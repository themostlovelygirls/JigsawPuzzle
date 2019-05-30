import Category from 'categoryEnum'

cc.Class({
    extends: cc.Component,

    properties: {
        category: cc.Label,
        imagePrefab: cc.Prefab,
        imagePageView: cc.PageView,
        imageLayoutPrefab: cc.Prefab,
        allImages: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
    },

    start () {
        
        this.getAllImages();
        /* this.getImages(); */
    },

    getAllImages() {

        this.category.string = Category.properties[require('global').gameCategory].name;
        console.log(this.category.string);

        console.log("getAllImages:");
        let self = this;
        wx.cloud.callFunction({
            name: 'getAllImages',
            data: {
                category: Category.properties[require('global').gameCategory].value,
            },
            success: function(res) {
                console.log(res.result);
                self.allImages = res.result;
                console.log(self.allImages);
                console.log("----")
                self.initAllImages(self);
                self.node.runAction(cc.fadeIn(0.5));
                self.getUnlock();
            },
            fail: console.error
        })
    },

    initAllImages (self) {
        console.log("init all images");

        self.images = [];
        let imglen = self.allImages.length;;
        for(let i = 0; i < imglen; i++) {
            let image = cc.instantiate(self.imagePrefab);
            image.getComponent("imagePrefab").setImage(self.allImages[i].url,self.allImages[i].description,self.allImages[i].name);
            this.images.push(image);
        }

        let imageIndex = 0;
        for(let i = 0; i < (imglen-1) / 6; i++) {
            let imageLayout = cc.instantiate(self.imageLayoutPrefab);
            let count = 0;
            while(imageIndex<this.images.length&&count<6){
                imageLayout.addChild(self.images[imageIndex]);
                count++;
                imageIndex++;
            }
            //imageLayout.updateLayout();
            self.imagePageView.addPage(imageLayout);
            imageLayout.setPosition(-360,-640);
            self.imagePageView.content.setPosition(360*Math.floor((imglen-1)/6),0);
        }
    },

    getUnlock() {

        let self = this;
        wx.cloud.callFunction({
            name: 'getUnlockedImages',
            data: {
                id: require('global').userid,
                category: Category.properties[require('global').gameCategory].value,
            },
            success: function(res) {
               let len = res.result.length;
               for(let i = 0; i < len; i++){
                self.images[i].getComponent('imagePrefab').fadeLock();
                self.images[i].getComponent('imagePrefab').setLockBool(false);
            } 
               
            },
            fail: console.error
        })
    },

    getImages() {
        this.category.string = Category.properties[require('global').gameCategory].name;
        console.log(this.category.string);

        this.blocks = [];
        let imglen = 12;
        for(let i = 0; i < imglen; i++) {
            let block = cc.instantiate(this.imagePrefab);
            block.getComponent("imagePrefab").setImage("url");
            this.blocks.push(block);
        }

        let blockIndex = 0;
        console.log(imglen / 6);
        for(let i = 0; i < (imglen-1) / 6; i++) {
            console.log("in loop");
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
            this.imagePageView.content.setPosition(360*Math.floor((imglen-1)/6),0);
        }

    },

    clickBackBtn (event, customEventData) {

        this.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            cc.director.loadScene("albumScene");
        })));
    }

    // update (dt) {},

});
