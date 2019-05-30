import * as gameLogic from './gameLogic';
import * as Alert from './Alert';
import Category from './categoryEnum'
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
        difficulty: 3,
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
        //inSwapMode: false,
        lastTime: 0,
        timer: null
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
        require('gameLocal').swap1_x = null
        require('gameLocal').swap1_y = null
        require('gameLocal').swap2_x = null
        require('gameLocal').swap2_y = null
        require('gameLocal').inSwapMode = false
        this.difficulty = require('global').difficulty

        // 显示目标图片
        this.goalImg.spriteFrame = new cc.SpriteFrame(require('global').imageTexture)

        this.getUserInfo()

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
        // console.log("wx getUserInfo")
        // console.log("id: " + require('global').userid)
        let self = this
        wx.cloud.callFunction({
            name: 'getUserInfo',
            data: {
                id: require('global').userid
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
                clearInterval(self.timer)
                // console.log("time out, you lose")

                let callback = function () {
                    self.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                        cc.director.loadScene("roundScene");
                    })));
                }

                Alert.show("就差一点点  QAQ", callback, false)
            }
        }, 1000)
    },
    // 根据秒数返回“倒计时：##：##”的字符串
    getFormatTime(time) {
        if(time < 0) {
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
    // // 背景变暗
    // bgFade() {
    //     //console.log("in bgFade func")
    //     //console.log("before this.bg.opacity: " + this.bg.opacity)
    //     //this.bg.opacity = 100
    //     let self = this
    //     setInterval(function() {
    //         if(self.bg.opacity > 100) {
    //             self.bg.opacity = self.bg.opacity - 20
    //         }
    //     }, 100)
    //     //console.log("after this.bg.opacity: " + this.bg.opacity)

    //     // let fout = cc.fadeOut(0.1);
    //     // this.mask.runAction(fout)

    //     // var s = cc.scaleTo(0.1, 0).easing(cc.easeBackIn());//添加缓动对象使动作变得好看
    //     // var callback = cc.callFunc(function(){
    //     //     this.node.active = false;
    //     // }.bind(this));
    //     // var seq = cc.sequence([s,callback]);
    //     // this.bg.runAction(seq);
    // },
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
                    CutTool.setImage(container, col, row, this.difficulty, require('global').imageTexture)
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
        this.toolNode.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (!require('gameLocal').inSwapMode) {
                this.useTool();
            }
        });

        this.bg.on(cc.Node.EventType.TOUCH_START, (event) => {
            // if(!require('gameLocal').inSwapMode && (require('gameLocal').pos1 != null || require('gameLocal').pos2 != null)) {
            //     // 交换
            //     console.log("交换")
            //     let x1 = require('gameLocal').pos1[0]
            //     let y1 = require('gameLocal').pos1[1]
            //     let x2 = require('gameLocal').pos2[0]
            //     let y2 = require('gameLocal').pos2[1]

            //     this.blocks[x1-1][y1-1].getComponent('block').setPos(x2, y2)
            //     this.blocks[x2-1][y2-1].getComponent('block').setPos(x1, y1)

            //     this.swap(x1, y1, x2, y2)

            //     require('gameLocal').pos1 = null
            //     require('gameLocal').pos2 = null

            //     for(let i = 0 ; i < this.blocks.length ; i++) {
            //         for(let j = 0 ; j < this.blocks[0].length ; j++) {
            //             this.blocks[i][j].getChildByName('blockButton').active = false
            //         }
            //     }
            //     this.startPoint = event.getLocation();
            //     console.log("startPoint: " + this.startPoint)
            // }

            if (!require('gameLocal').inSwapMode) {
                this.startPoint = event.getLocation();
               // console.log("startPoint: " + this.startPoint)
            }
        });

        this.bg.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (!require('gameLocal').inSwapMode) {
                this.touchEnd(event);
                // console.log("startPoint: " + this.startPoint)
            }
        });

        this.bg.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            if (!require('gameLocal').inSwapMode) {
                this.touchEnd(event);
                // console.log("startPoint: " + this.startPoint)
            }
        })
    },
    touchEnd(event) {
        this.endPoint = event.getLocation();

       // console.log("endPoint: " + this.endPoint)
        let vec = this.endPoint.sub(this.startPoint); //cc.Psub(this.endPoint, this.startPoint);\

        if (!require('gameLocal').inSwapMode && vec.mag() > MIN_LENGTH) {
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

        let self = this

        if (this.isFinished()) {
            clearInterval(self.timer)
            let callback = function () {
                self.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                    cc.director.loadScene("roundScene");
                })));
            }

            Alert.show("闯关成功  ヾ(✿ﾟ▽ﾟ)ノ", callback, false)

            // 计算完成度、星星、积分、等级
            let costPercent = 1 - this.lastTime / (this.difficulty * 2 * 60)
            let completion = 1
            if (costPercent <= 0.3) {
                completion = 3
            } else if (costPercent <= 0.6) {
                completion = 2
            } else {
                completion = 1
            }
            this.starBalance = this.starBalance + completion
            this.grade = this.grade + 2 * completion
            this.level = Math.floor(this.grade / 10)
            let categoryId = Category.properties[require('global').gameCategory].value

            console.log("计算完成度、星星、积分、等级")
            console.log("completion: " + completion + "  star: " + this.starBalance + "  grade: " + this.grade + "  level: " + this.level)

            // 调用云函数addSingleBattleRecord
            wx.cloud.callFunction({
                name: 'addSingleBattleRecord',
                data: {
                    id: require('global').userid,
                    grade: self.grade,
                    level: self.level,
                    star: self.starBalance,
                    category: categoryId,
                    index: require('global').index,
                    difficulty: require('global').difficulty,
                    completion: completion
                },
                success: function (res) {
                    // console.log("result: " + JSON.stringify(res.result))
                },
                fail: console.error
            })
        }
    },
    // TODO: 使用、购买道具
    useTool() {
        let self = this
        if (this.usedTools >= parseInt(this.difficulty * this.difficulty / 2)) {
            // console.log("can't use tool");
            let message = "使用道具数量已达上限"
            Alert.show(message, null, false)
        } else if (this.toolNum > 0) {
            //if (this.usedTools < parseInt(this.difficulty * this.difficulty / 2)) {
            let message = "使用道具增加15秒\n现在有" + this.toolNum + "个道具"
            let callback = function () {
                self.toolNum = self.toolNum - 1;
                self.usedTools = self.usedTools + 1;
                self.swapLabel.string = ": " + self.toolNum;
                self.lastTime = self.lastTime + 15

                // 调用云函数updateStarAndTool
                wx.cloud.callFunction({
                    name: 'updateStarAndTool',
                    data: {
                        id: require('global').userid,
                        starBalance: self.starBalance,
                        toolNum: self.toolNum
                    },
                    success: function (res) {
                        // console.log("result: " + JSON.stringify(res.result))
                    },
                    fail: console.error
                })
            }
            Alert.show(message, callback, true)



            // require('gameLocal').inSwapMode = true
            // for(let i = 0 ; i < this.blocks.length ; i++) {
            //     for(let j = 0 ; j < this.blocks[0].length ; j++) {
            //         // console.log("blocks[i][j].getChildByName('blockButton'): " + blocks[i][j].getChildByName('blockButton'))
            //         this.blocks[i][j].getChildByName('blockButton').active = true
            //     }
            // }
        } else if (this.starBalance > 0) {
            // buy tool
            let message = "使用1个星星购买道具\n现在有" + this.starBalance + "个星星"
            let callback = function () {
                //self.toolNum = self.toolNum + 1;
                //self.swapLabel.string = ": " + self.toolNum;
                self.starBalance = self.starBalance - 1
                self.lastTime = self.lastTime + 15
                self.usedTools = self.usedTools + 1;

                // 调用云函数updateStarAndTool
                wx.cloud.callFunction({
                    name: 'updateStarAndTool',
                    data: {
                        id: require('global').userid,
                        starBalance: self.starBalance,
                        toolNum: self.toolNum
                    },
                    success: function (res) {
                        // console.log("result: " + JSON.stringify(res.result))
                    },
                    fail: console.error
                })
            }
            Alert.show(message, callback, true)


        } else {
            // console.log("can't buy tool");
            let message = "星星不足，无法购买道具"
            Alert.show(message, null, false)
        }
    },

    // 返回roundScene
    clickReturn(event, customEventData) {
        // console.log("in click return")
        let self = this
        this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
            clearInterval(self.timer)
            cc.director.loadScene("roundScene");
        })));
    }

    // update (dt) {},
});