import request from '@/utils/request'
// 登录
export const postLoginAPI = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
// 头像上传
export const putHeadPhotoAPI = (data) => {
  return request({
    url: '/uploads',
    method: 'post',
    data
  })
}
// 短信发送
export const putCodeAPI = (data) => {
  return request({
    url: '/sendsms',
    method: 'post',
    data
  })
}
// 用户注册接口
export const putSendsmsAPI = (data) => {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
