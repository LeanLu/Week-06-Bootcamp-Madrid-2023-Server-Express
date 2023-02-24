# WEEK 2 - BOOTCAMP MADRID

## Ejercicios semana 2

### configuración:

- .editorconfig
- .gitignore
- package.json (Add Prettier)
- Install dependencias desde package.json: `npm i`
- crear repo: `git init`
- Install de eslint: `npm i -D eslint`
- Configuración del eslint: `npx eslint --init`
- Añadir: `npm i -D eslint-config-prettier`
- Incluir en eslint.json 'prettier' como última extensión
- Añadir carpeta con Huskies
- Iniciar husky: `npx husky install`

## Jest install / setup

- `npm i -D jest @types/jest @babel/plugin-transform-modules-commonjs`

- .eslintrc.json:

```json
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
```

- jsconfig.json:

```json
{
  "typeAcquisition": {
    "include": ["jest"]
  }
}
```

- package.json

```json
"babel": {
    "env": {
      "test": {
        "plugins": [
          "@babel/plugin-transform-modules-commonjs"
        ]
      }
    }
  }
```
