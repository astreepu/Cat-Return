import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.add.image(512, 384, 'background');
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload() {
        this.load.setPath('assets');
        this.load.audio('Summer', 'scene1/Summer.mp3');
        this.load.audio('type', 'scene1/type.mp3');

        this.load.image('background', 'title/background.png');
        this.load.image('logo', 'title/success.png');
        this.load.image('map_classroom', 'game/classroom.png');
        this.load.image('ground', 'game2/platform.png');
        this.load.image('health', 'game2/cathealth.png');

        this.load.spritesheet('bullet', 'game2/catbullet.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('attack2', 'game2/attack2.png', {
            frameWidth: 16,
            frameHeight: 29
        });
        this.load.spritesheet('ground2', 'game2/platform2.png', {
            frameWidth: 800,
            frameHeight: 96
        });
        this.load.spritesheet('attack3', 'game2/attack3.png', {
            frameWidth: 430,
            frameHeight: 102
        });
        this.load.spritesheet('liying', 'game2/liying.png', {
            frameWidth: 336,
            frameHeight: 504
        });
        this.load.spritesheet('lab', 'game2/lab.png', {
            frameWidth: 512,
            frameHeight: 341
        });

        this.load.spritesheet('cat', 'characters/cat.png', {
            frameWidth: 320,
            frameHeight: 320
        });

        this.load.spritesheet('7_building', 'scene1/7_building.png', {
            frameWidth: 1280,
            frameHeight: 1280
        });
        this.load.spritesheet('scene1_cat', 'scene1/cat_behind.png', {
            frameWidth: 1280,
            frameHeight: 1280
        });

        this.load.audio('chaos', 'scene2/chaos.mp3');
        this.load.audio('hoot', 'scene2/hoot.mp3');
        this.load.audio('huit', 'scene2/huit.mp3');
        this.load.audio('open', 'scene2/open.mp3');
        this.load.audio('battle', 'game2/battle.mp3');
        this.load.audio('restart', 'game2/restart.mp3');
        this.load.audio('ending', 'game2/ending.mp3');        

        this.load.image('scene2', 'scene2/Scene2.png');
        this.load.spritesheet('scene2', 'scene2/Scene2.png', {
            frameWidth: 1180,  // Adjust these values based on the actual frame size
            frameHeight: 820
        });

        this.load.spritesheet('student1', 'characters/student1.png', {
            frameWidth: 16,
            frameHeight: 32
        });

        this.load.spritesheet('student2', 'characters/student2.png', {
            frameWidth: 16,
            frameHeight: 32
        });

        this.load.image('map_stair', 'game/stair_v1.png');

        this.load.spritesheet('professor', 'characters/professor.png', {
            frameWidth: 48,
            frameHeight: 69
        });
    }

    create() {
        this.anims.create({
            key: "student1_idle",
            frames: this.anims.generateFrameNumbers('student1', { start: 144, end: 152 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "student1_talk",
            frames: this.anims.generateFrameNumbers('student1', { start: 42, end: 47 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "student1_walk",
            frames: this.anims.generateFrameNumbers('student1', { start: 60, end: 65 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "student2_idle",
            frames: this.anims.generateFrameNumbers('student2', { start: 144, end: 152 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "student2_talk",
            frames: this.anims.generateFrameNumbers('student2', { start: 42, end: 47 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "student2_walk",
            frames: this.anims.generateFrameNumbers('student2', { start: 60, end: 65 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "professor_idle",
            frames: this.anims.generateFrameNumbers('professor', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "idle1",
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: "idle2",
            frames: this.anims.generateFrameNumbers('cat', { start: 8, end: 13 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "scratch",
            frames: this.anims.generateFrameNumbers('cat', { start: 16, end: 21 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers('cat', { start: 32, end: 37 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers('cat', { start: 24, end: 29 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers('cat', { start: 40, end: 47 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "hurt",
            frames: this.anims.generateFrameNumbers('cat', { start: 48, end: 49 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leaves",
            frames: this.anims.generateFrameNumbers('7_building', { start: 0, end: 8 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: "scene1_cat",
            frames: this.anims.generateFrameNumbers('scene1_cat', { start: 0, end: 3 }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: "lab",
            frames: this.anims.generateFrameNumbers('lab', { start: 0, end: 19 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "bullet",
            frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 3 }),
            frameRate: 12    ,
            repeat: -1
        });
        this.anims.create({
            key: "liying_idle",
            frames: this.anims.generateFrameNumbers('liying', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "liying_charge",
            frames: this.anims.generateFrameNumbers('liying', { start: 5, end: 10 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "liying_power",
            frames: this.anims.generateFrameNumbers('liying', { start: 11, end: 15 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "liying_hurt",
            frames: this.anims.generateFrameNumbers('liying', { start: 16, end: 17 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "liying_att2",
            frames: this.anims.generateFrameNumbers('attack2', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "liying_att3",
            frames: this.anims.generateFrameNumbers('attack3', { start: 0, end: 19 }),
            frameRate: 12,
            repeat: -1
        });
        
        this.anims.create({
            key: "ground2",
            frames: this.anims.generateFrameNumbers('ground2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        // Move to the MainMenu with a fade-out effect
        this.cameras.main.fadeOut(1000, 0, 0, 0, () => {
            this.scene.start('MainMenu');
        });
    }
}
