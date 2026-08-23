export function dataviewPages(pages) {
  return [...pages].map(page => ({ ...page, sourceId: page.file?.path, path: page.file?.path }));
}

export function dataviewAdapter(dv, scope) {
  return dataviewPages(dv.pages(scope));
}
