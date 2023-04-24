import request from '@/utils/request'
// 获取学科列表信息接口
export const subjectList = (params) => {
  return request({
    url: '/subject/list',
    method: 'get',
    params
  })
}

// 添加学科接口
export const subjectAdd = (data) => {
  return request({
    url: '/subject/add',
    method: 'post',
    data
  })
}

// 学科编辑接口
export const subjectEdit = (data) => {
  return request({
    url: '/subject/edit',
    method: 'post',
    data
  })
}

// 学科删除接口
export const subjectRemove = (data) => {
  return request({
    url: '/subject/remove',
    method: 'post',
    data
  })
}

// 修改学科状态。启用或者禁用账号
export const subjectStatus = (data) => {
  return request({
    url: '/subject/status',
    method: 'post',
    data
  })
}

