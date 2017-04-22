window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    var map = '';
    var guy = {};
    var keydownTracker = {};

    function preload () {

        game.load.image('floor', 'floor.png');
        game.load.image('door', 'door.png');
        game.load.image('wall', 'wall.png');
        game.load.image('guy', 'guy.png');
        game.load.image('tiles', 'tiles.png');

    }

    function create () {
        for (var y = 0; y < 128; y++)
        {
            for (var x = 0; x < 128; x++)
            {
                //map += x===0||x===127||y===0||y===127 ? '1':'0';
                map += x%2===0&&y%2===0 ? '1':'0';

                if (x < 127)
                {
                    map += ',';
                }
            }

            if (y < 127)
            {
                map += "\n";
            }
        }
        game.cache.addTilemap('dynamicMap', null, map, Phaser.Tilemap.CSV);
        var tilemap = game.add.tilemap('dynamicMap', 40, 40);

        //  'tiles' = cache image key, 16x16 = tile size
        tilemap.addTilesetImage('tiles', 'tiles', 40, 40);

        var layer = tilemap.createLayer(0);

        layer.resizeWorld();

        guy = game.add.sprite(60, 60, 'guy');
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
