import { BitmapFont, BitmapText, Container } from "pixi.js";

export class GameScoreBar {

	private _textBlock: BitmapText;
	private _score: number = 0;

	constructor(scene: Container) {
		
		BitmapFont.from("gameplay", {
			fill: "#ffffff",
			fontFamily: "gameplay",
			fontSize: 26,
			align: "center",
		});

		this._textBlock = new BitmapText("o", {
			fontName: "gameplay",
			fontSize: 26,
			align: "center",
		});

		scene.addChild(this._textBlock);
	}

	reposition(x: number, y: number) {
		this._textBlock.x = x - this._textBlock.width / 2;
		this._textBlock.y = y;
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

