
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/postingAdd/product-form/product-form.component.ts": [
    {
      "path": "chunk-SLTJLC6U.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/main-products-page/main-products-page.component.ts": [
    {
      "path": "chunk-QPN3KUJF.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-WTQ354T4.js",
      "dynamicImport": false
    }
  ],
  "src/main.ts": [
    {
      "path": "main-FMFBNXQL.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-PIGUYHRN.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-Q3TESLUX.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-7YQ7MZRF.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-ETQ6EOZK.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-T6SVU3WA.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-IHIDFWEZ.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-AGS6GV7I.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-SLTJLC6U.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-QPN3KUJF.js",
      "dynamicImport": true
    }
  ],
  "src/app/components/home-page/home-page.component.ts": [
    {
      "path": "chunk-PIGUYHRN.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-IM6F7TYQ.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/products/products.component.ts": [
    {
      "path": "chunk-Q3TESLUX.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-IM6F7TYQ.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-VF762LOC.js",
      "dynamicImport": false
    }
  ],
  "src/app/spare-plates-details/spare-plates-details.component.ts": [
    {
      "path": "chunk-7YQ7MZRF.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-IM6F7TYQ.js",
      "dynamicImport": false
    }
  ],
  "src/app/motorcycles-details/motorcycles-details.component.ts": [
    {
      "path": "chunk-ETQ6EOZK.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-IM6F7TYQ.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/accessories/accessories.component.ts": [
    {
      "path": "chunk-T6SVU3WA.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/register/register/register.component.ts": [
    {
      "path": "chunk-IHIDFWEZ.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-VF762LOC.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/account/account/account.component.ts": [
    {
      "path": "chunk-AGS6GV7I.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-WTQ354T4.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 20875, hash: '1657d091c14c9570c1d4e26e0bf1fe2588a88f94d79699679e6fe9bceaa26ecf', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 10268, hash: '0b83fa2378e8671eeefee3d8b1535a951a9c789304e34b1c98437d18ab0fe2f3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-TWGHCDY5.css': {size: 136912, hash: '+47026KB0os', text: () => import('./assets-chunks/styles-TWGHCDY5_css.mjs').then(m => m.default)}
  },
};
