
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const ProxyURL = 'https://weapp-demo.wodavip.com'

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: ProxyURL,
        ws: false,
        changeOrigin: true,
        headers: {
          referer: ProxyURL,
          origin: ProxyURL
        }
      }
    }
  },
  configureWebpack: config => {
    config.output.chunkFilename = '[id].[chunkhash].js'
  },
  chainWebpack: config => {
    // ESLint
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .tap(options => {
        // Autofix
        options.fix = true

        return options
      })
      .end()

    // Docs Block
    // 后面加上输出原始文本
    // ExtractTextPlugin.extract('raw-loader') & new ExtractTextPlugin('docs.md')
    config.module
      .rule('docs')
      .resourceQuery(/blockType=docs/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

    // ToDo Block
    config.module
      .rule('todo')
      .resourceQuery(/blockType=todo/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

    // Tips Block
    config.module
      .rule('tips')
      .resourceQuery(/blockType=tips/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

    // SVG Sprite
    config.module
      .rule('svg')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons'))
      .end()
      .use('file-loader') // 修改原 svg 的 Rule
      .loader('svg-sprite-loader')
      .tap(options => {
        const _options = options || {}

        delete _options.name
        _options.symbolId = 'icon-[name]'

        return _options
      })
      .end()

    // Delete Plugins
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },
  filenameHashing: false,
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  css: {
    extract: process.env.NODE_ENV === 'production'
  },
  pwa: {
    // Configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local'
    }
  }
}
