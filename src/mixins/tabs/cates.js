import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    cateList: [],
    activeKey: 0,
    // 页面可用高度
    wh: 0,
    // 商品二级分类
    secondCate: []
  }

  methods = {
    onChange(event) {
      // e.detail是点击项的索引
      this.secondCate = this.cateList[event.detail].children
    },
    // 跳转到商品列表页
    goGoodsList(catid) {
      wepy.navigateTo({
        url: '/pages/goods_list?catid=' + catid
      })
    }
  }

  onLoad() {
    this.getCateList()
    this.getWindowHeigth()
  }
  //   获取分类列表数据
  async getCateList() {
    const { data } = await wepy.get('/categories')
    if (data.meta.status !== 200) return wepy.baseToast()
    this.cateList = data.message
    this.secondCate = this.cateList[0].children
    this.$apply()
  }

  async getWindowHeigth() {
    const res = await wepy.getSystemInfo()
    console.log(res)
    if (res.errMsg === 'getSystemInfo:ok') {
      this.wh = res.windowHeight
      this.$apply()
    }
  }
}
