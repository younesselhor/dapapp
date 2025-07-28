
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/main.ts": [
    {
      "path": "main-ETXHRRBF.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 20330, hash: 'cff0d1da5ba3523158d8abc603a224d206ccba6dbbf613f7f6db6671e1e8efc6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9860, hash: '7f50271c034cb62b35ce70ed0be542759a1d44ecddbcf0110c965188cfdaf5bc', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-YYH3UU5U.css': {size: 135151, hash: 'mQxxI4Dfphk', text: () => import('./assets-chunks/styles-YYH3UU5U_css.mjs').then(m => m.default)}
  },
};
