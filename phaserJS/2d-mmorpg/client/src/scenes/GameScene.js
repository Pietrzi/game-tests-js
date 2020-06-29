import * as Phaser from 'phaser';
import PlayerContainer from '../classes/player/PlayerContainer';
import GameManager from '../game_manager/GameManager';
import Chest from '../classes/Chest';
import Monster from '../classes/Monster';
import GameMap from '../classes/GameMap';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.scene.launch('Ui');

    // get a reference to our socket
    this.socket = this.sys.game.globals.socket;

    // listen for socket event
    this.listenForSocketEvents();
  }

  listenForSocketEvents() {
    // spawn player game objects
    this.socket.on('currentPlayers', (players) => {
      Object.keys(players).forEach((id) => {
        if (players[id].id === this.socket.id) {
          this.createPlayer(players[id], true);
          this.addCollisions();
        } else {
          this.createPlayer(players[id], false);
        }
      });
    });

    // spawn monster game objects
    this.socket.on('currentMonsters', (monsters) => {
      Object.keys(monsters).forEach((id) => {
        this.spawnMonster(monsters[id]);
      });
    });

    // spawn chest game objects
    this.socket.on('currentChests', (chests) => {
      Object.keys(chests).forEach((id) => {
        this.spawnChest(chests[id]);
      });
    });

    // spawn player game object
    this.socket.on('spawnPlayer', (player) => {
      this.createPlayer(player, false);
    });

    // a player has moved
    this.socket.on('playerMoved', (player) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (player.id === otherPlayer.id) {
          otherPlayer.flipX = player.flipX;
          otherPlayer.setPosition(player.x, player.y);
          otherPlayer.updateHealthBar();
          otherPlayer.updateFlipX();
          otherPlayer.playerAttacking = player.playerAttacking;
          otherPlayer.currentDirection = player.currentDirection;
          if (player.playerAttacking) {
            otherPlayer.attack();
          }
        }
      });
    });

    this.socket.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });

    this.socket.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });

    this.socket.on('chestRemoved', (chestId) => {
      this.chests.getChildren().forEach((chest) => {
        if (chest.id === chestId) {
          chest.makeInactive();
        }
      });
    });

    this.socket.on('monsterRemoved', (monsterId) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.makeInactive();
          this.monsterDeathAudio.play();
        }
      });
    });

    this.socket.on('monsterMovement', (monsters) => {
      this.monsters.getChildren().forEach((monster) => {
        Object.keys(monsters).forEach((monsterId) => {
          if (monster.id === monsterId) {
            this.physics.moveToObject(monster, monsters[monsterId], 40);
          }
        });
      });
    });

    this.socket.on('updateScore', (goldAmount) => {
      this.events.emit('updateScore', goldAmount);
    });

    this.socket.on('updateMonsterHealth', (monsterId, health) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.updateHealth(health);
        }
      });
    });

    this.socket.on('updatePlayerHealth', (playerId, health) => {
      if (this.player.id === playerId) {
        if (health < this.player.health) {
          this.playerDamageAudio.play();
        }
        this.player.updateHealth(health);
      } else {
        this.otherPlayers.getChildren().forEach((player) => {
          if (player.id === playerId) {
            player.updateHealth(health);
          }
        });
      }
    });

    this.socket.on('respawnPlayer', (playerObject) => {
      if (this.player.id === playerObject.id) {
        this.playerDeathAudio.play();
        this.player.respawn(playerObject);
      } else {
        this.otherPlayers.getChildren().forEach((player) => {
          if (player.id === playerObject.id) {
            player.respawn(playerObject);
          }
        });
      }
    });

    this.socket.on('disconnect', (playerId) => {
      this.otherPlayers.getChildren().forEach((player) => {
        if (playerId === player.id) {
          player.cleanUp();
        }
      });
    });

    this.socket.on('invalidToken', () => {
      window.alert('Token is no longer valid. Please login again.');
      window.location.reload();
    });
  }

  create() {
    this.createMap();
    this.createAudio();
    this.createGroups();
    this.createInput();
    this.createGameManager();

    // emit event to server that a new player joined
    this.socket.emit('newPlayer', getCookie('jwt'));
  }

  update() {
    // update z klasy player uruchamia się dopiero jak go tutaj wywołamy
    if (this.player) this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.3 });
    this.playerAttackAudio = this.sound.add('playerAttack', { loop: false, volume: 0.01 });
    this.playerDamageAudio = this.sound.add('playerDamage', { loop: false, volume: 0.2 });
    this.playerDeathAudio = this.sound.add('playerDeath', { loop: false, volume: 0.2 });
    this.monsterDeathAudio = this.sound.add('enemyDeath', { loop: false, volume: 0.2 });
  }

  createPlayer(playerObject) {
    this.player = new PlayerContainer(
      this,
      playerObject.x * 2,
      playerObject.y * 2,
      'characters',
      0,
      playerObject.health,
      playerObject.maxHealth,
      playerObject.id,
      this.playerAttackAudio,
    );
  }

  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();
    // create a monster group
    this.monsters = this.physics.add.group();
    this.monsters.runChildUpdate = true;
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
        chestObject.id,
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
        monsterObject.x,
        monsterObject.y,
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
      monster.setPosition(monsterObject.x, monsterObject.y);
      monster.makeActive();
    }
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    // check for collisions between player and block layer
    this.physics.add.collider(this.player, this.map.blockedLayer);
    // check for overlap between player and chest game objects
    this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
    // check for collisions between monsters and block layer
    this.physics.add.collider(this.monsters, this.map.blockedLayer);
    // ovelap for weapon on monsters
    this.physics.add.overlap(this.player.weapon, this.monsters, this.enemyOverlap, null, this);
  }

  enemyOverlap(weapon, enemy) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.events.emit('monsterAttacked', enemy.id, this.player.id);
    }
  }

  collectChest(player, chest) {
    // play pick gold sound
    this.goldPickupAudio.play();

    this.events.emit('pickUpChest', chest.id, player.id);
  }

  createMap() {
    // create map
    this.map = new GameMap(this, 'map', 'background', 'background', 'blocked');
  }

  createGameManager() {
    this.events.on('spawnPlayer', (playerObject) => {
      this.createPlayer(playerObject);
      this.addCollisions();
    });

    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });

    this.events.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });

    this.events.on('monsterRemoved', (monsterId) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.makeInactive();
          this.monsterDeathAudio.play();
        }
      });
    });

    this.events.on('chestRemoved', (chestId) => {
      this.chests.getChildren().forEach((chest) => {
        if (chest.id === chestId) {
          chest.makeInactive();
        }
      });
    });

    this.events.on('updateMonsterHealth', (monsterId, health) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.updateHealth(health);
        }
      });
    });

    this.events.on('monsterMovement', (monsters) => {
      this.monsters.getChildren().forEach((monster) => {
        Object.keys(monsters).forEach((monsterId) => {
          if (monster.id === monsterId) {
            this.physics.moveToObject(monster, monsters[monsterId], 40);
          }
        });
      });
    });

    this.events.on('updatePlayerHealth', (playerId, health) => {
      if (health < this.player.health) {
        this.playerDamageAudio.play();
      }
      this.player.updateHealth(health);
    });

    this.events.on('respawnPlayer', (playerObject) => {
      this.playerDeathAudio.play();
      this.player.respawn(playerObject);
    });

    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }
}
