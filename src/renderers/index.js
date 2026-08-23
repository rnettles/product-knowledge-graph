export * from "./json.js";
export * from "./csv.js";
export * from "./markdown.js";
export * from "./obsidian.js";

import { renderJson } from "./json.js";
import { renderCsv } from "./csv.js";
import { renderMarkdown } from "./markdown.js";

export function render(report, format = "json", options = {}) {
  if (format === "json") return renderJson(report, options);
  if (format === "csv") return renderCsv(report, options);
  if (format === "markdown" || format === "md") return renderMarkdown(report, options);
  throw new Error(`Unknown renderer: ${format}`);
}
