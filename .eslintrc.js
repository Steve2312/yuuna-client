module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es2021": true,
        "amd": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "react/prop-types": "off",
        "react/display-name": "off",
        "comma-dangle": [
            "error",
            "never"
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off"
    }
};