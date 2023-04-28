import { Container, Text } from "pixi.js";


export class InGameMessage {

	//private _textBlock: BitmapText;
	private _textBlock: Text;
	public isAnimating: boolean = false;

	private _messageOnScreenDelay: number = 0;
	private readonly _messageOnScreenDelayDefault: number = 20;

	constructor(scene: Container) {

		//BitmapFont.from("gameplay", {
		//	fill: "#ffffff",
		//	fontFamily: "gameplay",
		//	fontSize: 26,
		//	align: "center",
		//});

		//this._textBlock = new BitmapText("000", {
		//	fontName: "gameplay",
		//	fontSize: 26,
		//	align: "center",
		//});

		this._textBlock = new Text("", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 26
		});

		this.disableRendering();
		scene.addChild(this._textBlock);
	}

	disableRendering() {
		this.isAnimating = false;
		this._textBlock.renderable = false;
	}

	enableRendering() {
		this.isAnimating = true;
		this._textBlock.renderable = true;
	}

	reset() {
		this._messageOnScreenDelay = this._messageOnScreenDelayDefault;
	}

	depleteOnScreenDelay() {
		this._messageOnScreenDelay -= 0.1;
	}

	isDepleted() {
		return this._messageOnScreenDelay <= 0;;
	}

	setTitle(title: string) {
		this._textBlock.text = title;
	}

	reposition(x: number, y: number) {
		this._textBlock.x = x - this._textBlock.width / 2;
		this._textBlock.y = y - this._textBlock.height / 2;
	}

	getText(): string {
		return this._textBlock.text;
	}
}
