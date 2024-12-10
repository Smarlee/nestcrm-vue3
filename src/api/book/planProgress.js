import request from '@/utils/request'

// 查询定时任务调度列表
export function listProgress(query) {
  return request({
    url: '/system/planProgress/list',
    method: 'get',
    params: query
  })
}