export default class Map {
  constructor(scene, key, tileSetName, bgLayerName, blockedLayerName) {
    this.scene = scene; // scene this map belongs to
    this.key = key; // tile JSON key name
    this.tileSetName = tileSetName; // tiled tileset image key name
    this.bgLayerName = bgLayerName; // name of the background layer from tiled
    this.blockedLayer = blockedLayerName; // name of the blocked layer from tiled

    this.createMap();
  }

  createMap() {
    // create tile map
    this.map = this.scene.make.tilemap({ key: this.key });

    // add the tileset image to our map
    this.tiles = this.map.addTilesetImage(this.tileSetName, this.tileSetName, 32, 32, 1, 2);

    // create our background
    this.backgroundLayer = this.map.createStaticLayer(this.bgLayerName, this.tiles, 0, 0);
    this.backgroundLayer.setScale(2);

    // create block layer
    this.blockedLayer = this.map.createStaticLayer(this.blockedLayer, this.tiles, 0, 0);
    this.blockedLayer.setScale(2);
    // add collision to block layer
    this.blockedLayer.setCollisionByExclusion([-1]);

    // update the world bounds
    this.scene.physics.world.bounds.width = this.map.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.map.heightInPixels * 2;

    // limit the camer to size of map
    this.scene.cameras.main.setBounds(
      0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2,
    );
  }
}
