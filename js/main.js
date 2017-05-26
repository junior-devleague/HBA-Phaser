var leftKey;
var rightKey;
var upKey;
var speed = 200;
var sfxJump;

function init(){
	//Make hero sprite more focused when moving around
	game.renderer.renderSession.roundPixels = true;
}

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

    //Play a sound effect when jumping
    game.load.audio('sfx:jump', 'audio/jump.wav');

    //Load coin audio
    game.load.audio('sfx:coin', 'audio/coin.wav');

    //Load the spritesheet
    game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);

    game.load.spritesheet('spider', 'images/spider.png', 42, 32);
};

function create(){
	// create game entities and set up world here
	game.add.image(0, 0, 'background');

	sfxJump = game.add.audio('sfx:jump')
	sfxCoin = game.add.audio('sfx:coin')

	loadLevel(game.cache.getJSON('level:1'));

	//This sets the left and right keys as inputs for this game
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

	upKey.onDown.add(function(){
		jump();
	})
}

function update(){
	handleCollisions();
	handleInput();
}

function handleCollisions(){
	game.physics.arcade.collide(hero, platforms);
	game.physics.arcade.overlap(hero, coins, onHeroVsCoin,
        null, this);
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

function jump(){
	var canJump = hero.body.touching.down;
	//Ensures hero is on the ground or on a platform
	if (canJump) {
		hero.body.velocity.y = -600;
		sfxJump.play();
	}
	return canJump;
}
function loadLevel(data){
	// create all the groups/layers that we need
	platforms = game.add.group();

	//Spawn the coins
	coins = game.add.group();
	// spawn all platforms
	data.platforms.forEach(spawnPlatform, this);
	data.coins.forEach(spawnCoin, this);

	// called the function to spawn hero and enemies
	spawnCharacters({hero: data.hero});	

	//Enable gravity
	game.physics.arcade.gravity.y = 1200;
}

function spawnPlatform(platform){
	//add new platforms as sprites to the game world
	game.add.sprite(platform.x, platform.y, platform.image);
	var sprite = platforms.create(
        platform.x, platform.y, platform.image);
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

function spawnCoin(coin) {
    var sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
    game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

function spawnSpider(){
}

function onHeroVsCoin(hero, coin) {
    coin.kill();
    sfxCoin.play();
};

function move(direction){
	hero.x += direction * 2.5;
}

//Create a game state
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});