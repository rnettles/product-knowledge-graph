import fs from "node:fs";

export function readJsonEstate(file) {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("JSON estate must be an array");
  return parsed;
}
