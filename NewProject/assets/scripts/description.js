
cc.Class({
    extends: cc.Component,

    properties: {
        imgName: cc.Label,
        image: cc.Sprite,
        locked: true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        this.imageInfo = require('global').image;
        console.log(this.imageInfo);
        this.setOnlineImg(this.imageInfo.url, this.image)
        this.imgName.string = this.imageInfo.imgName;
    },

    setOnlineImg (url, node) {
        cc.loader.load(url , function (err, texture) {
            node.spriteFrame = new cc.SpriteFrame(texture);
        })
    },

    clickBackBtn (event, customEventData) {

        cc.log(customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("imageScene");
        })));
    },

    // update (dt) {},
});
