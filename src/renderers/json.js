export function renderJson(report, options = {}) {
  return JSON.stringify(report, null, options.compact ? 0 : 2) + "\n";
}
