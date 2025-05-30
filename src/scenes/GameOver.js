import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        if (this.sound.get('battle')) {
            this.sound.get('battle').stop();
        }
        this.endMusic = this.sound.add('ending', { loop: true });
        this.endMusic.play();


        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor('black');

        // Initial text configuration
        const text = this.add.text(1180, 800, '', {
            fontFamily: 'Arial Black', fontSize: 60, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
            wordWrap: { width: 1700 }
        }).setOrigin(0.5);

        // Full text to display
        const fullText = '本遊戲純屬虛構娛樂! 請教授大發慈悲不要當掉我們!\nthe game is only game!\npls professor dont fail us\n:D';

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
    }
}
