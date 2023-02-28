Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#ff6a03",
    list: [{
      pagePath: "/pages/diner/diner",
      iconPath: "/static/icon/diner.png",
      selectedIconPath: "/static/icon/diner_selected.png",
      text: "就餐"
    }, {
      pagePath: "/pages/commute/commute",
      iconPath: "/static/icon/car.png",
      selectedIconPath: "/static/icon/car_selected.png",
      text: "出行"
    }, {
      pagePath: "/pages/mine/mine",
      iconPath: "/static/icon/mine.png",
      selectedIconPath: "/static/icon/mine_selected.png",
      text: "我的"
    }],
    isShowTabBar: true
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      // this.setData({
      //   selected: data.index
      // })
    }
  }
})