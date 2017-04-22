window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    var map = [];
    var guy = {};
    var keydownTracker = {};
    var tilemap = {};
    var layer = {};

    var mapWidth = 128;
    var mapHeight = 128;

    var mapBuffer = 40;

    function preload () {
        game.load.image('guy', 'guy.png');
        game.load.image('tiles', 'tiles.png');
    }

    function create () {
        map = initMap(mapWidth+mapBuffer,mapHeight+mapBuffer);
        genMap(map,mapBuffer/2,mapBuffer/2,mapWidth,mapHeight);

        game.cache.addTilemap('dynamicMap', null, mapToCsv(map,mapWidth,mapHeight), Phaser.Tilemap.CSV);
        tilemap = game.add.tilemap('dynamicMap', 4, 4);


        tilemap.addTilesetImage('tiles', 'tiles', 4, 4);

        layer = tilemap.createLayer(0);
        //tilemap.scale = {x:0.1,y:0.1};

        layer.resizeWorld();

        guy = game.add.sprite(-60, 60, 'guy');
        guy.anchor.setTo(0.5, 0.5);

        //game.camera.follow(guy);

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
            guy.position.x -= 40;
            keydownTracker.left = true;
        }
        else if (cursors.right.isDown && !keydownTracker.right)
        {
            guy.position.x += 40;
            keydownTracker.right = true;
        }

        if (cursors.up.isDown && !keydownTracker.up)
        {
            guy.position.y -=40;
            keydownTracker.up = true;
        }
        else if (cursors.down.isDown && !keydownTracker.down)
        {
            guy.position.y +=40;
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

};
