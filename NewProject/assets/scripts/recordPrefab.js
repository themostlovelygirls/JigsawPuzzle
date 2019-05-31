
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
        if(name.length > 4) {
            name = name.substr(0, 4) + "...";
        }
        let name2 = info.rival;
        if(name2.length > 4) {
            name2 = name2.substr(0, 4) + "...";
        }

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
