import { Container, Graphics, Text } from "pixi.js";
import { Button } from "./Button";
import { Constants, ConstructType, SoundType } from "./Constants";
import { GameObjectContainer } from "./GameObjectContainer";
import { GameObjectSprite } from "./GameObjectSprite";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "./IScene";
import { PlayerSelectionScene } from "./PlayerSelectionScene";
import { SceneManager } from "./SceneManager";
import { SoundManager } from "./SoundManager";


export class GameTitleScene extends Container implements IScene {

	private sceneContainer: GameObjectContainer;

	constructor() {
		super();

		this.sceneContainer = new GameObjectContainer(0);
		this.sceneContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.sceneContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.sceneContainer.setPosition(SceneManager.width / 2 - this.sceneContainer.width / 2, SceneManager.height / 2 - this.sceneContainer.height / 2);
		//this.sceneContainer.filters = [new DropShadowFilter()];
		this.addChild(this.sceneContainer);

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));
		sprite.x = 0;
		sprite.y = 0;
		sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.sceneContainer.addChild(sprite);

		const title = new Text("Honk Buster", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 45
		});
		title.x = this.sceneContainer.width / 2 - title.width / 2;
		title.y = (this.sceneContainer.height / 2 - title.height / 2) - 120;
		this.sceneContainer.addChild(title);

		const subTitle = new Text("Let's put a stop to honking", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 25,
		});
		subTitle.x = this.sceneContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.sceneContainer.height / 2 - subTitle.height / 2) - 60;
		this.sceneContainer.addChild(subTitle);

		const button = new Button(new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 250, 50, 10).endFill(), () => {
			SoundManager.play(SoundType.OPTION_SELECT);
			SceneManager.isNavigating = true;
		}, "New Game");
		button.setPosition(this.sceneContainer.width / 2 - button.width / 2, this.sceneContainer.height / 2 - button.height / 2);
		this.sceneContainer.addChild(button);
	}

	public update(_framesPassed: number) {

		if (SceneManager.isNavigating) {
			this.sceneContainer.alpha -= 0.06;

			if (this.sceneContainer.alpha <= 0) {
				this.removeChild(this.sceneContainer);
				SceneManager.changeScene(new PlayerSelectionScene());
			}
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

