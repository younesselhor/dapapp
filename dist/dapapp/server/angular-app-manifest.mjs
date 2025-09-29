
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/postingAdd/product-form/product-form.component.ts": [
    {
      "path": "chunk-NOFI2XFE.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/main-products-page/main-products-page.component.ts": [
    {
      "path": "chunk-X6HXNUYV.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-5ZL27Y2O.js",
      "dynamicImport": false
    }
  ],
  "src/main.ts": [
    {
      "path": "main-AGAEFZKH.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-CG4DUWSX.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-GANE4A2Z.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-GOZYV64Q.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-PVSYNOXR.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-XL7DQOTX.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-JDFNVZMN.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-RC2MJTUU.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-NOFI2XFE.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-X6HXNUYV.js",
      "dynamicImport": true
    }
  ],
  "src/app/components/home-page/home-page.component.ts": [
    {
      "path": "chunk-CG4DUWSX.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-LJIZRMBM.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/products/products.component.ts": [
    {
      "path": "chunk-GANE4A2Z.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-LJIZRMBM.js",
      "dynamicImport": false
    }
  ],
  "src/app/spare-plates-details/spare-plates-details.component.ts": [
    {
      "path": "chunk-GOZYV64Q.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-LJIZRMBM.js",
      "dynamicImport": false
    }
  ],
  "src/app/motorcycles-details/motorcycles-details.component.ts": [
    {
      "path": "chunk-PVSYNOXR.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-LJIZRMBM.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/accessories/accessories.component.ts": [
    {
      "path": "chunk-XL7DQOTX.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/register/register/register.component.ts": [
    {
      "path": "chunk-JDFNVZMN.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/account/account/account.component.ts": [
    {
      "path": "chunk-RC2MJTUU.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-5ZL27Y2O.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 20116, hash: '7f36318705061f1aca22d769f53061e71d6ea70976fa885ea6e5daf6d37bf9e0', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 10437, hash: 'f9399a8f58a025d703c53c3c28a1d94ac1e52533b85cc57c3be70f91aa4d6c41', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-6PRAD6XQ.css': {size: 134777, hash: 'k/QrIlKncJo', text: () => import('./assets-chunks/styles-6PRAD6XQ_css.mjs').then(m => m.default)}
  },
};
