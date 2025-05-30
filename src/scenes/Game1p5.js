import { Scene } from 'phaser';

export class Game1p5 extends Scene {
    constructor() {
        super('Game1p5');
        this.dialogComplete = false; // Flag to track if the dialog is complete
    }

    create() {
        // Set the background color to black
        this.cameras.main.setBackgroundColor('#000000');

        // Start the scene with a fade-in effect
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Add and resize the map image
        const map = this.add.image(1280, 820, 'map_stair'); // Center position for larger map
        map.setDisplaySize(5120, 3280); // Adjust these values to your desired size (2x the canvas size)

        // Add the cat sprite and scasssle it down
        this.cat = this.physics.add.sprite(3000, -400, 'cat'); // Start cat at the center
        this.cat.setScale(0.7); // Scale the cat down
        this.cat.play('idle1'); // Play the idle1 animation

        // Add the professor sprite and scale it down
        this.professor = this.physics.add.sprite(2200, 500, 'professor');
        this.professor.setScale(3);
        this.professor.play('professor_idle');
       
        // Add dialog-related properties
        this.dialogTexts = [
            [ '喵喵喵! (你就是把學生當掉的人!!!\nmeow meow meow! (you failed failed students cry cry',
              '??? (疑惑\n??? (confused',
              '喵!喵! (來決鬥吧!!\nmeow!meow! (come and fight fight!!',
              '?你是餓了嗎???\n?are you hungry???',
              '喵嗚哇! (抓\nmeowuhwa! (zhua' ]
        ];
        this.DialogSectionIndex = 0;
        this.currentDialogIndex = 0;
        this.dialogBox = null;
        this.dialogText = null;
        this.typingEvent = null;

        // Enable camera follow on the cat sprite
        this.cameras.main.startFollow(this.cat);

        // Set up WASD keys for movement
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Adjust the width of the border as needed
        const borderWidth = 2;
        
        // Set world bounds to match the border
        this.physics.world.setBounds(-1081, -571, 4732 , 1900);

        // Collide with the world bounds to prevent the cat from crossing the border
        this.cat.setCollideWorldBounds(true);

        // Define classroom boundaries
        const boundaries = [
            { x: 3400, y: -800, width: 600, height: 600 },
            { x: 966, y: -820, width: 1800, height: 650},
            { x: -200, y: -820, width: 1200, height: 1500},
            { x: -675, y: -820, width: 300, height: 1950},
            { x: -973, y: -820, width: 200, height: 550},
        ];

        // Draw the boundaries and add barriers to the static group
        const barriers = this.physics.add.staticGroup();

        boundaries.forEach(boundary => {
            const rect = this.add.rectangle(boundary.x + boundary.width / 2, boundary.y + boundary.height / 2, boundary.width - 100, boundary.height - 300);
            this.physics.add.existing(rect, true); // Add static physics body
            barriers.add(rect);
        });

        // Enable physics for barriers
        this.physics.add.collider(this.cat, barriers);

        // Define the designated place for the terminated talk
        this.terminatedTalkPlace = [
            { x: 2000,
              y: 300,
              width: 400,
              height: 400 },
            { x: 0,
              y: 0,
              width: 0,
              height: 0 }
        ];

        // Boolean to ensure terminated talk happens only once
        this.terminatedTalkTriggered = false;
        this.controlIndex = 0;

        //control the student move to destination after talk
        this.moveStudent = false;
    }

