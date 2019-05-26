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
        roundPrefab: cc.Prefab,
        roundLayoutPrefab: cc.Prefab,
        roundPageView: cc.PageView,
        roundIndicator: cc.PageViewIndicator,
        toggle: cc.ToggleContainer,
        difficulty: cc.Label,
        diff: 3,
        category: cc.Label,
        allImages: [],
        roundRecord: []
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        try{
            this.getRoundRecord();
        }catch(ex){
            console.log(ex);
        }
    },

    getRoundRecord(){
        this.category.string = Category.properties[require('global').gameCategory].name;
        
        
    },
/* 
    makeLayoutMock() {
        this.rounds = [];
        var imglen = 9;
        for(let i = 0; i < imglen; i++){
            let round = cc.instantiate(this.roundPrefab);
            round.getComponent('roundImgAndStar').setStars(3-i%4);
            round.getComponent('roundImgAndStar').setImage("url");
            this.rounds.push(round);
        }

        let roundIndex = 0;
        for(let i = 0; i <= imglen/4; i++){
            let roundLayout = cc.instantiate(this.roundLayoutPrefab);
            let count = 0;
            while(roundIndex<this.rounds.length&&count<4){
                roundLayout.addChild(this.rounds[roundIndex]);
                count++;
                roundIndex++;
            }
            //roundLayout.updateLayout();
            this.roundPageView.addPage(roundLayout);
            roundLayout.setPosition(-360,-640);
        }
        this.roundPageView.content.setPosition(360*imglen/4,0);
    },
 */
    getRecord () {
        console.log("getRoundRecord:");
        var self = this;
        wx.cloud.callFunction({
            name: 'getRoundRecord',
            data: {
                id: require('global').userid,
                difficulty: self.diff,
                category: Category.properties[require('global').gameCategory].value,
            },
            success: function(res) {
                console.log(res.result);
                self.roundRecord.concat(res.result);
                self.initRecord();
            },
            fail: console.error
        })
    },

    initRecord () {
        for(let i = 0; i < this.roundRecord.)
        for(let i = 0; i < this.rounds.length; i++){
            let round = rounds[i];
            let index = round.getComponent('roundImgAndStar').getIndex();

        }
    },

    getAllImages () {
        console.log("getAllImages:");
        var self = this;
        wx.cloud.callFunction({
            name: 'getAllImages',
            data: {
                category: Category.properties[require('global').gameCategory].value,
            },
            success: function(res) {
                console.log(res.result);
                self.allImages.concat(res.result);
                self.initAllImages();
                self.getRecord();
            },
            fail: console.error
        })
    },

    initAllImages () {
        this.rounds = [];
        var imglen = this.allImages.length;
        for(let i = 0; i < imglen; i++){
            let round = cc.instantiate(this.roundPrefab);
            //round.getComponent('roundImgAndStar').setStars(0);
            round.getComponent('roundImgAndStar').setImage(this.allImages[i].url);
            round.getComponent('roundImgAndStar').setIndex(this.allImages[i].index);
            this.rounds.push(round);
        }
        let roundIndex = 0;
        for(let i = 0; i <= imglen/4; i++){
            let roundLayout = cc.instantiate(this.roundLayoutPrefab);
            let count = 0;
            while(roundIndex<this.rounds.length&&count<4){
                roundLayout.addChild(this.rounds[roundIndex]);
                count++;
                roundIndex++;
            }
            //roundLayout.updateLayout();
            this.roundPageView.addPage(roundLayout);
            roundLayout.setPosition(-360,-640);
        }
        this.roundPageView.content.setPosition(360*imglen/4,0);
    },
    
    setDifficulty (event, customEventData) {
        this.difficulty.string = "难度: "+ customEventData + " X " + customEventData;
        this.diff = parseInt(customEventData);
    },

    clickBackBtn (event, customEventData) {
        cc.log(customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("categoryScene");
        })));
    }


    // update (dt) {},
});
