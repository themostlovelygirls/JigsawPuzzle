

cc.Class({
    extends: cc.Component,

    properties: {
      image: cc.Sprite, 
      count: 0, 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    test() {
        console.log("test");
        /* this.node.rotationX = 0;
	    this.node.rotationY = 0;
	    var rotationTo = cc.rotateTo(1, 0, 180);
	    this.node.runAction(rotationTo); */
        /* this.node.scaleX = -1; */
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
	    //this.image.node.rotationY = 0;
        //var rotationTo = cc.rotateTo(1, 0, 180);
        this.image.node.runAction(rotationTo);

        
        let self = this;
        setTimeout(function(){self.setStaticImg(self.image, self.count);}, 500);
        //rotationTo = cc.rotateTo(1, 90, 0);
        //this.image.node.runAction(rotationTo)
    },

    setStaticImg (image, count) {
        let url;
        if(count % 2 == 0) {
            url = "logo";
            image.node.scaleX = 1;
        }else {
            url = "1";
            image.node.scaleX = -1;
        }
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            image.spriteFrame = spriteFrame;
        });
        //node.node.scaleX = -1;
    },

    reverse() {
        this.image.node.scaleX = -1;
    }
    // update (dt) {},
});
