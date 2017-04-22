window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload () {

        game.load.image('floor', 'floor.png');
        game.load.image('door', 'door.png');
        game.load.image('wall', 'wall.png');
        game.load.image('guy', 'guy.png');

    }

    function create () {

        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'floor');
        logo.anchor.setTo(0.5, 0.5);
        var door = game.add.sprite(game.world.centerX + 50, game.world.centerY, 'door');
        door.anchor.setTo(0.5, 0.5);
        var wall = game.add.sprite(game.world.centerX - 50, game.world.centerY, 'wall');
        wall.anchor.setTo(0.5, 0.5);

        var guy = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'guy');
        guy.anchor.setTo(0.5, 0.5);
    }

};
