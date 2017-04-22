window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    var map = [];
    var guy = {};
    var guyPos = {};
    var player = {
        health: 100,
        maxHealth: 100,
        weapon: {
            name: 'dagger',
            damage: 10
        }
    };
    var keydownTracker = {};
    var tilemap = {};
    var layer = {};
    var enemies = [];
    var items = [];

    var actionMade = false;

    var mapWidth = 128;
    var mapHeight = 128;

    var mapBuffer = 40;
    var tileWidth = 40;
    var guyOffset = 20;

    var getEnemy = enemyGetter(game,tileWidth,guyOffset);
    var getItem = itemGetter(game,tileWidth,guyOffset);

    function preload () {
        game.load.image('guy', 'guy.png');
        game.load.image('tiles', 'tiles.png');
        game.load.image('zombie', 'zombie.png');
        game.load.image('ded', 'ded.png');
        game.load.image('dagger', 'dagger.png');
        game.load.image('sword', 'sword.png');
    }

    function create () {
        map = initMap(mapWidth+mapBuffer,mapHeight+mapBuffer);
        genMap(map,mapBuffer/2,mapBuffer/2,mapWidth,mapHeight);
        fixRooms(map,mapWidth,mapHeight);

        mapWidth += mapBuffer;
        mapHeight += mapBuffer;
        game.cache.addTilemap('dynamicMap', null, mapToCsv(map,mapWidth,mapHeight), Phaser.Tilemap.CSV);
        tilemap = game.add.tilemap('dynamicMap', tileWidth, tileWidth);

        tilemap.addTilesetImage('tiles', 'tiles', tileWidth, tileWidth);

        layer = tilemap.createLayer(0);

        layer.resizeWorld();

        var openSpaces = determineRoomSquares(map,mapWidth,mapHeight);
        guyPos = openSpaces[getRandomInt(0,openSpaces.length-1)];

        getMapTile(guyPos).opened = true;
        getMapTile(guyPos).navigable = false;

        var playArea = determineConnectedSquares(map,guyPos);
        console.log(playArea.length);

        guy = game.add.sprite(tileWidth*guyPos.x+guyOffset,tileWidth*guyPos.y+guyOffset, 'guy');
        guy.anchor.setTo(0.5, 0.5);

        game.camera.follow(guy);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();

        keydownTracker.left = false;
        keydownTracker.right = false;
        keydownTracker.up = false;
        keydownTracker.down = false;
    }

    function update() {

        if(player.ded){
            return;
        }

        if (cursors.left.isDown && !keydownTracker.left)
        {
            actionMade = true;
            getMapTile(guyPos).navigable = true;
            if(map[guyPos.y][guyPos.x-1].navigable){
                guyPos.x -=1;
                setGuyPos();
            } else{
                handleInteraction({x:guyPos.x-1,y:guyPos.y},0);
            }
            keydownTracker.left = true;
        }
        else if (cursors.right.isDown && !keydownTracker.right)
        {
            actionMade = true;
            getMapTile(guyPos).navigable = true;
            if(map[guyPos.y][guyPos.x+1].navigable){
                guyPos.x +=1;
                setGuyPos();
            } else{
                handleInteraction({x:guyPos.x+1,y:guyPos.y},2);
            }
            keydownTracker.right = true;
        }

        if (cursors.up.isDown && !keydownTracker.up)
        {
            actionMade = true;
            getMapTile(guyPos).navigable = true;
            if(map[guyPos.y-1][guyPos.x].navigable){
                guyPos.y -=1;
                setGuyPos();
            } else{
                handleInteraction({x:guyPos.x,y:guyPos.y-1},1);
            }
            keydownTracker.up = true;
        }
        else if (cursors.down.isDown && !keydownTracker.down)
        {
            actionMade = true;
            getMapTile(guyPos).navigable = true;
            if(map[guyPos.y+1][guyPos.x].navigable){
                guyPos.y +=1;
                setGuyPos();
            } else{
                handleInteraction({x:guyPos.x,y:guyPos.y+1},3);
            }
            keydownTracker.down = true;
        }
        getMapTile(guyPos).navigable = false;

        if (cursors.left.isUp)
        {
            keydownTracker.left = false;
        }
        if (cursors.right.isUp)
        {
            keydownTracker.right = false;
        }
        if (cursors.up.isUp)
        {
            keydownTracker.up = false;
        }
        if (cursors.down.isUp)
        {
            keydownTracker.down = false;
        }

        if(actionMade){
            updateEnemies();
            actionMade = false;
        }

        if(player.health<=0 && !player.ded) {
            player.ded = true;
            game.add.sprite(game.camera.position.x,game.camera.position.y,'ded');
        }
    }

    function updateEnemies(){
        for(var i = 0; i < enemies.length;i++){
            var enemy = enemies[i];

            enemy.reaction--;

            if(enemy.health === 0){
                continue;
            }

            if(enemy.reaction<1)
            {
                enemy.reaction = enemy.baseReaction;
            } else{
                continue;
            }

            for(var j = 0;j < 4; j++){
                if(getInDir(enemy.pos,j).x === guyPos.x && getInDir(enemy.pos,j).y === guyPos.y){
                    player.health -= enemy.damage;
                    kovm.playerHealth(player.health);
                    continue;
                }
            }

            getMapTile(enemy.pos).navigable = true;
            enemy.updateFxn(map,guyPos);
            getMapTile(enemy.pos).navigable = false;
            getMapTile(enemy.pos).enemy = enemy;
            setPos(enemy.sprite,enemy.pos);
        }
    }

    function handleInteraction(pos,dir){
        unVisit(map,mapWidth,mapHeight);
        var tile = getMapTile(pos);
        if(map[pos.y][pos.x].tile === '2'){
            map[pos.y][pos.x].tile = '0';
            map[pos.y][pos.x].navigable = true;
            tilemap.fill(0, pos.x,pos.y,1,1);
            var afterDoor = getInDir(pos,dir);
            if(getMapTile(afterDoor).tile === '0'){
                processRoom(afterDoor);
                getMapTile(afterDoor).opened = true;
            }
        }
        else if(getMapTile(pos).tile === '1'){
            if(tile.health){
                tile.health--;
                if(tile.health<1){
                    tilemap.fill(0, pos.x,pos.y,1,1);
                    tile.navigable = true;
                    tile.tile = '0';
                }
            } else {
                tile.health = 10;
            }
            kovm.enemyHealth(tile.health);
            kovm.enemyName('wall');
        }
        else if(tile.enemy){
            tile.enemy.health -= player.weapon.damage;
            if(tile.enemy.health<1){
                tile.enemy.health = 0;
                tile.enemy.sprite.destroy(true);
                tile.navigable = true;
                if(getRandomInt(0,4)===1){
                    if(getRandomInt(0,1)===1){
                        items.push(getItem('dagger',tile.enemy.pos));
                    } else{
                        items.push(getItem('sword',tile.enemy.pos));
                    }
                }
            }
            kovm.enemyHealth(tile.enemy.health);
            kovm.enemyName(tile.enemy.name);
        }

    }

    function processRoom(pos){
        if(!hasRoomBeenOpened(map,pos)){
            console.log('new room');

            unVisit(map,mapWidth,mapHeight);
            var roomTiles = determineRoom(map,pos);

            for(var i = 0; i<getRandomInt(2,4);i++){
                var ith = getRandomInt(0,roomTiles.length-1);
                var enemyPos = roomTiles[ith];
                var enemy = getEnemy('zombie',enemyPos);
                getMapTile(enemy.pos).enemy = enemy;
                enemies.push(enemy);
                getMapTile(enemyPos).navigable = false;
            }
        }
        console.log('openedRoom');
    }

    function setGuyPos(){
        guy.position.x = tileWidth*guyPos.x+guyOffset;
        guy.position.y = tileWidth*guyPos.y+guyOffset;

        for(var i = 0;i < items.length; i++){
            var item = items[i];

            if(item.pos.x === guyPos.x && item.pos.y === guyPos.y){
                var t = item.name;
                var tt = item.damage;

                item.name = player.weapon.name;
                item.damage = player.weapon.damage;

                item.sprite.destroy();
                item.sprite = game.add.sprite(tileWidth*item.pos.x+guyOffset,tileWidth*item.pos.y+guyOffset,item.name);
                item.sprite.anchor.setTo(0.5, 0.5);

                game.world.swap(item.sprite,guy);

                player.weapon.name = t;
                kovm.playerWeapon(t);
                player.weapon.damage = tt;
            }
        }
    }

    function setPos(sprite,pos){
        sprite.position.x = tileWidth*pos.x+guyOffset;
        sprite.position.y = tileWidth*pos.y+guyOffset;
        for(var i = 0;i < items.length; i++){
            var item = items[i];

            if(item.pos.x === pos.x && item.pos.y === pos.y){
                if(item.sprite.z>sprite.z){
                    game.world.swap(sprite,item.sprite);
                }
            }
        }
    }

    function getMapTile(pos){
        return map[pos.y][pos.x];
    }
};
