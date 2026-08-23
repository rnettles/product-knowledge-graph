export function renderObsidian(report, container) {
  container.empty?.();
  const heading = document.createElement("h2"); heading.textContent = report.report; container.appendChild(heading);
  if (report.summary) {
    const list = document.createElement("ul");
    for (const [key, value] of Object.entries(report.summary)) { const item = document.createElement("li"); item.textContent = `${key}: ${value}`; list.appendChild(item); }
    container.appendChild(list);
  }
  const rows = report.rows ?? report.findings ?? report.artifacts ?? report.reached ?? report.consumers ?? report.references ?? report.roots;
  if (!Array.isArray(rows) || !rows.length) return container;
  const headers = [...new Set(rows.flatMap(row => Object.keys(row)))];
  const table = document.createElement("table");
  const head = table.createTHead().insertRow();
  for (const key of headers) { const th = document.createElement("th"); th.textContent = key; head.appendChild(th); }
  const body = table.createTBody();
  for (const row of rows) { const tr = body.insertRow(); for (const key of headers) tr.insertCell().textContent = typeof row[key] === "object" ? JSON.stringify(row[key]) : String(row[key] ?? ""); }
  container.appendChild(table); return container;
}
