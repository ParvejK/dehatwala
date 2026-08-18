/**
 * Normalisers for service text columns that the admin stores loosely.
 *
 * `tags` arrives as a JSON array of `{value}` objects, a comma separated string,
 * or null. `included` / `ideal_for` are admin textareas, so they arrive as a
 * newline separated string — or as a real array once the backend parses them.
 * Everything here returns `string[]` so components can map without guarding.
 */

const clean = (values: unknown[]): string[] =>
  values
    .map((value) => String(value ?? "").replace(/^[-•*\s]+/, "").trim())
    .filter(Boolean);

/** Parses the `[{"value":"Worker"}]` shape both columns can use. */
const fromJsonArray = (raw: string): string[] | null => {
  if (!raw.startsWith("[")) return null;

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }

  if (!Array.isArray(parsed)) return null;

  return clean(parsed.map((entry) => (typeof entry === "string" ? entry : (entry as { value?: string })?.value)));
};

/** Prefer the API's pre-parsed `tag_list`; fall back to parsing `tags`. */
export const parseTags = (raw?: string | null, preParsed?: string[] | null): string[] => {
  if (preParsed?.length) return clean(preParsed);

  const trimmed = raw?.trim();
  if (!trimmed) return [];

  return fromJsonArray(trimmed) ?? clean(trimmed.split(","));
};

/**
 * One bullet per line. Prefer the API's pre-parsed `*_list` companion; when
 * parsing the raw column, split on newlines only — a single line is kept whole,
 * because commas inside a sentence are not list separators here.
 */
export const parseBulletList = (raw?: string[] | string | null, preParsed?: string[] | null): string[] => {
  if (preParsed?.length) return clean(preParsed);
  if (Array.isArray(raw)) return clean(raw);

  const trimmed = raw?.trim();
  if (!trimmed) return [];

  return fromJsonArray(trimmed) ?? clean(trimmed.split(/\r?\n/));
};
