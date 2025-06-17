import { defineConfig } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';

import globals from 'globals';
import eslintjs from '@eslint/js';
const { configs } = eslintjs;

import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname,
	recommendedConfig: configs.recommended,
	allConfig: configs.all,
});

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath),
	{
		extends: compat.extends('eslint:recommended', 'prettier'),

		languageOptions: {
			sourceType: 'module',
			ecmaVersion: 2022,
			parserOptions: {},

			globals: {
				...globals.node,
				...globals.browser,
				chrome: 'readonly',
				browser: 'readonly',
			},
		},
	},
]);
