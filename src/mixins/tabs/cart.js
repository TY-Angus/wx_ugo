import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    //   购物车商品列表
    cart: []
  }
  onLoad() {
    this.cart = this.$parent.globalData.cart
  }
  methods = {
    // 监听步进器变化的事件
    countChanged(e) {
      // 当前的value值e.detail
      // 当前的id值e.target.dataset.id
      console.log(e.detail, e.target.dataset.id)
      this.$parent.updataGoodsCount(e.target.dataset.id, e.detail)
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
    }
  }

  computed = {
    //  判断购物车里面是否有商品
    isEmpty() {
      if (this.cart.length <= 0) {
        return true
      }
      return false
    }
  }
}
