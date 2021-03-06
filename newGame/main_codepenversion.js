/*
 * Made using Phaser 2.6.2
 */

var fullPageURL = 'http://codepen.io/hchiam/full/gmvzdo/';
function setFillertextByUrlDetection() { // for codepen
    let thisUrl = document.URL;
    if (thisUrl.indexOf('full') === -1) {
        document.getElementById('fillertext').innerHTML = 'Go Full Screen: ';
        let aTag = document.createElement('a');
        aTag.setAttribute('href',fullPageURL);
        aTag.setAttribute('target','_blank'); // open in new window
        aTag.innerHTML = fullPageURL;
        document.getElementById('fillertext').appendChild(aTag);
    }
}

var game = new Phaser.Game(800, 400, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    
    setFillertextByUrlDetection();
    
    game.stage.backgroundColor = '#85b5e1';
    
    //game.load.image('player', 'assets/square.png');
    //game.load.image('box', 'assets/square.png');
    
    game.load.crossOrigin = "Anonymous"; // enables loading from url
    game.load.image('player', 'https://2.bp.blogspot.com/-hdTvE_5T94s/WNp6fZa2dKI/AAAAAAAADDE/Y4hkeEig0UceMdrrFCjt83LivqlQVzNxwCLcB/s1600/square.png');
    game.load.image('box', 'https://2.bp.blogspot.com/-hdTvE_5T94s/WNp6fZa2dKI/AAAAAAAADDE/Y4hkeEig0UceMdrrFCjt83LivqlQVzNxwCLcB/s1600/square.png');
    
}

var player;
var boxes;
var immobiles;
var intangibles;
var invisibles;

var cursors;
var jumpButton;
var pad1;
// gamepad mappings for my retrolink usb controller:
var btn_a = Phaser.Gamepad.XBOX360_X;
var btn_b = Phaser.Gamepad.XBOX360_Y;
var btn_x = Phaser.Gamepad.XBOX360_A;
var btn_y = Phaser.Gamepad.XBOX360_B;
var stick_left_x = Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
var stick_left_y = Phaser.Gamepad.XBOX360_STICK_RIGHT_X;
var aButton; // just in case of misunderstanding controller vs keyboard A

var immobile = false;
var intangible = false;
var invisible = false;

var colorNormal = 0xFFFF00;
var colorBox = 0xFFA500;
var colorImmobile = 0x00FF00;
var colorIntangible = 0xFFFFFF;
var colorInvisible = 0x0000FF;

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
    
    player = game.add.sprite(100, 100, 'player');
    player.tint = colorNormal;
    
    game.physics.arcade.enable(player);
    
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 600;
    //player.body.bounce.set(0.5);
    
    boxes = game.add.physicsGroup();
    immobiles = game.add.physicsGroup();
    intangibles = game.add.physicsGroup();
    invisibles = game.add.physicsGroup();
    
    invisibles.create(20, 300, 'box');
    boxes.create(500, 50, 'box');
    boxes.create(500, 45, 'box');
    boxes.create(200, 250, 'box');
    immobiles.create(300, 300, 'box');
    immobiles.create(400, 200, 'box');
    intangibles.create(600, 325, 'box');
    intangibles.create(700, 400, 'box');
    
    //boxes.setAll('body.immovable', true);
    boxes.setAll('body.collideWorldBounds', true);
    boxes.setAll('body.bounce.x', 0.8);
    boxes.setAll('body.bounce.y', 1);
    boxes.setAll('body.gravity.y', 500);
    boxes.setAll('tint', colorBox);
    
    immobiles.setAll('body.collideWorldBounds', true);
    immobiles.setAll('body.bounce.x', 0.8);
    immobiles.setAll('body.bounce.y', 1);
    immobiles.setAll('body.gravity.y', 500);
    immobiles.setAll('tint', colorImmobile);
    
    intangibles.setAll('body.collideWorldBounds', true);
    intangibles.setAll('body.bounce.x', 0.8);
    intangibles.setAll('body.bounce.y', 1);
    intangibles.setAll('body.gravity.y', 200);
    intangibles.setAll('tint', colorIntangible);
    
    invisibles.setAll('body.collideWorldBounds', true);
    invisibles.setAll('body.bounce.x', 0.8);
    invisibles.setAll('body.bounce.y', 1);
    invisibles.setAll('body.gravity.y', 400);
    invisibles.setAll('tint', colorInvisible);
    
    cursors = game.input.keyboard.createCursorKeys();
    
    // Call the 'jump' function when the spacekey is hit
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    aButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    
    // Call the 'jump' function when we tap/click on the screen
    pointer1 = game.input.addPointer(); // TODO: check that this works
    game.input.onTap.add(jump, this);
    
    // Enable usb controller gamepad
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    
    text = game.add.text(0, 0, message);
    
    instructionText = game.add.text(0, 0, "Left / Right = \u25C0 / \u25B6 / left stick\nJump = Spacebar / \u261A / A", {fill:"maroon"});
    instructionText.x = game.width/2 - instructionText.width/2;
}

