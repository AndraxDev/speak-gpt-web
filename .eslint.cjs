module.exports = {
    extends: ['react-app'],
    rules: {
        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: '@mui/material',
                        message: 'Use deep imports like "@mui/material/Button" instead.',
                    },
                ],
            },
        ],
    },
};