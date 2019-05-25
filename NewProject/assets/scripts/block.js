cc.Class({
    extends: cc.Component,

    properties: {
        blockImage: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setImage (url) {
        this.setStaticImg("headImg",this.blockImage);
    },

    setStaticImg (url, node) {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.spriteFrame = spriteFrame;
        });
    },

    setOnlineImg (url, node) {
        cc.loader.load(url , function (err, texture) {
            node.spriteFrame = new cc.SpriteFrame(texture);
        })
    }

    // update (dt) {},
});
