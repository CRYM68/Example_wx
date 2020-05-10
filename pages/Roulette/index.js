// pages/Roulette/index.js
Page({
  data: {
    is_play: false, // 运动状态
    available_num: 2, // 抽奖次数


    // 旋转动画相关参数
    base_circle_number: 9, // 基本圈数
    low_circle_num: 5, // 在第几圈开始进入减速圈（必须小于等于基本圈数），可自定义设置
    random_angle: 0, // 中奖角度，随机中奖
    change_angle: 0, // 已经旋转的度数
    add_angle: 10, // 追加角度
    use_speed: 1, // 当前转速
    nor_speed: 1, // 正常转速
    low_speed: 10, // 减速转速
    end_speed: 20, // 最后转速
    // 奖项
    awards: [{
        startAngle: 1,
        endAngle: 51,
        val: "1等奖"
      },
      {
        startAngle: 52,
        endAngle: 102,
        val: "2等奖"
      },
      {
        startAngle: 103,
        endAngle: 153,
        val: "3等奖"
      },
      {
        startAngle: 154,
        endAngle: 203,
        val: "4等奖"
      },
      {
        startAngle: 204,
        endAngle: 251,
        val: "5等奖"
      },
      {
        startAngle: 252,
        endAngle: 307,
        val: "6等奖"
      },
      {
        startAngle: 307,
        endAngle: 360,
        val: "未中奖"
      }
    ]
  },

  onLoad: function (options) {

  },

  // 判断是否能执行抽奖
  judeg_draw() {
    // 判断运动状态
    if (!this.data.is_play) {
      this.setData({
        is_play: true
      })
    } else return false

    // 抽奖次数判断
    if (this.data.available_num === 0) {
      wx.showToast({
        title: '没机会了',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    return true
  },

  // 更新抽奖结束后状态
  luckDrawEndset() {
    // 抽奖完成
    this.setData({
      is_play: false, // 重置运动状态
      available_num: this.data.available_num - 1, // 抽奖次数减一
    })
    this.data.change_angle = 0
  },

  // 获取抽奖结果
  getLuckDrawResult() {
    let {
      awards,
      random_angle
    } = this.data;
    for (let i = 0; i < awards.length; i++) {
      if (random_angle >= awards[i].startAngle && random_angle <= awards[i].endAngle) {
        wx.showModal({
          title: 'result',
          content: awards[i].val,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  /**
   * 运动函数
   */
  luckDrawChange() {
    let {
      change_angle,
      base_circle_number,
      random_angle,
      low_circle_num,
      add_angle
    } = this.data;
    let all_angle = base_circle_number * 360 + random_angle
    if (change_angle >= all_angle) {
      // 提示结果
      this.getLuckDrawResult()
      // 更新状态
      this.luckDrawEndset()
    } else {
      if (change_angle >= low_circle_num * 360 && change_angle < base_circle_number * 360) { // 判断是否进入减速圈
        this.data.use_speed = this.data.low_speed
      } else if (change_angle >= base_circle_number * 360) { // 进入结束圈
        this.data.use_speed = this.data.end_speed
      }
      this.setData({
        change_angle: change_angle >= all_angle ? all_angle : change_angle + add_angle
      })
      setTimeout(this.luckDrawChange, this.data.use_speed)
    }
  },

  // 启动抽奖
  luckDrawStart() {
    // 是否满足抽奖条件
    if (!this.judeg_draw()) {
      return false
    }
    this.setData({
      random_angle: Math.ceil(Math.random() * 360)
    })
    // 运动函数,直接设置过渡属性也行
    setTimeout(this.luckDrawChange,this.data.use_speed)
  }
})