/*
 * Made using Phaser 2.6.2
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    
    game.stage.backgroundColor = '#85b5e1';
    
    game.load.image('player', 'assets/square.png');
    game.load.image('platform', 'assets/square.png');
    
}

var player;
var limpers;
var intangibles;

var cursors;
var jumpButton;
var canMove = true;
var intangible = false;

var colorNormal = 0xFFFF00;
var colorLimp = 0x00FF00;
var colorIntangible = 0xFFFFFF;

var message = "";
var counter = 5;

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
    player.tint = colorNormal;
    
    game.physics.arcade.enable(player);
    
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 600;
    //player.body.bounce.set(0.5);
    
    limpers = game.add.physicsGroup();
    intangibles = game.add.physicsGroup();
    
    limpers.create(500, 150, 'platform');
    limpers.create(500, 150, 'platform');
    limpers.create(20, 400, 'platform');
    limpers.create(20, 400, 'platform');
    limpers.create(200, 350, 'platform');
    limpers.create(300, 425, 'platform');
    intangibles.create(400, 425, 'platform');
    intangibles.create(600, 425, 'platform');
    intangibles.create(700, 500, 'platform');
    
    //platforms.setAll('body.immovable', true);
    limpers.setAll('body.collideWorldBounds', true);
    limpers.setAll('body.bounce.x', 0.8);
    limpers.setAll('body.bounce.y', 1);
    limpers.setAll('body.gravity.y', 500);
    limpers.setAll('tint', colorLimp);
    
    intangibles.setAll('body.collideWorldBounds', true);
    intangibles.setAll('body.bounce.x', 0.8);
    intangibles.setAll('body.bounce.y', 1);
    intangibles.setAll('body.gravity.y', 500);
    intangibles.setAll('tint', colorIntangible);
    
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    text = game.add.text(0, 0, message);
    
}

function update () {
    
    if (!intangible) {
        game.physics.arcade.collide(player, limpers);
        game.physics.arcade.collide(player, intangibles);
        
        game.physics.arcade.overlap(limpers, player, goLimp, null, this);
        game.physics.arcade.overlap(intangibles, player, goIntangible, null, this);
    }
    
    game.physics.arcade.collide(limpers, limpers);
    
    player.body.velocity.x = 0;
    
    if (canMove) {
        // moving left and right
        if (cursors.left.isDown) {
            player.body.velocity.x = -250;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 250;
        }
        
        // jumping off of floor + wall and ceiling "stickiness"
        if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down || player.body.touching.left || player.body.touching.right || player.body.onWall() )) {
            player.body.velocity.y = -500;
        } else if (jumpButton.isDown && (player.body.onCeiling() || player.body.touching.up)) {
            player.body.velocity.y = -500;
        }
    }
    
    // make text follow sprite
    text.text = message;
    text.x = player.x + player.width/2 - text.width/2;
    text.y = player.y + player.height/2 - text.height/2;
}

function render () {
    
}

function goLimp() {
    player.tint = colorLimp;
    canMove = false;
    message = "LIMP";
    game.time.events.add(Phaser.Timer.SECOND * 5, unLimp, this);
}

function goIntangible() {
    player.tint = colorIntangible;
    intangible = true;
    message = "INTANGIBLE";
    game.time.events.add(Phaser.Timer.SECOND * 5, unIntangible, this);
}

function unLimp() {
    player.tint = colorNormal;
    message = "";
    canMove = true;
}

function unIntangible() {
    player.tint = colorNormal;
    message = "";
    intangible = false;
}

function updateCounter(counter) {
    message = counter;
    text.text = message;
    counter--;
}