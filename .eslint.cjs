module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: '@mui/material',
                        message: 'Use deep imports like "@mui/material/Button" instead.',
                    },
                    {
                        name: '@mui/icons-material',
                        message: 'Use deep imports like "@mui/icons-material/Photo" instead.',
                    },
                ],
            },
        ],
    },
};
