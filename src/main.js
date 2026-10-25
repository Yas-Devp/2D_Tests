//import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { debug: true }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true,
};

const game = new Phaser.Game(config);
let player;
let cursors;
let wasd;

function preload() {
    this.load.spritesheet('player', 'assets/characters/Adventurer.png', { 
        frameWidth: 48, 
        frameHeight: 48 
    });

    this.load.tilemapTiledJSON('map', 'assets/maps/rooms1.json');
    
    this.load.image('doors', 'assets/maps/room1_assets/doors_windows_stairs.png');
    this.load.image('floors', 'assets/maps/room1_assets/floors.png');
    this.load.image('furniture', 'assets/maps/room1_assets/furniture1.png');
    this.load.image('items', 'assets/maps/room1_assets/items.png');
}

function create() {
    const map = this.make.tilemap({ key: 'map' });

    const tilesetDoors = map.addTilesetImage('doors_stairs', 'doors');
    const tilesetFloors = map.addTilesetImage('floors', 'floors');
    const tilesetFurniture = map.addTilesetImage('furniture1', 'furniture');
    const tilesetItems = map.addTilesetImage('items', 'items');

    const floorLayer = map.createLayer('floor', [tilesetFloors, tilesetDoors, tilesetFurniture], 0, 0);
    const wallsLayer = map.createLayer('walls', [tilesetFloors, tilesetDoors, tilesetFurniture], 0, 0);

    //here furnitures are in Group so I used 1 and 2 indexes
    const furnitureLayer = map.createLayer(1, [tilesetFloors, tilesetDoors, tilesetFurniture], 0, 0);
    const furniture2Layer = map.createLayer(2, [tilesetFloors, tilesetDoors, tilesetFurniture], 0, 0);

    const itemsLayer = map.createLayer('items', [tilesetItems, tilesetDoors, tilesetFurniture], 0, 0);

    //idle
    this.anims.create({ key: 'idle-down', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'idle-left', frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'idle-right', frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'idle-up', frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }), frameRate: 2, repeat: -1 });

    //walking
    this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('player', { start: 16, end: 19 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('player', { start: 20, end: 23 }), frameRate: 10, repeat: -1 });


    player = this.physics.add.sprite(200, 200, 'player').setScale(1.5); 
    player.setCollideWorldBounds(true);
    player.play('idle-down'); 
    

    if (wallsLayer) {
        wallsLayer.setCollisionByExclusion([-1]);
    }
    
    if (furnitureLayer) {
        furnitureLayer.setCollisionByExclusion([-1]);
    }
    
    if (furniture2Layer) {
        furniture2Layer.setCollisionByExclusion([-1]);
    }

    if (wallsLayer) this.physics.add.collider(player, wallsLayer);
    if (furnitureLayer) this.physics.add.collider(player, furnitureLayer);
    if (itemsLayer) this.physics.add.collider(player, itemsLayer);


    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(2);
    player.body.setSize(9, 9);
    player.body.setOffset(20, 30);

    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('W,A,S,D');
}

function update() {
    const speed = 150;
    player.setVelocity(0);

    if (cursors.left.isDown || wasd.A.isDown) {
        player.setVelocityX(-speed);
        player.anims.play('walk-left', true);
    } 
    else if (cursors.right.isDown || wasd.D.isDown) {
        player.setVelocityX(speed);
        player.anims.play('walk-right', true);
    } 
    else if (cursors.up.isDown || wasd.W.isDown) {
        player.setVelocityY(-speed);
        player.anims.play('walk-up', true);
    } 
    else if (cursors.down.isDown || wasd.S.isDown) {
        player.setVelocityY(speed);
        player.anims.play('walk-down', true);
    } 
    else {
        const currentAnim = player.anims.currentAnim ? player.anims.currentAnim.key : 'idle-down';
        if (currentAnim.includes('left')) player.anims.play('idle-left', true);
        else if (currentAnim.includes('right')) player.anims.play('idle-right', true);
        else if (currentAnim.includes('up')) player.anims.play('idle-up', true);
        else player.anims.play('idle-down', true);
    }
}