
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 17461, hash: 'bcc8e313f20b389521d18cd45531d4382ed2fdf99ed9c3da437a59c9da7a4a39', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 8657, hash: 'e64c7a2399de150dc5bb60c5db91c9684eda80fc04b00e65871b41227bdb7542', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-5HWEEX34.css': {size: 121624, hash: 'enVm02IgO+0', text: () => import('./assets-chunks/styles-5HWEEX34_css.mjs').then(m => m.default)}
  },
};
