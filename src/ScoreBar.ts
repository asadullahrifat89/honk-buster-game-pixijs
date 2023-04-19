import { BitmapFont, BitmapText, Container } from "pixi.js";

export class ScoreBar extends Container {

	private _textBlock: BitmapText;
	private _score: number = 0;

	constructor() {
		super();

		// If you need to know, this is the expensive part. This creates the font atlas
		BitmapFont.from("gameplay", {
			fill: "#ffffff", // White, will be colored later
			fontFamily: "gameplay",
			fontSize: 28
		});

		this._textBlock = new BitmapText("000", {
			fontName: "gameplay",
			fontSize: 28, // Making it too big or too small will look bad
			tint: 0xffffff
		});

		this.addChild(this._textBlock);
	}

	reset() {
		this._score = 0;
		this._textBlock.text = this._score.toString();
	}

	gainScore(score: number) {
		this._score += score;
		this._textBlock.text = this._score.toString();
	}

	looseScore(score: number) {
		if (this._score > 1) {
			this._score -= score;
			this._textBlock.text = this._score.toString();
		}
	}

	getScore(): number {
		return this._score;
	}
}