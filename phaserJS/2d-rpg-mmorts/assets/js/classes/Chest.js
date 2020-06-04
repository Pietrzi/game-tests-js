class Chest extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.coins = 10;

        // fizyka na player
        this.scene.physics.world.enable(this);
        // dodać player do sceny
        this.scene.add.existing(this);
    }
}