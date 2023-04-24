import request from '@/utils/request'
// 获取企业数据
export const enterpriseList = (params) => {
  return request({
    url: '/enterprise/list',
    method: 'get',
    params
  })
}
// 添加企业
export const enterpriseAdd = (data) => {
  return request({
    url: '/enterprise/add',
    method: 'post',
    data
  })
}
// 编辑企业
export const enterpriseEdit = (data) => {
  return request({
    url: '/enterprise/edit',
    method: 'post',
    data
  })
}
// 删除企业
export const enterpriseRemove = (data) => {
  return request({
    url: '/enterprise/remove',
    method: 'post',
    data
  })
}
// 企业状态设置
export const enterpriseStatus = (data) => {
  return request({
    url: '/enterprise/status',
    method: 'post',
    data
  })
}
// 企业

// 企业列表
export function getEnterpriseGet(params) {
  return request({
    url: '/enterprise/list',
    method: 'get',
    params
  })
}
