import router from './router'
import store from './store'
// 白名单
const whitePage = ['/404', '/login']
// 前置导航守卫
router.beforeEach((to, from, next) => {
  if (store.state.user.token) {
    if (to.path.toLowerCase() === '/login') {
      next('/dashboard')
    } else {
      store.dispatch('user/getUsrInfo')
      next()
    }
  } else {
    if (whitePage.includes(to.path.toLowerCase())) {
      next()
    } else {
      next('/login')
    }
  }
  // next()
})
router.afterEach((to, from) => {
  // if (to.path.toLowerCase() === '/login') {
  //   // location.reload()
  // }
})
