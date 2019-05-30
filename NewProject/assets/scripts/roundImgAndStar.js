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
        roundImg: cc.Sprite,
        index: 1,
        difficulty: 3,
        locked: true,
        lockImg: cc.Sprite,
        imageTexture: cc.Texture2D
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    getIndex (){
        return this.index;
    },

    setIndex (i){
        this.index = i;
    },

    setImage (url) {
        //this.setStaticImg("headImg",this.roundImg);
        this.setOnlineImg(url, this.roundImg);
    },

    setStars (number) {
        switch(number){
            case 3: this.setStaticImg("star", this.star3);
            case 2: this.setStaticImg("star", this.star2);
            case 1: this.setStaticImg("star", this.star1);
            default: break;
        }
    },

    setDifficulty (diff) {
        this.difficulty = diff;
    },

    setLockBool (lockbool){
        this.locked = lockbool;
    },

    setStaticImg (url, node) {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.spriteFrame = spriteFrame;
        });
    },
    
    setOnlineImg (url, node) {
        var self = this;
        cc.loader.load(url , function (err, texture) {
            node.spriteFrame = new cc.SpriteFrame(texture);
            self.imageTexture = texture;

            // console.log("self.imageTexture in roundImgAndStar: " + self.imageTexture)
            // console.log("instance: " + typeof(self.imageTexture))

            //console.log(err);
        })
    },
    // update (dt) {},

    fadeLock (){
        this.fadeOut(this.lockImg.node);
    },

    fadeOut (node) {
        /* for(let j = 255; j >=0; j-=0.01){
            (function(e){
                setTimeout(function(){
                    node.opacity = e;
                }, 700);
            })(j);
        } */
        node.opacity = 0;
    },



    lock () {
        this.setLockBool(true);
        this.lockImg.node.opacity = 255;
        this.setStaticImg("starEmpty", this.star1);
        this.setStaticImg("starEmpty", this.star2);
        this.setStaticImg("starEmpty", this.star3);
    },

    clickBtn (event, customEventData) {
        console.log("click round!");
        if(!this.locked){
            require('global').index = this.index;
            require('global').difficulty = this.difficulty;

            // console.log("this.imageTexture before set: " + this.imageTexture)
            // console.log("type: " + typeof(this.imageTexture))

            require('global').imageTexture = this.imageTexture;

            // console.log("this.imageTexture after set: " + this.imageTexture)
            // console.log("type: " + typeof(this.imageTexture))

            this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("gameScene");
            })));
        }
    }
});