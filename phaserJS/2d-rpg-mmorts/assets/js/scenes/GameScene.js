class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.scene.launch('Ui');
    }

    create() {
        this.createAudio();
    
        this.createChests();
    
        this.createWalls();
    
        this.createPlayer();
    
        this.addCollisions();
    
        this.createInput();
    }

     update() {
        this.player.update(this.cursors) // update z klasy player uruchamia się dopiero jak go tutaj wywołamy
    }

    createAudio() {
        this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.6 });
    }

    createPlayer() {
        this.player = new Player(this, 32, 32, 'characters', 0);
    }

    createChests() {
        this.chest = new Chest(this, 300, 300, 'items', 0);
    }

    createWalls() {
        this.wall = this.physics.add.image(500, 100, 'button1');
        this.wall.setImmovable();
    }

    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.wall)
        this.physics.add.overlap(this.player, this.chest, this.collectChest, null, this)
    }

    collectChest(player, chest) {
        this.goldPickupAudio.play();
        this.events.emit('updateScore', chest.coins)
        chest.destroy();
    }
}