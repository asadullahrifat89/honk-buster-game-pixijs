import { Container, Text, Texture } from "pixi.js";
import { GameObjectSprite } from "./GameObjectSprite";


export class OnScreenMessage {

	public isAnimating: boolean = false;

	private messageAuthor: GameObjectSprite;
	private messageText: Text;
	private messageOnScreenDelay: number = 0;
	private readonly messageOnScreenDelayDefault: number = 20;

	constructor(scene: Container) {

		this.messageAuthor = new GameObjectSprite(Texture.from("./images/character_maleAdventurer_talk.png"));
		this.messageAuthor.width = 192;
		this.messageAuthor.height = 256;
		scene.addChild(this.messageAuthor);

		this.messageText = new Text("", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 30
		});

		this.disableRendering();
		scene.addChild(this.messageText);
	}

	disableRendering() {
		this.isAnimating = false;
		this.messageText.renderable = false;
		this.messageAuthor.renderable = false;
	}

	enableRendering() {
		this.isAnimating = true;
		this.messageText.renderable = true;
		this.messageAuthor.renderable = true;
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

	setTitle(title: string) {
		this.messageText.text = title;
	}

	reposition(x: number, y: number) {
		this.messageText.x = x - this.messageText.width / 2;
		this.messageText.y = y - this.messageText.height / 2;

		this.messageAuthor.x = x - this.messageAuthor.width * 3;
		this.messageAuthor.y = y * 2 - this.messageAuthor.height + 50;
	}

	getText(): string {
		return this.messageText.text;
	}
}