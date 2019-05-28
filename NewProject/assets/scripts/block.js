cc.Class({
    extends: cc.Component,

    properties: {
        blockImage: cc.Sprite,
        blockButton: cc.Button,
        row: -1,
        column: -1
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    setPos(i, j) {
        this.row = i
        this.column = j

        console.log("set block pos, i: " + i + "  j: " + j)
    },
    getPos() {
        let pos = [this.row, this.column]
        return pos
    },

    clickOnButton() {
        console.log("click on the button i: " + this.row + " j: " + this.column)
        if (require('gameLocal').inSwapMode) {
            if (require('gameLocal').pos1 == null || require('gameLocal').pos1 == undefined) {
                require('gameLocal').pos1 = this.getPos()
            } else {
                let pos = this.getPos()
                if (require('gameLocal').pos1.toString() != pos.toString()) {
                    require('gameLocal').pos2 = this.getPos()
                    require('gameLocal').inSwapMode = false
                }
            }
        }
    },

    setImage(url) {
        this.setStaticImg("headImg", this.blockImage);
    },

    setStaticImg(url, node) {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.spriteFrame = spriteFrame;
        });
    },

    setOnlineImg(url, node) {
        cc.loader.load(url, function (err, texture) {
            node.spriteFrame = new cc.SpriteFrame(texture);
        })
    }

    // update (dt) {},
});