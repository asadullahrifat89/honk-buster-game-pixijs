import { Container, Text, BlurFilter } from "pixi.js";
import { Constants, ConstructType, SoundType } from "../Constants";
import { Button } from "../controls/Button";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { IScene } from "../managers/IScene";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { PlayerCharacterSelectionScene } from "./PlayerCharacterSelectionScene";
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

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));
		sprite.x = 0;
		sprite.y = 0;
		sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		sprite.filters = [new BlurFilter()];
		this.uiContainer.addChild(sprite);

		const title = new Text("Game Over", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		const subTitle = new Text("Score " + Constants.GAME_SCORE, {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 32,
			align: "center",
			fill: "#ffffff",
		});
		subTitle.x = this.uiContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.uiContainer.height / 2 - subTitle.height / 2) - 60;
		this.uiContainer.addChild(subTitle);

		const button = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new PlayerCharacterSelectionScene());
		}).setText("Play Again");
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);

		SoundManager.play(SoundType.GAME_OVER);
	}

	public update(_framesPassed: number) {
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
