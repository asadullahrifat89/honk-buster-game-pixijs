import { BitmapFont, BitmapText, Container, Graphics } from "pixi.js";

export class GameScoreBar {

	private scoreContainer: Container;
	private scoreText: BitmapText;
	private score: number = 0;

	constructor(scene: Container) {

		BitmapFont.from("gameplay", {
			fill: "#ffffff",
			fontFamily: "gameplay",
			fontSize: 30,
			align: "center",
		});

		this.scoreText = new BitmapText("o", {
			fontName: "gameplay",
			fontSize: 30,
			align: "center",
		});

		this.scoreContainer = new Container();

		const graphics = new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 80, 35, 3).endFill();
		this.scoreContainer.addChild(graphics);

		this.scoreText.x = 10;

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

