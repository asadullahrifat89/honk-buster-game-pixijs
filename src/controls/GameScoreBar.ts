import { Text, Container, Graphics } from "pixi.js";
import { Constants } from "../Constants";

export class GameScoreBar {

	private scoreContainer: Container;
	private scoreText: Text;
	private scoreGraphics: Graphics;
	private score: number = 0;
	private prefix: string = "";

	constructor(scene: Container, prefix: string = "", score: number = 0) {

		this.prefix = prefix;
		this.score = score;
		this.scoreContainer = new Container();

		this.scoreText = new Text(this.prefix + this.score.toString(), {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: Constants.MESSAGE_BOX_TEXT_COLOR,
			fontSize: 20,
		});
		this.scoreText.x = 10;
		this.scoreText.y = 5;

		this.scoreGraphics = this.drawScoreGraphics();

		this.scoreContainer.addChild(this.scoreGraphics);
		this.scoreContainer.addChild(this.scoreText);

		scene.addChild(this.scoreContainer);
	}

	reposition(x: number, y: number) {
		this.scoreContainer.x = x;
		this.scoreContainer.y = y;
	}

	gainScore(score: number) {
		this.score += score;
		this.scoreText.text = this.prefix + this.score.toString();

		this.resetGraphics();
	}

	looseScore(score: number) {
		if (this.score > 1) {
			this.score -= score;
			this.scoreText.text = this.prefix + this.score.toString();

			this.resetGraphics();
		}
	}

	private resetGraphics() {
		this.scoreContainer.removeChild(this.scoreGraphics);
		this.scoreGraphics = this.drawScoreGraphics();
		this.scoreContainer.addChildAt(this.scoreGraphics, 0);
	}

	getScore(): number {
		return this.score;
	}

	private drawScoreGraphics(): Graphics {
		return new Graphics().beginFill(0xffffff).lineStyle(3, Constants.MESSAGE_BOX_BORDER_COLOR).drawRoundedRect(0, 0, this.scoreText.width + 20, this.scoreText.height + 5, 4).endFill();
	}
}

