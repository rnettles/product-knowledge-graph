# Scope Ladder

> [!warning] Configure before use
> Set `profilePath` and `scope` to the adopting project's profile and Dataview source scope.

```dataviewjs
const profilePath = "tools/product-knowledge-graph/profiles/example-profile.yaml";
const scope = '"YOUR/PROJECT/ESTATE"';
const bundleRelative = "tools/product-knowledge-graph/dist/pkg-graph.mjs";
const bundlePath = app.vault.adapter.getFullPath(bundleRelative).replaceAll("\\", "/");
const bundleUrl = encodeURI(bundlePath.startsWith("/") ? `file://${bundlePath}` : `file:///${bundlePath}`);
const pkg = await import(`${bundleUrl}?v=${app.vault.getAbstractFileByPath(bundleRelative).stat.mtime}`);
const profile = pkg.compileProfile(pkg.parseProfileYaml(await app.vault.adapter.read(profilePath)));
if (!profile.valid) throw new Error(JSON.stringify(profile.findings));
const graph = pkg.buildGraph(pkg.normalizeRecords(pkg.dataviewAdapter(dv, scope), profile), profile);
pkg.renderObsidian(pkg.runReport("scope-ladder", graph, { config: profile.reports.scope_ladder }), dv.container);
```
