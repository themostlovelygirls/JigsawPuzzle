import * as gameLogic from './gameLogic';
const MIN_LENGTH = 50;

// game.js 实现gameScene的逻辑
cc.Class({
    extends: cc.Component,

    properties: {
        goalLabel: cc.Label,
        timerLabel: cc.Label,
        headImg: cc.Node,
        bg: cc.Node,
        blockPrefab: cc.Prefab,
        toolNode: cc.Node,
        swapImg: cc.Sprite,
        swapLabel: cc.Label,
        difficulty: 3,
        toolNum: 2,
        gap: 50,
        blank_x: 0,
        blank_y: 0,
        preOption: null,
        map: null,
        usedTools: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 动态加载图片
    // TODO: 配置代理，调用微信接口，获得图片
    loadImg: function(container,url){
        cc.log("动态加载图片");
        cc.log("url: "+url);
        cc.loader.loadRes(url, function (err, texture) {
        //cc.loader.load(url, function (err, texture) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            var sprite  = new cc.SpriteFrame(texture);
            container.spriteFrame = sprite;
            cc.loader.setAutoRelease(url, true);
        });
    },
    
    start () {
        // 加载头像
        this.loadHead();
        // 设置倒计时
        this.setTimer();
        // 初始化map
        this.init();
        // 添加事件监听
        this.addEventHandler();

        cc.log("toolNum: "+this.toolNum)
        this.swapLabel.string = ": " + this.toolNum;
    },
    // 加载头像
    loadHead () {
        // TODO: 得到图片url
        let url = 'headImg';
        //let url = 'http://game.people.com.cn/NMediaFile/2015/1029/MAIN201510290900000533552743089.jpg';
        let container = this.headImg.getComponent(cc.Sprite);//图片呈现位置
        this.loadImg(container, url);
    },
    // 设置倒计时
    setTimer() {
        let minutes = this.difficulty * 2;
        this.timerLabel.string = "倒计时：" + minutes + " : 00";
    },
    // 初始化map
    init() {
        // 清空所有块
        if(this.blocks) {
            for(let i = 0 ; i < this.blocks.length ; i++) {
                for(let j = 0 ; j < this.blocks[i].length ; j++) {
                    if(this.blocks[i][j] != null) {
                        this.blocks[i][j].destory();
                    }
                }
            }
        }
        this.blocks = [];

        this.map = gameLogic.initMap(this.difficulty);
        cc.log(this.map);
        let size = (cc.winSize.width - (this.difficulty+1) * this.gap) / this.difficulty;
        let x = this.gap;
        let y = size * 2.5 + this.gap * 2;

        for(let i = 0 ; i < this.difficulty ; i++) {
            let line = [];
            for(let j = 0 ; j < this.difficulty ; j++) {
                let block = cc.instantiate(this.blockPrefab);
                block.width = size;
                block.height = size;
                this.bg.addChild(block);
                let posX = x + j * size + j * this.gap;
                let posY = y - (i * size + i * this.gap);
                block.setPosition(cc.v2(posX, posY));

                // TODO: get url
                let url = "";
                let id = this.map[i][j];
                if(id != this.difficulty * this.difficulty) {
                    url = "" + id;
                }else {
                    url = "blank";
                    this.blank_x = i;
                    this.blank_y = j;
                }

                let container = block.getComponent(cc.Sprite);//图片呈现位置
                this.loadImg(container, url);
                line.push(block);
            }
            this.blocks.push(line);
        }
    },
    // 添加事件监听
    addEventHandler() {
        this.toolNode.on(cc.Node.EventType.TOUCH_START, (event)=>{
            this.useTool();
        });

        this.bg.on(cc.Node.EventType.TOUCH_START, (event)=>{
            this.startPoint = event.getLocation();
        });

        this.bg.on(cc.Node.EventType.TOUCH_END, (event)=>{
           this.touchEnd(event);
        });

        this.bg.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
            this.touchEnd(event);
        })
    },
    touchEnd(event) {
        this.endPoint = event.getLocation();
            let vec = this.endPoint.sub(this.startPoint);//cc.Psub(this.endPoint, this.startPoint);

            if(vec.mag() > MIN_LENGTH) {
                if(Math.abs(vec.x) > Math.abs(vec.y)) {// 水平方向
                    if(vec.x > 0) {
                        this.moveRight();
                    }else {
                        this.moveLeft();
                    }
                }else {// 竖直方向
                    if(vec.y > 0) {
                        this.moveUp();
                    }else {
                        this.moveDown();
                    }
                }
            }

            if(this.blank_x == this.difficulty-1 && this.blank_y == this.difficulty-1 && this.isFinished()) {
                cc.log("has finished");
            }
    },
    moveRight() {
        if(this.blank_y > 0) {
            this.preOption = "right";
            this.swap(this.blank_x, this.blank_y, this.blank_x, this.blank_y-1);
            this.blank_y = this.blank_y - 1;
            if(!this.isFinished()) {
                cc.log(this.map);
            }
        }
    },
    moveLeft() {
        if(this.blank_y < this.difficulty - 1) {
            this.preOption = "left";
            this.swap(this.blank_x, this.blank_y, this.blank_x, this.blank_y+1);
            this.blank_y = this.blank_y + 1;
            if(!this.isFinished()) {
                cc.log(this.map);
            }
        }
    },
    moveUp() {
        if(this.blank_x < this.difficulty - 1) {
            this.preOption = "up";
            this.swap(this.blank_x, this.blank_y, this.blank_x+1, this.blank_y);
            this.blank_x = this.blank_x + 1;
            if(!this.isFinished()) {
                cc.log(this.map);
            }
        }
    },
    moveDown() {
        if(this.blank_x > 0) {
            this.preOption = "down";
            this.swap(this.blank_x, this.blank_y, this.blank_x-1, this.blank_y);
            this.blank_x = this.blank_x - 1;
            if(!this.isFinished()) {
                cc.log(this.map);
            }
        }
    },
    // 判断拼图是否拼好
    isFinished() {
        for(let i = 0 ; i < this.difficulty ; i++) {
            for(let j = 0 ; i < this.difficulty ; j++) {
                if(this.map[i][j] != (i*this.difficulty+j+1)) {
                    return false;
                }
            }
        }
        return true;
    },
    // 交换两格
    swap(x1, y1, x2, y2) {

        //cc.log(this.map);

        //cc.log("swap x1: "+x1+"  y1: "+y1+"  x2: "+x2+"  y2: "+y2);
        //cc.log(this.map[x1][y1] + "  " + this.map[x2][y2]);

        let tmpId = this.map[x1][y1];
        this.map[x1][y1] = this.map[x2][y2];
        this.map[x2][y2] = tmpId;

        let block1 = this.blocks[x1][y1];
        let block2 = this.blocks[x2][y2];

        let x = block1.x, y = block1.y;
        block1.x = block2.x; block1.y = block2.y;
        block2.x = x; block2.y = y;

        this.blocks[x1][y1] = block2;
        this.blocks[x2][y2] = block1;

        //cc.log(this.blocks);
    },
    // TODO: 使用、购买道具
    useTool() {
        if(this.toolNum > 0) {
            if(this.usedTools < parseInt(this.difficulty * this.difficulty / 2)) {
                cc.log("use tool")
                this.toolNum = this.toolNum - 1;
                this.usedTools = this.usedTools + 1;
                this.swapLabel.string = ": "+ this.toolNum;
            }else {
                cc.log("can't use tool");
            }
        }else {
            // TODO:
            cc.log("buy tool");
        }
    },

    // update (dt) {},
});
