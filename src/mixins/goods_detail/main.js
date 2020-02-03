import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    goods_id: 0,
    goodsInfo: {},
    addressInfo: null
  }
  onLoad(options) {
    console.log(options)
    this.goods_id = options.goods_id
    this.getGoodsInfo()
  }

  async getGoodsInfo() {
    const { data } = await wepy.get('/goods/detail', {
      goods_id: this.goods_id
    })
    if (data.meta.status !== 200) return wepy.baseToast()

    this.goodsInfo = data.message
    this.$apply()
  }

  methods = {
    preview(current) {
      wx.previewImage({
        urls: this.goodsInfo.pics.map(item => item.pics_big),
        // 当前默认预览图片
        current
      })
    },

    // 获取收货地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err)
      if (res.errMsg !== 'chooseAddress:ok') {
        return wepy.baseToast('获取收货地址失败')
      }
      this.addressInfo = res
      wepy.setStorageSync('address', res)
      this.$apply()
    },

    // 加入购物车事件
    addToCart() {
      // 调用全局自定义的共享方法
      this.$parent.addGoodsToCart(this.goodsInfo)

      // 提示用户加入了购物车
      wepy.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    }
  }

  // 计算属性节点
  computed = {
    addressStr() {
      if (this.addressInfo === null) {
        return '请选择收货地址'
      }
      const addr = this.addressInfo
      const str =
        addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    }
  }
}
