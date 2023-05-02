import { Text, Container, Graphics } from "pixi.js";

export class GameScoreBar {

	private scoreContainer: Container;
	private scoreText: Text;
	private scoreGraphics: Graphics;
	private score: number = 0;

	constructor(scene: Container) {

		//BitmapFont.from("gameplay", {
		//	fill: "#2f3a5a",
		//	fontFamily: "gameplay",
		//	fontSize: 26,
		//	align: "center",
		//});

		//this.scoreText = new BitmapText("o", {
		//	fontName: "gameplay",
		//	fontSize: 26,
		//	align: "center",
		//});

		this.scoreContainer = new Container();

		this.scoreText = new Text("0", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#2f3a5a",
			fontSize: 26,
		});
		this.scoreText.x = 10;
		this.scoreText.y = 2.5;

		this.scoreGraphics = this.drawScoreGraphics();

		this.scoreContainer.addChild(this.scoreGraphics);		
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

		this.scoreContainer.removeChild(this.scoreGraphics);
		this.scoreGraphics = this.drawScoreGraphics();
		this.scoreContainer.addChildAt(this.scoreGraphics, 0);
	}

	looseScore(score: number) {
		if (this.score > 1) {
			this.score -= score;
			this.scoreText.text = this.score.toString();

			this.scoreContainer.removeChild(this.scoreGraphics);
			this.scoreGraphics = this.drawScoreGraphics();
			this.scoreContainer.addChildAt(this.scoreGraphics, 0);
		}
	}

	getScore(): number {
		return this.score;
	}

	private drawScoreGraphics(): Graphics {
		return new Graphics().beginFill(0xffffff).lineStyle(4, 0x2f3a5a).drawRoundedRect(0, 0, this.scoreText.width + 20, 35, 4).endFill();
	}
}

