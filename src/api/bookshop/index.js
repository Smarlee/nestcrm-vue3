import request from '@/utils/request'

// 查询定时任务调度列表
export function cartView(userId) {
  return request({
    url: '/cart/view/'+userId,
    method: 'get',
  })
}


 

// 添加商品到购物车
export function addCarts(userId,data) {
  return request({
    url: `/cart/${userId}/add-multiple`,
    method: 'post',
    data: data
  })
}


// 删除 
export function delCart(noticeId) {
  return request({
    url: '/cart/' + noticeId,
    method: 'delete'
  })
}