/**
 * Maps a clicked text string back to its field path in the section content.
 *
 * Given a section's content object and the textContent of a clicked DOM element,
 * finds the field path (e.g. "headline", "items.0.name") whose value matches.
 *
 * For StyledHeadline texts that use *accent* markers, we strip the markers
 * before comparing since the rendered text won't include asterisks.
 */

function stripAccentMarkers(text: string): string {
  return text.replace(/\*/g, "");
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

interface MatchResult {
  fieldPath: string;
  currentValue: string;
}

export function findFieldByText(
  content: Record<string, unknown>,
  clickedText: string
): MatchResult | null {
  const needle = normalizeText(clickedText);
  if (!needle || needle.length < 2) return null;

  // Check top-level string fields
  for (const [key, value] of Object.entries(content)) {
    if (typeof value === "string") {
      const cleaned = normalizeText(stripAccentMarkers(value));
      if (cleaned === needle || cleaned.includes(needle) || needle.includes(cleaned)) {
        return { fieldPath: key, currentValue: value };
      }
    }
  }

  // Check string arrays (e.g. paragraphs)
  for (const [key, value] of Object.entries(content)) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const item = value[i];

        // Simple string array (paragraphs)
        if (typeof item === "string") {
          const cleaned = normalizeText(stripAccentMarkers(item));
          if (cleaned === needle || cleaned.includes(needle) || needle.includes(cleaned)) {
            return { fieldPath: `${key}.${i}`, currentValue: item };
          }
        }

        // Object array (items, members, plans, etc.)
        if (typeof item === "object" && item !== null) {
          for (const [subKey, subValue] of Object.entries(item as Record<string, unknown>)) {
            if (typeof subValue === "string") {
              const cleaned = normalizeText(stripAccentMarkers(subValue));
              if (cleaned === needle || cleaned.includes(needle) || needle.includes(cleaned)) {
                return { fieldPath: `${key}.${i}.${subKey}`, currentValue: subValue };
              }
            }
          }
        }
      }
    }
  }

  return null;
}

/**
 * Updates a value at a dot-separated path in the content object.
 * Returns a new content object (immutable).
 *
 * Examples:
 *   setFieldByPath(content, "headline", "New title")
 *   setFieldByPath(content, "items.0.name", "New name")
 *   setFieldByPath(content, "paragraphs.1", "New paragraph")
 */
export function setFieldByPath(
  content: Record<string, unknown>,
  fieldPath: string,
  newValue: string
): Record<string, unknown> {
  const parts = fieldPath.split(".");
  const result = { ...content };

  if (parts.length === 1) {
    result[parts[0]] = newValue;
    return result;
  }

  // Deep clone the path
  let current: Record<string, unknown> = result;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const isArrayIndex = /^\d+$/.test(nextKey);

    if (Array.isArray(current[key])) {
      current[key] = [...(current[key] as unknown[])];
      const arr = current[key] as unknown[];
      const idx = parseInt(parts[i + 1]);

      if (i + 2 === parts.length) {
        // Last segment — set the value
        arr[idx] = newValue;
        return result;
      } else {
        // Clone the object at this index and continue
        arr[idx] = { ...(arr[idx] as Record<string, unknown>) };
        current = arr[idx] as Record<string, unknown>;
        i++; // skip the index part
      }
    } else if (typeof current[key] === "object" && current[key] !== null) {
      current[key] = { ...(current[key] as Record<string, unknown>) };
      current = current[key] as Record<string, unknown>;
    }
  }

  current[parts[parts.length - 1]] = newValue;
  return result;
}
