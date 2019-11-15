// auth认证 操作的是用户信息(token令牌,用来认证信息)
// 之前用户信息存储位置是:sessionStorage  关闭浏览器则登录失效,这种方法不适合移动端
// 我们要永久保存用户信息,根据refresh_token来延长有效期,使用localStorage保存用户信息
// 导出三个操作
const USER_KEY = 'm-tt'
// 获取用户信息
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}
// 设置用户信息,user是传过来的对象
export const setUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}
// 删除对象
export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
