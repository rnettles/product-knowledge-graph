import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

function filesUnder(root) {
  const out = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const at = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(at));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(at);
  }
  return out;
}

export function parseMarkdown(text, sourceId = "<markdown>") {
  if (!text.startsWith("---\n")) return { sourceId, path: sourceId };
  const end = text.indexOf("\n---", 4);
  if (end < 0) throw new Error(`${sourceId}: frontmatter is not closed`);
  const frontmatter = YAML.parse(text.slice(4, end)) ?? {};
  return { ...frontmatter, sourceId, path: sourceId };
}

export function readMarkdownEstate(root) {
  const absolute = path.resolve(root);
  return filesUnder(absolute).map(file => parseMarkdown(fs.readFileSync(file, "utf8"), path.relative(absolute, file).split(path.sep).join("/")));
}
