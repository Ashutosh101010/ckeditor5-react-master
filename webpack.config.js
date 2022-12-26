/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { bundler, styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
module.exports = {
	context: __dirname,

	devtool: 'source-map',
	performance: { hints: false },
	externals: {
		react: {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react'
		}
	},

	entry: {
		ckeditor: path.join( __dirname, 'src', 'index.js' ),
		classEditor: path.join( __dirname, 'src', 'matheditor/ckeditor.js' )
	},

	output: {
		library: 'CKEditor',

		path: path.join( __dirname, 'dist' ),
		filename: '[name].js',
		libraryTarget: 'umd'
	},

	optimization: {
		minimizer: [
			( compiler ) => {
				const TerserPlugin = require( 'terser-webpack-plugin' );
				new TerserPlugin( {
					terserOptions: {
						compress: {}
					}
				} ).apply( compiler );
			}
		]
	},

	plugins: [
		new CKEditorWebpackPlugin( {
			// UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
			// When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
			language: 'en',
			additionalLanguages: 'all'
		} ),
		new webpack.BannerPlugin( {
			banner: bundler.getLicenseBanner(),
			raw: true
		} )
	],

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: [ 'raw-loader' ]
			},
			{
				test: /\.css$/,

				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'singletonStyleTag',
							attributes: {
								'data-cke': true
							}
						}
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: styles.getPostCssConfig( {
								themeImporter: {
									themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
								},
								minify: true
							} )
						}
					}
				]
			},
			{
				test: /\.jsx$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					compact: false,
					presets: [ '@babel/preset-react' ]
				}
			}
		]
	}
};
