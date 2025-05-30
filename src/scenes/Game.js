import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.dialogComplete = false; // Flag to track if the dialog is complete
    }

    create() {
        // Set the background color to black
        this.cameras.main.setBackgroundColor('#000000');

        // Start the scene with a fade-in effect
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Add and resize the map image
        const map = this.add.image(1280, 820, 'map_classroom'); // Center position for larger map
        map.setDisplaySize(5120, 3280); // Adjust these values to your desired size (2x the canvas size)

        // Add the cat sprite and scale it down
        this.cat = this.physics.add.sprite(3500, 900, 'cat'); // Start cat at the center
        this.cat.setScale(0.7); // Scale the cat down
        this.cat.play('idle1'); // Play the idle1 animation

        // Add the student1 sprite and scale it down
        this.student1 = this.physics.add.sprite(1500, 100, 'student1'); 
        this.student1.setScale(6);
        this.student1.play('student1_idle');

        // Add the student1 sprite and scale it down
        this.student2 = this.physics.add.sprite(1600, 100, 'student2'); 
        this.student2.setScale(6);
        this.student2.play('student2_idle');
       
        // Add dialog-related properties
        this.dialogTexts = [
            [ '喵嗚?! (前面發生甚麼事了??!\nmeowuu?! (what happened??!',
              '喵! (好像有人在哭!\nmeow?! (someone is crying!',
              '喵喵喵!! (去教室裡面看看吧!!\nmeow meow meow!! (maybe go check check the classroom!!' ],
            [ '嗚嗚嗚怎麼辦??? 電路學真的太難了啦QAQ\nelectric circuits is tooooo hard for me QAQ',
              '一大堆數學公式轉來轉去，轉到我都快暈船了...\nthere are too many formula for my brain to remember...',
              '如果我被當掉怎麼辦阿阿阿阿!!! 我真的不想重修:(\nwhat if i fail the test!!! i dont wanna retake it:(',
              '那你可以去暑修阿XD\nmaybe u can go to summer class lmao',
              '不要再說了!!!!!!\nstop speaking!!!' ],
            [ '喵~ (按照剛剛兩個同學說的...\nmeow~ (according to the clue...',
              '喵喵喵喵~ (教獸應該就在那裡了...\nmeow meow meow~ (promonster should be there...'
            ]
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

        const borderWidth = 10; // Adjust the width of the border as needed
        const borderX = map.x - map.displayWidth / 2 - borderWidth / 2;
        const borderY = map.y - map.displayHeight / 2 - borderWidth / 2;
        const borderW = map.displayWidth + borderWidth;
        const borderH = map.displayHeight + borderWidth;

        // Set world bounds to match the border
        this.physics.world.setBounds(borderX + 200, borderY + 250, borderW - 390 , borderH- 1500);

        // Collide with the world bounds to prevent the cat from crossing the border
        this.cat.setCollideWorldBounds(true);

        // Define classroom boundaries
        const boundaries = [
            { x: borderX + 200, y: borderY + 250, width: 3180, height: 2740 }, // Classroom 1
            { x: borderX + 280  + borderW, y: borderY + 250 + borderH -2500, width: 3200, height: 1150}, //top right machines
            { x: 1240, y: borderY + 250 + borderH -2500, width: 1000, height: 1150},
            { x: 2100, y: borderY + 250 + borderH -2550, width: 55, height: 400},
            { x: 2080, y: borderY + 250 + borderH -2500, width: 10, height: 1150}
        ];

        // Create static group for barriers
        const barriers = this.physics.add.staticGroup();

        // Add barriers to the static group and draw the boundaries
        boundaries.forEach(boundary => {
            const rect = this.add.rectangle(boundary.x, boundary.y, boundary.width, boundary.height);
            barriers.add(rect);
        });

        // Enable physics for barriers
        this.physics.add.existing(barriers);

        // Set up collision between cat and barriers
        this.physics.add.collider(this.cat, barriers);

        // Define the designated place for the terminated talk
        this.terminatedTalkPlace = [
            { x: 2500,
              y: 900,
              width: 100,
              height: 400 },
            { x: 1700, 
              y: 300, 
              width: 300, 
              height: 100 },
            { x: -1000, 
              y: 900, 
              width: 100, 
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

            if (this.controlIndex == 1){
                this.student1.play('student1_talk');
                this.student2.play('student2_talk');
            }            
        }

        //
        if(this.dialogComplete){
            if (this.controlIndex == 2){
                this.moveStudent = true;
                this.student1.play('student1_walk');
                this.student2.play('student2_walk');
            }else if(this.controlIndex == 3){
                this.scene.start('Game1p5');
            }
            this.terminatedTalkTriggered = false;
            this.dialogComplete = false;
        }

        //make the student leave after the talk
        if(this.moveStudent){
            this.tweens.add({
                targets: [this.student1, this.student2], // Ensure targets are properly specified
                x: '-= 500', // Move to the left by 1000 units
                duration: 1300, // Duration of the walk in milliseconds
                ease: 'Power1', // Easing function
                onComplete: () => {
                    this.student1.destroy(); // Remove student1
                    this.student2.destroy(); // Remove student2
                    this.moveStudent = false; // Reset the moveStudent flag
                }
            });
        };
       
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

        if((this.DialogSectionIndex == 1 && this.currentDialogIndex > 2) || (this.DialogSectionIndex != 1 && this.currentDialogIndex < 2)){
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