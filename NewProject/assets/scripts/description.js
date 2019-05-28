
cc.Class({
    extends: cc.Component,

    properties: {
        imgName: cc.Label,
        image: cc.Sprite,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {

    },

    clickBackBtn (event, customEventData) {

        cc.log(customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("imageScene");
        })));
    },

    // update (dt) {},
});
