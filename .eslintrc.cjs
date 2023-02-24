module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022
	},
	env: {
		es2022: true,
		node: true,
		browser: true
	}
};
