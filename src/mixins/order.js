import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    addressInfo: null,
    cart: [],
    islogin: false
  }
  methods = {
    //  监听选择地址的事件
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err)
      if (res.errMsg !== 'chooseAddress:ok') return
      this.addressInfo = res
      //   保存地址到本地
      wepy.setStorageSync('address', res)
      this.$apply()
    },

    // 获取用户信息
    async getUserInfo(userInfo) {
      if (userInfo.detail.errMsg !== 'getUserInfo:ok') {
        return wepy.baseToast('获取用户信息失败')
      }
      const loginRes = await wepy.login()
      if (loginRes.errMsg !== 'login:ok') {
        return wepy.baseToast('微信登录失败')
      }

      const loginParams = {
        code: loginRes.code,
        encryptedData: userInfo.detail.encryptedData,
        iv: userInfo.detail.iv,
        rawData: userInfo.detail.rawData,
        signature: userInfo.detail.signature
      }
      const { data } = await wepy.post('/users/wxlogin', loginParams)
      console.log(data)
      if (data.meta.status !== 200) return wepy.baseToast('登录失败')
      //   保存到本地中
      wepy.setStorageSync('token', data.message.token)
      this.islogin = true
      this.$apply()
    },

    // 支付订单事件
    async onSubmit() {
      if (this.amount <= 0) {
        return wepy.baseToast('订单价格不能为零')
      }
      if (this.addressStr.length <= 0) {
        return wepy.baseToast('收货地址不能为空')
      }

      // 创建订单
      const { data } = await wepy.post('/my/orders/create', {
        order_price: this.amount / 100,
        consignee_addr: this.addressStr,
        order_detail: JSON.stringify(this, cart),
        goods: this.cart.map(x => {
          return {
            goods_id: x.id,
            goods_number: x.count,
            goods_price: x.price
          }
        })
      })

      if (data.meta.status !== 200) {
        return wepy.baseToast('创建订单失败')
      }

      // 订单成功了
      const orderInfo = data.message
      // 创建预支付订单
      const { data: orderResult } = await wepy.post(
        '/my/orders/req_unifiedorder',
        {
          order_number: orderInfo.order_number
        }
      )

      if (orderResult.meta.status !== 200) {
        return wepy.baseToast('创建预支付订单失败')
      }

      // 支付
      const payResult = await wepy
        .requestPayment(orderResult.message.pay)
        .catch(err => err)

      if (payResult.errMsg === 'resquestPayment:fail cancel') {
        return wepy.baseToast('您已经取消了支付')
      }

      // 支付完成，检查结果
      const { data: payCheckResult } = await wepy.post('/my/orders/chkOrder', {
        order_number: data.order_number
      })
      if (payCheckResult.meta.status !== 200) {
        return wepy.baseToast('支付失败')
      }
      wepy.showToast({
        title: '支付成功'
      })

      // 跳转到订单列表页面
      wepy.navigateTo({
        url: '/pages/orderList'
      })
    }
  }

  onLoad() {
    //   读取本地收货地址
    this.addressInfo = wepy.getStorageSync('address') || null

    // 从购物车把选中的商品放在一个新的数组
    const newArr = this.$parent.globalData.cart.filter(x => x.isCheck)
    this.cart = newArr
  }

  computed = {
    //   是否有地址
    isHaveAddress() {
      if (this.addressInfo) return true
      return false
    },
    // 详细地址
    addressStr() {
      if (this.addressInfo === null) {
        return ''
      }
      const addr = this.addressInfo
      const str =
        addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    },
    // 当前订单的总价格
    amount() {
      let total = 0
      this.cart.forEach(x => {
        total += x.price * x.count
      })
      return total * 100
    }
  }
}
