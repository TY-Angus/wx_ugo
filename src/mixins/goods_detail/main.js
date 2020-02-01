import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    goods_id: 0,
    goodsInfo: {}
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
}
