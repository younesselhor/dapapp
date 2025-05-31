
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/main.ts": [
    {
      "path": "main-C4MPHHA7.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 18228, hash: '203dc7d69040d598e4d0b90f1c99ff3672d347decf0c30fc9435ddac2825be18', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9000, hash: 'b954f0547193ea43b28a2803583d43975f2da3fbd0e8f561cbf38f0e60477b4e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-KXDFUQNS.css': {size: 128926, hash: 'LzkV5QCF/dg', text: () => import('./assets-chunks/styles-KXDFUQNS_css.mjs').then(m => m.default)}
  },
};
