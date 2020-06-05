class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    // init( ) {
    //     // referencja do game scene
    //     this.gameScene = this.scene.get('Game');
    // }

    create() {
        // tekst tytułowy
        this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, "MMO RPG", {fontSize: '64px', fill: '#fff'});
        this.titleText.setOrigin(0.5);

        // guziczek
        this.startGameButton = new UiButton(this, this.scale.width / 2, this.scale.height * 0.65, 'button1', 'button2', 'Start Game', this.startScene.bind(this, 'Game'))
    }

    startScene(targetScene) {
        this.scene.start(targetScene);
        console.log('clickTitle')
    }
}