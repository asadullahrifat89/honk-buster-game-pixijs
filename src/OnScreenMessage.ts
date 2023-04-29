import { Container, Text } from "pixi.js";


export class OnScreenMessage {

	public isAnimating: boolean = false;

	private messageText: Text;
	private messageOnScreenDelay: number = 0;
	private readonly messageOnScreenDelayDefault: number = 20;

	constructor(scene: Container) {

		this.messageText = new Text("", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 26
		});

		this.disableRendering();
		scene.addChild(this.messageText);
	}

	disableRendering() {
		this.isAnimating = false;
		this.messageText.renderable = false;
	}

	enableRendering() {
		this.isAnimating = true;
		this.messageText.renderable = true;
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
	}

	getText(): string {
		return this.messageText.text;
	}
}