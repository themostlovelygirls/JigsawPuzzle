cc.Class({
    extends: cc.Component,

    properties: {
        recordPrefab: cc.Prefab,
        level: cc.Label,
        recordScrollView: cc.ScrollView,
        tip: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.initRecord();
    },

    initRecord() {

        this.level.string = require('global').battleLevel;
        
        let self = this;
        wx.cloud.callFunction({
            name: 'getBattleRecord',
            data: {
                id: require('global').userid,
            },
            success: function (res) {
                self.records = res.result;

                let rlen = self.records.length;

                if(rlen === 0) {
                    self.tip.node.active = true;
                }
        
                for (let i = rlen - 1; i >= 0; i--) {
                    let record = cc.instantiate(self.recordPrefab);
                    console.log(record);
                    record.getComponent('recordPrefab').setInfo(self.records[i]);
                    let contentNode = self.recordScrollView.node.getChildByName('view').getChildByName('content');
                    contentNode.addChild(record);
                }

            },
            fail: console.error
        })

        /* if(rlen !== 0) {
            this.tip.node.active = false;
        }

        for (let i = 0; i < rlen; i++) {
            let record = cc.instantiate(this.recordPrefab);
            console.log(record);
            record.getComponent('recordPrefab').setInfo(this.records[i]);
            let contentNode = this.recordScrollView.node.getChildByName('view').getChildByName('content');
            contentNode.addChild(record);
        } */
    },

    clickBackBtn(event, customEventData) {

        this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
            cc.director.loadScene("mainScene");
        })));
    }


    // update (dt) {},
});