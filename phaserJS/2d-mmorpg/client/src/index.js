import 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload,
        create
    },
};
    
const game = new Phaser.Game(config);

function preload() {
    console.log("preload")
}

function create() {
    this.add.text(0, 0, 'hello world 3')
}