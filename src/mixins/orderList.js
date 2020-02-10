import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 默认被选中的标签
    active: 0,
    allOrderList: [],
    waitOrderList: [],
    finishOrderList: []
  }

  onLoad() {
    this.getOrderList(this.active)
  }

  methods = {
    // 标签页变化的事件
    tabChanged(e) {
      this.active = e.detail.index
      this.getOrderList(this.active)
    }
  }

  // 获取订单列表
  async getOrderList(index) {
    const { data } = await wepy.get('/my/orders/all', { type: index + 1 })
    if (data.meta.status !== 200) {
      return wepy.baseToast('获取订单列表失败')
    }

    data.message.orders.forEach(x => {
      x.order_detail = JSON.parse(x.order_detail)
    })

    if (index === 0) {
      this.allOrderList = data.message.orders
    } else if (index === 1) {
      this.waitOrderList = data.message.orders
    } else {
      this.finishOrderList = data.message.orders
    }
    this.$apply()
  }
}
