window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    var map = [];
    var guy = {};
    var guyPos = {};
    var keydownTracker = {};
    var tilemap = {};
    var layer = {};

    var mapWidth = 128;
    var mapHeight = 128;

    var mapBuffer = 40;
    var tileWidth = 4;
    var guyOffset = 2;

    function preload () {
        game.load.image('guy', 'guy2.png');
        game.load.image('tiles', 'tiles.png');
    }

    function create () {
        map = initMap(mapWidth+mapBuffer,mapHeight+mapBuffer);
        genMap(map,mapBuffer/2,mapBuffer/2,mapWidth,mapHeight);

        game.cache.addTilemap('dynamicMap', null, mapToCsv(map,mapWidth,mapHeight), Phaser.Tilemap.CSV);
        tilemap = game.add.tilemap('dynamicMap', tileWidth, tileWidth);

        tilemap.addTilesetImage('tiles', 'tiles', tileWidth, tileWidth);

        layer = tilemap.createLayer(0);

        layer.resizeWorld();

        var openSpaces = determineRoomSquares(map,mapWidth,mapHeight);
        guyPos = openSpaces[getRandomInt(0,openSpaces.length-1)];

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
            if(map[guyPos.y+1][guyPos.x].navigable){
                guyPos.y +=1;
                setGuyPos();
            } else{
                handleInteraction({x:guyPos.x,y:guyPos.y+1},3);
            }
            keydownTracker.down = true;
        }

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
    }

    function handleInteraction(pos,dir){
        if(map[pos.y][pos.x].tile === '2'){
            map[pos.y][pos.x].tile = '0';
            map[pos.y][pos.x].navigable = true;
            tilemap.fill(0, pos.x,pos.y,1,1);
            var afterDoor = getInDir(pos,dir);
            if(getMapTile(afterDoor).tile === '0'){
                processRoom(afterDoor);
            }
        }
    }

    function processRoom(pos){
        console.log('openedRoom');
    }

    function setGuyPos(){
        guy.position.x = tileWidth*guyPos.x+guyOffset;
        guy.position.y = tileWidth*guyPos.y+guyOffset;
    }

    function getMapTile(pos){
        return map[pos.y][pos.x];
    }
};
