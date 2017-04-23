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
                armour: 0,
            };
            enemy.updateFxn = function(map,playerPos){
                var xDif = playerPos.x - enemy.pos.x;
                var yDif = playerPos.y - enemy.pos.y;

                if(Math.abs(xDif)>Math.abs(yDif)){
                    if(xDif<0){
                        var newSpot = getInDir(enemy.pos,0);
                        if(getMapTileFromMap(map,newSpot).navigable){
                            enemy.pos = newSpot;
                        }
                    } else{
                        var newSpot = getInDir(enemy.pos,2);
                        if(getMapTileFromMap(map,newSpot).navigable){
                            enemy.pos = newSpot;
                        }
                    }
                } else {
                    if(yDif<0){
                        var newSpot = getInDir(enemy.pos,1);
                        if(getMapTileFromMap(map,newSpot).navigable){
                            enemy.pos = newSpot;
                        }
                    } else{
                        var newSpot = getInDir(enemy.pos,3);
                        if(getMapTileFromMap(map,newSpot).navigable){
                            enemy.pos = newSpot;
                        }
                    }
                }
            }
            return enemy;
        }
        if(type === 'zombie2'){
            var enemyPos = pos;
            var enemySprite = game.add.sprite(tileWidth*enemyPos.x+guyOffset,tileWidth*enemyPos.y+guyOffset, 'zombie2');
            enemySprite.anchor.setTo(0.5, 0.5);
            var enemy = {
                sprite: enemySprite,
                pos: enemyPos,
                health: 50,
                reaction: getRandomInt(0,3),
                baseReaction: 3,
                name: 'zombie',
                damage: 10,
                armour: 0,
            };
            enemy.updateFxn = function(map,playerPos){
                var xDif = playerPos.x - enemy.pos.x;
                var yDif = playerPos.y - enemy.pos.y;

                if(Math.abs(xDif)<Math.abs(yDif)){
                    if(yDif<0){
                        var newSpot = getInDir(enemy.pos,1);
                        if(getMapTileFromMap(map,newSpot).navigable){
                            enemy.pos = newSpot;
                        }
                    } else{
                        var newSpot = getInDir(enemy.pos,3);
                        if(getMapTileFromMap(map,newSpot).navigable){
                            enemy.pos = newSpot;
                        }
                    }
                } else {
                    if(xDif<0){
                        var newSpot = getInDir(enemy.pos,0);
                        if(getMapTileFromMap(map,newSpot).navigable){
                            enemy.pos = newSpot;
                        }
                    } else{
                        var newSpot = getInDir(enemy.pos,2);
                        if(getMapTileFromMap(map,newSpot).navigable){
                            enemy.pos = newSpot;
                        }
                    }
                }
            }
            return enemy;
        }
        if(type === 'skellyton'){
            var enemyPos = pos;
            var enemySprite = game.add.sprite(tileWidth*enemyPos.x+guyOffset,tileWidth*enemyPos.y+guyOffset, 'skellyton');
            enemySprite.anchor.setTo(0.5, 0.5);
            var enemy = {
                sprite: enemySprite,
                pos: enemyPos,
                health: 100,
                reaction: getRandomInt(0,2),
                baseReaction: 2,
                name: 'skellyton',
                damage: 20,
                armour: 0,
                nextDir: getRandomInt(0,3),
                doubleMove: false
            };

        }
    }
}
