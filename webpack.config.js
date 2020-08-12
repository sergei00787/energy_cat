const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CssUrlRelativePlugin = require('css-url-relative-plugin')

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
    // 'style-loader',
    'css-loader',
    // {
    //   loader: 'postcss-loader',
    //   options: {
    //       plugins: [
    //           autoprefixer({})
    //       ],
    //   }
    // },
    {
      loader: 'resolve-url-loader',
      options: {
        sourceMap: true,
      }
    },
  ]

  if (p_exrta) {
    loaders.push(p_exrta);
  }

  return loaders;
}

module.exports = {
  entry: {
    main: ['@babel/polyfill','./src/js/index.js']
  },

  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    // publicPath: "/dist/",
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
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader?sourceMap')
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },

      {
        test: /\.(png|jpg|gif|ico|svg)$/,
        use: [
          'file-loader?name=img/[name].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {}
          },
        ]
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'file-loader?name=fonts/[name].[ext]',
          {
            loader: 'file-loader',
            options: {
              path: '/src/fonts/',
              name: '[name].[ext]',
              outputPath: 'fonts'
            }
          },
        ]
        // loader: 'file-loader'
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
    new HTMLWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
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
      chunkFilename: "[id].css"
    }),
    
  ],


}
