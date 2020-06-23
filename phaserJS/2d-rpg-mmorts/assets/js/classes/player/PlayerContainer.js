const Direction = {
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    UP: 'UP',
    DOWN: 'DOWN'
}

class PlayerContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y);
        this.scene = scene; // the scene this game object will be added to
        this.velocity = 160; // vleocity of player movement
        this.currentDirection = Direction.RIGHT;
        this.playerAttacking = false;
        this.flipX = true;
        this.swordHit = false;

        // set size on container
        this.setSize(64, 64);
        // enable physics
        this.scene.physics.world.enable(this);
        // kolizja z granicami
        this.body.setCollideWorldBounds(true);
        // dodać player container do sceny
        this.scene.add.existing(this);
        // camera follow player
        this.scene.cameras.main.startFollow(this);

        // create the player
        this.player = new Player(this.scene, 0, 0, key, frame);
        this.add(this.player);

        //create weapon game object
        this.weapon = this.scene.add.image(40, 0, 'items', 4);
        this.scene.add.existing(this.weapon);
        this.weapon.setScale(1.5);
        this.scene.physics.world.enable(this.weapon);
        this.add(this.weapon);
        this.weapon.alpha = 0;
    }

    update(cursors) {
        this.body.setVelocity(0);
    
        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.velocity);
            this.cuurentDirection = Direction.LEFT;
            this.weapon.setPosition(-40, 0);
            this.player.flipX = false;
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.velocity);
            this.cuurentDirection = Direction.RIGHT;
            this.weapon.setPosition(40, 0);
            this.player.flipX = true;
        }
    
        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.velocity);
            this.currentDirection = Direction.UP;
            this.weapon.setPosition(0, -40);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.velocity);
            this.currentDirection = Direction.DOWN;
            this.weapon.setPosition(0, 40);
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.playerAttacking) {
            this.weapon.alpha = 1;
            this.playerAttacking = true;
            this.scene.time.delayedCall(150, () => {
                this.weapon.alpha = 0;
                this.playerAttacking = false;
                this.swordHit = false;
            }, [], this);
        }

        if (this.playerAttacking) {
            if (this.weapon.flipX) {
                this.weapon.angle -= 10;
            } else {
                this.weapon.angle += 10;
            }

        } else {
            if (this.currentDirection === Direction.DOWN) {
                this.weapon.setAngle(-270);
            } else if (this.currentDirection === Direction.UP) {
                this.weapon.setAngle(-90);
            } else {
                this.weapon.setAngle(0);
            }

            this.weapon.flipX = false;
            if (this.currentDirection === Direction.LEFT) {
                this.weapon.flipX = true;
                console.log('l')
            }
        }
    }
}