const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');

const port = 8085;

module.exports = {
  mode: 'development',
  devServer: {
    port: port,
    historyApiFallback: {
      index: '/index.html', // ensures all routes serve index.html
    },
    hot: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: {
      overlay: false, // Disable overlay for warnings and errors in the browser console
      logging: 'none', // Disables all Webpack Dev Server logs in the browser console
    },
    static: {
      directory: path.join(__dirname, 'public'), // serve static files from /public
      publicPath: '/',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  entry: './src/index.tsx',
  output: {
    publicPath: `http://localhost:${port}/`, // important for loading JS correctly in dev
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Match image files
        type: 'asset/resource', // Use Webpack's asset modules
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/, // Match .scss files
        use: [
          'style-loader', // Inject CSS into DOM
          'css-loader', // Translates CSS into CommonJS
          'sass-loader', // Compiles SCSS into CSS
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'MfeRenzyAdmin',
      filename: 'MfeRenzyAdminEntry.js',
      remotes: {},
      exposes: {},
      shared: {
        react: {
          singleton: true,
          eager: true, // Force eager loading
          requiredVersion: '18.3.1', // Specify the required version
        },
        'react-dom': {
          singleton: true,
          eager: true, // Force eager loading
          requiredVersion: '18.3.1', // Specify the required version
        },
        'react-router-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^7.1.5', // Adjust as per your actual version
        },
        'react-helmet-async': {
          singleton: true,
          requiredVersion: '^1.3.0', // or whatever version you're using
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv({
      path: './.env.development', // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false, // load '.env.defaults' as the default values if empty.
    }),
  ],
  watch: true,
  devtool: 'eval-source-map', // Better debugging
  stats: {
    warnings: false,
    errors: true,
  },
};
