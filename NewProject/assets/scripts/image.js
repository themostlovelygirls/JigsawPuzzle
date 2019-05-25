import Category from 'categoryEnum'

cc.Class({
    extends: cc.Component,

    properties: {
        category: cc.Label,
        blockPrefab: cc.Prefab,
        imagePageView: cc.PageView,
        imageLayoutPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.runAction(cc.fadeIn(0.5));
    },

    start () {
        this.getImages();
    },

    getImages() {
        this.category.string = Category.properties[require('global').gameCategory].name;
        cc.log(this.category.string);

        this.blocks = [];
        let imglen = 9;
        for(let i = 0; i < imglen; i++) {
            let block = cc.instantiate(this.blockPrefab);
            block.getComponent("block").setImage("url");
            this.blocks.push(block);
        }

        let blockIndex = 0;
        for(let i = 0; i < imglen / 6; i++) {
            let imageLayout = cc.instantiate(this.imageLayoutPrefab);
            let count = 0;
            while(blockIndex<this.blocks.length&&count<=5){
                imageLayout.addChild(this.blocks[blockIndex]);
                count++;
                blockIndex++;
            }
            //imageLayout.updateLayout();
            this.imagePageView.addPage(imageLayout);
            imageLayout.setPosition(-360,-640);
            this.imagePageView.content.setPosition(360*imglen/6,0);
        }

    },

    clickBackBtn (event, customEventData) {

        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("albumScene");
        })));
    }

    // update (dt) {},

});
