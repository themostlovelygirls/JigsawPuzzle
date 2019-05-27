var CutTool = {
    //要设置的sprite, 第几行，第几列，一共几列(难度)，原图
    setImage(sprite, col, row, colNum, texture){
        this.spriteNode = node;
        let rect = cc.rect(0, 0, texture.width, texture.height);
        let newRectWidth = rect.width / colNum;
        let newRectHeight = rect.height / colNum;
        let newRectX = col * newRectWidth;
        let newRectY = (colNum - row - 1) * newRectHeight;
        let newRect = cc.rect(newRectX, newRectY, newRectWidth, newRectHeight);
        sprite.spriteFrame = new cc.SpriteFrame(this.texture, newRect);
    }
}

module.exports = CutTool;