function update () {
    
    if (immobile) {
        message = "IMMOBILE";
        player.tint = colorImmobile;
    } 
    if (invisible) {
        message = "INVISIBLE";
        player.tint = colorInvisible;
    }
    if (intangible) {
        message = "INTANGIBLE";
        player.tint = colorIntangible;
    }
    
    if (intangible === false && invisible === false) {
        // order matters: special interaction skills apply before regular collisions:
        game.physics.arcade.overlap(immobiles, player, goImmobile, null, this);
        game.physics.arcade.overlap(intangibles, player, goIntangible, null, this);
        game.physics.arcade.overlap(invisibles, player, goInvisible, null, this);
        
        game.physics.arcade.collide(player, intangibles);
        game.physics.arcade.collide(player, invisibles);
        game.physics.arcade.collide(player, boxes);
        if (immobile === false) {
            game.physics.arcade.collide(player, immobiles);
        }
    } else if (intangible) {
        game.physics.arcade.collide(player, intangibles);
    }
    
    game.physics.arcade.collide(immobiles, immobiles);
    game.physics.arcade.collide(invisibles, invisibles);
    game.physics.arcade.collide(invisibles, immobiles);
    game.physics.arcade.collide(boxes, boxes);
    game.physics.arcade.collide(boxes, immobiles);
    game.physics.arcade.collide(boxes, invisibles);
    
    player.body.velocity.x = 0;
    
    if (immobile === false) {
        // moving left and right
        if (cursors.left.isDown) {
            player.body.velocity.x = -250;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 250;
        }
        
        if (jumpButton.isDown || aButton.isDown) {
            // jumping off of floor and wall/ceiling "stickiness"
            jump();
        }
        
        // use gamepad:
        
        // gamepad buttons a,b,x,y:
        if (pad1.isDown(btn_a)) {
            jump();
        } else if (pad1.isDown(btn_b)) {
            jump();
        } else if (pad1.isDown(btn_x)) {
            jump();
        } else if (pad1.isDown(btn_y)) {
            jump();
        }
        // gamepad left stick x and y directions:
        if (pad1.connected) {
            var rightStickX = pad1.axis(stick_left_x);
            //var rightStickY = pad1.axis(stick_left_y);
            
            if (rightStickX) player.x += rightStickX * 10;
            //if (rightStickY) player.y += rightStickY * 10;
        }
    }
    
    // make text follow sprite
    text.text = message;
    text.x = player.x + player.width/2 - text.width/2;
    text.y = player.y + player.height/2 - text.height/2;
}

function render () {
    
}

function jump() {
    if (player.body.onFloor() || player.body.touching.down || player.body.touching.left || player.body.touching.right || player.body.onWall() || player.body.onCeiling() || player.body.touching.up) {
        player.body.velocity.y = -500;
    }
}

function goImmobile() {
    player.tint = colorImmobile;
    immobile = true;
    message = "IMMOBILE";
    game.time.events.add(Phaser.Timer.SECOND * 5, unImmobile, this);
}

function goIntangible() {
    player.tint = colorIntangible;
    intangible = true;
    message = "INTANGIBLE";
    game.time.events.add(Phaser.Timer.SECOND * 5, unIntangible, this);
}

function goInvisible() {
    player.alpha = 0;
    message = "INVISIBLE";
    game.time.events.add(Phaser.Timer.SECOND * 5, unInvisible, this);
}

function unImmobile() {
    player.tint = colorNormal;
    message = "";
    immobile = false;
}

function unIntangible() {
    player.tint = colorNormal;
    message = "";
    intangible = false;
}

function unInvisible() {
    message = "";
    player.alpha = 1;
}

function updateCounter(counter) {
    message = counter;
    text.text = message;
    counter--;
}
