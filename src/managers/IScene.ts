import { DisplayObject } from "pixi.js";

export interface IScene extends DisplayObject {
    
    update(framesPassed: number): void;

    // we added the resize method to the interface
    resize(scale: number): void;
}
