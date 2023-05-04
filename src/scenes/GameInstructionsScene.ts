import { BlurFilter, Container, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { GameTitleScene } from "./GameTitleScene";


export class GameInstructionsScene extends Container implements IScene {
	private uiContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

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
		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);
		this.uiContainer.addChild(this.bg_container);

		// title
		const subTitle = new Text("How to Play", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 42,
		});
		subTitle.x = this.uiContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.uiContainer.height / 2 - subTitle.height / 2) - 200;
		this.uiContainer.addChild(subTitle);

		// new game button
		const newGameButton = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			SceneManager.isNavigating = true;
		}).setText("Okay");
		newGameButton.setPosition(this.uiContainer.width / 2 - newGameButton.width / 2, (this.uiContainer.height / 2 - newGameButton.height / 2) + 250);
		this.uiContainer.addChild(newGameButton);
	}

	public update(_framesPassed: number) {

		if (SceneManager.isNavigating) {
			this.uiContainer.alpha -= 0.06;

			if (this.uiContainer.alpha <= 0) {
				this.removeChild(this.uiContainer);
				SceneManager.changeScene(new GameTitleScene());
				SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC, 0.5, true);
			}
		}
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
