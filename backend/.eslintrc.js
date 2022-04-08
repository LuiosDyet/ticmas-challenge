module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['airbnb-base'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        indent: ['error', 4],
        'consistent-return': 'off',
        'comma-dangle': ['off', 'never'],
        'no-console': 'off',
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
        'no-underscore-dangle': 'off',
    },
};
