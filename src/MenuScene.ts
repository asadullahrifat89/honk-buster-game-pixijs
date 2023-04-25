import { Container } from "pixi.js";
import { IScene } from "./IScene";


export class MenuScene extends Container implements IScene {

    constructor() {
        super();
    }

    public update(_framesPassed: number) { }
    public resize(_scale: number): void { }
}
