module.exports = {
  lintOnSave: true,
  baseUrl: '/fibosadmin/',
  outputDir: 'dist',
  runtimeCompiler: true,
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8103,
    https: false,
    hotOnly: false,
    proxy: {
      '/api/fibos/': {
        target: 'http://tunnel.fibos.io/',
        changeOrigin: true,
        pathRewrite: {
          '^/api/fibos/': '/1.0/',
        },
      },
    },
  },
};
