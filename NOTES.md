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

## Code patterns

**EditorConfig**

- Install VsCode extension "EditorConfig for VS Code";
- On root folder, click "Generate .editorconfig";
- Edit.

Suggestion:

```ini
root = true

[*]
end_of_line = lf
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

💡 There's plugins for most editors and IDEs.

**ESLint**

Install:
```
yarn add eslint -D
```

Initialize:
```
yarn eslint --init
```

My selected options:
```
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? None of these
? Does your project use TypeScript? Yes
? Where does your code run? Node
? How would you like to define a style for your project? Use a popular style guide
? Which style guide do you want to follow? Airbnb: https://github.com/airbnb/javascript
? What format do you want your config file to be in? JSON
```

Dependencies will be listed:

```
@typescript-eslint/eslint-plugin@latest eslint-config-airbnb-base@latest eslint@^5.16.0 || ^6.8.0 eslint-plugin-import@^2.20.1 @typescript-eslint/parser@latest
```

When asked `? Would you like to install them now with npm? (Y/n)`, when using `yarn`, answer `no` and manually install listed dependencies.

Installing with `yarn`, removing previous installed `eslint`:
```
yarn add @typescript-eslint/eslint-plugin@latest eslint-config-airbnb-base@latest eslint-plugin-import@^2.20.1 @typescript-eslint/parser@latest
```

At the end, the `.eslintrc.json` file is created.

💡 VsCode support: install `ESLint` extension.

On `settings.json`, you may enforce ESLint fixes after saving (✨ magic!):

```json
    "[javascript]": {
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
      }
    },
    "[javascriptreact]": {
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
      }
    },
    "[typescript]": {
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
      }
    },
    "[typescriptreact]": {
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
      }
    },
```

🗨 git will auto convert LF to CRLF on Windows. To disable:

```
git config --global core.autocrlf false
```

Adittional steps:

Install ESLint support for TypeScript imports:
```
yarn add eslint-import-resolver-typescript -D
```

Configure it in `.eslintrc.json`:

```json
  "rules": {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never"
      }
    ]
  },
  "settings": {
    "import/resolver": {
      "typescript": {}
    }
  }
```

**Prettier**

Install:
```
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

Configure it in `.eslintrc.json`:

```json
  "extends": [
    // keep preexistent
    "airbnb-base",
    // add the new, bellow
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  // ...
  "plugins": [
    // keep preexistent
    "@typescript-eslint",
    // add the new, bellow
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    // keep the others
    // ...
  },
```

Add `prettier.config.js`:

```js
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
};
```

Create `.eslintignore`:

```
/*.js
node_modules
dist
```

💡 ESLint will now ignore `.js` in root (like `prettier.config.js`), and all files in `node_modules` and `dist`.
