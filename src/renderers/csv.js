const scalar = value => value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
const quote = value => `"${scalar(value).replaceAll('"', '""')}"`;

export function renderCsv(report) {
  const rows = report.rows ?? report.findings ?? report.artifacts ?? report.reached ?? report.consumers ?? report.references ?? report.roots;
  if (!Array.isArray(rows) || !rows.length) return "";
  const headers = [...new Set(rows.flatMap(row => Object.keys(row)))];
  return [headers.map(quote).join(","), ...rows.map(row => headers.map(key => quote(row[key])).join(","))].join("\n") + "\n";
}
