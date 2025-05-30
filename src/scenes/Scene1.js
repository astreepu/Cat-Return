import { Scene } from 'phaser';

export class Scene1 extends Scene {
    constructor() {
        super('Scene1');
        this.typingSound = null; // Reference for the typing sound
    }

    create() {
        // Add the background image
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        const bgImage = this.add.sprite(1180, 820, '7_building'); // Center position based on your screen size

        // Set the image to fill the screen
        bgImage.displayWidth = this.sys.game.config.width;
        bgImage.displayHeight = this.sys.game.config.height;
        bgImage.setOrigin(0.5, 0.5); // Center the image

        // Play background image animation
        bgImage.play('leaves');

        // Create the dialog box
        const dialogBox = this.add.rectangle(1180, 1440, 1800, 200, 0x000000, 0.5);
        dialogBox.setOrigin(0.5, 0.5);

        // Initial text configuration
        const text = this.add.text(1180, 1440, '', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
            wordWrap: { width: 1700 }
        }).setOrigin(0.5);

        // Full text to display
        const fullText = '喵嗚~~(好漂亮的地方...希望以後可以變成我的新家...)\nmeowuu~~(what a beautiful place...i hope this \ncan be my new home~ ';

        // Typewriter effect implementation with sound
        let charIndex = 0;
        // Calculate the duration of the typing sound based on the length of fullText and the delay between characters
        const typingSoundDuration = fullText.length * 50; // 50 milliseconds delay per character

        let isTypingSoundPlaying = false;

        this.time.addEvent({
            delay: 50, // Delay in milliseconds between each character
            callback: () => {
                if (charIndex < fullText.length) {
                    text.text += fullText[charIndex];
                    charIndex++;

                    // Check if the typing sound is not already playing
                    if (!isTypingSoundPlaying) {
                        // Play the typing sound and set the flag to true
                        this.typingSound = this.sound.play('type', { volume: 0.5 });
                        isTypingSoundPlaying = true;
                    }
                }
            },
            repeat: Math.ceil(typingSoundDuration / 50) - 1, // Repeat the typing sound to match the text duration
            onComplete: () => {
                // Reset the flag when the typing sound completes
                isTypingSoundPlaying = false;
            }
        });

        // Transition to Scene2 after 7 seconds
        this.time.delayedCall(7000, () => {
            if (this.typingSound) {
                this.sound.stopByKey('type'); // Stop only the typing sound
            }
            this.scene.start('Scene2');
        }, [], this);

        // Add the cat sprite and make it larger, after the dialog box and text
        const cat = this.add.sprite(900, 700, 'scene1_cat');
        cat.setScale(1.5);
        cat.play('scene1_cat'); // Play cat animation

        // Set up input listener to transition to Scene2
        this.input.once('pointerdown', () => {
            if (this.typingSound) {
                this.sound.stopByKey('type'); // Stop only the typing sound
            }
            this.scene.start('Scene2');
        });
    }
}
