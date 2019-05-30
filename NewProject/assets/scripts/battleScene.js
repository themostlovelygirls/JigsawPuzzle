import * as gameLogic from './gameLogic';
import * as Alert from './Alert';
//import Category from './categoryEnum'
import CutTool from './cutImage'
const MIN_LENGTH = 50;
const TIMEOUT = 20 * 60

cc.Class({
    extends: cc.Component,

    properties: {
        goalImg: cc.Sprite,
        timerLabel: cc.Label,
        bg: cc.Node,
        blockPrefab: cc.Prefab,
        avaterImg: cc.Sprite,
        rivalImg: cc.Sprite,
        difficulty: 3,
        gap: 30,
        blank_x: 0,
        blank_y: 0,
        preOption: null,
        map: null,
        lastTime: 0,
        timer: null,
        room: "",
        imageTexture: cc.Texture2D
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.runAction(cc.fadeIn(0.5));
    },
    // 动态加载图片
    loadImg: function (container, url) {
        // console.log("动态加载图片");
        // console.log("url: " + url);
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
        // TODO: 
        wx.cloud.init()
        this.difficulty = require('battleLocal').difficulty
        this.room = require('battleLocal').room        

        // TODO: 获得目标图片
        console.log("获得目标图片")
        console.log("url: " + require('battleLocal').imageUrl)
        let self = this
        let url = require('battleLocal').imageUrl
        console.log("url: " + url)
        let node = this.goalImg
        cc.loader.load(url, function (err, texture) {
            node.spriteFrame = new cc.SpriteFrame(texture);
            self.imageTexture = texture;
            console.log("imageTexture: " + self.imageTexture)
            self.init()
        })

        // TODO: 加载头像
        this.setImage(require('battleLocal').avaterUrl, this.avaterImg)
        this.setImage(require('battleLocal').rivalUrl, this.rivalImg)

        // 设置倒计时
        this.setTimer();
        // 初始化map
        //this.init();
        // 添加事件监听
        this.addEventHandler();

        //console.log("toolNum: " + this.toolNum)
        //this.swapLabel.string = ": " + this.toolNum
    },
    // TODO: 显示头像
    setImage (url, node) {
        // let self = this;
        cc.loader.load(url , function (err, texture) {
            node.spriteFrame = new cc.SpriteFrame(texture);
            // self.imageTexture = texture;
        })
    },
    // 加载头像
    // loadHead() {
    //     // 得到图片url
    //     let url = 'headImg';
    //     let container = this.headImg.getComponent(cc.Sprite); //图片呈现位置
    //     this.loadImg(container, url);
    // },
    // 设置倒计时
    setTimer() {
        let minutes = this.difficulty * 2
        this.lastTime = minutes * 60
        this.timerLabel.string = this.getFormatTime(this.lastTime);

        let self = this
        this.timer = setInterval(function () {
            self.lastTime--
            self.timerLabel.string = self.getFormatTime(self.lastTime);
            if (self.lastTime <= 0) {
                //clearInterval(self.timer)
                console.log("time out, you lose")

                // TODO: 调用云函数addBattleRecord  time=TIMEOUT
                self.notComplete()
                let message = "就差一点点  QAQ"
                let callback = function () {
                    self.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                        cc.director.loadScene("mainScene");
                    })));
                }
                Alert.show(message, callback, false)
            }
        }, 1000)
    },
    // 根据秒数返回“倒计时：##：##”的字符串
    getFormatTime(time) {
        if (time < 0) {
            time = 0
        }
        let minutes = Math.floor(time / 60)
        let second = time - minutes * 60
        let str = " : "
        if (minutes < 10) {
            str = "0" + minutes + str
        } else {
            str = minutes + str
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
        // console.log("difficulty: " + this.difficulty)

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
        // console.log("map: " + this.map);
        let size = (cc.winSize.width - (this.difficulty + 1) * this.gap) / this.difficulty;
        let x = this.gap;
        let y = size * (0.5 + this.difficulty - 1) + this.gap * (this.difficulty - 1);

        for (let i = 0; i < this.difficulty; i++) {
            let line = [];
            for (let j = 0; j < this.difficulty; j++) {
                let block = cc.instantiate(this.blockPrefab);
                // console.log("i: " + i + " j: " + j)
                // console.log("row: " + (this.difficulty - j) + " column: " + (this.difficulty - i))
                block.getComponent('block').setPos(this.difficulty - j, this.difficulty - i)
                block.width = size;
                block.height = size;
                block.getChildByName('blockButton').active = false
                this.bg.addChild(block);
                let posX = x + j * size + j * this.gap;
                let posY = y - (i * size + i * this.gap);

                block.setPosition(cc.v2(posX, posY));

                let url = "";
                let id = this.map[i][j];
                if (id != this.difficulty * this.difficulty) {
                    let row = Math.floor((id - 1) / this.difficulty)
                    let col = (id - 1) - row * this.difficulty
                    let container = block.getComponent(cc.Sprite); //图片呈现位置
                    // TODO: 显示模块图片
                    CutTool.setImage(container, col, row, this.difficulty, this.imageTexture)
                } else {
                    url = "blank";
                    this.blank_x = i;
                    this.blank_y = j;
                    let container = block.getComponent(cc.Sprite); //图片呈现位置
                    this.loadImg(container, url);
                }
                line.push(block);
            }
            this.blocks.push(line);
        }
    },
    // 添加事件监听
    addEventHandler() {
        this.bg.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.startPoint = event.getLocation();
            // console.log("startPoint: " + this.startPoint)
        });

        this.bg.on(cc.Node.EventType.TOUCH_END, (event) => {
            this.touchEnd(event);
            // console.log("startPoint: " + this.startPoint)
        });

        this.bg.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            this.touchEnd(event);
            // console.log("startPoint: " + this.startPoint)
        })
    },
    touchEnd(event) {
        this.endPoint = event.getLocation();

        // console.log("endPoint: " + this.endPoint)
        let vec = this.endPoint.sub(this.startPoint); //cc.Psub(this.endPoint, this.startPoint);\

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
        //console.log("swap: x1:" + x1 + " y1:" + y1 + " x2:" + x2 + " y2:" + y2)

        let tmpId = this.map[x1][y1];
        this.map[x1][y1] = this.map[x2][y2];
        this.map[x2][y2] = tmpId;

        let block1 = this.blocks[x1][y1];
        let block2 = this.blocks[x2][y2];

        let x = block1.x;
        let y = block1.y;
        block1.x = block2.x;
        block1.y = block2.y;
        block2.x = x;
        block2.y = y;

        this.blocks[x1][y1] = block2;
        this.blocks[x2][y2] = block1;

        if (this.isFinished()) {
            clearInterval(this.timer)

            // TODO: 调用云函数addBattleRecord
            let result = true
            let self = this
            let costTime = this.difficulty * 2 - this.lastTime
            wx.cloud.callFunction({
                name: 'addBattleResult',
                data: {
                    id: require('global').userid,
                    room: self.room,
                    time: costTime
                },
                success: function (res) {
                    console.log("result: " + JSON.stringify(res.result))
                    result = res.result
                },
                fail: console.error
            })
            let message = "恭喜你，成功击败" + require('battleLocal').rivalName + "  ヾ(✿ﾟ▽ﾟ)ノ"
            if (!result) {
                message = "就差一点点  QAQ"
            }
            let callback = function () {
                self.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                    cc.director.loadScene("mainScene");
                })));
            }
            Alert.show(message, callback, false)
        }
    },
    // 返回roundScene
    clickReturn(event, customEventData) {
        console.log("click return")
        let self = this
        let message = "退出对战？（退出对战将判定为失败）"
        let callback = function () {
            self.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                // TODO: 调用云函数addBattleRecord  time=TIMEOUT
                self.notComplete()
                clearInterval(self.timer)
                cc.director.loadScene("mainScene");
            })));
        }
        Alert.show(message, callback, true)
    },
    // 未完成拼图,调用云函数addBattleRecord  time=TIMEOUT
    notComplete() {
        console.log("未完成拼图")
        let self = this
        //let costTime = this.difficulty * 2 - this.lastTime
        wx.cloud.callFunction({
            name: 'addBattleResult',
            data: {
                id: require('global').userid,
                room: self.room,
                time: TIMEOUT
            },
            success: function (res) {
                console.log("result: " + JSON.stringify(res.result))

            },
            fail: console.error
        })
    }

    // update (dt) {},
});