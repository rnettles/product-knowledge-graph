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
  if (!text.startsWith("---\n")) return { sourceId, path: sourceId, __hasFrontmatter: false, __body: text, __frontmatterRaw: "" };
  const end = text.indexOf("\n---", 4);
  if (end < 0) return { sourceId, path: sourceId, __hasFrontmatter: true, __body: "", __frontmatterRaw: text.slice(4), __parseProblems: ["frontmatter is not closed"] };
  const raw = text.slice(4, end);
  const body = text.slice(end + 4).replace(/^\n/, "");
  try {
    const frontmatter = YAML.parse(raw) ?? {};
    return { ...frontmatter, sourceId, path: sourceId, __hasFrontmatter: true, __body: body, __frontmatterRaw: raw, __parseProblems: [] };
  } catch (error) {
    return { sourceId, path: sourceId, __hasFrontmatter: true, __body: body, __frontmatterRaw: raw, __parseProblems: [error.message] };
  }
}

export function readMarkdownEstate(root) {
  const absolute = path.resolve(root);
  return filesUnder(absolute).map(file => ({...parseMarkdown(fs.readFileSync(file, "utf8"), path.relative(absolute, file).split(path.sep).join("/")), __fileSize: fs.statSync(file).size}));
}
