import { Container, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { PlayerCharacterSelectionScene } from "./PlayerCharacterSelectionScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, PlayerHonkBombTemplate, PlayerRideTemplate, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { GamePlayScene } from "./GamePlayScene";


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

		// title
		const title = new Text("HONK BUSTERS", {
			fontFamily: Constants.GAME_TITLE_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 42
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		// tag line
		const subTitle = new Text("A honk pollution fighting saga", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 19,
		});
		subTitle.x = this.uiContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.uiContainer.height / 2 - subTitle.height / 2) - 65;
		this.uiContainer.addChild(subTitle);

		// new game button
		const newGameButton = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			Constants.HOW_TO_PLAY_MODE = false;
			SceneManager.isNavigating = true;
		}).setText("New Game");
		newGameButton.setPosition(this.uiContainer.width / 2 - newGameButton.width / 2, this.uiContainer.height / 2 - newGameButton.height / 2);
		this.uiContainer.addChild(newGameButton);

		// how to play button
		const howToPlayButtonButton = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			this.removeChild(this.uiContainer);		

			Constants.HOW_TO_PLAY_MODE = true;
			Constants.SELECTED_PLAYER_RIDE_TEMPLATE = Constants.getRandomNumber(PlayerRideTemplate.BALLOON, PlayerRideTemplate.CHOPPER);
			Constants.SELECTED_HONK_BUSTER_TEMPLATE = Constants.getRandomNumber(PlayerHonkBombTemplate.EXPLOSIVE_BOMB, PlayerHonkBombTemplate.STICKY_BOMB);
			SceneManager.changeScene(new GamePlayScene());

		}).setText("How To Play");
		howToPlayButtonButton.setPosition(this.uiContainer.width / 2 - howToPlayButtonButton.width / 2, this.uiContainer.height / 2 - (howToPlayButtonButton.height / 2) + 65);
		this.uiContainer.addChild(howToPlayButtonButton);

		const bottomline = new Text("- Made with ❤️ & PixiJS -", {
			fontFamily: "diloworld",
			align: "center",
			fill: "#ffffff",
			fontSize: 18,
		});
		bottomline.x = this.uiContainer.width / 2 - bottomline.width / 2;
		bottomline.y = (this.uiContainer.height / 2 - bottomline.height / 2) + 250;
		this.uiContainer.addChild(bottomline);
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


