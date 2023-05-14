import { Container, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { TextureType } from "../Enums";
import { GameTitleScene } from "./GameTitleScene";


export class GameSplashScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	private splashDelay: number = 15;

	constructor() {
		super();

		this.uiContainer = new GameObjectContainer();
		this.uiContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.uiContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		this.addChild(this.uiContainer);

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.GAME_COVER_IMAGE));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

		this.bg_container = new GameObjectContainer();
		this.bg_container.alpha = 0;
		this.bg_container.addChild(bg_sprite);
		this.uiContainer.addChild(this.bg_container);

		//#region title

		const title = new Text("KNIGHT GAMES", {
			fontFamily: Constants.GAME_TITLE_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 44
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2);
		this.uiContainer.addChild(title);

		//#endregion		
	}

	public update() {
		this.bg_container.hover();
		this.splashDelay -= 0.1;

		if (this.splashDelay < 5) {
			this.alpha -= 0.1;
		}

		if (this.alpha <= 0) {
			SceneManager.changeScene(new GameTitleScene());
		}
	}

	public resize(scale: number): void {

		if (SceneManager.width < SceneManager.height) {
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			this.uiContainer.scale.set(scale);
			this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		}
	}
}


