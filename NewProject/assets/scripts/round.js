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
        //1 得到所有图片信息
        this.getImages();
        //2 得到个人闯关记录<--difficulty
        this.getRoundRecord();


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

    getRoundRecord () {
        var self = this;
        wx.cloud.callFunction({
            name: 'getRoundRecord',
            data: {
                id: require('global').userid,
                difficulty: self.diff,
                category: require('global').gameCategory.value,
            },
            success: function(res) {
                console.log(res.result);
                self.roundRecord.concat(res.result);
            },
            fail: console.error
        })
    },

    getImages () {
        var self = this;
        wx.cloud.callFunction({
            name: 'getAllImages',
            data: {
                category: require('global').gameCategory.value,
            },
            success: function(res) {
                console.log(res.result);
                self.allImages.concat(res.result);
            },
            fail: console.error
        })
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
