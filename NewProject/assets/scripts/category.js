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
        backBtn: cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {

    },

    clickLiteratureButton () {
        require('global').gameCategory = Category.ITERATURE;
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("roundScene");
        })));
    },
    
    clickDramaBtn () {
        require('global').gameCategory = Category.DRAMA;
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("roundScene");
        })));
    },

    clickArtBtn () {
        require('global').gameCategory = Category.ART;
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("roundScene");
        })));
    },

    clickDanceBtn () {
        require('global').gameCategory = Category.DANCE;
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("roundScene");
        })));
    },
    
    clickFestivalBtn () {
        require('global').gameCategory = Category.FESTIVAL;
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("roundScene");
        })));
    },
    
    clickSkillBtn () {
        require('global').gameCategory = Category.SKILL;
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("roundScene");
        })));
    },

    clickBackBtn (event, customEventData) {
        cc.log(customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("mainScene");
        })));
    }


    // update (dt) {},
});
