module.exports = {
  plugins: {
    autoprefixer: {},
    // 配置计算rem值得插件
    'postcss-pxtorem': {
      // 按照37.5的基准值来换算rem单位
      // vant默认按照最佳显示状态在iphone6
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
