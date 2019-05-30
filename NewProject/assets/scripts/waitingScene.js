const WAITING_TIME = 15

cc.Class({
    extends: cc.Component,

    properties: {
        infoLabel: cc.Label,
        confirmButton: cc.Button,
        exitButton: cc.Button,
        difficultyLabel: cc.Label,
        timer: null,
        dots: "",
        count: 0,
        difficulty: 3,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        //this.exitButton.enabled = false;
        this.exitButton.node.active = false;
        this.confirmButton.node.active = true;
        console.log("exitButton: " + this.exitButton.node.active)
        console.log("confirmButton: " + this.confirmButton.node.active)
    },
    setTimer() {
        console.log('set timer')
        self.count++
        let message =  "对战匹配中\n"
        if(self.dots.length < 6) {
            self.dots = self.dots + "."
        }else {
            self.dots = ""
        }
        self.infoLabel.string = message + self.dots

        // TODO: 调用函数判断是否匹配成功
        if(self.count >= WAITING_TIME) {
            self.timeout()
        }
    },
    clickConfirmButton(event, customEventData) {
        console.log("click on the confirm button")
        this.setTimer()
        this.confirmButton.node.active = false
        this.exitButton.node.active = true
    },
    clickExitButton(event, customEventData) {
        console.log("click on the exit button")
        clearInterval(this.timer)
        this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
            cc.director.loadScene("mainScene");
        })));
    },
    timeout() {
        console.log("time out, return")
        clearInterval(this.timer)
    },
    setDifficulty (event, customEventData) {
        // console.log("customEventData: " + customEventData)
        if(customEventData == "any") {
            this.difficultyLabel.string = "随机";
            this.difficulty = 'any'
        }else {
            this.difficultyLabel.string = customEventData + " x " + customEventData;
            this.difficulty = parseInt(customEventData)
        }
        // console.log("set difficulty: " + this.difficulty)
    },

    // update (dt) {},
});
