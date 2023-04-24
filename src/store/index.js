import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import createPersistedstate from 'vuex-persistedstate'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  // 数据持久化
  plugins: [
    createPersistedstate({
      key: 'heimamm', // 存数据的key名   自定义的  要有语义化
      paths: ['user.token'] // 要把那些模块加入缓存
    })
  ],
  getters
})

export default store
