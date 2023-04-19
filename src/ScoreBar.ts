import { BitmapFont, BitmapText, Container } from "pixi.js";

export class ScoreBar extends Container {

	//#region Properties

	private _textBlock: BitmapText;
	private _score: number = 0;

	//#endregion

	//#region Ctor

	constructor() {
		super();

		// If you need to know, this is the expensive part. This creates the font atlas
		BitmapFont.from("gameplay", {
			fill: "#ffffff",
			fontFamily: "gameplay",
			fontSize: 26
		});

		this._textBlock = new BitmapText("000", {
			fontName: "gameplay",
			fontSize: 26,
			align: "center",
			//tint: 0xffffff
		});

		this.addChild(this._textBlock);
	}

	//#endregion

	//#region Methods

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

	//#endregion
}