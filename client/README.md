- Change directory to FE
`cd Front-End`
- Install dependencies
`npm ci -f`
- Run FE
+ Open 2 terminal
Terminal 1:
`$env:NODE_OPTIONS="--openssl-legacy-provider"`
`npm run start`
Terminal 2:
`npx tailwindcss -i ./src/index.css -o .src/style/output.css --watch`

<!-- - If got this error message: `code: 'ERR_OSSL_EVP_UNSUPPORTED'` run
+ windows: `$env:NODE_OPTIONS="--openssl-legacy-provider"`
+ linux: `export NODE_OPTIONS=--openssl-legacy-provider`
Then re-run -->