import { Container, Graphics, Text, BlurFilter, Texture } from "pixi.js";
import { Button } from "./controls/Button";
import { Constants, ConstructType, SoundType } from "./Constants";
import { GameObjectContainer } from "./GameObjectContainer";
import { GameObjectSprite } from "./GameObjectSprite";
import { IScene } from "./IScene";
import { PlayerHonkBombSelectionScene } from "./PlayerHonkBombSelectionScene";
import { SceneManager } from "./managers/SceneManager";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { SoundManager } from "./managers/SoundManager";


export class PlayerCharacterSelectionScene extends Container implements IScene {

	private sceneContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	constructor() {
		super();

		this.sceneContainer = new GameObjectContainer(0);
		this.sceneContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.sceneContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.sceneContainer.setPosition(SceneManager.width / 2 - this.sceneContainer.width / 2, SceneManager.height / 2 - this.sceneContainer.height / 2);
		//this.sceneContainer.filters = [new DropShadowFilter()];
		this.addChild(this.sceneContainer);

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		bg_sprite.filters = [new BlurFilter()];

		this.bg_container = new GameObjectContainer(0);
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);

		this.sceneContainer.addChild(this.bg_container);

		const title = new Text("Select Character", {
			fontFamily: "gameplay",
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.sceneContainer.width / 2 - title.width / 2;
		title.y = (this.sceneContainer.height / 2 - title.height / 2) - 120;
		this.sceneContainer.addChild(title);

		const player_1_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_1_character"));
		player_1_sprite.width = 208 / 1.5;
		player_1_sprite.height = 256 / 1.5;
		player_1_sprite.x = 0;
		player_1_sprite.y = 0;
		const player_1_button = new Button(player_1_sprite, () => {
			SoundManager.play(SoundType.OPTION_SELECT);
			player_2_sprite.filters = [new BlurFilter()];
			player_1_sprite.filters = null;
			Constants.SELECTED_PLAYER_TEMPLATE = 0;
		});
		player_1_button.setPosition(this.sceneContainer.width / 2 - player_1_sprite.width, this.sceneContainer.height / 2 - player_1_sprite.height / 2);
		this.sceneContainer.addChild(player_1_button);

		const player_2_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_2_character"));
		player_2_sprite.width = 208 / 1.5;
		player_2_sprite.height = 256 / 1.5;
		player_2_sprite.x = 0;
		player_2_sprite.y = 0;
		const player_2_button = new Button(player_2_sprite, () => {
			SoundManager.play(SoundType.OPTION_SELECT);
			player_1_sprite.filters = [new BlurFilter()];
			player_2_sprite.filters = null;
			Constants.SELECTED_PLAYER_TEMPLATE = 1;
		});
		player_2_button.setPosition(this.sceneContainer.width / 2, this.sceneContainer.height / 2 - player_2_sprite.height / 2);
		this.sceneContainer.addChild(player_2_button);

		const button = new Button(new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 250, 50, 10).endFill(), () => {

			if (player_1_sprite.filters || player_2_sprite.filters) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.sceneContainer);
				SceneManager.changeScene(new PlayerHonkBombSelectionScene());
			}
			else {
				SoundManager.play(SoundType.PLAYER_HEALTH_LOSS);
			}

		}, "Select");
		button.setPosition(this.sceneContainer.width / 2 - button.width / 2, this.sceneContainer.height - button.height * 2);
		this.sceneContainer.addChild(button);
	}

	public update(_framesPassed: number) {
		this.bg_container.hover();
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

