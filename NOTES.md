# NodeJS notes

## Project start

**Create package management file `package.json`**

```
yarn init -y
```
- `-y` automatically answer yes to all questions.

_You may use `npm` instead._

**Install Express**

```
yarn add express
```

**Install TypeScript**

```
yarn add typescript -D
```

- `-D` install package as DEV-only dependency

**Initialize TS config file `tsconfig.json`**

```
yarn tsc --init
```

Useful configurations:
```json
    "outDir": "./dist",
    "rootDir": "./src",
```

💡 `yarn tsc` will now convert all `.ts` files in `rootDir` to `.js` in `outDir`.

**Install Express Type Definitions**

```
yarn add @types/express -D
```

**Create scripts**

```json
  "scripts": {
    "build": "tsc"
  },
```

💡 `yarn build` will run `yarn tsc`.

**Changes monitoring (live reload)**

Install `ts-node-dev`:
```
yarn add ts-node-dev -D
```

Script:
```json
"dev:server": "ts-node-dev --transpileOnly --ignore-watch node_modules src/server.ts"
```

- `--transpileOnly` disable type checking, making reload faster
- `--ignore-watch node_modules` blacklist `node_modules` from monitoring/transpiling

Run in dev mode:
```
yarn dev:server
```
_This will not update `dist` folder anymore. Delete it._

💡 alternatives: `nodemon`, `sucrase`, `babel`, `webpack`, `tsc`...