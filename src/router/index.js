import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
// 配置路由规则
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')
const Question = () => import('@/views/question/index')
const Video = () => import('@/views/video/index')
const User = () => import('@/views/user/index')
const UserProfile = () => import('@/views/user/profile')
const UserChat = () => import('@/views/user/chat')
const Login = () => import('@/views/user/login')
const Search = () => import('@/views/search/index')
const SearchResult = () => import('@/views/search/result')
const Article = () => import('@/views/home/article')

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: Layout,
  children: [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/question',
    name: 'question',
    component: Question
  },
  {
    path: '/video',
    name: 'video',
    component: Video
  },
  {
    path: '/user',
    name: 'user',
    component: User
  }
  ]
},
{
  path: '/user/profile',
  name: 'user-profile',
  component: UserProfile
},
{
  path: '/user/chat',
  name: 'user-chat',
  component: UserChat
},
{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/search',
  name: 'search',
  component: Search
},
{
  path: '/search/result',
  name: 'search-result',
  component: SearchResult
},
{
  path: '/article',
  name: 'article',
  component: Article
}
]

const router = new VueRouter({
  routes
})
// 使用导航守卫拦截登录
router.beforeEach((to, from, next) => {
  // 当未登录并且页面为(个人中心/user  编辑资料/user/profile  小智同学/user/chat)
  const {
    user
  } = store.state
  if (!user.token && to.path.startsWith('/user')) {
    return next({
      // 实现登录后回跳,把当前想访问的地址传递给登录页面
      path: '/login',
      query: {
        redirectUrl: to.path
      }
    })
  }
  next()
})
export default router
