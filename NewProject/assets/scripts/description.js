
cc.Class({
    extends: cc.Component,

    properties: {
        imgName: cc.Label,
        image: cc.Sprite,
        locked: true,
        des: cc.Label,
        count: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        this.imageInfo = require('global').image;
        console.log(this.imageInfo);
        this.des.string = "京剧，曾称平剧，中国五大戏曲剧种之一，场景布置注重写意，腔调以西皮、二黄为主，用胡琴和锣鼓等伴奏，被视为中国国粹，中国戏曲三鼎甲“榜首”。\n\n京剧表演的四种艺术手法:唱、念、做、打，也是京剧表演四项基本功。唱指歌唱，念指具有音乐性的念白，二者相辅相成，构成歌舞化的京剧表演艺术两大要素之一的“歌”，做指舞蹈化的形体动作，打指武打和翻跌的技艺，二者相互结合，构成歌舞化的京剧表演艺术两大要素之一的“舞”。";
        this.setOnlineImg(this.imageInfo.url, this.image)
        this.imgName.string = this.imageInfo.imgName;
    },

    reverse() {
        this.count++;
        this.image.node.rotationX = 0;
        var rotationTo;
        if(this.count % 2 == 0) {
            this.image.node.rotationY = 180;
            rotationTo = cc.rotateTo(1, 0, 0);
        }else {
            this.image.node.rotationY = 0;
            rotationTo = cc.rotateTo(1, 0, 180);
        }

        this.image.node.runAction(rotationTo);

        
        let self = this;
        setTimeout(function(){self.setInfo(self);}, 500);
    },

    setInfo(self) {
        if(self.count % 2 == 0) {
            self.image.node.scaleX = 1;
            self.des.node.opacity = 0;
            cc.loader.load(self.imageInfo.url , function (err, texture) {
                self.image.spriteFrame = new cc.SpriteFrame(texture);
            })
        }else {
            let url = "blank";
            self.image.node.scaleX = -1;
            self.des.node.opacity = 255;

            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                self.image.spriteFrame = spriteFrame;
            });
        }
        
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
