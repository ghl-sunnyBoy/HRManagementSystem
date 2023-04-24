import request from '@/utils/request'
// import store from '@/store'

// 获取用户列表
export const userList = (params) => {
  return request({
    url: '/user/list',
    method: 'GET',
    params

  })
}
// 获取用户信息
export const getUserInfoAPI = () => {
  return request({
    url: '/info'
  })
}
// 后台创建用户
export const userAdd = (data) => {
  return request({
    url: '/user/add',
    method: 'POST',
    data

  })
}
// 用户信息编辑接口
export const userEdit = (data) => {
  return request({
    url: `/user/edit/${data.id}`,
    method: 'POST',
    data

  })
}

// 删除用户
export const userRemove = (data) => {
  return request({
    url: '/user/remove',
    method: 'POST',
    data
  })
}

// 修改用户状态。启用或者禁用账号

export const userStatus = (data) => {
  return request({
    url: '/user/status',
    method: 'POST',
    data
  })
}
