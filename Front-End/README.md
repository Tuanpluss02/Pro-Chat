- Change directory to FE
`cd Front-End`
- Install dependencies
`npm ci -f`
- Run FE
`npm run start`
- If got this error message: `code: 'ERR_OSSL_EVP_UNSUPPORTED'` run
+ windows: $env:NODE_OPTIONS="--openssl-legacy-provider"
+ linux: export NODE_OPTIONS=--openssl-legacy-provider
Then re-run