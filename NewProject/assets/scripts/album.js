import Category from 'categoryEnum'

cc.Class({
    extends: cc.Component,

    properties: {
        categories: [],
        literatureLock: cc.Sprite,
        dramaLock: cc.Sprite,
        artLock: cc.Sprite,
        skillLock: cc.Sprite,
        danceLock: cc.Sprite,
        festivalLock: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        try{
            this.getWeChatCategory();
            console.log("wx")
        }catch(ex){
            this.getMockCategory();
            console.log("mock");
        };
    },

    getWeChatCategory(){
        var self = this;
        wx.cloud.callFunction({
            name: 'getUnlockedCategory',
            data: {
                id: require('global').userid,
            },
            success: function(res) {
                for(var i = 0; i < res.result.length; i++){
                    self.categories.push(parseInt(res.result[i]));
                }
                self.lockCategory();
            },
            fail: console.error
        })
    },

    getMockCategory() {
        this.categories.push(1);
        this.categories.push(2);
        this.categories.push(3);
        this.lockCategory();
    },

    lockCategory() {
        let cateLen = this.categories.length;
        for(let i = cateLen+1; i <= 6; i++) {
            switch(i){
                case Category.ITERATURE:
                    this.setLock(this.literatureLock.node);
                    break;
                case Category.DRAMA:
                    this.setLock(this.dramaLock.node);
                    break;
                case Category.ART:
                    this.setLock(this.artLock.node);
                    break;
                case Category.DANCE:
                    this.setLock(this.danceLock.node);
                    break;
                case Category.FESTIVAL:
                    this.setLock(this.festivalLock.node);
                    break;
                case Category.SKILL:
                    this.setLock(this.skillLock.node);
                    break;
            }
        }
    },

    getImges(event, category) {
        console.log(typeof(category));
        console.log(category);

        if(this.categories.indexOf(parseInt(category)) >= 0) {
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
        }

    },

    clickBackBtn (event, customEventData) {

        cc.log(customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("mainScene");
        })));
    },

    setLock(node) {
        node.opacity = 200;
    }


    // update (dt) {},
});``