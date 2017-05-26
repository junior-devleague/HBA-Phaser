var leftKey;
var rightKey;
var speed = 200;

function preload(){
	//load and render an image
    game.load.image('background', 'images/background.png');
    game.load.json('level:1', 'data/level01.json');

    //spawn platform sprites
    game.load.image('ground', 'images/ground.png');
    game.load.image('grass:8x1', 'images/grass_8x1.png');
    game.load.image('grass:6x1', 'images/grass_6x1.png');
    game.load.image('grass:4x1', 'images/grass_4x1.png');
    game.load.image('grass:2x1', 'images/grass_2x1.png');
    game.load.image('grass:1x1', 'images/grass_1x1.png');

    //load the hero image
    game.load.image('hero', 'images/hero_stopped.png');
};

function init(){
	//Make hero sprite more focused when moving around
	game.renderer.renderSession.roundPixels = true;
}

function create(){
	// create game entities and set up world here
	game.add.image(0, 0, 'background');

	loadLevel(game.cache.getJSON('level:1'));

	//This sets the left and right keys as inputs for this game
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}

function loadLevel(data){
	// create all the groups/layers that we need
	platforms = game.add.group();
	// spawn all platforms
	data.platforms.forEach(spawnPlatform, this);

	// called the function to spawn hero and enemies
	spawnCharacters({hero: data.hero});	

	//Enable gravity
	game.physics.arcade.gravity.y = 1200;
}

function spawnPlatform(platform){
	//add new platforms as sprites to the game world
	game.add.sprite(platform.x, platform.y, platform.image);
	var sprite = platforms.create(platform.x, platform.y, platform.image);
	game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
}

function spawnCharacters(data){
	// add hero sprite to game
	hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
    hero.anchor.set(0.5, 0.5);

    //Make the main character use the physics engine for movement
	game.physics.enable(hero);

	//Prevent the main character to get out of the screen
	hero.body.collideWorldBounds = true;
}

function move(direction){
	hero.x += direction * 2.5;
}
function handleCollisions(){
	game.physics.arcade.collide(hero, platforms);
}

function handleInput(){
	if (leftKey.isDown) { // move hero left
        move(-1);
    }
    else if (rightKey.isDown) { // move hero right
        move(1);
    }
    else {
    	move(0);
    }
}

function update(){
	handleCollisions();
	handleInput();
}

//Create a game state
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});