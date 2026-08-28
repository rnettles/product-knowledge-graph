# Product Knowledge Graph

A reusable, profile-driven knowledge graph, linter, and reporting toolkit for documentation-as-code
software projects.

## Documentation

- [Generic Product Knowledge Graph Standard](docs/Generic%20Product%20Knowledge%20Graph%20Standard.md)
- [Project Profile Guide](docs/Product%20Knowledge%20Graph%20Project%20Profile%20Guide.md)
- [Software Product Traceability Convention](docs/Software%20Product%20Traceability%20Convention.md)
- [Reporting Tools Specification](docs/Product%20Knowledge%20Graph%20Reporting%20Tools%20Specification.md)
- [Obsidian Workbench design project](obsidian-plugin/README.md)

## Install and verify

```bash
npm install
npm test
npm run build
```

Projects can pin the package directly to a release tag. Software projects can start from
`profiles/software-product-profile.yaml` and record project-specific deviations rather than
reimplementing the traceability topology.

```bash
npm install --save-dev github:rnettles/product-knowledge-graph#v0.3.1
```

## CLI

```bash
node src/cli.js profile-lint --profile profiles/example-profile.yaml
node src/cli.js lint --profile profiles/example-profile.yaml --source tests/.fixtures/valid
node src/cli.js gate --profile profiles/example-profile.yaml --source tests/.fixtures/valid --baseline .pkg-graph-baseline.json
node src/cli.js report scope-ladder --profile profiles/example-profile.yaml --source tests/.fixtures/valid --format markdown
node src/cli.js report intent-coverage --profile profiles/example-profile.yaml --source tests/.fixtures/valid --seed CAP-007
```

The reports are read-only graph consumers. Project vocabulary, constraints, maturity ladders, planning-focus scoring and priority rules, and
report policy come from a versioned project profile.
