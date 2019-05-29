
cc.Class({
    extends: cc.Component,

    properties: {
        imgName: cc.Label,
        image: cc.Sprite,
        locked: true,
        des: cc.Label,
        count: 0,
        border: cc.Sprite,
        imgContent: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        this.imageInfo = require('global').image;
        /* console.log(this.imageInfo); */
        this.des.string = this.imageInfo.des;
        this.setOnlineImg(this.imageInfo.url, this.imgContent)
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
            self.border.node.active = true;
            self.imgContent.node.active = true;
            cc.loader.load(self.imageInfo.url , function (err, texture) {
                self.imgContent.spriteFrame = new cc.SpriteFrame(texture);
            })
        }else {
            let url = "description";
            self.image.node.scaleX = -1;
            self.des.node.opacity = 255;
            self.border.node.active = false;
            self.imgContent.node.active = false;

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

    /* setStaticImg (node) {
        //let url = 
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.spriteFrame = spriteFrame;
        });
    }, */

    clickBackBtn (event, customEventData) {

        cc.log(customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("imageScene");
        })));
    },

    // update (dt) {},
});
