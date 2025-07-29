
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/postingAdd/product-form/product-form.component.ts": [
    {
      "path": "chunk-BROPBVQJ.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/main-products-page/main-products-page.component.ts": [
    {
      "path": "chunk-KZJL3GEQ.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-CEVU57XV.js",
      "dynamicImport": false
    }
  ],
  "src/main.ts": [
    {
      "path": "main-HKH7QKY3.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-7WUPKHMH.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-ZZT3V3QW.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-R5VLIVF5.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-BURSZOO2.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-EOFXZZIV.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-JHDUWOLG.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-N3NDW2WY.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-BROPBVQJ.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-KZJL3GEQ.js",
      "dynamicImport": true
    }
  ],
  "src/app/components/home-page/home-page.component.ts": [
    {
      "path": "chunk-7WUPKHMH.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-IGW5E2RP.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/products/products.component.ts": [
    {
      "path": "chunk-ZZT3V3QW.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-IGW5E2RP.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-TGYWCX6R.js",
      "dynamicImport": false
    }
  ],
  "src/app/spare-plates-details/spare-plates-details.component.ts": [
    {
      "path": "chunk-R5VLIVF5.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-IGW5E2RP.js",
      "dynamicImport": false
    }
  ],
  "src/app/motorcycles-details/motorcycles-details.component.ts": [
    {
      "path": "chunk-BURSZOO2.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-IGW5E2RP.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/accessories/accessories.component.ts": [
    {
      "path": "chunk-EOFXZZIV.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/register/register/register.component.ts": [
    {
      "path": "chunk-JHDUWOLG.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-TGYWCX6R.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/account/account/account.component.ts": [
    {
      "path": "chunk-N3NDW2WY.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-CEVU57XV.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 20738, hash: 'b5195013b51dda44b4c0f170d3a083874bbdce45b6f0014ac42596f78e760d62', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 10268, hash: '270ca771b296cc3d6e577dec5ddea316635f548ac2d2a01b398de5d58015731a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-D7UG3ITP.css': {size: 135124, hash: 'cD7FCBTSVWo', text: () => import('./assets-chunks/styles-D7UG3ITP_css.mjs').then(m => m.default)}
  },
};
