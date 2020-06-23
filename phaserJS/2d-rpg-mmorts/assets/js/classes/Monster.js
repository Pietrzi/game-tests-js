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
       // update origin 
       this.setOrigin(0);

       this.createHealthBar();
    }

    createHealthBar() {
        this.healtBar = this.scene.add.graphics();
        this.updateHealthBar();
    }

    updateHealthBar() {
        this.healtBar.clear();
        this.healtBar.fillStyle(0xffffff, 1);
        this.healtBar.fillRect(this.x, this.y -8, 64, 5);
        this.healtBar.fillGradientStyle(0xff0000, 0xffffff, 4);
        this.healtBar.fillRect(this.x, this.y -8, 64 * (this.health / this.maxhealth), 5);
    }

    updateHealth(health) {
        this.health = health;
        this.updateHealthBar();
    }

    makeActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body.checkCollision.none = false;
        this.updateHealthBar();
    }

    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body.checkCollision.none = true;
        this.healtBar.clear();
    }
}