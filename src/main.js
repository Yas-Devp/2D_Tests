//import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { debug: false } // Keep false for now, just to see the character clearly
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
    // The sprite sheet has 48x48 pixel frames
    this.load.spritesheet('player', 'assets/Adventurer.png', { 
        frameWidth: 48, 
        frameHeight: 48 
    });
}

function create() {
    // --- 1. CREATE ANIMATIONS ---
    // Based on the layout: Down (Row 1), Left (Row 2), Right (Row 3), Up (Row 4)
    
    // IDLE (2 frames)
    this.anims.create({ key: 'idle-down', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'idle-left', frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'idle-right', frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'idle-up', frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }), frameRate: 2, repeat: -1 });

    // WALK (4 frames)
    this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('player', { start: 16, end: 19 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('player', { start: 20, end: 23 }), frameRate: 10, repeat: -1 });

    // --- 2. CREATE PLAYER ---
    player = this.physics.add.sprite(400, 300, 'player').setScale(2); // Scale up for better visibility
    player.setCollideWorldBounds(true);
    player.play('idle-down'); // Start facing down

    // --- 3. INPUTS ---
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('W,A,S,D');
}

function update() {
    const speed = 150;
    player.setVelocity(0); // Stop moving every frame

    // --- MOVEMENT & ANIMATION ---
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
        // If no keys are pressed, play idle animation based on the last direction
        // Phaser remembers the last animation key automatically
        const currentAnim = player.anims.currentAnim ? player.anims.currentAnim.key : 'idle-down';
        if (currentAnim.includes('left')) player.anims.play('idle-left', true);
        else if (currentAnim.includes('right')) player.anims.play('idle-right', true);
        else if (currentAnim.includes('up')) player.anims.play('idle-up', true);
        else player.anims.play('idle-down', true);
    }
}