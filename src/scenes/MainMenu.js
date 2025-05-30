import { NONE, Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Start the scene with a fade-in effect
        // this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Play the background music and start at 5 seconds
        const music = this.sound.add('Summer', {
            volume: 0.5, // Adjust the volume as needed
            loop: true // Loop the music
        });
        music.play();
        music.seek = 5; // Start at 5 seconds into the track

        this.add.image(2360 / 2, 1640 / 2, 'background');
        var logo = this.add.image(2360 / 2, 1640 / 2, 'logo');
        var cat = this.add.sprite(100, 1400, 'cat');

        cat.play('idle1');
        cat.setInteractive();

        cat.on("pointerover", () => {
            cat.play('idle2');
        });
        cat.on("pointerout", () => {
            cat.play('idle1');
        });

        cat.on("pointerdown", () => {
            cat.play('scratch');
            // Use this.time.delayedCall to play idle1 after 500ms
            this.time.delayedCall(700, () => {
                cat.play('idle1');
            }, [], this);
        }, this); // Ensure 'this' context is passed correctly

        logo.setInteractive();

        logo.on("pointerover", () => {
            logo.setScale(1.05);
        });
        logo.on("pointerout", () => {
            logo.setScale(1);
        });

        logo.once('pointerdown', () => {
            cat.play('run');
            this.tweens.add({
                targets: cat,
                x: 2360 / 2, // Desired x position
                duration: 3000, // Duration of the run in milliseconds
                ease: 'Power1', // Easing function
                onComplete: () => {
                    // Jump after reaching the position
                    this.sound.play('huit', { volume: 2});
                    this.tweens.add({
                        targets: cat,
                        y: cat.y - 200, // Jump height
                        duration: 300,
                        yoyo: true, // Make the cat return to the original position
                        ease: 'Power1', // Easing function
                        onComplete: () => {
                            // Go back to idle animation after jump
                            
                            cat.play('idle1');
                        }
                    });
                }
            });
            this.time.delayedCall(4500, () => {
                this.scene.start('Scene1');
            }, [], this);
        });
    }
}
