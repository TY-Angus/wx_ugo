import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    //   查询关键词
    query: '',
    // 分类id
    cid: '',
    // 页码
    pagenum: 1,
    // 每页显示多少条数据
    pagesize: 10,
    // 商品列表
    goodsList: [],
    // 总数据条数
    total: 0,
    // 默认没有加载完毕 隐藏
    isOver: true,
    // 表示没有请求数据
    isLoading: false
  }

  onLoad(options) {
    console.log(options)
    this.query = options.query || ''
    this.cid = options.catid || ''
    this.getGoodsList()
  }

  //   获取商品列表数据
  async getGoodsList(cb) {
    this.isLoading = true
    const { data } = await wepy.get('/goods/search', {
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })

    if (data.meta.status !== 200) return wepy.baseToast()

    this.goodsList.push(...data.message.goods)
    this.total = data.message.total
    this.isLoading = false
    this.$apply()
    cb && cb()
  }

  //   页面触底事件
  onReachBottom() {
    // 判断是否还在请求中 如果是就直接return
    if (this.isLoading) return

    //   先判断是否有下一页的数据
    if (this.pagenum * this.pagesize >= this.total) {
      this.isOver = false
      return
    }
    console.log('触底了')
    this.pagenum++
    this.getGoodsList()
  }

  //   下拉刷新操作
  onPullDownRefresh() {
    this.pagenum = 1
    this.total = 0
    this.goodsList = []
    this.isOver = true
    this.isLoading = false

    this.getGoodsList(() => {
      // 停止下拉刷新行为
      wepy.stopPullDownRefresh()
    })
  }

  methods = {
    //  跳转商品详情页
    goGoodsList(goodsId) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goodsId
      })
    }
  }
}
