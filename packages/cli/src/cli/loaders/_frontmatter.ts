import YAML from "yaml";

/**
 * Minimal YAML front-matter parser/serializer.
 *
 * Replaces `gray-matter` (which pulls a vulnerable `js-yaml@3` transitively)
 * for the only way we used it: a leading `---` delimited YAML block. The YAML
 * itself is parsed/stringified with the already-present, patched `yaml`
 * package. Behaviour matches `gray-matter`'s defaults for these cases — see
 * the loader specs, which assert equivalence against `gray-matter`.
 */

// `---\n<yaml>\n---` at the very start, consuming the single newline after the
// closing delimiter (gray-matter does the same), so `content` is the remainder.
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const stringifyYaml = (data: Record<string, any>): string => YAML.stringify(data, { defaultStringType: "PLAIN" });

export function parseFrontmatter(input: string): {
  data: Record<string, any>;
  content: string;
} {
  const match = FRONTMATTER_RE.exec(input);
  if (!match) {
    return { data: {}, content: input };
  }
  const data = (YAML.parse(match[1]) ?? {}) as Record<string, any>;
  return { data, content: input.slice(match[0].length) };
}

export function stringifyFrontmatter(content: string, data: Record<string, any>): string {
  if (!data || Object.keys(data).length === 0) {
    return content;
  }
  return `---\n${stringifyYaml(data)}---\n${content}`;
}
