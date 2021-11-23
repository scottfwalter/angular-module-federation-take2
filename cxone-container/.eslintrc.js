module.exports = {
    "extends": [
        "eslint-config-cxone"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.eslint.json",
        "sourceType": "module"
    },
    "overrides": [
        {
            "files": ["*.ts"],
            "rules": {
                "import/named": "off",
                "import/no-unresolved": "off"
            }
        }
    ]
};


