// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        userUrl: cc.Node,
        level: cc.Label,
        grade: cc.Label,
        battleLevel: cc.Label,
        battleGrade: cc.Label,
        roundBtn: cc.Button,
        battleBtn: cc.Button,
        albumBtn: cc.Button,
        recordBtn: cc.Button,
        bg: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        this.getBaseInfo();
    },
    
    getBaseInfo () {
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
    }
});