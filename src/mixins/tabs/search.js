import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    value: '',
    // 搜索建议列表
    suggestList: [],
    // 搜索历史列表
    kwList: []
  }

  onLoad() {
    // 获取本地存储的搜索历史列表
    const kwList = wepy.getStorageSync('kw') || []
    this.kwList = kwList
    this.$apply()
  }

  methods = {
    //   触发了搜索功能
    onSearch(e) {
      if (e.detail.trim().length <= 0) return

      // 把用户填写的关键词存储到Storage去
      if (this.kwList.indexOf(e.detail.trim()) === -1) {
        this.kwList.unshift(e.detail.trim())
      }
      // 数组截取十项0~9
      this.kwList = this.kwList.slice(0, 10)
      wepy.setStorageSync('kw', this.kwList)
      // 跳转到商品列表页面
      wepy.navigateTo({
        url: '/pages/goods_list?query=' + e.detail.trim()
      })
    },

    // 触发了取消功能
    onCancel() {
      this.suggestList = []
    },

    // 输入框里面的值发生改变时触发
    onChange(e) {
      this.value = e.detail.trim()
      if (e.detail.trim().length <= 0) {
        this.suggestList = []
        return
      }
      this.getSuggestList(e.detail)
    },

    // 点击建议项导航
    goGoodsDetail(goodsId) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goodsId
      })
    },

    // 点击标签页导航
    goGoodsList(query) {
      wepy.navigateTo({
        url: '/pages/goods_list?query=' + query
      })
    },

    // 清除搜索历史记录
    clearHistory() {
      this.kwList = []
      wepy.setStorageSync('kw', [])
    }
  }

  // 计算属性
  computed = {
    // 如果返回ture就是渲染历史区域
    // 如果为false就是不渲染
    isShowHistory() {
      if (this.value.length <= 0) return true
      return false
    }
  }
  // 发送请求获取建议列表
  async getSuggestList(searchStr) {
    const { data } = await wepy.get('/goods/qsearch', { query: searchStr })
    if (data.meta.status !== 200) return wepy.baseToast()

    this.suggestList = data.message
    this.$apply()
  }
}
