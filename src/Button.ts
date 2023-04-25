﻿import { BitmapText, Container, BitmapFont, DisplayObject } from "pixi.js";


export class Button extends Container {

    constructor(background: DisplayObject, text: string, onPressed: any) {
        super();

        // If you need to know, this is the expensive part. This creates the font atlas
        BitmapFont.from("gameplay", {
            fill: "#ffffff",
            fontFamily: "gameplay",
            fontSize: 26,
            align: "center",
        });

        this.interactive = true;

        this.addChild(background);

        const buttonText = new BitmapText(text, {
            fontName: "gameplay",
            fontSize: 26,
            align: "center",
        });

        buttonText.x = this.width / 2 - buttonText.width / 2;
        buttonText.y = (this.height / 2 - buttonText.height / 2) + 2;

        this.addChild(buttonText);

        this.on("pointertap", onPressed, this);
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
