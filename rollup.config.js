import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
	intro: '(function () {\'use strict\';\nvar define = false;\nvar window = window || self',
	outro: '}());',
	plugins: [
		nodeResolve({
			jsnext: true
		}),
		commonjs({
			include: 'node_modules/**'
		}),
		json(),
		babel({
			exclude: 'node_modules/**',
			presets: [ 'es2015-rollup' ]
		})
	]
};
