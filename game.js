window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    var map = [];
    var guy = {};
    var guyPos = {};
    var keydownTracker = {};
    var tilemap = {};
    var layer = {};
    var enemies = [];

    var actionMade = false;

    var mapWidth = 128;
    var mapHeight = 128;

    var mapBuffer = 40;
    var tileWidth = 40;
    var guyOffset = 20;

    var getEnemy = enemyGetter(game,tileWidth,guyOffset);

    function preload () {
        game.load.image('guy', 'guy.png');
        game.load.image('tiles', 'tiles.png');
        game.load.image('zombie', 'zombie.png');
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

        //move once on click
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

        //reset key click trackers
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
    }

    function updateEnemies(){
        for(var i = 0; i < enemies.length;i++){
            var enemy = enemies[i];

            enemy.reaction--;

            if(enemy.reaction<1)
            {
                enemy.reaction = enemy.baseReaction;
            } else{
                continue;
            }

            getMapTile(enemy.pos).navigable = true;
            var xDif = guyPos.x - enemy.pos.x;
            var yDif = guyPos.y - enemy.pos.y;

            if(Math.abs(xDif)>Math.abs(yDif)){
                if(xDif<0){
                    var newSpot = getInDir(enemy.pos,0);
                    if(getMapTile(newSpot).navigable){
                        enemy.pos = newSpot;
                    }
                } else{
                    var newSpot = getInDir(enemy.pos,2);
                    if(getMapTile(newSpot).navigable){
                        enemy.pos = newSpot;
                    }
                }
            } else {
                if(yDif<0){
                    var newSpot = getInDir(enemy.pos,1);
                    if(getMapTile(newSpot).navigable){
                        enemy.pos = newSpot;
                    }
                } else{
                    var newSpot = getInDir(enemy.pos,3);
                    if(getMapTile(newSpot).navigable){
                        enemy.pos = newSpot;
                    }
                }
            }
            getMapTile(enemy.pos).navigable = false;
            getMapTile(enemy.pos).enemy = enemy;
            setPos(enemy.sprite,enemy.pos);
        }
    }

    function handleInteraction(pos,dir){
        unVisit(map,mapWidth,mapHeight);
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
    }

    function setPos(sprite,pos){
        sprite.position.x = tileWidth*pos.x+guyOffset;
        sprite.position.y = tileWidth*pos.y+guyOffset;
    }

    function getMapTile(pos){
        return map[pos.y][pos.x];
    }
};
