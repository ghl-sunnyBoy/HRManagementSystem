import { getUserInfoAPI } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: ''
  },
  mutations: {
    // 修改token
    setToken(state, v) {
      state.token = v
    },
    // 修改用户信息
    setUserInfo(state, v) {
      state.userInfo = v
    },
    // 退出登录 删除用户信息和token
    logOut(state) {
      state.token = ''
      state.userInfo = ''
    }
  },
  actions: {
    // 获取用户信息
    async getUsrInfo(xtc) {
      const res = await getUserInfoAPI()
      xtc.commit('setUserInfo', res.data)
    }
  },
  getters: {}
}

