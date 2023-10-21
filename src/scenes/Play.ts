import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;
  enemy?: Phaser.GameObjects.Shape;
  launched = false;
  origin?: { x: number; y: number };

  strafeSpeed = 0.5;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");
    this.origin = {
      x: (this.game.config.width as number) / 2,
      y: (this.game.config.height as number) - 50,
    };

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.spinner = this.add.rectangle(
      this.origin.x,
      this.origin.y,
      50,
      50,
      0xff0000,
    );

    this.enemy = this.addEnemy();
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown && !this.launched) {
      this.spinner!.x -= delta * this.strafeSpeed;
    }
    if (this.right!.isDown && !this.launched) {
      this.spinner!.x += delta * this.strafeSpeed;
    }

    if (this.fire!.isDown && !this.launched) {
      this.launched = true;
      this.tweens.add({
        targets: this.spinner,
        y: { from: (this.game.config.height as number) - 50, to: -50 },
        duration: 2000,
        ease: Phaser.Math.Easing.Sine.Out,
        onComplete: () => {
          this.spinner?.setPosition(this.origin!.x, this.origin!.y);
          this.launched = false;
        },
      });
    }
    if (
      Math.abs(this.spinner!.x - this.enemy!.x) < 50 &&
      Math.abs(this.spinner!.y - this.enemy!.y) < 50
    ) {
      this.enemy?.destroy();
      this.enemy = this.addEnemy();
    }
  }

  addEnemy() {
    const enemy = this.add.rectangle(
      this.game.config.width as number,
      100,
      50,
      50,
      0xffffff,
    );

    this.tweens.add({
      targets: enemy,
      x: { from: (this.game.config.width as number) + 50, to: -50 },
      duration: 5000,
      loop: -1,
    });
    return enemy;
  }
}
