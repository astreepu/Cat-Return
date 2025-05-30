import { Scene } from 'phaser';

export class Game2 extends Scene {
    constructor() {
        super('Game2');
        this.isHurt = false; // Flag to indicate if hurt animation is playing
        this.isInvulnerable = false; // Flag to indicate if cat is invulnerable
        this.health = 9; // Initial health value
        this.hearts = []; // Array to store heart sprites
        this.bosshealth = 30;
        this.bossPhaseInterval = 5000; // Interval to update boss phase
        this.attackSpeed = 1; // Multiplier for attack speed
        this.teleporting = false; // Flag to indicate if teleporting
    }

    create() {
        if (this.sound.get('Summer')) {
            this.sound.get('Summer').stop();
        }
        this.battleMusic = this.sound.add('battle', { loop: true });
        this.battleMusic.play();
        //---------------------------------------------------------
        this.cameras.main.setBackgroundColor('#4d4b4c');
        // Start the scene with a fade-in effect
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const map = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'lab'); // Center position based on your screen size
        
        // Set the image to fill the screen
        map.displayWidth = this.sys.game.config.width;
        map.displayHeight = this.sys.game.config.height;
        map.setOrigin(0.5, 0.5); // Center the image
        //-------------------------------------------------------------
        // Play background image animation
        map.play('lab');
        //----------------------------------------------------------
        this.attacks = this.physics.add.group();
        //----------------------------------------------------------
        // Add the cat sprite and scale it down
        this.cat = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'cat'); // Start cat at the center
        this.cat.setScale(1); // Scale the cat down
        this.cat.play('idle1'); // Play the idle1 animation
        // Set cat physics properties
        this.cat.setCollideWorldBounds(true);
        this.cat.body.setGravityY(3000); // Apply gravity to the cat
        this.cat.body.setBounce(0.2); // Add slight bounce to the cat

        this.cat.setSize(100, 258); // Set a custom hitbox size (width, height)
        this.cat.setOffset(110, 60); // Offset the hitbox if needed
        //----------------------------------------------------------
        // Set up WASD keys for movement
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE, // Add space key for jump
            charge: Phaser.Input.Keyboard.KeyCodes.Q, // Add Q key for liying charge
            power: Phaser.Input.Keyboard.KeyCodes.E // Add E key for liying power
        });
        //----------------------------------------------------------
        // Load the health image and create a sprite
        for (let i = 0; i < this.health; i++) {
            const heart = this.add.image(100 + i * 100, 50, 'health');
            heart.setScale(2); // Adjust scale as needed
            this.hearts.push(heart);
        }

        //----------------------------------------------------------
        // Create borders
        const borderWidth = 10; // Adjust the width of the border as needed
        const borderX = map.x - map.displayWidth / 2 - borderWidth / 2;
        const borderY = map.y - map.displayHeight / 2 - borderWidth / 2;
        const borderW = map.displayWidth + borderWidth;
        const borderH = map.displayHeight + borderWidth;

        const graphics = this.add.graphics();
        graphics.lineStyle(borderWidth, 0xffffff); // Set line color to white and width
        graphics.strokeRect(borderX, borderY - 100, borderW, borderH);

        // Set world bounds to match the border
        this.physics.world.setBounds(borderX, borderY - 100, borderW, borderH);

        // Add a ground platform for the cat to stand on
        const ground = this.physics.add.staticGroup();
        ground.create(this.cameras.main.centerX, 1700, 'ground').setScale(10).refreshBody();

        const ground2 = this.physics.add.staticGroup();

        const ground2_sprite = ground2.create(this.cameras.main.centerX, this.cameras.main.centerY+250, 'ground2')

        ground2_sprite.setScale(1).refreshBody();
        ground2_sprite.play('ground2');
        

        // Collide the cat with the ground
        this.physics.add.collider(this.cat, ground);
        this.physics.add.collider(this.cat, ground2);
        // Create a bullet group
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet'
        });

        // Configure bullets to check world bounds and kill out of bounds
        this.bullets.children.each(function(bullet) {
            bullet.body.checkWorldBounds = true;
            bullet.body.outOfBoundsKill = true;
        }, this);

        // Add event listener for firing bullets on pointer down
        this.input.on('pointerdown', this.fireBullet, this);

        // Add liying sprite and play idle animation
        this.liying = this.physics.add.sprite(this.cameras.main.centerX - 800, this.cameras.main.centerY + 200, 'liying');
        this.liying.setScale(2.5); // Adjust the scale as needed
        this.liying.play('liying_idle'); // Play the idle animation for liying
        this.liying.setSize(200, 600); // Set custom width and height for the hitbox
        this.liying.setOffset(25, 50);

        this.physics.add.collider(this.cat, this.liying, this.handleCatLiyingCollision, null, this);
        // Add event listeners for Q and E keys
        this.input.keyboard.on('keydown-Q', this.attack3, this);
        this.input.keyboard.on('keydown-E', this.attack2, this);

        if(this.bosshealth > 0){
            this.time.addEvent({
                delay: this.bossPhaseInterval,
                callback: this.bossPhase,
                callbackScope: this,
                loop: true
            });
        }
        
        this.cat.isJumpingUp = false;
    }

    update() {
        const speed = 500; // Adjust the speed as needed

        if (!this.isHurt) { // Only allow movement if not hurt
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

            // Jump when space is pressed and the cat is on the ground
            if (this.cursors.jump.isDown && this.cat.body.touching.down) {
                this.cat.setVelocityY(-1800); // Adjust the jump force as needed
            }
            

            if (this.cat.body.velocity.x === 0 && this.cat.body.touching.down) {
                this.cat.play('idle1', true);
            }
            
        }

        this.physics.add.collider(this.cat, this.attacks, this.handleAttackCollision, null, this);
    }

    bossPhase() {
        if (this.bosshealth >= 20) {
            console.log('Boss Phase 1');
            this.attackSpeed = 1;
            this.time.delayedCall(1000 / this.attackSpeed, this.attack2, [], this); // Launch attack 2
        } else if (this.bosshealth >= 10) {
            console.log('Boss Phase 2');
            this.attackSpeed = 1.5;
            this.time.delayedCall(1000 / this.attackSpeed, this.attack2, [], this); // Launch attack 2
            this.time.delayedCall(3000 / this.attackSpeed, this.attack3, [], this); // Launch attack 3
        } else if (this.bosshealth >=0){
            console.log('Boss Phase 3');
            this.attackSpeed = 2;
            this.time.delayedCall(1000 / this.attackSpeed, this.attack2, [], this); // Launch attack 2
            this.time.delayedCall(3000 / this.attackSpeed, this.attack3, [], this); // Launch attack 3
            this.teleport();
        }else{
            this.liying.play('liying_hurt');
        }
    }

    teleport() {
        if (!this.teleporting) {
            this.teleporting = true;
            this.time.delayedCall(2000, () => {
                if (Phaser.Math.Between(0, 100) < 50) { // Adjust the probability as needed
                    this.liying.x = this.cameras.main.width - this.liying.x;
                    this.liying.flipX = !this.liying.flipX;
                }
                this.teleporting = false;
            });
        }
    }

    updateHealth() {
        // Update heart sprites based on current health
        for (let i = 0; i < this.hearts.length; i++) {
            if (i < this.health) {
                this.hearts[i].setAlpha(1); 
            } else {
                this.hearts[i].setAlpha(0); 
            }
        }

        // Check if game over
        if (this.health <= 0) {
            console.log('gameover');            

            // Add black overlay
            const overlay = this.add.graphics();
            overlay.fillStyle(0x000000, 1); // Black color with full opacity
            overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
            overlay.setDepth(10); // Ensure it is above all other sprites
            
            // Add restart text
            const restartText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, '重修就好:D\n\n\nRestart', {
                fontSize: '64px',
                fill: '#ffffff',
                align: 'center',
                lineSpacing: 20 // Adjust line spacing if necessary
            });
            restartText.setOrigin(0.5);
            restartText.setDepth(11); // Ensure it is above the overlay
        
            // Make the restart text interactive
            restartText.setInteractive();
            restartText.on("pointerover", () => {
                restartText.setScale(1.05);
            });
            restartText.on("pointerout", () => {
                restartText.setScale(1);
            });
            restartText.on('pointerdown', () => {
                this.resetGame();
                this.scene.restart();
            });
        
            // Hide other elements
            this.cat.setVisible(false);
            this.liying.setVisible(false);
            this.hearts.forEach(heart => heart.setVisible(false));
        }
        
    }
    // Add this method to your scene
    resetGame() {
        this.isHurt = false; // Flag to indicate if hurt animation is playing
        this.isInvulnerable = false; // Flag to indicate if cat is invulnerable
        this.health = 9; // Initial health value
        this.hearts = []; // Array to store heart sprites
        this.bosshealth = 30;
        this.bossPhaseInterval = 5000; // Interval to update boss phase
        this.attackSpeed = 1; // Multiplier for attack speed
        this.teleporting = false; // Flag to indicate if teleporting
        this.cat.setVisible(true); // Ensure the cat is visible again
        this.liying.setVisible(true); // Ensure the boss is visible again
        this.hearts.forEach(heart => heart.setVisible(true)); // Ensure hearts are visible again
        
        // Reset positions and states of other elements as needed
        // Example:
        this.cat.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
        this.liying.setPosition(this.cameras.main.centerX - 800, this.cameras.main.centerY + 200);
        // Reset other game-specific variables and states as needed
    }

    handleCatLiyingCollision(cat, liying) {
        if (!this.isInvulnerable) {
            console.log('Cat touched Liying');
            this.health--; // Decrease health
            this.updateHealth(); // Update health display
            this.isHurt = true; // Set hurt flag
            this.liying.setVelocity(0);
            this.cat.setVelocityX(500); 
    
            // Play hurt animation or perform other actions as needed
            cat.play('hurt', true);
    
            // Set a delay to reset invulnerability and hurt state
            this.time.delayedCall(300, () => {
                this.isInvulnerable = false; // Reset invulnerability
                this.isHurt = false; // Reset hurt state
            });
        }
    }

    fireBullet(pointer) {
        if (this.time.now < (this.lastFiredTime || 0) + 300) {
            // Ignore the click if fired too soon (e.g., within 300ms)
            return;
        }
    
        // Calculate the bullet spawn position
        const spawnX = this.cat.x + 10;
        const spawnY = this.cat.y + 100;
    
        // Get a bullet from the bullet group
        const bullet = this.bullets.get(spawnX, spawnY);
    
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
    
            // Adjust the size of the bullet
            bullet.setScale(5); // Set the scale as needed
    
            // Play bullet animation
            bullet.play('bullet', true);
    
            // Set the bullet's direction based on cat's facing direction
            const bulletSpeed = 1000;
            if (this.cat.flipX) {
                bullet.setVelocityX(-bulletSpeed); // Fire bullet to the left
                bullet.setFlipX(true); // Flip the bullet sprite
            } else {
                bullet.setVelocityX(bulletSpeed); // Fire bullet to the right
                bullet.setFlipX(false); // Reset flip for right direction
            }
    
            this.lastFiredTime = this.time.now; // Record the last fired time
    
            // Check for collision with boss
            this.physics.add.collider(bullet, this.liying, (bullet, liying) => {
                this.attackboss(bullet, liying);
                bullet.destroy(); // Destroy bullet immediately on collision
            });
    
            // Destroy bullet after 4 seconds if it doesn't collide with anything
            this.time.delayedCall(4000, () => {
                bullet.destroy();
            });
        }
    }

    attackboss(bullet, boss){
        this.bosshealth --;
        this.liying.play('liying_hurt')
        this.time.delayedCall(500, () => {
            this.liying.play('liying_idle');
        });
        console.log(this.bosshealth);
        bullet.destroy()
        this.liying.setVelocity(0);
        if (this.bosshealth <= 0) {
            console.log('gameover (boss is dead)');
            
            this.time.delayedCall(8000, () => {
                this.scene.start('GameOver');
            });
        }
    }

    attack3() {
        // Play animation first
        this.liying.play('liying_charge'); 
        this.time.delayedCall(2000, () => {
            this.liying.play('liying_idle');
            let random = Phaser.Math.Between(0, 100)
            

            if (random < 30) { // Adjust the probability as needed
                let attackX = this.liying.x + 1800;
                let attackY = this.liying.y-400;
                if (this.liying.flipX) {
                    attackX = this.liying.x - 1800; // Adjust the starting position if liying is flipped
                }
                const attack = this.physics.add.sprite(attackX, attackY, 'attack3');
                attack.setScale(10); // Adjust the scale as needed
                attack.play('liying_att3'); // Play the attack animation
                attack.flipX = this.liying.flipX;
    
                this.time.delayedCall(1000, () => {
                    this.physics.add.collider(this.cat, attack, this.handleAttackCollision3, null, this);
                });
                // Destroy the attack after a certain time (e.g., 1 second)
                this.time.delayedCall(1700, () => {
                    attack.destroy();
                });
            }else {
                let attackX = this.liying.x + 1800;
                let attackY = this.liying.y + 350;
                if (this.liying.flipX) {
                    attackX = this.liying.x - 1800; // Adjust the starting position if liying is flipped
                }
                const attack = this.physics.add.sprite(attackX, attackY, 'attack3');
                attack.setScale(10); // Adjust the scale as needed
                attack.play('liying_att3'); // Play the attack animation
                attack.flipX = this.liying.flipX;
                
                attack.setSize(2000, 200); // Set custom width and height for the hitbox
                attack.setOffset(25, 50);
    
                this.time.delayedCall(1000, () => {
                    this.physics.add.collider(this.cat, attack, this.handleAttackCollision3, null, this);
                });
                // Destroy the attack after a certain time (e.g., 1 second)
                this.time.delayedCall(1700, () => {
                    attack.destroy();
                });
            }
            

        });

    }
    attack2() {
        // Define the action for liying power
        console.log('Liying Power activated');
        this.liying.play('liying_power'); // Assuming you have an animation named 'liying_power'
        this.time.delayedCall(700, () => {
            this.liying.play('liying_idle');
            // Create three attack sprites with a delay between each
            for (let i = 0; i < 3; i++) {
                this.time.delayedCall(i * 1000, () => {
                    const attack = this.physics.add.sprite(this.liying.x, this.liying.y, 'attack2');
                    attack.setScale(10); // Adjust the scale as needed
                    attack.play('liying_att2'); // Play the attack animation

                    //check if boss is flipped
                    attack.flipX = this.liying.flipX;
        
                    // Calculate the direction towards the cat
                    const dx = this.cat.x - attack.x;
                    const dy = this.cat.y - attack.y;
                    const angle = Math.atan2(dy, dx);
        
                    // Set attack velocity towards the cat's direction
                    const attackSpeed = 500;
                    attack.setVelocity(attackSpeed * Math.cos(angle), attackSpeed * Math.sin(angle));
        
                    // Create a collider between attack and cat sprites
                    this.physics.add.collider(this.cat, attack, this.handleAttackCollision2, null, this);
        
                    // Destroy the attack after a certain time (e.g., 1 second)
                    this.time.delayedCall(3500, () => {
                        attack.destroy();
                    });
                });
            }
        });
    }
    
    handleAttackCollision2(cat, attack) {
        if (this.isInvulnerable) {
            return; // Ignore collision if cat is invulnerable
        }

        console.log('Collision detected');
        attack.destroy();

        // Clear any current animation before playing the hurt animation
        cat.anims.stop();
        console.log('Animation stopped, playing hurt');
        this.health--;
        this.updateHealth();

        this.isHurt = true; // Set the hurt flag
        this.isInvulnerable = true; // Set the invulnerable flag
        cat.play('hurt', true);

        // Set a delay to transition back to idle1 animation
        this.time.delayedCall(300, () => {
            console.log('Hurt animation complete, transitioning to idle1');
            this.isHurt = false; // Reset the hurt flag
            cat.play('idle1');

            // Set a delay to reset invulnerability
            this.time.delayedCall(1000, () => {
                this.isInvulnerable = false; // Reset the invulnerable flag after 2 seconds
            });
        });
    }
    handleAttackCollision3(cat, attack) {
        if (this.isInvulnerable) {
            return; // Ignore collision if cat is invulnerable
        }

        console.log('Collision detected');

        // Clear any current animation before playing the hurt animation
        cat.anims.stop();
        console.log('Animation stopped, playing hurt');

        this.isHurt = true; // Set the hurt flag
        this.isInvulnerable = true; // Set the invulnerable flag
        cat.play('hurt', true);
        this.health--;
        this.updateHealth();

        // Set a delay to transition back to idle1 animation
        this.time.delayedCall(300, () => {
            console.log('Hurt animation complete, transitioning to idle1');
            this.isHurt = false; // Reset the hurt flag
            cat.play('idle1');
            attack.destroy();

            // Set a delay to reset invulnerability
            this.time.delayedCall(1000, () => {
                this.isInvulnerable = false; // Reset the invulnerable flag after 2 seconds
            });
        });
    }
}
