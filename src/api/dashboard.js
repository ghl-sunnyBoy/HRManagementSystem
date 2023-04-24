import request from '@/utils/request'
// 面板数据接口
export const getDataAPI = () => {
  return request({
    url: '/data/title',
    method: 'post'
  })
}
// 企业题目数据统计
export const dataStatisticsAPI = () => {
  return request({
    url: '/data/statistics',
    method: 'post'
  })
}
// 热门城市题目统计
export const hotCitiesAPI = () => {
  return request({
    url: '/data/hot_cities',
    method: 'post'
  })
}
