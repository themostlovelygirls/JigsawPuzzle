
cc.Class({
    extends: cc.Component,

    properties: {
        rname: cc.Label,
        date: cc.Label,
        winImg: cc.Sprite,
        failImg: cc.Sprite, 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setInfo(info) {
        console.log("this");
        console.log(this);
        this.date.string = info.time;

        let name = require('global').username;
        let name2 = info.rival;

        this.rname.string = name + " VS " + name2;
        
        if(info.result) {
            this.winImg.node.active = true;
            this.failImg.node.active = false;
        }else {
            this.failImg.node.active = true;
            this.winImg.node.active = false;
        }
    },

    // update (dt) {},
});
