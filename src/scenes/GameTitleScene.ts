import { Container, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { PlayerCharacterSelectionScene } from "./PlayerCharacterSelectionScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";



export class GameTitleScene extends Container implements IScene {

	private sceneContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	constructor() {
		super();

		this.sceneContainer = new GameObjectContainer();
		this.sceneContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.sceneContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.sceneContainer.setPosition(SceneManager.width / 2 - this.sceneContainer.width / 2, SceneManager.height / 2 - this.sceneContainer.height / 2);		
		this.addChild(this.sceneContainer);

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);

		this.sceneContainer.addChild(this.bg_container);

		const title = new Text("HONK BUSTERS", {
			fontFamily: Constants.GAME_TITLE_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 42
		});
		title.x = this.sceneContainer.width / 2 - title.width / 2;
		title.y = (this.sceneContainer.height / 2 - title.height / 2) - 120;
		this.sceneContainer.addChild(title);

		const subTitle = new Text("A honk pollution fighting saga", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 19,
		});
		subTitle.x = this.sceneContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.sceneContainer.height / 2 - subTitle.height / 2) - 65;
		this.sceneContainer.addChild(subTitle);

		const button = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			SceneManager.isNavigating = true;
		}).setText("New Game");
		button.setPosition(this.sceneContainer.width / 2 - button.width / 2, this.sceneContainer.height / 2 - button.height / 2);
		this.sceneContainer.addChild(button);
	}

	public update(_framesPassed: number) {

		if (SceneManager.isNavigating) {
			this.sceneContainer.alpha -= 0.06;

			if (this.sceneContainer.alpha <= 0) {
				this.removeChild(this.sceneContainer);
				SceneManager.changeScene(new PlayerCharacterSelectionScene());
				SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC, 0.5, true);
			}
		}
		else {
			this.bg_container.hover();
		}
	}

	public resize(scale: number): void {

		if (SceneManager.width < SceneManager.height) {
			this.removeChild(this.sceneContainer);
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			this.sceneContainer.scale.set(scale);
			this.sceneContainer.setPosition(SceneManager.width / 2 - this.sceneContainer.width / 2, SceneManager.height / 2 - this.sceneContainer.height / 2);
		}		
	}
}

