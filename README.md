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

game
├── audio
├── data
├── images
├── index.html
└── js

3. Launch a local web server with:
`live-server` and check that you can get to the index.html file in the browser. For instance, if you have launched your web server in the port 3000, you should be able to see the contents of index.html by accessing http://0.0.0.0:3000.

### Initialise Phaser and the canvas

HTML5 games need a <canvas> element to draw graphics. Phaser can create one automatically when we initialise the game. We need to supply the ID of the element that will wrap the canvas –in our case, it will be a <div id="game"> that we have in our index.file. We will also be providing the canvas' dimensions (960✕600).

`var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});`

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

// load game assets here
PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
};
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
