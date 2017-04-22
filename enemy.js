function enemyGetter(game,tileWidth,guyOffset){
    return function getEnemy(type,pos){
        if(type === 'zombie'){
            var enemyPos = pos;
            var enemySprite = game.add.sprite(tileWidth*enemyPos.x+guyOffset,tileWidth*enemyPos.y+guyOffset, 'zombie');
            enemySprite.anchor.setTo(0.5, 0.5);
            var enemy = {
                sprite: enemySprite,
                pos: enemyPos,
                health: 40,
                reaction: getRandomInt(0,3),
                baseReaction: 3,
                name: 'zombie',
                damage: 10,
                armour: 0
            };
            return enemy;
        }
    }
}
