import request from '@/utils/request'

// 查询定时任务调度列表
export function listBook(query) {
  return request({
    url: '/system/bookList/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getBook(noticeId) {
  return request({
    url: '/system/bookList/' + noticeId,
    method: 'get'
  })
}


// 新增公告
export function addBook(data) {
  return request({
    url: '/system/bookList',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateBook(data) {
  return request({
    url: '/system/bookList',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delBook(noticeId) {
  return request({
    url: '/system/bookList/' + noticeId,
    method: 'delete'
  })
}