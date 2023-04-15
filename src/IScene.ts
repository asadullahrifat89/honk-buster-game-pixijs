import { DisplayObject } from "pixi.js";

// This could have a lot more generic functions that you force all your scenes to have. Update is just an example.
// Also, this could be in its own file...

export interface IScene extends DisplayObject {
    update(framesPassed: number): void;

    // we added the resize method to the interface
    resize(scale: number): void;
}
