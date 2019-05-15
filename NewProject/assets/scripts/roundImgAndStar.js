// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        star1: cc.Sprite,
        star2: cc.Sprite,
        star3: cc.Sprite,
        roundImg: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setImage () {
        //
    },

    setStars (number) {
        switch(number){
            case 3: this.setStaticImg("star", this.star3);
            case 2: this.setStaticImg("star", this.star2);
            case 1: this.setStaticImg("star", this.star1);
            default: break;
        }
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