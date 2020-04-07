import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    //   购物车商品列表
    cart: []
  }
  onLoad() {
    this.cart = this.$parent.globalData.cart
  }
  onShow() {
    this.$parent.renderCartBadge()
  }
  methods = {
    // 监听步进器变化的事件
    countChanged(e) {
      // 当前的value值e.detail
      // 当前的id值e.target.dataset.id
      console.log(e.detail, e.target.dataset.id)
      const id = e.target.dataset.id
      const value = e.detail
      this.$parent.updataGoodsCount(id, value)
    },

    // 监听复选框发生变化的事件
    statusChange(e) {
      // 当前的状态
      const status = e.detail
      const id = e.target.dataset.id
      this.$parent.updataGoodsStatus(id, status)
    },

    // 监听删除商品的事件
    close(id) {
      this.$parent.removeGoodsById(id)
    },

    // 监听全选框值的改变的事件
    onFullCheckChanged(e) {
      this.$parent.updataAllGoodsStatus(e.detail)
    },

    // 监听提交订单的事件
    submitOrder() {
      if (this.amount <= 0) {
        return wepy.baseToast('订单不能为空')
      }

      wepy.navigateTo({
        url: '/pages/order'
      })
    }
  }

  computed = {
    //  判断购物车里面是否有商品
    isEmpty() {
      if (this.cart.length <= 0) {
        return true
      }
      return false
    },

    // 总价格 单位是分
    amount() {
      let total = 0
      this.cart.forEach(x => {
        if (x.isCheck) {
          total += x.price * x.count
        }
      })
      return total * 100
    },

    // 是否全选
    idFullChecked() {
      const allCount = this.cart.length
      let c = 0
      this.cart.forEach(x => {
        if (x.isCheck) {
          c++
        }
      })
      if (allCount === c) return true
      return false
    }
  }
}
