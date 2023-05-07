import { Container, Text, BlurFilter } from "pixi.js";
import { Constants, ConstructType, SoundType } from "../Constants";
import { Button } from "../controls/Button";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { IScene } from "../managers/IScene";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { GameTitleScene } from "./GameTitleScene";
import { ScreenOrientationScene } from "./ScreenOrientationScene";



export class GameOverScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;

	constructor() {
		super();

		this.uiContainer = new GameObjectContainer();
		this.uiContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.uiContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		this.addChild(this.uiContainer);

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		bg_sprite.filters = [new BlurFilter()];
		this.uiContainer.addChild(bg_sprite);

		const title = new Text("GAME OVER", {
			fontFamily: Constants.GAME_TITLE_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		const score = new Text("Score " + Constants.GAME_SCORE, {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 30,
			align: "center",
			fill: "#ffffff",
		});
		score.x = this.uiContainer.width / 2 - score.width / 2;
		score.y = (this.uiContainer.height / 2 - score.height / 2) - 60;
		this.uiContainer.addChild(score);

		const level = new Text("Level " + Constants.GAME_LEVEL, {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 28,
			align: "center",
			fill: "#ffffff",
		});
		level.x = this.uiContainer.width / 2 - level.width / 2;
		level.y = (this.uiContainer.height / 2 - level.height / 2);
		this.uiContainer.addChild(level);

		const button = new Button(() => {

			SoundManager.play(SoundType.OPTION_SELECT);
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new GameTitleScene());

		}).setText("Play Again");
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);

		SoundManager.play(SoundType.GAME_OVER);
	}

	public update(_framesPassed: number) {
		//TODO: check unlockables based on game score and level,
	}

	public resize(scale: number): void {

		if (SceneManager.width < SceneManager.height) {
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			this.uiContainer.scale.set(scale);
			this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		}
	}
}
