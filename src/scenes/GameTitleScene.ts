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

		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);

		this.uiContainer.addChild(this.bg_container);

		const title = new Text("HONK BUSTERS", {
			fontFamily: Constants.GAME_TITLE_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 42
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		const subTitle = new Text("A honk pollution fighting saga", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 19,
		});
		subTitle.x = this.uiContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.uiContainer.height / 2 - subTitle.height / 2) - 65;
		this.uiContainer.addChild(subTitle);

		const button = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			SceneManager.isNavigating = true;
		}).setText("New Game");
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height / 2 - button.height / 2);
		this.uiContainer.addChild(button);
	}

	public update(_framesPassed: number) {

		if (SceneManager.isNavigating) {
			this.uiContainer.alpha -= 0.06;

			if (this.uiContainer.alpha <= 0) {
				this.removeChild(this.uiContainer);
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
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			this.uiContainer.scale.set(scale);
			this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		}		
	}
}

