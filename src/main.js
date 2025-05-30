import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { Game1p5 } from './scenes/Game1p5';
import { Game2 } from './scenes/Game2';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 2360,
    height: 1640,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        Game1p5,
        Game2,
        Scene1,
        Scene2,
        GameOver
    ],
    physics: {
        default: 'arcade', // Choose the physics system you want to use (e.g., Arcade Physics)
        arcade: {
            gravity: { y: 0 }, // Add gravity if necessary
            debug: false // Set to true for debugging purposes
        }
    }
};

// const game = new Phaser.Game(config);
export default new Phaser.Game(config);
