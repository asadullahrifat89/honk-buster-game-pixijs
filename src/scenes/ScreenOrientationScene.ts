import { Container, Text } from "pixi.js";
import { IScene } from "../managers/IScene";
import { SceneManager } from "../managers/SceneManager";
import { GameTitleScene } from "./GameTitleScene";


export class ScreenOrientationScene extends Container implements IScene {

    private changeOrienationText: Text;

    constructor() {
        super();

        this.changeOrienationText = new Text("Pls Change Screen Orientation", {
            fontFamily: "diloworld",
            fontSize: 18,
            align: "center",
            fill: "#ffffff",
        });
        this.changeOrienationText.x = SceneManager.width / 2 - this.changeOrienationText.width / 2;
        this.changeOrienationText.y = (SceneManager.height / 2 - this.changeOrienationText.height / 2);
        this.changeOrienationText.alpha = 0;

        this.addChild(this.changeOrienationText);
    }

    resize(_scale: number): void {

        // check if screen orientation is in correct mode
        if (SceneManager.width < SceneManager.height) {

            this.changeOrienationText.alpha = 1;
        }
        else {

            SceneManager.changeScene(new GameTitleScene());
        }
    }

    update(_framesPassed: number): void {
        // To be a scene we must have the update method even if we don't use it.
    }
}
