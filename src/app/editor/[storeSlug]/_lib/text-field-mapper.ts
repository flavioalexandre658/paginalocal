/**
 * Maps clicked text to blueprint fields using BLOCK_EDIT_MAP for precision.
 *
 * Instead of blindly searching all content, we consult the map to know
 * exactly which fields are text vs button vs image, then only search
 * the relevant fields. This prevents mismatches (e.g., a button label
 * accidentally matching a headline).
 */

import type { BlockType } from "@/types/ai-generation";
import { BLOCK_EDIT_MAP, type EditMode, type EditableField } from "./block-edit-map";

function stripMarkers(text: string): string {
  return text.replace(/\*/g, "").replace(/~/g, "");
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export interface FieldMatch {
  fieldPath: string;
  currentValue: string;
  field: EditableField;
}

/**
 * Resolve a wildcard pattern (e.g. "items.*.name") against real content,
 * returning all concrete paths and their string values.
 */
function resolveWildcard(
  obj: unknown,
  parts: string[],
  currentPath: string
): Array<{ path: string; value: string }> {
  if (parts.length === 0) {
    if (typeof obj === "string") {
      return [{ path: currentPath, value: obj }];
    }
    return [];
  }

  const [head, ...rest] = parts;

  if (head === "*") {
    if (Array.isArray(obj)) {
      const results: Array<{ path: string; value: string }> = [];
      for (let i = 0; i < obj.length; i++) {
        results.push(
          ...resolveWildcard(obj[i], rest, currentPath ? `${currentPath}.${i}` : `${i}`)
        );
      }
      return results;
    }
    return [];
  }

  if (typeof obj !== "object" || obj === null) return [];
  const record = obj as Record<string, unknown>;
  const nextPath = currentPath ? `${currentPath}.${head}` : head;
  return resolveWildcard(record[head], rest, nextPath);
}

/**
 * Find a field matching the clicked text, filtered by edit mode.
 *
 * Only searches fields that match the given mode (text, button, image).
 * This is the primary matching function used by the editor.
 */
export function findFieldByMode(
  content: Record<string, unknown>,
  clickedText: string,
  blockType: BlockType,
  mode: EditMode
): FieldMatch | null {
  const needle = normalize(clickedText);
  if (!needle) return null;

  const fields = BLOCK_EDIT_MAP[blockType];
  if (!fields) return null;

  const modeFields = fields.filter((f) => f.mode === mode);
  const needleLow = needle.toLowerCase();

  // Resolve all field values once
  const allResolved: Array<{ field: typeof modeFields[number]; path: string; value: string; cleanedLow: string }> = [];
  for (const field of modeFields) {
    const parts = field.path.split(".");
    const resolved = resolveWildcard(content, parts, "");
    for (const { path, value } of resolved) {
      const cleanedLow = normalize(stripMarkers(value)).toLowerCase();
      allResolved.push({ field, path, value, cleanedLow });
    }
  }

  // Pass 1: EXACT match (prevents "Visitante" matching title "visitantes dizem")
  for (const r of allResolved) {
    if (r.cleanedLow === needleLow) {
      return { fieldPath: r.path, currentValue: r.value, field: r.field };
    }
  }

  // Pass 2: includes — only for longer texts (min 15 chars) to avoid false positives
  if (needleLow.length >= 15) {
    for (const r of allResolved) {
      if (r.cleanedLow.includes(needleLow) || needleLow.includes(r.cleanedLow)) {
        return { fieldPath: r.path, currentValue: r.value, field: r.field };
      }
    }
  }

  return null;
}

/**
 * Fallback: search ALL content fields recursively (no map filtering).
 * Used when the map-based search doesn't find a match.
 */
export function findFieldByText(
  content: Record<string, unknown>,
  clickedText: string
): { fieldPath: string; currentValue: string } | null {
  const needle = normalize(clickedText).toLowerCase();
  if (!needle || needle.length < 1) return null;

  // Pass 1: exact match only
  function searchExact(value: unknown, pathPrefix: string): { fieldPath: string; currentValue: string } | null {
    if (typeof value === "string") {
      const cleaned = normalize(stripMarkers(value)).toLowerCase();
      if (cleaned === needle) {
        return { fieldPath: pathPrefix, currentValue: value };
      }
      return null;
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const r = searchExact(value[i], `${pathPrefix}.${i}`);
        if (r) return r;
      }
      return null;
    }
    if (typeof value === "object" && value !== null) {
      for (const [key, sub] of Object.entries(value as Record<string, unknown>)) {
        if (key === "highlighted" || key === "ctaType" || key === "icon" || key === "rating") continue;
        const r = searchExact(sub, pathPrefix ? `${pathPrefix}.${key}` : key);
        if (r) return r;
      }
    }
    return null;
  }

  for (const [key, value] of Object.entries(content)) {
    const r = searchExact(value, key);
    if (r) return r;
  }

  // Pass 2: includes (fallback for long texts only)
  function search(value: unknown, pathPrefix: string): { fieldPath: string; currentValue: string } | null {
    if (typeof value === "string") {
      const cleaned = normalize(stripMarkers(value)).toLowerCase();
      if (needle.length >= 15 && (cleaned.includes(needle) || needle.includes(cleaned))) {
        return { fieldPath: pathPrefix, currentValue: value };
      }
      return null;
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const r = search(value[i], `${pathPrefix}.${i}`);
        if (r) return r;
      }
      return null;
    }
    if (typeof value === "object" && value !== null) {
      for (const [key, sub] of Object.entries(value as Record<string, unknown>)) {
        if (key === "highlighted" || key === "ctaType" || key === "icon" || key === "rating") continue;
        const r = search(sub, pathPrefix ? `${pathPrefix}.${key}` : key);
        if (r) return r;
      }
    }
    return null;
  }

  for (const [key, value] of Object.entries(content)) {
    const r = search(value, key);
    if (r) return r;
  }
  return null;
}

/**
 * Updates a value at a dot-separated path in the content object.
 * Returns a new content object (immutable).
 */
export function setFieldByPath(
  content: Record<string, unknown>,
  fieldPath: string,
  newValue: string
): Record<string, unknown> {
  const parts = fieldPath.split(".");
  return setDeep(content, parts, newValue) as Record<string, unknown>;
}

function setDeep(obj: unknown, parts: string[], newValue: string): unknown {
  if (parts.length === 0) return newValue;

  const [head, ...rest] = parts;

  if (Array.isArray(obj)) {
    const idx = parseInt(head);
    if (isNaN(idx)) return obj;
    const arr = [...obj];
    arr[idx] = setDeep(arr[idx], rest, newValue);
    return arr;
  }

  if (typeof obj === "object" && obj !== null) {
    const record = obj as Record<string, unknown>;
    return { ...record, [head]: setDeep(record[head], rest, newValue) };
  }

  return newValue;
}
