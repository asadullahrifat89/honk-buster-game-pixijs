import { BitmapFont, BitmapText, Container } from "pixi.js";

export class GameScoreBar {

	private scoreText: BitmapText;
	private score: number = 0;

	constructor(scene: Container) {
		
		BitmapFont.from("gameplay", {
			fill: "#ffffff",
			fontFamily: "gameplay",
			fontSize: 26,
			align: "center",
		});

		this.scoreText = new BitmapText("o", {
			fontName: "gameplay",
			fontSize: 26,
			align: "center",
		});

		scene.addChild(this.scoreText);
	}

	reposition(x: number, y: number) {
		this.scoreText.x = x - this.scoreText.width / 2;
		this.scoreText.y = y;
	}

	reset() {
		this.score = 0;
		this.scoreText.text = this.score.toString();
	}

	gainScore(score: number) {
		this.score += score;
		this.scoreText.text = this.score.toString();
	}

	looseScore(score: number) {
		if (this.score > 1) {
			this.score -= score;
			this.scoreText.text = this.score.toString();
		}
	}

	getScore(): number {
		return this.score;
	}
}

