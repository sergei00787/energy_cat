const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const fs = require('fs');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log("IS DEV = " + isDev);

const optimization = () => {
  const config = {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin()
    ]
  }

  return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = (p_exrta) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      },
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          autoprefixer({})
        ],
      }
    },
  ]

  if (p_exrta) {
    loaders.push(p_exrta);
  }

  return loaders;
}

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
  assets: 'assets/'
}

console.log("PATHS.src = " + PATHS.src);

const PAGES_DIR = `${PATHS.src}/pug/pages`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));
// const PAGES = fs.readdirSync(PAGES_DIR);

console.log("PAGES_DIR = " + PAGES_DIR);




module.exports = {
  entry: {
    // app: paths.src,
    main: ['@babel/polyfill', './src/js/index.js']
  },

  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },

  optimization: optimization(),

  devtool: isDev ? 'source-map' : '',

  resolve: {
    alias: {
      root: path.resolve(__dirname, 'src'),
      img: path.resolve(__dirname, "img")
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_component)/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          }
        }
      },

      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_component)/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ],
          }
        }
      },

      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_component)/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ],
          }
        }
      },


      {
        test: /\.s(a|c)ss$/,
        loader: [
          MiniCssExtractPlugin.loader,
          //  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                autoprefixer({})
              ],
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },

      {
        test: /\.(png|jpe?g|gif|ico|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img',
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {}
          },
        ]
      },

      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              path: '/src/fonts/',
              name: '[name].[ext]',
              outputPath: 'fonts'
            }
          },
        ]
      },

      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: isDev
            }
          }
          
        ]
        // loader: 'pug-loader'
      }
    ]
  },

  devServer: {
    // contentBase: '/dist',
    port: 4200,
    overlay: true,
    hot: isDev
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),

    // new HtmlWebpackPlugin({
    //   template: `${PAGES_DIR}catalog.pug`,
    //   // template: './src/pug/pages/catalog.pug',
    //   filename: 'catalog.html',
    //   inject:true
    // }),

    // Automatic creation any html pages (Don't forget to RERUN dev server)
    // see more: https://github.com/vedees/webpack-template/blob/master/README.md#create-another-html-files
    // best way to create pages: https://github.com/vedees/webpack-template/blob/master/README.md#third-method-best
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/, '.html')}`
    })),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/img/'),
          to: path.resolve(__dirname, './dist/img/')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('[name].css'),
      chunkFilename: isDev ? "[id].css" : "[id].[hash].css"
    }),

    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],


}
