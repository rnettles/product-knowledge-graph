#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { compileProfile } from "./profile.js";
import { normalizeRecords } from "./normalize.js";
import { buildGraph } from "./graph.js";
import { lintEstate } from "./lint/index.js";
import { compareBaseline, readBaseline, writeBaseline } from "./lint/baseline.js";
import { readMarkdownEstate } from "./adapters/markdown.js";
import { readJsonEstate } from "./adapters/json.js";
import { runReport, REPORTS } from "./reports/index.js";
import { render } from "./renderers/index.js";

function parseArgs(argv) {
  const positional = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) positional.push(token);
    else { const key = token.slice(2); const next = argv[i + 1]; if (next && !next.startsWith("--")) { flags[key] = next; i++; } else flags[key] = true; }
  }
  return { positional, flags };
}

function usage() {
  return `pkg-graph commands:
  profile-lint --profile <yaml>
  lint --profile <yaml> --source <dir|json> [--json]
  gate --profile <yaml> --source <dir|json> --baseline <json>
  baseline --profile <yaml> --source <dir|json> --baseline <json>
  report <name> --profile <yaml> --source <dir|json> [--format json|markdown|csv] [--seed <id>] [--invariant <id>]
Reports: ${Object.keys(REPORTS).join(", ")}
`;
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const command = positional[0];
if (!command || flags.help) { process.stdout.write(usage()); process.exit(command ? 0 : 1); }
if (!flags.profile) { process.stderr.write("--profile is required\n"); process.exit(2); }
const profileRaw = YAML.parse(fs.readFileSync(path.resolve(flags.profile), "utf8"));
const compiled = compileProfile(profileRaw);
if (!compiled.valid) { process.stderr.write(JSON.stringify(compiled.findings, null, 2) + "\n"); process.exit(2); }
if (command === "profile-lint") { process.stdout.write(`Profile ${compiled.name} ${compiled.version} is valid\n`); process.exit(0); }
if (!flags.source) { process.stderr.write("--source is required\n"); process.exit(2); }
const sourcePath = path.resolve(flags.source);
const sources = fs.statSync(sourcePath).isDirectory() ? readMarkdownEstate(sourcePath) : readJsonEstate(sourcePath);
const graph = buildGraph(normalizeRecords(sources, compiled), compiled);
const findings = lintEstate(graph, { diagnostics: flags.diagnostics !== "false" });

if (command === "lint") {
  if (flags.json) process.stdout.write(JSON.stringify({ artifacts: graph.records.length, findings }, null, 2) + "\n");
  else {
    process.stdout.write(`${graph.records.length} artifacts; ${findings.filter(x => x.severity === "error").length} error(s); ${findings.filter(x => x.severity === "diagnostic").length} diagnostic(s)\n`);
    for (const value of findings) process.stdout.write(`${value.severity.toUpperCase()} ${value.code} ${value.sourceIds.join(",")}: ${value.message}\n`);
  }
  process.exit(findings.some(x => x.severity === "error") ? 1 : 0);
}

if (command === "gate") {
  if (!flags.baseline) { process.stderr.write("--baseline is required\n"); process.exit(2); }
  const result = compareBaseline(findings, readBaseline(path.resolve(flags.baseline)));
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  process.exit(result.newFindings.length || result.staleWaivers.length ? 1 : 0);
}

if (command === "baseline") {
  if (!flags.baseline) { process.stderr.write("--baseline is required\n"); process.exit(2); }
  const values = writeBaseline(path.resolve(flags.baseline), findings);
  process.stdout.write(`Wrote ${values.length} exact finding waiver(s)\n`); process.exit(0);
}

if (command === "report") {
  const name = positional[1];
  const config = compiled.reports[name.replaceAll("-", "_")] ?? {};
  const report = runReport(name, graph, { config, findings, seed: flags.seed, invariant: flags.invariant });
  process.stdout.write(render(report, flags.format ?? "json")); process.exit(0);
}

process.stderr.write(`Unknown command: ${command}\n${usage()}`); process.exit(2);
