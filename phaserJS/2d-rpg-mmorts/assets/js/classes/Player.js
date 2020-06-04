class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.velocity = 160;

        // fizyka na player
        this.scene.physics.world.enable(this);
        // immovable do kolizji z player
        this.setImmovable(false);
        // skalowanie
        this.setScale(2);
        // kolizja z granicami
        this.setCollideWorldBounds(true);
        // dodać player do sceny
        this.scene.add.existing(this);
    }

    update(cursors) {
        this.body.setVelocity(0);
    
        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.velocity);
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.velocity);
        }
    
        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.velocity);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.velocity);
        }
    }
}