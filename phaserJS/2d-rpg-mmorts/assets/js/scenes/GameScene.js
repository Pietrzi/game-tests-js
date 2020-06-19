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
        this.createGroups();
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

    createGroups() {
        // create a chest group
        this.chests = this.physics.add.group();
        // create a monster group
        this.monsters = this.physics.add.group();
    }

    spawnChest(chestObject) {
        let chest = this.chests.getFirstDead();
        if (!chest) {
            chest = new Chest(
                this, 
                chestObject.x * 2, 
                chestObject.y * 2, 
                'items', 
                0, 
                chestObject.gold,
                 chestObject.id
            );
            this.chests.add(chest);
        } else {
            chest.coins = chestObject.gold;
            chest.id = chestObject.id;
            chest.setPosition(chestObject.x * 2, chestObject.y * 2);
            chest.makeActive();
        }
    }

    spawnMonster(monsterObject) {
        let monster = this.monsters.getFirstDead();
        if (!monster) {
            monster = new Monster(
                this, 
                monsterObject.x * 2, 
                monsterObject.y * 2,
                'monsters', 
                monsterObject.frame,
                monsterObject.id,
                monsterObject.health,
                monsterObject.maxHealth,
            );
            this.monsters.add(monster);
        } else {
            monster.id = monsterObject.id;
            monster.health = monsterObject.health;
            monster.maxHealth = monsterObject.maxHealth;
            monster.setTexture('monsters', monsterObject.frame);
            monster.setPosition(monsterObject.x * 2, monsterObject.y * 2);
            monster.makeActive();
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

        this.events.emit('pickUpChest', chest.id);
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

        this.events.on('chestSpawned', chest => {
            this.spawnChest(chest);
        });

        this.events.on('monsterSpawned', monster => {
            this.spawnMonster(monster);
        });

        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }
}