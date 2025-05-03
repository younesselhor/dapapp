
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 15285, hash: '194c05c35068b2c217b3619b2d5c490fb7a178849226f9a3570bda6397efd253', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 8657, hash: 'e4a3c21082848f96cff7bf400443edcd7d8aa3206938e7763b4a1ccd754d7c36', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-FTDQ4FGW.css': {size: 115532, hash: 'yeTXBHqAiic', text: () => import('./assets-chunks/styles-FTDQ4FGW_css.mjs').then(m => m.default)}
  },
};
