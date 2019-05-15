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
        difficulty: 3,
        gap: 20,
        blank_x: 0,
        blank_y: 0,
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
            //cc.loader.setAutoRelease(url, true);
            
        });
    },
    
    start () {
        // 加载头像
        this.loadHead();

        // 设置倒计时
        this.setTimer();
        
        // TODO: 初始化map
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
        this.blockSize = (cc.winSize.width - this.gap * (this.difficulty+1)) / this.difficulty;
        let x = this.gap + this.blockSize / 2;
        let y = this.blockSize;
        let map = gameLogic.initMap(this.difficulty);
        for(let i = 0 ; i < this.difficulty ; i++) {
            for(let j = 0 ; j < this.difficulty ; j++) {
                let id = map[i][j];
                let block = cc.instantiate(this.blockPrefab);

                // 加载图片
                // TODO: get url
                let url = "";
                if(id == this.difficulty * this.difficulty) {
                    url = "blank.png";
                    this.blank_x = i;
                    this.blank_y = j;
                }else {
                    url = id + ".png";
                }
                let container = block.getComponent(cc.Sprite);//图片呈现位置
                this.loadImg(container, url);

                block.width = this.blockSize;
                block.height = this.blockSize;
                block.setPosition(cc.v2(x+j*(this.blockSize+this.gap), y+i*(this.blockSize+this.gap)));
            }
        }

        this.addEventHandler();
    },
    // 加载头像
    loadHead () {
        // TODO: 得到图片url
        let url = 'headImg.png';
        //let url = 'http://game.people.com.cn/NMediaFile/2015/1029/MAIN201510290900000533552743089.jpg';
        let container = this.headImg.getComponent(cc.Sprite);//图片呈现位置
        //container.height = this.headImg.height;
        this.loadImg(container, url);
    },
    // 设置倒计时
    setTimer() {
        let minutes = this.difficulty * 2;
        this.timerLabel.string = "倒计时：" + minutes + " : 00";
    },
    // 初始化map
    init() {

    },
    // 添加事件监听
    addEventHandler() {
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
    },

    moveRight() {
        cc.log('moveRight');
    },
    moveLeft() {
        cc.log('moveLeft');
    },
    moveUp() {
        cc.log('moveUp');
    },
    moveDown() {
        cc.log('moveDown');
    },

    

    // update (dt) {},
});
