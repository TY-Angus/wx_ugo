import wepy from 'wepy'

export default class extends wepy.mixin {
  config = {}
  data = {
    swiperList: [],
    cateItems: [],
    floorData: []
  }
  onLoad() {
    this.getSwiperData()
    this.getCateItems()
    this.getFloorData()
  }
  onShow() {
    this.$parent.renderCartBadge()
  }
  // 获取轮播图数据
  async getSwiperData() {
    const { data } = await wepy.get('/home/swiperdata')
    if (data.meta.status !== 200) {
      // 失败就弹框
      return wepy.showToast({
        title: '获取数据失败',
        icon: 'success',
        duration: 1500
      })
    }

    this.swiperList = data.message
    console.log(this.swiperList) // 输出数据
    this.$apply()
  }

  // 获取首页分类数据
  async getCateItems() {
    const { data } = await wepy.get('/home/catitems')
    // 失败就弹框
    if (data.meta.status !== 200) return wepy.baseToast()

    this.cateItems = data.message
    this.$apply()
  }

  //   获取首页楼层数据
  async getFloorData() {
    const { data } = await wepy.get('/home/floordata')
    // 失败就弹框
    if (data.meta.status !== 200) return wepy.baseToast()

    this.floorData = data.message
    console.log(this.floorData)
    this.$apply()
  }

  methods = {
    //  点击图片跳转页面
    goGoodsList(url) {
      wepy.navigateTo({
        url
      })
    }
  }
}
