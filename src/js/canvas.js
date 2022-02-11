import platformImg from "../images/platform.png";
import hillsImage from "../images/hills.png";
import backgroundImage from "../images/background.png";
import platformSmallImg from "../images/platformSmallTall.png";
import spriteRunLeftImg from "../images/spriteRunLeft.png";
import spriteRunRightImg from "../images/spriteRunRight.png";
import spriteStandLeftImg from "../images/spriteStandLeft.png";
import spriteStandRightImg from "../images/spriteStandRight.png";

const canvas = document.querySelector("canvas");

// ? canvas context for rendering
const c = canvas.getContext("2d");

// ? make canvas take the full screen
// canvas.width = innerWidth; // same thing as window.innerWidth
// canvas.height = innerHeight; // same thing as window.innerHeight

// ? 16:9
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

// ? the player that is being controlled
class Player {
  constructor() {
    this.speed = 10;
    this.jump = 15;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 66;
    this.height = 150;
    this.image = createImage(spriteStandRightImg); // ? image of the sprite
    this.frames = 0; // ? current frame of the sprite
    this.sprites = {
      // ? sprite properties, such as when it is running/standing and the direction it is facing
      stand: {
        cropWidth: 177, // ? width of the sprite in the provided sprite image (not on the screen, but in the .png)
        width: 66, // ? width of the image/sprite on the screen
        right: createImage(spriteStandRightImg),
        left: createImage(spriteStandLeftImg),
      },
      run: {
        cropWidth: 341,
        width: 127.875,
        right: createImage(spriteRunRightImg),
        left: createImage(spriteRunLeftImg),
      },
    };

    this.currentSprite = this.sprites.stand.right; // ? current sprite image
    this.currentCropWidth = this.sprites.stand.cropWidth; // ? related to which sprite is being shown
  }

  // ? what the player will look like on the screen
  draw() {
    // ? create a red box
    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // ? draw an image (instead of a red box)
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames, // ? * this.frames is used to select which sprite frame to use (in the image via x-axis)
      0, // ? the top of the sprite image (via y-axis)
      this.currentCropWidth, // ? width of sprite
      400, // ? height of sprite
      this.position.x, // ? where to place the sprite on the screen
      this.position.y,
      this.width, // ? width of sprite image on the screen
      this.height
    );
  }

  // ? update the image on the screen
  update() {
    // ? on every update, add 1 to the frames
    this.frames++;

    // ? when the frames reach 59 or 29 and the sprite is standing or running, reset to the start of the sprite image
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    )
      this.frames = 0;
    else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right) |
        (this.currentSprite === this.sprites.run.left)
    )
      this.frames = 0;

    this.draw(); // draw the sprite on the screen (then change gravity/movement (below) and update/rerender image again)

    // ? this is the position of the sprite, that is controlled by gravity below
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // ? gravity
    // ? if the position of the player + height of the player (which essentially means its the bottom of the sprite)
    // ? + the velocity of the sprite is less than the canvas height, add (more) gravity
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

// ? the platform that the user will stand on
class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// ? This is for the background scenery
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let platformImgRef = createImage(platformImg);
let defaultPlatformWidth = platformImgRef.width - 2;
let platformSmallImgRef = createImage(platformSmallImg);

let player = new Player(); // ? new instance of player
let platforms = [];
let genericObjects = [];
let lastKey = ""; // ? last key that the user pressed (either A or D)
let scrollOffset = 0; // ? how far has the player/platform scrolled on the screen
const gap = 225; // ? gap size between platforms

// ? whether the left/right (A or D) keys are currently pressed
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

function initializeGame() {
  platformImgRef = createImage(platformImg);
  platformSmallImgRef = createImage(platformSmallImg);

  player = new Player();
  platforms = [
    // x: -1 to remove white edges issue
    new Platform({ x: -1, y: 460, image: platformImgRef }),
    new Platform({
      x: defaultPlatformWidth,
      y: 460,
      image: platformImgRef,
    }),
    new Platform({
      x: 2 * (defaultPlatformWidth + gap),
      y: 460,
      image: platformImgRef,
    }),
    new Platform({
      x: 3 * (defaultPlatformWidth + gap) - gap,
      y: 460,
      image: platformImgRef,
    }),
    new Platform({
      x: 4 * (defaultPlatformWidth + gap) - 2 * gap - platformSmallImgRef.width,
      y: 234,
      image: platformSmallImgRef,
    }),
    new Platform({
      x: 5 * (defaultPlatformWidth + gap) - 3 * gap,
      y: 234,
      image: platformImgRef,
    }),
    new Platform({
      x: 6 * (defaultPlatformWidth + gap) - 3 * gap,
      y: 460,
      image: platformImgRef,
    }),
    new Platform({
      x: 7 * (defaultPlatformWidth + gap) - 4 * gap - 50,
      y: 336,
      image: platformImgRef,
    }),
  ];
  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: createImage(backgroundImage) }),
    new GenericObject({ x: -1, y: -1, image: createImage(hillsImage) }),
  ];
  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);

  // clear the canvas before the next update
  // from the top to bottom
  // c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();

  // ? if the user presses the A or D key, move the player
  // ? also check if the player is not near an out of bounds area
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed & (scrollOffset === 0) && player.position.x > 0)
    // second condition checks if the user is near/greater than the left most out of bounds area
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    // parallax scenery
    // move background/platform instead of player
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  // ? platform collision detection
  platforms.forEach((platform) => {
    // ? if the bottom of the player above the platform
    // ? if the player lands on the platform while still having velocity (this fixes players floating above the platform due to velocity)
    // ? if the right side of the player is on the left side of the platform
    // ? if the left side of the player is on the right side of the platform (dont let him fall off)
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // switch sprite animation
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // win condition
  if (scrollOffset > 6 * (platformImgRef.width + gap) - gap) {
    console.log("you win!");
  }

  // lose condition
  if (player.position.y > canvas.height) {
    initializeGame();
  }
}

initializeGame();
animate();

// keyboard events
window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyW": {
      platforms.forEach((platform) => {
        // ? if the bottom of the player is on the platform
        // ? if the right side of the player is on the left side of the platform
        // ? if the left side of the player is on the right side of the platform (dont let him fall off)
        if (
          player.position.y + player.height === platform.position.y - 0.5 &&
          player.position.x + player.width >= platform.position.x &&
          player.position.x <= platform.position.x + platform.width
        ) {
          // ? this is a fix where due to the loop and two platforms being too close, the player will launch into the sky
          player.position.y -= 1; // make the first loop have the player be 1 px up, so the first condition will be false
          // ? increase the players velocity
          player.velocity.y -= player.jump;
        }
      });

      break;
    }
    case "KeyA": {
      // ? checks if the player is moving right (D)
      // ? if the user tries to go left (A), it will set the right movement to false
      if (keys.right.pressed) keys.right.pressed = false;

      keys.left.pressed = true;
      lastKey = "left";

      break;
    }
    case "KeyD": {
      if (keys.left.pressed) keys.left.pressed = false;

      keys.right.pressed = true;
      lastKey = "right";

      break;
    }
  }
});
window.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA": {
      keys.left.pressed = false;

      break;
    }
    case "KeyD": {
      keys.right.pressed = false;

      break;
    }
  }
});
