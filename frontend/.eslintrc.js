module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:react/recommended', 'airbnb'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        indent: ['error', 4],
        'comma-dangle': ['off', 'never'],
        'no-console': 'off',
        'no-underscore-dangle': 'off',
        'react/jsx-indent': 'off',
        'react/jsx-indent-props': 'off',
        'react/button-has-type': 'off',
    },
};
