function itemGetter(game,tileWidth,guyOffset){
    return function getItem(type,pos){
        if(type === 'sword'){
            var itemPos = pos;
            var itemSprite = game.add.sprite(tileWidth*itemPos.x+guyOffset,tileWidth*itemPos.y+guyOffset, 'sword');
            itemSprite.anchor.setTo(0.5, 0.5);
            var item = {
                sprite: itemSprite,
                pos: itemPos,
                name: 'sword',
                damage: 20
            };
            return item;
        }
        if(type === 'dagger'){
            var itemPos = pos;
            var itemSprite = game.add.sprite(tileWidth*itemPos.x+guyOffset,tileWidth*itemPos.y+guyOffset, 'dagger');
            itemSprite.anchor.setTo(0.5, 0.5);
            var item = {
                sprite: itemSprite,
                pos: itemPos,
                name: 'dagger',
                damage: 10
            };
            return item;
        }
    }
}
