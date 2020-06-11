class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.scene.launch('Ui');
        this.score = 0;
    }

    create() {
        this.createMap();
        this.createAudio();
        this.createChests();
        this.createInput();
        this.createGameManager();
    }

     update() {
        if (this.player) this.player.update(this.cursors) // update z klasy player uruchamia się dopiero jak go tutaj wywołamy
    }

    createAudio() {
        this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.6 });
    }

    createPlayer(location) {
        this.player = new Player(this, location[0] * 2, location[1] * 2, 'characters', 0);
    }

    createChests() {
        // create a chest group
        this.chests = this.physics.add.group();
        // chest positions arry
        this.chestPositions = [[100,100], [200,200], [300,300], [400,400], [500,500]];
        // max numbers of chests
        this.maxNumberOfChests = 3;
        // spawn a chest
        for (let i = 0; i < this.maxNumberOfChests; i += 1) {
            this.spawnChest();
        }
        // this is how we did 1 chest
        //this.spawnChest();
    }

    spawnChest() {
        const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];

        let chest = this.chests.getFirstDead();
        if (!chest) {
            const chest = new Chest(this, location[0], location[1], 'items', 0);
            this.chests.add(chest);
        } else {
            chest.setPosition(location[0], location[1]);
            chest.makeActive();
        }
        
    }

    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    addCollisions() {
        // check for collisions between player and block layer
        this.physics.add.collider(this.player, this.map.blockedLayer)
        // check for overlap between player and chest game objects
        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this)
    }

    collectChest(player, chest) {
        // play pick gold sound
        this.goldPickupAudio.play();
        // update score
        this.score += chest.coins
        this.events.emit('updateScore', this.score); // updatescore in Ui
        // make chest object inactive
        chest.makeInactive();
        // spawn a new chest
        this.time.delayedCall(1000, this.spawnChest, [], this) // phaser time event
    }

    createMap() {
        // create map
        this.map = new Map(this, 'map', 'background', 'background','blocked')
    }

    createGameManager() {
        this.events.on('spawnPlayer', location => {
            this.createPlayer(location);
            this.addCollisions();
        });

        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }
}