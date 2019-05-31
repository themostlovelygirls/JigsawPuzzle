import * as Alert from './Alert';

const WAITING_TIME = 15

cc.Class({
    extends: cc.Component,

    properties: {
        infoLabel: cc.Label,
        button: cc.Button,
        difficultyLabel: cc.Label,
        buttonLabel: cc.Label,
        difficultyPart: cc.Node,
        timer: null,
        dots: "",
        count: 0,
        difficulty: 3,
        state: 'choose'
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
        this.node.runAction(cc.fadeIn(0.5));
    },

    start() {},
    // 设置定时器
    setTimer() {
        console.log('set timer')
        let self = this
        this.timer = setInterval(function () {
            self.count++
            let message = "对战匹配中\n"
            if (self.dots.length < 6) {
                self.dots = self.dots + "."
            } else {
                self.dots = ""
            }
            self.infoLabel.string = message + self.dots

            // TODO: 调用函数判断是否匹配成功
            console.log("定时器中 调用函数判断是否匹配成功")
            // result: [{"_id":"c0a3987b5cf099f108a4dc1b50b860c8","avaterUrl":"","difficulty":3,"id":"MouXiang512","name":"","room":"2019-5-31 03:05:21-6","url":"https://7465-test-1-4dcpx-1259242721.tcb.qcloud.la/drama/8%E6%98%86%E6%9B%B2.jpg?sign=d9a2fc8dde1159ea2ae47642703b2dad&t=1559139114"},{"_id":"c0a3987b5cf099f108a4dc2115c163f7","avaterUrl":"url","difficulty":3,"id":"xuan","name":"小寒","room":"2019-5-31 03:05:21-6","url":"https://7465-test-1-4dcpx-1259242721.tcb.qcloud.la/drama/8%E6%98%86%E6%9B%B2.jpg?sign=d9a2fc8dde1159ea2ae47642703b2dad&t=1559139114"}]
            wx.cloud.callFunction({
                name: 'getRoom',
                data: {
                    id: require('global').userid
                },
                success: function (res) {
                    console.log("result: " + JSON.stringify(res.result))
                    if(res.result != null && res.result.length == 2) {
                        clearInterval(self.timer)
                        console.log("匹配成功")

                        let result = res.result
                        let player = result[0], rival = result[1]
                        if(player.id != require('global').userid) {
                            player = result[1]
                            rival = result[0]
                        }
                        console.log("player: " + JSON.stringify(player))
                        console.log("rival:  " + JSON.stringify(rival))

                        require('battleLocal').room = player.room
                        require('battleLocal').imageUrl = player.url
                        require('battleLocal').rivalId = rival.id
                        require('battleLocal').rivalUrl = rival.avaterUrl
                        require('battleLocal').rivalName = rival.name
                        require('battleLocal').avaterUrl = player.avaterUrl
                        require('battleLocal').difficulty = player.difficulty
                        require('battleLocal').map = player.map

                        let callback = function () {
                            self.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                                cc.director.loadScene("battleScene");
                            })));
                        }
                        Alert.show("匹配成功，开始对战", callback, false)
                    }
                },
                fail: console.error
            })

            if (self.count >= WAITING_TIME) {
                self.timeout()
            }
        }, 1000)

    },
    clickButton(event, customEventData) {
        console.log("click on the button")
        if (this.state == 'choose') { // 点击确定按钮
            this.difficultyPart.active = false
            this.infoLabel.string = "对战匹配中\n"
            this.buttonLabel.string = '取消'
            this.state = 'waiting'
            // 调用云函数，加入等待队列
            console.log("调用云函数，加入等待队列")
            let self = this
            wx.cloud.callFunction({
                name: 'doBattleQueue',
                data: {
                    id: require('global').userid,
                    operation: 'add',
                    difficulty: self.difficulty,
                    name: require('global').username,
                    avaterUrl: require('global').avatarUrl
                },
                success: function (res) {
                    console.log("result: " + JSON.stringify(res.result))
                },
                fail: console.error
            })

            this.setTimer()
        } else { // 点击取消按钮
            clearInterval(this.timer)
            // 调用云函数，退出等待队列
            console.log('调用云函数，退出等待队列')
            wx.cloud.callFunction({
                name: 'doBattleQueue',
                data: {
                    id: require('global').userid,
                    operation: 'delete'
                },
                success: function (res) {
                    console.log("result: " + JSON.stringify(res.result))
                },
                fail: console.error
            })

            this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                cc.director.loadScene("mainScene");
            })));
        }

    },
    // 超时，匹配失败
    timeout() {
        // console.log("time out, return")
        clearInterval(this.timer)
        let self = this
        // 调用云函数，退出等待队列
        console.log('调用云函数，退出等待队列')
        wx.cloud.callFunction({
            name: 'doBattleQueue',
            data: {
                id: require('global').userid,
                operation: 'delete'
            },
            success: function (res) {
                console.log("result: " + JSON.stringify(res.result))
            },
            fail: console.error
        })
        let callback = function () {
            self.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                cc.director.loadScene("mainScene");
            })));
        }
        Alert.show("匹配失败", callback, false)
    },
    // 选择难度
    setDifficulty(event, customEventData) {
        // console.log("customEventData: " + customEventData)
        if (customEventData == "any") {
            this.difficultyLabel.string = "随机";
            this.difficulty = 'any'
        } else {
            this.difficultyLabel.string = customEventData + " x " + customEventData;
            this.difficulty = parseInt(customEventData)
        }
        // console.log("set difficulty: " + this.difficulty)
    },

    // update (dt) {},
});