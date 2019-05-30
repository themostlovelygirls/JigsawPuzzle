
cc.Class({
    extends: cc.Component,

    properties: {
        recordPrefab: cc.Prefab,
        level: cc.Label,
        recordScrollView: cc.ScrollView
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initRecord();
    },

    initRecord() {
        let rlen = 6;
        for(let i = 0; i < rlen; i++) {
            let record = cc.instantiate(this.recordPrefab);
            let contentNode = this.recordScrollView.node.getChildByName('view').getChildByName('content');
            contentNode.addChild(record);
            /* record.setPosition(-300, 100 - i * 250); */
            /* this.recordScrollView.node.addChild(record); */
        }
    },

    clickBackBtn (event, customEventData) {

        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("mainScene");
        })));
    }


    // update (dt) {},
});
