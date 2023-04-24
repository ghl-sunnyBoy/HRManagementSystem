// 题库
import request from '@/utils/request'

// 题库列表
export const questionGet = (params) => {
  return request({
    url: '/question/list',
    method: 'get',
    params
  })
}
// 改变题目状态
export const questionStatus = (id) => {
  return request({
    url: '/question/status',
    method: 'post',
    data: {
      id
    }
  })
}
// 新增题目
export const questionAdd = (data) => {
  return request({
    url: '/question/add',
    method: 'post',
    data
  })
}
// 删除题目
export const questionRemove = (id) => {
  return request({
    url: '/question/remove',
    method: 'post',
    data: {
      id
    }
  })
}
// 题目信息
export const questionOne = (id) => {
  return request({
    url: '/question/one',
    method: 'post',
    data: {
      id
    }
  })
}
// 编辑

export const questionEdit = (data) => {
  return request({
    url: '/question/edit',
    method: 'post',
    data
  })
}
