import { BitmapFont, BitmapText, Container } from "pixi.js";


export class InGameMessage {

	private _textBlock: BitmapText;
	public isAnimating: boolean = false;

	private _messageOnScreenDelay: number = 0;
	private readonly _messageOnScreenDelayDefault: number = 20;

	constructor(scene: Container) {

		// If you need to know, this is the expensive part. This creates the font atlas
		BitmapFont.from("gameplay", {
			fill: "#ffffff",
			fontFamily: "gameplay",
			fontSize: 26,
			align: "center",
		});

		this._textBlock = new BitmapText("000", {
			fontName: "gameplay",
			fontSize: 26,
			align: "center",
		});

		this.disableRendering();
		scene.addChild(this._textBlock);
	}

	disableRendering() {
		this._textBlock.renderable = false;
		this.isAnimating = false;
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
}
