import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.image("background", "public/assets/title/background.png");
        this.load.image("logo", "public/assets/title/success.png");

    }

    create() {
        this.scene.start("Preloader");
    }
}
//  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
//  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

