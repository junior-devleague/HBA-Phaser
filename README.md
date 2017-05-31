# HTML5 Phaser Summer Workshop

## Start here
We are going to create a classic *one-screen platformer* game! It will feature a main character, who can run and jump to platforms. There will also be enemies that this character will have to avoid –or kill! The goal of the game is to fetch the key and open the door that leads to the next level.

![Screenshot](https://mozdevs.github.io/html5-games-workshop/assets/platformer/platformer_screenshot.png)

You can [play the game here](https://mozdevs.github.io/html5-games-workshop/platformer/).

We will be implementing the following game development concepts:

- *Loading* assets.
- Handling *game states*.
- Rendering *images* on the screen.
- Implementing *sprites*.
- Reading the player's input via *keyboard*.
- Using a *physics engine* to move sprites and handle *collisions*.
- Writing *text* with a bitmap font.
- Playing *sound* effects and background music.
We will focus on game development concepts and the Phaser API in a way that is accessible to as many people as possible. This means that some good practises, like modules, that require of additional tools or a better understanding of JavaScript will not be seen here.

That said, if you are familiar with this tools/concepts and want to use them in this workshop, by all means, do it.

### Important!

This guide uses Phaser version 2.6.2 "Kore Springs". This version is what it's included in the project template provided in the next step.

It is possible that later on some changes in Phaser API in future versions might make this guide not 100% compatible with the latest Phaser version. We will try to keep this updated, though.

### About the art assets

The graphic and audio assets of the game in this guide have been released in the public domain under a CC0 license. These assets are:

- The images have been created by Kenney, and are part of his Platformer Art: Pixel Redux set (they have been scaled up, and some of them have minor edits).
- The background music track, Happy Adventure, has been created by Rick Hoppmann.
- The sound effects have been randomly generated with the Bfxr synth.

### Contents of this guide

1. Start here
2. Initialise Phaser
3. The game loop
4. Creating platforms
5. The main character sprite
6. Keyboard controls
7. Moving sprites with physics
8. Gravity
9. Jumps
10. Pickable coins
11. Walking enemies
12. Death
13. Scoreboard
14. Animations for the main character
15. Win condition
16. Switching levels
17. Moving forward…

## 2. Initialize Phaser

### Tasks

#### Set up the project skeleton

1. Create a directory/folder for the game in your computer.
2. Download the initial project skeleton and unzip its contents in the directory you just created. Make sure that the resulting structure looks like this:

```html
game
├── audio
├── data
├── images
├── index.html
└── js
```

3. Launch a local web server with:
`live-server` and check that you can get to the index.html file in the browser. For instance, if you have launched your web server in the port 3000, you should be able to see the contents of index.html by accessing http://0.0.0.0:3000.

### Initialise Phaser and the canvas

HTML5 games need a <canvas> element to draw graphics. Phaser can create one automatically when we initialise the game. We need to supply the ID of the element that will wrap the canvas –in our case, it will be a <div id="game"> that we have in our index.file. We will also be providing the canvas' dimensions (960✕600).

```html
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});
```

You might be wondering what is this Phaser.AUTO parameter we are passing. It's to specify whether we want a 2D canvas or a WebGL canvas. By setting it to AUTO, it will try to use a WebGL canvas –for most games it's most performant– and, when it isn't available, will fallback to use a regular 2D canvas.

Refresh your browser so you can see the changes. You should be able to see a black canvas with the dimensions we specified in the initialisation.

![Empty canvas on the screen](https://mozdevs.github.io/html5-games-workshop/assets/platformer/step00_check.png)

### Checklist

Before you go ahead, make sure:

- You can access the contents of index.html in your browser (by launching a local server).
- You see a black canvas element on the screen.
All done? Then let's continue! The glory of game development awaits us!

## 3. The game loop

The game loop is the core of every game. It's what allows us to update the game logic and render the graphics every frame –hopefully 60 times per second!

![The game loop](https://mozdevs.github.io/html5-games-workshop/assets/platformer/game_loop.png)

In Phaser, the game loop is handled automatically via *game states*. A game state represents one "screen" in our game: the loading screen, the main menu, a level, etc. Each state is divided into phases or steps, the most important are:

![Game state](https://mozdevs.github.io/html5-games-workshop/assets/platformer/game_state.png)

As you can see, `update` and `render` form the game loop. These phases *are called automatically* each frame, so we don't need to worry to implement a game loop and keep track of the timing.

A game state in Phaser is just an `Object` with some methods that we can override. We will be overriding some of these in order to load an image and render it on the screen.

### Tasks

#### Create a game state

#### Load and render an image

1. To load an image, we will make use of the preload phase of our game state. In this phase we will load all the assets that we require (images, sound effects, etc.).

To use a phase in a game state we need to add a method with a matching name. In our case, we will be filling in the *preload function*:

```html
function preload(){
  game.load.image('background', 'images/background.png');
}
```

Things to note:

- When we load an asset, we assign it an (arbitrary) key. We will use this key later to reference that asset.
2. To *render an image* we need to create an instance of `Phaser.Image`, which is one of the many game entities in Phaser. We can do this using the `game.add` factory, which will automatically add the image to the *game world* so it gets drawn on the screen automatically every frame.

Add the following method to the *create function*:

// create game entities and set up world here
```html
function create(){
  game.add.image(0, 0, 'background');
}
```
We are providing the X and Y coordinates –(0, 0) is the top left corner– and the key to the asset we just loaded.

If you check out the game, you should see a pretty background drawn in the screen:

![A background, rendered](https://mozdevs.github.io/html5-games-workshop/assets/platformer/step01_check.png)

### Checklist

- The background image is rendered in the screen.
Rendering an image in the game loop is the first step in crafting games. Get ready for the next step!

## Creating platforms

A platformer game needs… platforms, right? There are multiple techniques to handling platforms and the physics related to them. In this workshop, we will consider the platforms as *sprites*, like other characters in the game.

There are more efficient and flexible ways to do this, but for a one-screen platformer, this one is performant enough and, more importantly, the most simple way.

This is how some of the platforms look like (a 4✕1 and a 1✕1):

![4x1 grass platform 1x1 grass platform](https://mozdevs.github.io/html5-games-workshop/assets/platformer/grass_4x1.png)

As with images, there is a factory method to create *sprites* (in this case, instances of Phaser.Sprite) and add them automatically to the game world.

But where to place the platforms? We could hardcode the whole thing, but in the long run it's better to have the level data in a separate file that we can load. We have some *level data as JSON* files in the `data/` folder.

Ideally, these files would be generated with a level editor tool, but you can add more levels to the game after the workshop by creating your own JSON files!

If you open one of these JSON files, you can see how platform data is specified:
```html
{
    "platforms": [
        {"image": "ground", "x": 0, "y": 546},
        {"image": "grass:4x1", "x": 420, "y": 420}
    ],
    // ....
}
```
### Tasks

#### Load the level data

Phaser considers JSON files as another type of asset with can load within the game. Let's load the level data in the preload method:

```html
function preload(){
  game.load.json('level:1', 'data/level01.json');
  // ...
}
```

Now modify `create`:

```html
function create(){
  //...
  loadLevel(this.game.cache.getJSON('level:1'));
}


function loadLevel(data) {
};
```

You can check this works if you add a `console.log(data)` in `function loadLevel(data)` –and don't forget to remove it afterwards.

#### Spawn platform sprites

1. Before creating the sprites, we need to load the images that the platforms will use. As usual, we do this in the `preload` method:

```html
function preload() {
    //spawn platform sprites
    game.load.image('ground', 'images/ground.png');
    game.load.image('grass:8x1', 'images/grass_8x1.png');
    game.load.image('grass:6x1', 'images/grass_6x1.png');
    game.load.image('grass:4x1', 'images/grass_4x1.png');
    game.load.image('grass:2x1', 'images/grass_2x1.png');
    game.load.image('grass:1x1', 'images/grass_1x1.png');
};
```

2. Now let's spawn the platforms. The level JSON file contains a `platform` property with an Array of the info necessary to spawn the platforms: their position, and the image. So we just need to iterate over this Array and add new sprites to the game world:

```html
function loadLevel(data) {
    // spawn all platforms
    data.platforms.forEach(spawnPlatform, this);
};

function spawnPlatform(platform) {
    game.add.sprite(platform.x, platform.y, platform.image);
};
```

If you are thinking why we are splitting this into different methods, it's because loadLevel will become very crowded in the following steps.

Refresh your browser and you should see our platform sprites!

![Platform sprites](https://mozdevs.github.io/html5-games-workshop/assets/platformer/step02_check.png)

### Checklist

- You can see platforms rendered over the background
- Make sure you are using `game.add.sprite` to create the platforms and not `game.add.image`!

## The main character sprite

The hero or main character will be another *sprite* in our game. However, this sprite is more complex than the platforms, since it needs more business logics: moving around, jumping, etc.

Wouldn't be nice to have a class for these sprites with `jump`, `move`, etc. methods? 

### Tasks

#### Load the hero image

1. In `preload`:

```html
function preload() {
    // ...
    game.load.image('hero', 'images/hero_stopped.png');
};
```

### Spawn the hero when loading the level.

1. As with platforms, the hero position is stored in the JSON level file. We will create a new function, spawnCharacters, to spawn the hero and, later on, the enemies.

```html
function loadLevel (data) {
    //...
    // spawn hero and enemies
    spawnCharacters({hero: data.hero});
};
function spawnCharacters (data) {
    // spawn hero
    hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
};
```
2. Check how it looks like. You should see the hero… not in a very good position:

![Bad-positioned hero](https://mozdevs.github.io/html5-games-workshop/assets/platformer/hero_bad_position.png)

Why is this? Is the level data wrong? What happens is that, usually, we'd like sprites to be handled by their center. This helps in operations like rotations, flipping, etc. and it's also more intuitive. Let's fix this.

In Phaser, the point where we handle sprites and images is called anchor. It's a vector, and it accepts values in the 0 (left) to 1 (right) range. So the central point would be (0.5, 0.5). 

```html
function spawnCharacters (data) {
    // spawn hero
    hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
    hero.anchor.set(0.5, 0.5);
};
```

Refresh the browser again and you should see the hero positioned just over the ground:

![Hero positioned correctly in the scenario](https://mozdevs.github.io/html5-games-workshop/assets/platformer/step03_check.png)

### Checklist

- There is a hero sprite over the ground, on the bottom left part of the level.

## Keyboard controls

The player will be able to control the main character with the keyboard. For now, we will make the character move left and right when the player presses the arrow keys.

Phaser let us detect a key status (and listen to events like the key being released, etc.) via instances of Phaser.Key, each instance being associated to a specific key. Since we don't need to listen to the whole keyboard, we can settle for one instance for the left arrow key, and another one for the right arrow key.

### Tasks

#### Create instances of Phaser.Key

We can easily create Phaser.Key instances with the game.input.keyboard.addKeys method, which allow us to create multiple keys at once. We will create them in the create phase, since we don't need any of the assets loaded in preload.

```html
function create(){
  //This sets the left and right keys as inputs for this game
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}
```
You can perfectly create the keys in the create phase. But sometimes reserving create to spawn game entities that need the assets in preload can help to make the code more readable.

#### Add a move method to Hero

This is when having a custom class comes handy! Let's add a move method which will receive the direction as a parameter: -1 will mean left, and 1 will mean right:

```html
function move(direction){
	hero.body.velocity.x = direction * 200;
}
```

Remember how update and render were special phases of a state that were called automatically? Well, we will need to use update for this one: we want to check the status of the left and right arrow keys and, if they are pressed, move the character.

```html
function update(){
	handleInput();
}
```
```html
function handleInput(){
	if (leftKey.isDown) { // move hero left
        move(-1);
    }
    else if (rightKey.isDown) { // move hero right
        move(1);
    }
}
```
Load the game in the browser and make sure you can move the character left and right. Woohoo!

#### Fix a tiny glitch

If your sight is sharp you may have noticed the following glitch when moving the character:

![Blurry hero sprite](https://mozdevs.github.io/html5-games-workshop/assets/platformer/blurry_hero.png)

Do you see it? The hero sprite sometimes appear blurry, specially when compared to the background and platforms.

This is due to an anti-aliasing technique performed when drawing an image in not round coordinates (for instance, 100.27 instead of 100). For most games it is OK because it allows for smoother movements, but since this game uses pixel art, it doesn't look nice when it's blurred, even slightly.

Fortunately for us, there is a way in Phaser to force the rendering system to round the position values when drawing images.

We can do this in the init function, since it gets executed before any other phase:

```html
function init(){
	//Make hero sprite more focused when moving around
	game.renderer.renderSession.roundPixels = true;
}
```

#### Checklist

- The character moves left and right with the arrow keys.
- The character stays sharp after having moved. You can check this more easily if you zoom in your browser (Ctrl + for Win/Linux, or ⌘ + for Mac OS).

## Moving sprites with physics

It's always a good idea to tie movement to time. Previously we just set the character to move a fixed amount per frame, but we are ignoring how many frames per second our game is executing!

We could handle movements manually by querying for the delta time (the time that has elapsed between this frame an the previous one), but Phaser offer us a more convenient way: the use of a Physics engine.

Physics engines are usually expensive in terms of computation, but Phaser has implemented a very fast and small engine named Arcade Physics. It is very limited in features, but it's enough to handle a platformer game like ours –and we will not get a performance hit!

We will use the physics engine to move sprite, but also –later on– to handle gravity, collision tests, etc.

The important thing to take into account is that each sprite will have a physical body, and if this body is moved, rotated, etc. by the physics engine, Phaser will automatically update their rendering properties (like x or y), so we don't need to keep track of it.

### Tasks

#### Make the main character use the physics engine for movement

First we need to create a body for the character. This gets done when we "enable" physics for this sprite.

```html
function spawnCharacters(data){
	//Make the main character use the physics engine for movement
	game.physics.enable(hero);
}
```

Now we just need to make the move method affect the body of the sprite instead of directly modifying its position. What we need is to modify the sprite's velocity so it can move left or right. Edit the move function so it looks like this:

```html
function move(direction){
	hero.body.velocity.x = direction * 200;
	if (hero.body.velocity.x < 0) {
        hero.scale.x = -1;
    }
    else if (hero.body.velocity.x > 0) {
        hero.scale.x = 1;
    }
}
```

Try this out in the browser! Can you move left and right? Yes? Well done! But now we have a different problem… we need to be able to stop the character!

#### Stop the main character

We didn't need to do this before because we were modifying the position, but now we are modifying the velocity –and obviously objects with a non-zero velocity, move. We can stop the character by setting its speed to zero, and we can do that just by passing 0 as the direction when no key is being pressed:

function handleInput() {
    if (leftKey.isDown) { // move hero left
        // ...
    }
    else if (rightKey.isDown) { // move hero right
        // ...
    }
    else { // stop
        move(0);
    }
};
#### Prevent the main character to get out of the screen

This is a taste of what a physics engine can do for us with very little code from our part. Let's prevent the main character to move outside the bounds of the screen. In Phaser this can be done by setting a flag in the body. Edit the Hero constructor:

```html
function spawnCharacters(data){
    //Make the main character use the physics engine for movement
    game.physics.enable(hero);

    //Prevent the main character to get out of the screen
    hero.body.collideWorldBounds = true;
}
```

#### Checklist

- You can still move the main character left and right with the arrow keys.
- The character stops if no key is being pressed.
- The character cannot move out of the screen.

## Gravity

Using a physics engine makes jumping and handling gravity easy. Now we will handle gravity in the world, making the character step on platforms. And as a side effect, we will make the character not to go trough walls too!

We can set a global gravity that affects all the entities in the world. In a platformer game, We want the characters (like the hero and some enemies) to be affected by it. Other sprites (like pickable coins, or platforms themselves) should be immobile and not be affected by gravity).

One thing that we will start doing from now on is to group multiple sprites of the same kind into a sprite list: in Phaser they are instances of Phaser.Group. Once there, we can –among other things– perform collision tests between groups or between a single sprite and a whole group.

### Tasks

#### Enable gravity in the world

1. Edit loadLevel() to enable the gravity:

```html
function loadLevel(data){
    //Enable gravity
    game.physics.arcade.gravity.y = 1200;
}
```

We are doing this here and not in PlayState.init to have more flexibility… in this way, in the future we could set the gravity value in the JSON file and allow each level to have their own gravity… Some platformers have levels in the Moon!

2. Check the result in the browser… you will see that the main character falls down. The other sprites (the platforms) aren't affected because they don't have a physic body –yet.

![Main character falling down](https://mozdevs.github.io/html5-games-workshop/assets/platformer/hero_fall_bottom.png)

####  Make the character collide against the platforms

1. We don't want the main character to go through platforms –it's not a ghost! First we need to store the platforms into a group. Let's create it before spawning any sprite:

```html
function loadLevel(data) {
    // create all the groups/layers that we need
    platforms = game.add.group();
    // ...
};
```

2. Now change spawnPlatform so the sprite gets added to the group and we enable physics on it, to check for collisions:

```html
function spawnPlatform(platform) {
    var sprite = platforms.create(
        platform.x, platform.y, platform.image);
    game.physics.enable(sprite);
};
```

Phaser.Group.create is a factory method for sprites. The new sprite will be added as a child of the group.

3. Finally, perform collision checks between the main character and the platforms. Using collide will make the physics engine to avoid bodies going through other bodies:

```html
function update(){
	handleCollisions();
	handleInput();
};
```
```html
function handleCollisions(){
   game.physics.arcade.collide(hero, platforms);
};
```

4. If you try it out, you will see how the platforms fall! And there is one remaining platform that stays on the top of the character –because we prevented the character to move outside of the screen, remember?

![Platforms falling](https://mozdevs.github.io/html5-games-workshop/assets/platformer/platforms_falling.gif)

#### Fix collisions

1. Let's disable gravity for platforms. There is a flag for that in the body:

```html
function spawnPlatform(platform) {
    // ...
    sprite.body.allowGravity = false;
};
```

2. Refresh the game in the browser and you will be able to see how the platforms stay in their place… except the ground. This is happening because the main character is falling and pushing against the ground –like a pool ball against other balls.

![Ground falling](https://mozdevs.github.io/html5-games-workshop/assets/platformer/ground_falling.gif)

3. In order to fix this, we need to tell the physics engine that the platforms can't be moved when colliding. We do this by setting another flag:

```html
function spawnPlatform(platform) {
    // ...
    sprite.body.immovable = true;
};
```

Everything should be working as expected now! As a bonus, see how the character can't go through the small wall/platform on the ground:

![Character vs Wall](https://mozdevs.github.io/html5-games-workshop/assets/platformer/step06_check.png)

#### Checklist

- Platforms stay at their place.
- The main character does not fall through the ground.
- The main character can't go through the small wall on the ground.
Now on to doing some jumps!
