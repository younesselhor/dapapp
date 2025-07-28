
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/postingAdd/product-form/product-form.component.ts": [
    {
      "path": "chunk-AQLA3EOK.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/main-products-page/main-products-page.component.ts": [
    {
      "path": "chunk-VZTOG7NM.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-JQFHFCZ5.js",
      "dynamicImport": false
    }
  ],
  "src/main.ts": [
    {
      "path": "main-EGRWZLX4.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-EHTNNP5B.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-UYQMUYXH.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-XULWHDUB.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-PEEF6WXB.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-3VDG5RIK.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-WY2P3Q4H.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-PZMLUYCC.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-AQLA3EOK.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-VZTOG7NM.js",
      "dynamicImport": true
    }
  ],
  "src/app/components/home-page/home-page.component.ts": [
    {
      "path": "chunk-EHTNNP5B.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-QSTM2OZN.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/products/products.component.ts": [
    {
      "path": "chunk-UYQMUYXH.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-QSTM2OZN.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-YP57XCNE.js",
      "dynamicImport": false
    }
  ],
  "src/app/spare-plates-details/spare-plates-details.component.ts": [
    {
      "path": "chunk-XULWHDUB.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-QSTM2OZN.js",
      "dynamicImport": false
    }
  ],
  "src/app/motorcycles-details/motorcycles-details.component.ts": [
    {
      "path": "chunk-PEEF6WXB.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-QSTM2OZN.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/accessories/accessories.component.ts": [
    {
      "path": "chunk-3VDG5RIK.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/register/register/register.component.ts": [
    {
      "path": "chunk-WY2P3Q4H.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-YP57XCNE.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/account/account/account.component.ts": [
    {
      "path": "chunk-PZMLUYCC.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-JQFHFCZ5.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 20875, hash: '59f4821d35c8591c75d80407a9efdfe125efb510599c4cf76e5f8f184f5ea320', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 10268, hash: '6c6e36f62ad92bc30ccb69c99ad98ee707471129fb30850d8246b33f49d9bd68', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-TWGHCDY5.css': {size: 136912, hash: '+47026KB0os', text: () => import('./assets-chunks/styles-TWGHCDY5_css.mjs').then(m => m.default)}
  },
};
