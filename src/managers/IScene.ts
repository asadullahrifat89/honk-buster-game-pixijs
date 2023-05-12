import { DisplayObject } from "pixi.js";

export interface IScene extends DisplayObject {

    // update method for scenes to process ticket events
    update(): void;

    // resize method for scenes to adopt to scaling
    resize(scale: number): void;
}
