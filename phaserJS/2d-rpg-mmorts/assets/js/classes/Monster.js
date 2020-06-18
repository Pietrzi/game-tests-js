class Monster extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame, id, health, maxhealth){
       super(scene, x, y, key, frame);
       this.scene = scene;
       this.id = id;
       this.health = health;
       this.maxhealth = maxhealth; 

       // fizyka na
       this.scene.physics.world.enable(this);
       // immovable do kolizji z monster
       this.setImmovable(false);
       // skalowanie
       this.setScale(2);
       // kolizja z granicami
       this.setCollideWorldBounds(true);
       // dodać monster do sceny
       this.scene.add.existing(this);
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