    update() {
        const speed = 500; // Adjust the speed as needed

        if (!this.terminatedTalkTriggered || this.dialogComplete) {
            // Play animations based on keyboard input
            if (this.cursors.left.isDown) {
                this.cat.setVelocityX(-speed);
                this.cat.play('run', true);
                this.cat.flipX = true; // Flip the cat sprite for left direction
            } else if (this.cursors.right.isDown) {
                this.cat.setVelocityX(speed);
                this.cat.play('run', true);
                this.cat.flipX = false; // Reset flip for right direction
            } else {
                this.cat.setVelocityX(0);
            }
        
            if (this.cursors.up.isDown) {
                this.cat.setVelocityY(-speed);
                this.cat.play('up', true);
            } else if (this.cursors.down.isDown) {
                this.cat.setVelocityY(speed);
                this.cat.play('down', true);
            } else {
                this.cat.setVelocityY(0);
            }
        }
        
        // Check if the cat is in the terminated talk place
        const catInTerminatedTalkPlace = Phaser.Geom.Rectangle.Contains(
            new Phaser.Geom.Rectangle(
                this.terminatedTalkPlace[this.controlIndex].x,
                this.terminatedTalkPlace[this.controlIndex].y,
                this.terminatedTalkPlace[this.controlIndex].width,
                this.terminatedTalkPlace[this.controlIndex].height
            ),
            this.cat.x,
            this.cat.y
        );

        if (catInTerminatedTalkPlace && !this.terminatedTalkTriggered) {
            // Stop the cat and play the chat animation
            this.cat.setVelocity(0, 0);

            this.startDialog();
            this.terminatedTalkTriggered = true;      
        }

        //
        if(this.dialogComplete){
            this.terminatedTalkTriggered = false;
            this.dialogComplete = false;
            this.scene.start('Game2');
        }
       
        // Randomly play 'idle1' or 'idle2' animation when not moving
        if (this.cat.body.velocity.x === 0 && this.cat.body.velocity.y === 0) {
            if (!this.cat.idleTimer || this.time.now > this.cat.idleTimer) {
                const idleAnimation = Phaser.Math.Between(0, 1) === 0 ? 'idle1' : 'idle2';
                this.cat.play(idleAnimation, true);
                this.cat.idleTimer = this.time.now + Phaser.Math.Between(0, 900); // Randomize idle time
            }
        }
    }

    startDialog() {
        this.dialogBox = this.add.rectangle(this.cat.x - 50, this.cat.y + 600, 1800, 200, 0x000000, 0.5).setOrigin(0.5, 0.5);
        this.dialogText = this.add.text(this.cat.x - 50, this.cat.y + 600, '', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
            wordWrap: { width: 1700 }
        }).setOrigin(0.5);
    
        this.displayText(this.dialogTexts[this.DialogSectionIndex][this.currentDialogIndex]);
        this.input.once('pointerdown', () => {
            this.nextDialog();
        });
    }
    
    displayText(content) {
        this.dialogText.text = '';
        let charIndex = 0;
        const typingSoundDuration = content.length * 50;
        let isTypingSoundPlaying = false;
    
        this.typingEvent = this.time.addEvent({
            delay: 50,
            callback: () => {
                if (charIndex < content.length) {
                    this.dialogText.text += content[charIndex];
                    charIndex++;
    
                    if (!isTypingSoundPlaying) {                        
                        this.typingSound = this.sound.play('type', { volume: 0.5 });
                        isTypingSoundPlaying = true;
                    }
                }
                console.log(0);
            },
            repeat: content.length - 1
        });

        if(this.DialogSectionIndex == 0){
            this.time.delayedCall(2100, () => {
                if (this.typingSound) {
                    this.sound.stopByKey('type'); // Stop only the typing sound
                }
            }, [], this);
        }
    }
    
    nextDialog() {
        if (this.typingEvent) {
            this.typingEvent.remove();
        }
        this.currentDialogIndex++;
        if (this.currentDialogIndex < this.dialogTexts[this.DialogSectionIndex].length) {
            this.displayText(this.dialogTexts[this.DialogSectionIndex][this.currentDialogIndex]);
            this.input.once('pointerdown', () => {
                this.nextDialog();
            });
        } else {
            this.dialogBox.destroy();
            this.dialogText.destroy();
            this.controlIndex++;
            this.DialogSectionIndex++;
            this.currentDialogIndex = 0;
            this.dialogComplete = true;
        }
    }
}