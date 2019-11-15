// 用户信息可能好多组件都要使用,所以托管到vuex上面,为了实现数据共享和好监听数据
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth' // 拿出auth的所有成员变量
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 用户信息(包含token)
    user: auth.getUser()
  },
  mutations: {
    // 修改用户信息,传入user对象
    setUser (state, user) {
      // 修改state
      state.user = user
      // 更新本地数据(当你刷新页面的时候,默认获取的就是本地的用户信息)
      auth.setUser(user)
    },
    // 清除用户信息
    delUser (state) {
      state.user = {}
      auth.delUser()
    }
  },
  actions: {}
})
