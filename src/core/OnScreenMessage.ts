﻿import { Container, Graphics, Text, Texture } from "pixi.js";
import { GameObjectSprite } from "./GameObjectSprite";


export class OnScreenMessage {

	public isAnimating: boolean = false;

	private messageContainer: Container;
	private messageGraphics: Graphics;
	private messageAuthor: GameObjectSprite;
	private messageText: Text;
	private messageOnScreenDelay: number = 0;
	private readonly messageOnScreenDelayDefault: number = 20;

	constructor(scene: Container) {

		this.messageContainer = new Container();

		this.messageAuthor = new GameObjectSprite(Texture.from("./images/character_maleAdventurer_talk.png"));
		this.messageAuthor.width = 192 / 1.5;
		this.messageAuthor.height = 256 / 1.5;
		this.messageAuthor.x = 0;
		this.messageAuthor.y = 0;
		this.messageAuthor.anchor.set(0.5);

		this.messageContainer.addChild(this.messageAuthor);

		this.messageGraphics = new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 250, 50, 10).endFill();
		this.messageGraphics.x = this.messageAuthor.width / 1.8;
		this.messageContainer.addChild(this.messageGraphics);

		this.messageText = new Text("", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 30
		});
		this.messageText.x = this.messageAuthor.width / 1.5;
		this.messageText.y = 5;
		this.messageContainer.addChild(this.messageText);

		this.disableRendering();
		scene.addChild(this.messageContainer);
	}

	disableRendering() {
		this.isAnimating = false;
		this.messageContainer.renderable = false;
	}

	enableRendering() {
		this.isAnimating = true;
		this.messageContainer.renderable = true;
	}

	reset() {
		this.messageOnScreenDelay = this.messageOnScreenDelayDefault;
	}

	depleteOnScreenDelay() {
		this.messageOnScreenDelay -= 0.1;
	}

	isDepleted() {
		return this.messageOnScreenDelay <= 0;;
	}

	setTitle(title: string, icon: Texture) {
		this.messageText.text = title;
		this.messageAuthor.setTexture(icon);

		this.messageContainer.removeChild(this.messageGraphics);
		this.messageGraphics = new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, this.messageText.width + 25, 50, 10).endFill();
		this.messageGraphics.x = this.messageAuthor.width / 1.8;
		this.messageContainer.addChildAt(this.messageGraphics, 0);
	}

	reposition(x: number, y: number) {
		this.messageContainer.x = x - this.messageContainer.width / 2;
		this.messageContainer.y = y /*- this.messageContainer.height / 2*/;
	}

	getText(): string {
		return this.messageText.text;
	}
}