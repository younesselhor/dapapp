
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/main-products-page/main-products-page.component.ts": [
    {
      "path": "chunk-7ZYE2OKE.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/home-page/home-page.component.ts": [
    {
      "path": "chunk-FPF7ZKRY.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-DT5PEX43.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-OMMPAO3A.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/products/products.component.ts": [
    {
      "path": "chunk-BCP4Y4QJ.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-OMMPAO3A.js",
      "dynamicImport": false
    }
  ],
  "src/app/spare-plates-details/spare-plates-details.component.ts": [
    {
      "path": "chunk-QVYRKEQS.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-DT5PEX43.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-OMMPAO3A.js",
      "dynamicImport": false
    }
  ],
  "src/app/motorcycles-details/motorcycles-details.component.ts": [
    {
      "path": "chunk-MPEZUQUB.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-DT5PEX43.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-OMMPAO3A.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/accessories/accessories.component.ts": [
    {
      "path": "chunk-JUIE6AMB.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/register/register/register.component.ts": [
    {
      "path": "chunk-KEOE4DBQ.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/postingAdd/product-form/product-form.component.ts": [
    {
      "path": "chunk-J6S563VO.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 20347, hash: 'cfbbd021b4928679bdb2ea492b36379b0aac067511ff1d886fbedbc7e9e41561', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 10488, hash: 'aaf68838b9425a2172f4a07b5acef2444d8abcda6ae6c8b06a432ee94ab9d22c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-GNQXBLCT.css': {size: 136515, hash: 'JSLr99ooKqA', text: () => import('./assets-chunks/styles-GNQXBLCT_css.mjs').then(m => m.default)}
  },
};
