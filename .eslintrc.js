module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'settings': {
        'react': {
            'version': 'detect'
        }
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        '@typescript-eslint'
    ],
    'ignorePatterns': [
        'config/**',
        'scripts/**'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': 'off',
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'keyword-spacing': [
            'error',
            {
                'before': true,
                'after': true
            }
        ],
        'space-infix-ops': ['error', { 'int32Hint': true }],
        'object-curly-spacing': ['error', 'always'],
        'space-before-blocks': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
        'react/display-name': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                'allowExpressions': true
            }
        ]
    }
}
