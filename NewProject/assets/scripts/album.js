import Category from 'categoryEnum'

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    getImges(event, category) {
        console.log(typeof(category));
        console.log(category);
        switch(category) {
            case "1":
                require('global').gameCategory = Category.ITERATURE;
                break;
            case "2":
                require('global').gameCategory = Category.DRAMA;
                break;
            case "3":
                require('global').gameCategory = Category.ART;
                break;
            case "4":
                require('global').gameCategory = Category.DANCE;
                break;
            case "5":
                require('global').gameCategory = Category.FESTIVAL;
                break;
            case "6":
                require('global').gameCategory = Category.SKILL;
                break;
        }

        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("imageScene");
        })));

    },

    clickBackBtn (event, customEventData) {

        cc.log(customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("mainScene");
        })));
    }


    // update (dt) {},
});``