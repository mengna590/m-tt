import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入rem适配
import 'amfe-flexible'
// 引入vant组件库(完整导入,配置方便节省时间,将来上线可以按需导入)
import Vant from 'vant'
import 'vant/lib/index.css'
// 注册全局样式,覆盖vant的样式
import '@/styles/index.less'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
