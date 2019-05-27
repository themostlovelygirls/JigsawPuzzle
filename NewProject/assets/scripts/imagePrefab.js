cc.Class({
    extends: cc.Component,

    properties: {
        blockImage: cc.Sprite,
        lockImg: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setImage (url) {
       /*  this.setStaticImg("headImg",this.blockImage); */
        this.setOnlineImg(url, this.blockImage);
        console.log("url:"+url);
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
    },

    fadeLock (){
        this.fadeOut(this.lockImg.node);
    },

    fadeOut (node) {
        for(let j = 210; j >=0; j-=0.01){
            (function(e){
                setTimeout(function(){
                    node.opacity = e;
                }, 200);
            })(j);
        }
    },

    // update (dt) {},
});
