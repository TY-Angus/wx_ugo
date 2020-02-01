import wepy from 'wepy'

// 定义基础地址
const baseURL = 'https://www.zhengzhicheng.cn/api/public/v1'

// 弹窗提示一个屋无图标的提示框
// str表示提示的文字信息
wepy.baseToast = function(str = '获取数据失败') {
  wepy.showToast({
    title: str,

    // 弹窗期间不会携带任何图标
    icon: 'none',
    duration: 1500
  })
}

// 发送get请求的API
// data是请求参数对象
wepy.get = function(url, data = {}) {
  return wepy.request({
    url: baseURL + url,
    method: 'get',
    data
  })
}

// 发送post请求的API
wepy.post = function(url, data = {}) {
  return wepy.request({
    url: baseURL + url,
    method: 'post',
    data
  })
}
