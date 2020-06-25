class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene; // the scene this game object will be added to

        // enable physics
        this.scene.physics.world.enable(this);
        // immovable do kolizji z player
        this.setImmovable(true);
        // skalowanie
        this.setScale(2);
        // dodać player do sceny
        this.scene.add.existing(this);
    }
}