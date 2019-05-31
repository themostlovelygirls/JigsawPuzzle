import levelTool from './levelEnum'

cc.Class({
    extends: cc.Component,

    properties: {
        userUrl: cc.Sprite,
        level: cc.Label,
        grade: cc.Label,
        battleLevel: cc.Label,
        battleGrade: cc.Label,
        roundBtn: cc.Button,
        battleBtn: cc.Button,
        albumBtn: cc.Button,
        recordBtn: cc.Button,
        shopBtn: cc.Button,
        helpBtn: cc.Button,
        bg: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        try{
            this.getWeChatBaseInfo();
        }catch(e){
            this.getMockBaseInfo();
            console.log(e);
        }
        
    },
    

    getWeChatBaseInfo () {
        var self = this;
        wx.cloud.callFunction({
            name: 'getUserInfo',
            data: {
                id: require('global').userid,
            },
            success: function(res) {
                console.log(res.result);
                self.setOnlineImg(require('global').avatarUrl, self.userUrl);
                console.log("avatar: "+require('global').avatarUrl);
                self.level.string = '等级: '+ levelTool.getLevel(res.result.level);
                self.grade.string = '积分: '+ res.result.grade;
                self.battleLevel.string = '对战等级: '+ levelTool.getBattleLevel(res.result.battle_level);
                require('global').battleLevel = self.battleLevel.string;
                self.battleGrade.string = '对战积分: '+ res.result.battle_grade;
            },
            fail: console.error
        })
    },

    setOnlineImg (url, node) {
        cc.loader.load(url , function (err, texture) {
            node.spriteFrame = new cc.SpriteFrame(texture);
        })
    },

    getMockBaseInfo () {
        /**
         * mock
         */
        this.level.string = '等级: '+'平民';
        this.grade.string = '积分: '+'0.0';
        this.battleLevel.string = '对战等级: '+'丙等';
        this.battleGrade.string = '对战积分: '+'0.0';
    },
    // update (dt) {},
    clickRoundBtn (event, customEventData) {
        //cc.log("click!" + customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("categoryScene");
        })));
    },

    clickAlbumBtn (event, customEventData) {
        //cc.log("click!" + customEventData);
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("albumScene");
        })));
    },

    clickShopBtn (event, customEventData) {
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("shopScene");
        })));
    },

    clickHelpBtn (event, customEventData) {
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("helpScene");
        })));
    },

    clickRecordBtn (event, customEventData) {
        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("recordScene");
        })));
    }

});
