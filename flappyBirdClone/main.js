// http://www.lessmilk.com/tutorial/flappy-bird-phaser-1
// http://www.lessmilk.com/tutorial/flappy-bird-phaser-2

// Create our 'main' state that will contain the game
var mainState = {
    
    // preload, create, update, etc. are the core methods borrowed from the Phaser framework
    // everything else are helper methods
    
    
    // Core methods: preload, create, update
    
    /* preload:
     * This function will be executed at the beginning
     * That's where we load the images and sounds
     */
    preload: function() {
        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
        
        // Load the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
        
        // Load the jump sound
        game.load.audio('jump', 'assets/jump.wav');
    },
    
    /* create:
     * This function is called after the preload function
     * Here we set up the game, display sprites, etc.
     */
    create: function() {
        // Change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';
        
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');
        
        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);
        
        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;
        
        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        // Create an empty group, to which pipes will be added with our custom function addOnePipe or addRowOfPipes
        this.pipes = game.add.group();
        
        // Actually add pipes in our game every 1.5 seconds
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        
        // Show score
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        
        // Add the jump sound
        this.jumpSound = game.add.audio('jump');
    },
    
    /* update:
     * This function is called 60 times per second
     * It contains the game's logic
     */
    update: function() {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > gameHeight) {
            this.restartGame();
        }
        
        // Move the bird's anchor (and hence center of rotation) to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);
        
        // Rotate bird downward up to a certain point as the bird falls (i.e. when not jumping)
        if (this.bird.angle < 20) { // 20 degrees clockwise
            this.bird.angle += 1;
        }
        
        // Restart game each time the bird collides with a pipe in the pipes group
        //game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
        
        // When the bird dies, make the bird fall off the screen (instead of restarting the game instantly)
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); // hitPipe instead of restartGame
    },
    
    
    // Helper methods: jump, restartGame, addOnePipe, addRowOfPipes, hitPipe
    
    /* Make the bird jump
     */
    jump: function() {
        // We don't want to be able to make the bird jump when it's dead
        if (this.bird.alive == false) {
            return;
        }
        
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
        
        // Add and start an animation on the bird, to change angle to -20 degrees COUNTERclockwise in 100 milliseconds
        game.add.tween(this.bird).to({angle: -20}, 100).start(); 
            //// Create an animation on the bird
            //var animation = game.add.tween(this.bird);
            //// Change the angle of the bird to -20 degrees COUNTERclockwise in 100 milliseconds
            //animation.to({angle: -20}, 100);
            //// And start the animation
            //animation.start();
        
        // Actually play the jump sound
        this.jumpSound.play();
    },
    
    /* Restart the game
     */
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
    
    /* Our function to add a pipe in the game
     */
    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');
        
        // Add the pipe to our previously created group
        this.pipes.add(pipe);
        
        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);
        
        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;
        
        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    /* Our function to display multiple pipes in a row and a hole somewhere in the middle
     */
    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;
        
        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(400, i * 60 + 10);
            }
        }
        
        // Increase score by 1 each time new pipes are created
        this.score += 1;
        this.labelScore.text = this.score;
    },
    
    /* When the bird dies, make the bird fall off the screen (instead of restarting the game instantly)
     */
    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false) {
            return;
        }
        
        // Set the alive property of the bird to false
        this.bird.alive = false;
        
        // Prevent new pipes from appearing. I.e. prevent this code: this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        game.time.events.remove(this.timer);
        
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        }, this);
    },
};

var gameWidth = 400;
var gameHeight = 490;

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(gameWidth, gameHeight);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');