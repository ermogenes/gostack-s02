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

Configure it in `.eslintrc.json` (_add the new, keep preexistent_):

```json
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
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

## Debug on VsCode

Create `launch.json`:

![](launchjson.png)

Select `Node.js` option and edit the file.

Remove:
```json
"program": "${workspaceFolder}\\index.js"
```

Change:
```json
"request": "attach",
"name": "Attach to running ts-node-dev",
```

Add:
```json
"protocol": "inspector",
"restart": true,
```

It will became something like this:
```json
    "configurations": [
        {
            "type": "node",
            "request": "attach",
            "protocol": "inspector",
            "restart": true,
            "name": "Attach to running ts-node-dev",
            "skipFiles": [
                "<node_internals>/**"
            ],
        }
    ]
```

Edit the `dev:server` script to run on inspect mode:

```json
"dev:server": "ts-node-dev --inspect --transpileOnly --ignore-watch node_modules src/server.ts"
```

- `--inspect` tells ts-node-dev to expose debug info via WebSockets.

💡 You may create a new script, like `yarn debug` and keep `yarn dev:server` untouched.

_Run your script first, then debug via VsCode._

## Persistence

Relational DB access abstractions/strategies:

- write your query using a DB driver like `node-postgres`;
- use a query builder like `Knex.js`;
- use a ORM, like `sequelize` or `TypeORM`.

Configure Postgres container:

`docker run --name gostack-postgres -e POSTGRES_PASSWORD=gostack -p 5432:5432 -d postgres`

💡 Docker tips:
- `docker ps` lists all running `docker` containers
- `docker ps -a` lists all `docker` containers and status
- `docker logs <ID>` shows logs of a container
- `docker stop <ID>` stops a container
- `docker start <ID>` starts a container

Install TypeORM:

```
yarn add typeorm pg
```

... or `mysql`, `sqlite3`, `mssql`, `oracledb`...

Configure TypeORM in `ormconfig.json`:

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "gostack",
  "database": "gostack_gobarber"
}
```

If database doesn't exists (`error: database "gostack_gobarber" does not exist`), create it (_you may use DBeaver_).

Add migrations support in `ormconfig.json`:

```json
  "migrations": [
    "./src/database/migrations/*.ts"
  ],
  "cli": {
    "migrationsDir": "./src/database/migrations"
  }
```

Add a script on `package.json`:

```json
    "typeorm": "ts-node-dev ./node_modules/typeorm/cli.js"
```

Now you can run TypeORM CLI with `yarn typeorm`.

Create a migration:

```
yarn typeorm migration:create -n CreateAppointments
```

Now you can write `up` and `down` methods.

After write the migration, run it:

```
yarn typeorm migration:run
```

💡 TypeORM migration tips:
- `yarn typeorm migration:show` show available migrations, with status
- `yarn typeorm migration:revert` revert last migration
- `yarn typeorm migration:run` run migration to up-to-date version

Enabling decorators on TypeScript, in `tsconfig.json`:

```json
    /* Experimental Options */
    "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
```

Also disable errors on imports and property non-initialization:
```json
    "strictPropertyInitialization": false,    /* Enable strict checking of property initialization in classes. */
    "allowSyntheticDefaultImports": true,     /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
```

😫 The TypeORM has dependency on `reflect-metadata`. You must run this, and import it on your application to use decorators:

```
yarn add reflect-metadata
```

Finnaly, you must point `ormconfig.json` to your entities:

```json
  "entities": [
    "./src/models/*.ts"
  ],
```

🍌 ESLint may mark some fieldnames-like variable names with errors. To disable, add a rule in `.eslintrc.json`:

```json
    "@typescript-eslint/camelcase": "off",
```

## Security

### Crypto

Password criptography, using `bcryptjs`:

```
yarn add bcryptjs
yarn add -D @types/bcryptjs
```

The `hash` function can be used to create salted-hash strings.

### Auth

JWT - JSON Web Tokens ([RFC 7519](https://tools.ietf.org/html/rfc7519))

Three strings base64-encoded joined by ".":
  * A header with metadata;
  * A payload;
  * A message auth code (MAC).

Example:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODk3MjEyMDksImV4cCI6MTU4OTgwNzYwOSwic3ViIjoiNTk4NDhhMjItNzU0OC00ODUzLWI5MzgtMmM0MDU2ZWFlNzY4In0.6Uvob8DiEgbXrqmE48VZ8tS3f_KWQKKvAHvq4eLhKeQ
```

That means... _([online decoder](https://jwt.io/))_

Header:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Payload:
```json
{
  "iat": 1589721209,
  "exp": 1589807609,
  "sub": "59848a22-7548-4853-b938-2c4056eae768"
}
```

Claims:
- `iat` stands for "Issued Time";
- `exp` stands for "Expiration Time";
- `sub` stands for "Subject", may be the user id.

Users should send a valid token at header `Authorization` in `Bearer {token}` format.

Installl packages:

```
yarn add jsonwebtoken
yarn add -D @types/jsonwebtoken
```
