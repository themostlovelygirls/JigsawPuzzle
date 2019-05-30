import * as Alert from './Alert';

cc.Class({
    extends: cc.Component,

    properties: {
        returnBtn: cc.Button,
        cartBtn: cc.Button,
        leftStarLabel: cc.Label,
        leftToolLabel: cc.Label,
        leftStar: 0,
        leftTool: 0
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        this.initData();
    },

    initData () {
        var self = this;
        wx.cloud.callFunction({
            name: 'getUserInfo',
            data: {
                id: require('global').userid
            },
            success: function (res) {
                self.leftStar = res.result.star_balance;
                self.leftTool = res.result.tools;
                self.setToolNum(res.result.tools);
                self.setStarNum(res.result.star_balance);
            },
            fail: console.error
        })
    },

    setStarNum (number) {
        this.leftStarLabel.string = ": "+number;
    },

    setToolNum (number) {
        this.leftToolLabel.string = ": "+number;
    },

    clickBackBtn (event, customEventData) {
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("mainScene");
        })));
    },

    clickShopBtn (event, customEventData) {
        if(this.leftStar>0){
            this.leftStar = this.leftStar - 1;
            this.leftTool = this.leftTool + 1;
            var self = this;
            wx.cloud.callFunction({
                name: 'updateStarAndTool',
                data: {
                    id: require('global').userid,
                    starBalance: self.leftStar,
                    toolNum: self.leftTool
                },
                success: function (res) {
                    let message = "购买成功ヾ(✿ﾟ▽ﾟ)ノ";
                    Alert.show(message, null, false)
                    self.initData();
                },
                fail: console.error
            })
        }else{
            let message = "已经没有中国结了QAQ";
            Alert.show(message, null, false)
        }
    }

    // update (dt) {},
});
