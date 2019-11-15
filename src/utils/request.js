// 封装的目的: 复用,导出一个调用请求的函数(配置axios,使用配置好的axios发请求)
// 处理js最大安全数值;在每次请求携带token,处理响应数据(剥离无效数据)
// 导出一个使用配置好的axios发请求的函数
import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
import router from 'vue-router'

// 创建一个新的axios实例
const instance = axios.create({
  // 基准地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 转换原始数据格式
  transformResponse: [(data) => {
    // data原始数据(json格式字符串)
    try {
      return JSONBIGINT.parse(data)
    } catch (e) {
      return data
    }
  }]
})
// 请求拦截 在每次请求头中携带token(发送请求之前)
instance.interceptors.request.use(config => {
  // 成功拦截
  // 修改请求配置,修改的是headers,获取token,配置token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => Promise.reject(err))
// 响应拦截,响应后获取有效数据(接受响应数据之后)
instance.interceptors.response.use(res => {
  // 处理响应
  // 调用接口的时候,then()的传参就是现在的return
  // res.data是响应内容,res.data.data才是有效数据
  try {
    return res.data.data
  } catch (e) {
    return res
  }
}, async err => {
  // 处理token失效
  // 1.判断是不是401状态(两种情况下会返回401);
  // 2.如果是未登录,则拦截到登录页面,并且预留回跳功能;
  // 3.如果是token失效,发请求给后台刷新token;
  // 3.1刷新成功, 更新vuex中token和本地存储的token;把原本失败的请求继续发送出去
  // 3.2刷新失败,删除vuex中token和本地存储的token,并且拦截到登录页面,预留回跳功能

  if (err.response && err.response.status === 401) {
    // 拦截到登录的跳转地址配置(vue组件实例的方式:this.$route.path)===(路由组件的方式:router.currentRoute)
    // 设置实现回跳的参数
    const loginConfig = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.path
      }
    }
    const {
      user
    } = store.state
    // 2.如果没有登录,拦截到登录页面
    if (!user || !user.token || !user.refresh__token) {
      return router.push(loginConfig)
    }
    // 3.如果是token失效的情况
    try {
      // 如果这个时候使用instance,将会有一些配置已经生效,所以在这里我们使用axios发请求
      // 发请求,给头部设置refresh_token
      const {
        data: {
          data
        }
      } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh__token}`
        }
      })
      // 3.1如果刷新成功，更新vuex中的token和本地存储的token
      store.commit('setUser', {
        token: data.token,
        refresh__token: user.refresh__token
      })
      return instance(err.config)
      // 把原本失败的请求发出去
      // 1 发请求  使用instance发送
      // 2 传入 原本失败的请求的配置
      // 3 最终代码：instance(原本失败的请求的配置) err.config
      // 4 instance(err.config) 返回给当前的错误拦截函数
    } catch (e) {
      // 3.2 刷新失败(有可能refresh_token也失效了)
      // 删除token,并且拦截到登录页面
      store.commit('delUser')
      return router.push(loginConfig)
    }
  }
  return Promise.reject(err)
})

// 导出一个使用配置好的axios来发送请求的函数
// 请求地址url,请求方式method,传参data
export default (url, method, data) => {
  return instance({
    url,
    method,
    // 当请求方式是get 是params来传参
    // 其他请求方式   是data来传参
    // 动态插入 属性 params|data
    // [] 写任意表达式  返回结果一定要是字符串类型
    // 不够严谨：用户传入请求方式 get Get GET
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
