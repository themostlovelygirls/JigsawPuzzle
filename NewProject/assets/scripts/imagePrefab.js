cc.Class({
    extends: cc.Component,

    properties: {
        blockImage: cc.Sprite,
        lockImg: cc.Sprite,
        imgName: "",
        des: "",
        url: "",
        locked: true,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setLockBool (lockbool){
        this.locked = lockbool;
    },

    setImage (url, des, name) {

        this.url = url;
        this.des = des;
        this.imgName = name;

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

    clickBtn() {
        if(!this.locked) {
            let image = {
                des: this.des,
                url: this.url,
                imgName: this.imgName,
            }
            require('global').image = image;

            this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("desScene");
            })));
        }
    },

    // update (dt) {},
});
