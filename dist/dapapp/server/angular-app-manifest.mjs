
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/postingAdd/product-form/product-form.component.ts": [
    {
      "path": "chunk-VXKHIAGL.js",
      "dynamicImport": false
    }
  ],
  "src/app/components/main-products-page/main-products-page.component.ts": [
    {
      "path": "chunk-23PUWY7M.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-5ZL27Y2O.js",
      "dynamicImport": false
    }
  ],
  "src/main.ts": [
    {
      "path": "main-FFP4KWTJ.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-J4MGDELG.js",
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
      "path": "chunk-QWKZAAVT.js",
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
      "path": "chunk-VXKHIAGL.js",
      "dynamicImport": true
    },
    {
      "path": "chunk-23PUWY7M.js",
      "dynamicImport": true
    }
  ],
  "src/app/components/home-page/home-page.component.ts": [
    {
      "path": "chunk-J4MGDELG.js",
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
      "path": "chunk-QWKZAAVT.js",
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
    'index.csr.html': {size: 20253, hash: 'f361cb5e40f854cbf2898e9231e1fc09bd141aaa40793337a8b802c7edd72567', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 10437, hash: '14c868d2c66399f9449093a822de3acbe9290f0af516cf680bd15905a6eaeb72', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-I4B4YZRF.css': {size: 136749, hash: 'VIjVYeixx+k', text: () => import('./assets-chunks/styles-I4B4YZRF_css.mjs').then(m => m.default)}
  },
};
