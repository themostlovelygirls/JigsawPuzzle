var CutTool = {
    //要设置的sprite, 第几列(0~难度-1)，第几行(0~难度-1)，一共几列(难度)，原图
    setImage(sprite, col, row, colNum, texture){
        //this.spriteNode = node;
        let rect = cc.rect(0, 0, texture.width, texture.height);
        let newRectWidth = rect.width / colNum;
        let newRectHeight = rect.height / colNum;
        let newRectX = col * newRectWidth;
        let newRectY = row * newRectHeight;
        let newRect = cc.rect(newRectX, newRectY, newRectWidth, newRectHeight);
        sprite.spriteFrame = new cc.SpriteFrame(texture, newRect);
    }
}

module.exports = CutTool;