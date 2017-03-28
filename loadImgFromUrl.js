// Phaser: Load Sprite From URL

// Make sure to import Phaser: https://cdn.jsdelivr.net/phaser/2.6.2/phaser.min.js

// Or test out my codepen interatively in your browser: https://codepen.io/hchiam/pen/qrJZdJ

var game = new Phaser.Game(400, 300, Phaser.AUTO, '', { preload: preload, create: create });
// add to the list of preload, create, etc. as needed for your game

var mySprite;

function preload() {
    myURL = 'https://3.bp.blogspot.com/-rvEAS04tpM0/WK4xClQYGbI/AAAAAAAAC9c/daNKjHXgovMUkfRfHIXxndy_xN_DSyy7wCLcB/s200/stack.png';
    game.load.crossOrigin = "Anonymous"; // enables loading from URL
    game.load.image('myImg', myURL);
}

function create() {
    mySprite = game.add.sprite(10, 10, 'myImg');
}