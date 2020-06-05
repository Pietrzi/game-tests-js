class Chest extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene; // the scene this game object will be added to
        this.coins = 10; // ammount of coins in chest

        // fizyka na player
        this.scene.physics.world.enable(this);
        // dodać player do sceny
        this.scene.add.existing(this);
    }

    makeActive() {
        this.setActive(true);
        this.setVissible(true);
        this.body.checkCollision.none = false;
    }

    makeInactive() {
        this.setActive(false);
        this.setVissible(false);
        this.body.checkCollision.none = true;
    }
}