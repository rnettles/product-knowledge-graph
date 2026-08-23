const esc = value => String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");

export function renderMarkdown(report) {
  const lines = [`# ${report.report}`, ""];
  if (report.summary) for (const [key, value] of Object.entries(report.summary)) lines.push(`- **${key}:** ${esc(value)}`);
  const rows = report.rows ?? report.findings ?? report.artifacts ?? report.reached ?? report.consumers ?? report.references ?? report.roots;
  if (Array.isArray(rows) && rows.length) {
    const headers = [...new Set(rows.flatMap(row => Object.keys(row)))];
    lines.push("", `| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`);
    for (const row of rows) lines.push(`| ${headers.map(key => esc(typeof row[key] === "object" ? JSON.stringify(row[key]) : row[key])).join(" | ")} |`);
  }
  return lines.join("\n") + "\n";
}
