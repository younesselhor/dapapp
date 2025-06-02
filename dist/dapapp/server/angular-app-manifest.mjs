
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/main.ts": [
    {
      "path": "main-ORNB5BC5.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 18228, hash: 'c5a0c391a8718e5a7d734f2daf011079c10070d3edda59ec4bab277ad8d8cf58', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9000, hash: 'dbc38ded2b9096bcddb1a5a880ab769ba47dda02b27e152aa2453b9887b39e59', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-EP5AT5P7.css': {size: 128904, hash: 'p3JdZhEE3rY', text: () => import('./assets-chunks/styles-EP5AT5P7_css.mjs').then(m => m.default)}
  },
};
