/**
 * Updates a value at a dot-separated path in the content object.
 * Returns a new content object (immutable).
 *
 * Examples:
 *   setFieldByPath(content, "headline", "New title")
 *   setFieldByPath(content, "items.0.name", "New name")
 *   setFieldByPath(content, "plans.0.features.2", "New feature")
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
