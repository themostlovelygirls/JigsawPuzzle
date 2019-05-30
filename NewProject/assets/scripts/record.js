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
        
        this.records = [{
            time:"5月8日",
            rival:"xuan",
            result:true
        },
        {
            time:"5月9日",
            rival:"xuan",
            result:false
        }
        ];
        let rlen = this.records.length;


        /* let self = this; */
       /*  wx.cloud.callFunction({
            name: 'getBattleRecord',
            data: {
                id: require('global').userid,
            },
            success: function (res) {
                self.records = res.result;

                let rlen = self.records.length;
                for (let i = 0; i < rlen; i++) {
                    let record = cc.instantiate(this.recordPrefab);
                    record.getComponent('recordPrefab').setInfo(self.records[i]);
                    let contentNode = this.recordScrollView.node.getChildByName('view').getChildByName('content');
                    contentNode.addChild(record);
                    
                }

            },
            fail: console.error
        }) */

        if(rlen !== 0) {
            this.tip.node.active = false;
        }

        for (let i = 0; i < rlen; i++) {
            let record = cc.instantiate(this.recordPrefab);
            console.log(record);
            record.getComponent('recordPrefab').setInfo(this.records[i]);
            let contentNode = this.recordScrollView.node.getChildByName('view').getChildByName('content');
            contentNode.addChild(record);
        }
    },

    clickBackBtn(event, customEventData) {

        this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
            cc.director.loadScene("mainScene");
        })));
    }


    // update (dt) {},
});