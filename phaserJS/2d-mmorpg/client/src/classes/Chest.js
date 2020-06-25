import * as Phaser from 'phaser';

export default class Chest extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, coins, id) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    this.coins = coins; // ammount of coins in chest
    this.id = id;

    // fizyka na player
    this.scene.physics.world.enable(this);
    // dodać player do sceny
    this.scene.add.existing(this);
    // scale chest game object
    this.setScale(2);
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  }

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }
}
