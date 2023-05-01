import { BitmapFont, BitmapText, Container, Graphics } from "pixi.js";

export class GameScoreBar {

	private scoreContainer: Container;
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

		this.scoreContainer = new Container();

		const graphics = new Graphics().beginFill(0x5FC4F8).lineStyle(3, 0x2f3a5a).drawRoundedRect(0, 2.5, 80, 30, 3).endFill();
		this.scoreContainer.addChild(graphics);

		this.scoreText.x = 10;
		this.scoreText.y = 0.5;

		this.scoreContainer.addChild(this.scoreText);

		scene.addChild(this.scoreContainer);
	}

	reposition(x: number, y: number) {
		this.scoreContainer.x = x - this.scoreContainer.width / 2;
		this.scoreContainer.y = y;
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

