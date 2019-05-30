// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Category from 'categoryEnum'
cc.Class({
    extends: cc.Component,

    properties: {
        literatureBtn: cc.Button,
        dramaBtn: cc.Button,
        artBtn: cc.Button,
        danceBtn: cc.Button,
        festivalBtn: cc.Button,
        skillBtn: cc.Button,
        backBtn: cc.Button,
        categories: [],
        literatureLock: cc.Sprite,
        dramaLock: cc.Sprite,
        artLock: cc.Sprite,
        skillLock: cc.Sprite,
        danceLock: cc.Sprite,
        festivalLock: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
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

    getMockCategory(){
        this.categories.push(1);
        this.categories.push(2);
        this.lockCategory();
    },

    lockCategory () {
        for(let i = 1; i <= 6; i++){
            if(this.categories.indexOf(i)>=0){
                switch(i){
                    case Category.ITERATURE:
                        this.fadeNode(this.literatureLock.node);
                        break;
                    case Category.DRAMA:
                        this.fadeNode(this.dramaLock.node);
                        break;
                    case Category.ART:
                        this.fadeNode(this.artLock.node);
                        break;
                    case Category.DANCE:
                        this.fadeNode(this.danceLock.node);
                        break;
                    case Category.FESTIVAL:
                        this.fadeNode(this.festivalLock.node);
                        break;
                    case Category.SKILL:
                        this.fadeNode(this.skillLock.node);
                        break;
                }
            }
        }
    },

    clickLiteratureButton () {
        if(this.categories.includes(Category.ITERATURE)){
            require('global').gameCategory = Category.ITERATURE;
            this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("roundScene");
            })));
        }
    },
    
    clickDramaBtn () {
        if(this.categories.includes(Category.DRAMA)){
            require('global').gameCategory = Category.DRAMA;
            this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("roundScene");
            })));
        }
        
    },

    clickArtBtn () {
        if(this.categories.includes(Category.ART)){
            require('global').gameCategory = Category.ART;
            this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("roundScene");
            })));
        }
    },

    clickDanceBtn () {
        if(this.categories.includes(Category.DANCE)){
            require('global').gameCategory = Category.DANCE;
            this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("roundScene");
            })));
        }
    },
    
    clickFestivalBtn () {
        if(this.categories.includes(Category.FESTIVAL)){
            require('global').gameCategory = Category.FESTIVAL;
            this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("roundScene");
            })));
        }
        
    },
    
    clickSkillBtn () {
        if(this.categories.includes(Category.SKILL)){
            require('global').gameCategory = Category.SKILL;
            this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("roundScene");
            })));
        }
    },

    clickBackBtn (event, customEventData) {
        cc.log(customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("mainScene");
        })));
    },


    /* setStaticImg (url, node) {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.spriteFrame = spriteFrame;
        });
    }, */

    /*  update (dt) {

     }, */
    fadeNode (node){
        for(let j = 255; j >=0; j-=0.01){
            (function(e){
                setTimeout(function(){
                    node.opacity = e;
                }, 1000);
            })(j);
        }
    }
});
