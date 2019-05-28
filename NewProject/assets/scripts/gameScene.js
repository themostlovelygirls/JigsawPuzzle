import * as gameLogic from './gameLogic';
import * as globalStorage from './global'
import CutTool from './cutImage'
const MIN_LENGTH = 50;

// game.js 实现gameScene的逻辑
cc.Class({
    extends: cc.Component,

    properties: {
        //goalLabel: cc.Label,
        goalImg: cc.Sprite,
        timerLabel: cc.Label,
       // headImg: cc.Node,
        bg: cc.Node,
        blockPrefab: cc.Prefab,
        toolNode: cc.Node,
        swapImg: cc.Sprite,
        swapLabel: cc.Label,
        difficulty: globalStorage.difficulty,
        toolNum: 0,
        starBalance: 0,
        level: 0,
        grade: 0,
        gap: 30,
        blank_x: 0,
        blank_y: 0,
        preOption: null,
        map: null,
        usedTools: 0,
        inSwapMode: false,
        lastTime: 0,
        timer: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 动态加载图片
    // TODO: 调用微信接口，获得图片
    loadImg: function (container, url) {
        console.log("动态加载图片");
        console.log("url: " + url);
        cc.loader.loadRes(url, function (err, texture) {
            //cc.loader.load(url, function (err, texture) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            var sprite = new cc.SpriteFrame(texture);
            container.spriteFrame = sprite;
            cc.loader.setAutoRelease(url, true);
        });
    },

    start() {
        // TODO: 显示目标图片
        //console.log("显示目标图片")
        //console.log("texture: " + require('global').imageTexture)
        //console.log("texture json: " + JSON.stringify(require('global').imageTexture))
        //console.log("type: " + typeof(require('global').imageTexture))
        this.goalImg.spriteFrame = new cc.SpriteFrame(require('global').imageTexture)
        // let container = this.goalImg.getComponent(cc.Sprite) //图片呈现位置
        // container.spriteFrame = sprite

        this.getUserInfo()

        // TODO: 加载image
        this.loadImage()

        // 加载头像
        //this.loadHead();
        // 设置倒计时
        this.setTimer();
        // 初始化map
        this.init();
        // 添加事件监听
        this.addEventHandler();

        //console.log("toolNum: " + this.toolNum)
        //this.swapLabel.string = ": " + this.toolNum
    },
    // 调用云函数getUserInfo，获得baseinfo  
    getUserInfo() {
        console.log("wx getUserInfo")
        console.log("id: " + globalStorage.userid)
        let self = this
        wx.cloud.callFunction({
            name: 'getUserInfo',
            data: {
                id: globalStorage.userid
            },
            success: function (res) {
                //console.log("res: " + JSON.stringify(res))
                self.toolNum = res.result.tools
                self.starBalance = res.result.star_balance
                self.level = res.result.level
                self.grade = res.result.grade

                self.swapLabel.string = self.toolNum
            },
            fail: console.error
        })
    },
    // TODO: 调用云函数，获得图片
    loadImage() {

    },
    // 加载头像
    // loadHead() {
    //     // TODO: 得到图片url
    //     let url = 'headImg';
    //     let container = this.headImg.getComponent(cc.Sprite); //图片呈现位置
    //     this.loadImg(container, url);
    // },
    // 设置倒计时
    setTimer() {
        let minutes = this.difficulty;
        this.lastTime = minutes * 60
        this.timerLabel.string = this.getFormatTime(this.lastTime);

        let self = this
        this.timer = setInterval(function (self) {
            self.lastTime--
            self.timerLabel.string = self.getFormatTime(self.lastTime);
            if (self.lastTime <= 0) {
                clearInterval(self.timer)
                console.log("time out, you lose")
                // TODO:
            }
        }, 1000, self)
    },
    // 根据秒数返回“倒计时：##：##”的字符串
    getFormatTime(time) {
        let minutes = Math.floor(time / 60)
        let second = time - minutes * 60
        let str = " : "
        if (minutes < 10) {
            str = "0" + minutes + str
        } else {
            str = "0" + minutes + str
        }
        if (second < 10) {
            str = str + "0" + second
        } else {
            str = str + second
        }
        return "倒计时：" + str
    },
    // 初始化map
    init() {
        // 清空所有块
        if (this.blocks) {
            for (let i = 0; i < this.blocks.length; i++) {
                for (let j = 0; j < this.blocks[i].length; j++) {
                    if (this.blocks[i][j] != null) {
                        this.blocks[i][j].destory();
                    }
                }
            }
        }
        this.blocks = [];

        this.map = gameLogic.initMap(this.difficulty);
        console.log(this.map);
        let size = (cc.winSize.width - (this.difficulty + 1) * this.gap) / this.difficulty;
        let x = this.gap;
        let y = size * 2.5 + this.gap * 2;

        for (let i = 0; i < this.difficulty; i++) {
            let line = [];
            for (let j = 0; j < this.difficulty; j++) {
                let block = cc.instantiate(this.blockPrefab);
                block.width = size;
                block.height = size;
                this.bg.addChild(block);
                let posX = x + j * size + j * this.gap;
                let posY = y - (i * size + i * this.gap);
                block.setPosition(cc.v2(posX, posY));

                let url = "";
                let id = this.map[i][j];
                if (id != this.difficulty * this.difficulty) {
                    let row = Math.floor((id-1) / this.difficulty)
                    let col = (id-1) - row * this.difficulty
                    let container = block.getComponent(cc.Sprite); //图片呈现位置
                    CutTool.setImage(container, col, row, this.difficulty, require('global').imageTexture)
                } else {
                    url = "blank";
                    this.blank_x = i;
                    this.blank_y = j;
                    let container = block.getComponent(cc.Sprite); //图片呈现位置
                    this.loadImg(container, url);
                }

                // let container = block.getComponent(cc.Sprite); //图片呈现位置
                // this.loadImg(container, url);
                line.push(block);
            }
            this.blocks.push(line);

            //console.log("map: "+this.map)
        }
    },
    // 添加事件监听
    addEventHandler() {
        this.toolNode.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.useTool();
        });

        this.bg.on(cc.Node.EventType.TOUCH_START, (event) => {

            this.startPoint = event.getLocation();
        });

        this.bg.on(cc.Node.EventType.TOUCH_END, (event) => {
            this.touchEnd(event);
        });

        this.bg.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            this.touchEnd(event);
        })
    },
    touchEnd(event) {
        this.endPoint = event.getLocation();
        let vec = this.endPoint.sub(this.startPoint); //cc.Psub(this.endPoint, this.startPoint);

        if (vec.mag() > MIN_LENGTH) {
            if (Math.abs(vec.x) > Math.abs(vec.y)) { // 水平方向
                if (vec.x > 0) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
            } else { // 竖直方向
                if (vec.y > 0) {
                    this.moveUp();
                } else {
                    this.moveDown();
                }
            }
        }
    },
    moveRight() {
        if (this.blank_y > 0) {
            this.preOption = "right";
            this.swap(this.blank_x, this.blank_y, this.blank_x, this.blank_y - 1);
            this.blank_y = this.blank_y - 1;
        }
    },
    moveLeft() {
        if (this.blank_y < this.difficulty - 1) {
            this.preOption = "left";
            this.swap(this.blank_x, this.blank_y, this.blank_x, this.blank_y + 1);
            this.blank_y = this.blank_y + 1;
        }
    },
    moveUp() {
        if (this.blank_x < this.difficulty - 1) {
            this.preOption = "up";
            this.swap(this.blank_x, this.blank_y, this.blank_x + 1, this.blank_y);
            this.blank_x = this.blank_x + 1;
        }
    },
    moveDown() {
        if (this.blank_x > 0) {
            this.preOption = "down";
            this.swap(this.blank_x, this.blank_y, this.blank_x - 1, this.blank_y);
            this.blank_x = this.blank_x - 1;
        }
    },
    // 判断拼图是否拼好
    isFinished() {
        for (let i = 0; i < this.difficulty; i++) {
            for (let j = 0; j < this.difficulty; j++) {
                if (this.map[i][j] != (i * this.difficulty + j + 1)) {
                    return false;
                }
            }
        }
        return true;
    },
    // 交换两格
    swap(x1, y1, x2, y2) {
        let tmpId = this.map[x1][y1];
        this.map[x1][y1] = this.map[x2][y2];
        this.map[x2][y2] = tmpId;

        let block1 = this.blocks[x1][y1];
        let block2 = this.blocks[x2][y2];

        let x = block1.x,
            y = block1.y;
        block1.x = block2.x;
        block1.y = block2.y;
        block2.x = x;
        block2.y = y;

        this.blocks[x1][y1] = block2;
        this.blocks[x2][y2] = block1;

        if (this.isFinished()) {
            // TODO:
            console.log("is finished")
        }
    },
    // TODO: 使用、购买道具
    useTool() {
        if (this.toolNum > 0) {
            if (this.usedTools < parseInt(this.difficulty * this.difficulty / 2)) {
                console.log("use tool")
                this.toolNum = this.toolNum - 1;
                this.usedTools = this.usedTools + 1;
                this.swapLabel.string = ": " + this.toolNum;

                this.inSwapMode = true
            } else {
                console.log("can't use tool");
            }
        } else {
            // TODO:
            console.log("buy tool");
        }
    },

    // 返回roundScene
    clickReturn(event, customEventData) {
        console.log("in click return")
        this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
            cc.director.loadScene("roundScene");
        })));
    }

    // update (dt) {},
});