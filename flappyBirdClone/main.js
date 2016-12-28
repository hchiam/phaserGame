// http://www.lessmilk.com/tutorial/flappy-bird-phaser-1

// Create our 'main' state that will contain the game
var mainState = {
    
    /* preload:
     * This function will be executed at the beginning
     * That's where we load the images and sounds
     */
    preload: function() {
        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
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
    },
    
    /* Make the bird jump
     */
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },
    
    /* Restart the game
     */
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
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