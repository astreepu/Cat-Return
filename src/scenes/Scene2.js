import { Scene } from 'phaser';

export class Scene2 extends Scene {
    constructor() {
        super('Scene2');
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Add the scene2 image
        const scene2Image = this.add.sprite(0, 0, 'scene2').setOrigin(0, 0);

        // Define the dimensions of each quadrant
        const imageWidth = scene2Image.width / 2;
        const imageHeight = scene2Image.height / 2;

        // Set the camera bounds to match the image dimensions
        this.cameras.main.setBounds(0, 0, scene2Image.width, scene2Image.height);

        // Set initial zoom level to fill the screen with one quadrant
        const zoomLevel = 2.8;
        this.cameras.main.setZoom(zoomLevel);

        // Ensure the camera starts at the top left corner
        this.cameras.main.centerOn(0, 350);

        this.sound.play('hoot', { volume: 0.5 });

        this.time.delayedCall(2000, () => {
            console.log('Pan to top right');
            this.cameras.main.pan(imageWidth + imageWidth / 2, imageHeight / 2, 2000, 'Power1', true, (cam, progress) => {
                if (progress === 1) {
                    this.sound.play('huit', { volume: 2 });
                    this.time.delayedCall(2000, () => {
                        console.log('Pan to bottom right');
                        this.cameras.main.pan(imageWidth + imageWidth / 2, imageHeight + imageHeight / 2, 2000, 'Power1', true, (cam, progress) => {
                            if (progress === 1) {
                                this.sound.play('open', { volume: 2 });
                                this.time.delayedCall(2000, () => {
                                    console.log('Pan to bottom left');
                                    this.sound.play('chaos', { volume: 0.2 });
                                    this.cameras.main.pan(imageWidth / 2, imageHeight + imageHeight / 2, 2000, 'Power1', true, (cam, progress) => {
                                        if (progress === 1) {
                                            this.time.delayedCall(4000, () => {
                                                console.log('Transition to Game');
                                                this.scene.start('Game');
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });
        });

        // Set up input listener to transition to Game scene
        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
