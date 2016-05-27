var toLoad = ["images/timeBombPanic.png",
              "maps/timeBombPanic.json"];

var g = hexi(512, 512, setup, toLoad);

g.scaleToWindow();

g.start();

var world;
var alien;
var message;
var wallMapArray;
var bombMapArray;
var bombSprites;
var bombLayer;
var leftArrow;
var rightArrow;
var downArrow;
var upArrow;
var tap = false;

function setup() {
    world = g.makeTiledWorld("maps/timeBombPanic.json",
                             "images/timeBombPanic.png");
    alien = world.getObject("alien");
    wallMapArray = world.getObject("wallLayer").data;
    bombLayer = world.getObject("bombLayer");
    bombMapArray = bombLayer.data;
    bombSprites = world.getObjects("bomb");

    alien.direction = "";

    leftArrow = g.keyboard(37);
    upArrow = g.keyboard(38);
    rightArrow = g.keyboard(39);
    downArrow = g.keyboard(40);

    leftArrow.press = function() { alien.direction = "left"; };
    upArrow.press = function() { alien.direction = "up"; };
    rightArrow.press = function() { alien.direction = "right"; };
    downArrow.press = function() { alien.direction = "down"; };

    g.pointer.tap = function() { tap = true; };

    g.state = play;
}

function play() {
    if (tap) {
        var xdiff = g.pointer.x - alien.x;
        var ydiff = g.pointer.y - alien.y;

        if (Math.abs(xdiff) > Math.abs(ydiff)) {
            if (g.pointer.x > alien.x) {
                alien.direction = "right";
            } else if (g.pointer.x < alien.x) {
                alien.direction = "left";
            }
        } else {
            if (g.pointer.y > alien.y) {
                alien.direction = "down";
            } else if (g.pointer.y < alien.y) {
                alien.direction = "up";
            }
        }
        tap = false;
    }

    if (Math.floor(alien.x) % world.tilewidth === 0 && Math.floor(alien.y) % world.tileheight === 0) {
        switch (alien.direction) {
            case "up":
                alien.vy = -4;
                alien.vx = 0;
                break;
            case "down":
                alien.vy = 4;
                alien.vx = 0;
                break;
            case "left":
                alien.vy = 0;
                alien.vx = -4;
                break;
            case "right":
                alien.vy = 0;
                alien.vx = 4;
                break;
            case "none":
                alien.vy = 0;
                alien.vx = 0;
                break;
        }
    }

    g.move(alien);
    g.contain(alien, g.stage);

    var alienVsFloor = g.hitTestTile(alien, wallMapArray, 0, world, "every");
    if (!alienVsFloor.hit) {
        alien.x -= alien.vx;
        alien.y -= alien.vy;
        alien.vx = 0;
        alien.vy = 0;
    }

    var alienVsBomb = g.hitTestTile(alien, bombMapArray, 5, world, "every");
    if (alienVsBomb.hit) {
        bombSprites = bombSprites.filter(function(bomb) {
            if (bomb.index === alienVsBomb.index) {
                bombMapArray[bomb.index] = 0;
                g.remove(bomb);
                return false;
            } else {
                return true;
            }
        });
    }
}