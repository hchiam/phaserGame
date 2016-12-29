/*
 * Made using Phaser 2.6.2
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    
    game.stage.backgroundColor = '#85b5e1';
    
    game.load.image('player', 'assets/bird.png');
    game.load.image('platform', 'assets/pipe.png');
    
}

var player;
var platforms;
var cursors;
var jumpButton;

function create() {
    // If this is not a desktop (so it's a mobile device)
    if (game.device.desktop === false) {
        // Set the scaling mode to SHOW_ALL to show all the game
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // Set a minimum and maximum size for the game
        // Here the minimum is half the game size
        // And the maximum is the original game size
        game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        
        // Center the game horizontally and vertically
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    }
    
    // Center the game horizontally and vertically for desktop too
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    
    player = game.add.sprite(100, 200, 'player');
    
    game.physics.arcade.enable(player);
    
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 600;
    //player.body.bounce.set(0.5);
    
    platforms = game.add.physicsGroup();
    
    platforms.create(500, 150, 'platform');
    platforms.create(500, 150, 'platform');
    platforms.create(20, 400, 'platform');
    platforms.create(20, 400, 'platform');
    platforms.create(400, 550, 'platform');
    platforms.create(400, 550, 'platform');
    platforms.create(75, 500, 'platform');
    platforms.create(80, 500, 'platform');
    platforms.create(100, 500, 'platform');
    platforms.create(110, 500, 'platform');
    platforms.create(200, 350, 'platform');
    platforms.create(300, 425, 'platform');
    platforms.create(400, 425, 'platform');
    platforms.create(600, 425, 'platform');
    platforms.create(700, 500, 'platform');
    
    //platforms.setAll('body.immovable', true);
    platforms.setAll('body.collideWorldBounds', true);
    platforms.setAll('body.bounce.x', 0.8);
    platforms.setAll('body.bounce.y', 1);
    platforms.setAll('body.gravity.y', 500);
    
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

function update () {
    
    game.physics.arcade.collide(player, platforms);
    
    game.physics.arcade.collide(platforms, platforms);
    
    player.body.velocity.x = 0;
    
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down || player.body.touching.left || player.body.touching.right)) // || player.body.onWall()
    {
        player.body.velocity.y = -500;
    }
    else if (jumpButton.isDown && (player.body.onCeiling() || player.body.touching.up))
    {
        player.body.velocity.y = -500;
    }
}

function render () {
    
}
