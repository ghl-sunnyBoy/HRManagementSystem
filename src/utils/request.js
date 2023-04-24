import { Message } from 'element-ui'
import store from '@/store'
import axios from 'axios'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  withCredentials: true
})
// 添加请求拦截器
request.interceptors.request.use(function(config) {
  // config.headers.token = store.state.user.token
  // 在发送请求之前做些什么
  // 请求头
  if (store.state.user.token) {
    config.headers.token = store.state.user.token
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // console.log(response.data)
  if (response.data.code === 200) {
    // console.log(response.data.code)
    return response.data
  } else {
    // token失效
    if (response.data.code === 206) {
      store.commit('user/logOut')
      router.push('/login')
      Message.error('登录失效')
      return Promise.reject(response.data.message)
    }
    Message.error(response.data.message)
    return Promise.reject(response.data.message)
    // Excel导入重复数据

    // Message.error(response.data.message)
  }
}, function(error) {
  // console.dir(error.response.status)
  return Promise.reject(error)
})
export default request
