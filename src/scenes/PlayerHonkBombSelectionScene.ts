import { Container, Graphics, Text, Texture } from "pixi.js";
import { GameScene } from "./GameScene";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { GrayscaleFilter } from "@pixi/filter-grayscale";


export class PlayerHonkBombSelectionScene extends Container implements IScene {

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
		bg_sprite.alpha = 0.4;

		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);

		this.sceneContainer.addChild(this.bg_container);

		const title = new Text("Select your droppings", {
			fontFamily: "gamefont",
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.sceneContainer.width / 2 - title.width / 2;
		title.y = (this.sceneContainer.height / 2 - title.height / 2) - 120;
		this.sceneContainer.addChild(title);

		const player_1_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_cracker_1"));
		player_1_sprite.width = 300 / 2;
		player_1_sprite.height = 300 / 2;
		player_1_sprite.x = 0;
		player_1_sprite.y = 0;
		const player_1_button = new Button(player_1_sprite, () => {
			SoundManager.play(SoundType.OPTION_SELECT);
			player_1_sprite.filters = null;
			player_2_sprite.filters = [new GrayscaleFilter()];
			player_3_sprite.filters = [new GrayscaleFilter()];
			Constants.SELECTED_HONK_BUSTER_TEMPLATE = 0;
		});
		player_1_button.setPosition(this.sceneContainer.width / 2 - player_1_sprite.width, this.sceneContainer.height / 2 - player_1_sprite.height / 2 + 10);
		this.sceneContainer.addChild(player_1_button);

		const player_2_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_trash_1"));
		player_2_sprite.width = 300 / 2;
		player_2_sprite.height = 300 / 2;
		player_2_sprite.x = 0;
		player_2_sprite.y = 0;
		const player_2_button = new Button(player_2_sprite, () => {
			SoundManager.play(SoundType.OPTION_SELECT);
			player_2_sprite.filters = null;
			player_1_sprite.filters = [new GrayscaleFilter()];
			player_3_sprite.filters = [new GrayscaleFilter()];
			Constants.SELECTED_HONK_BUSTER_TEMPLATE = 1;
		});
		player_2_button.setPosition(this.sceneContainer.width / 2, this.sceneContainer.height / 2 - player_2_sprite.height / 2 + 10);
		this.sceneContainer.addChild(player_2_button);

		const player_3_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_barrel_1"));
		player_3_sprite.width = 300 / 2;
		player_3_sprite.height = 300 / 2;
		player_3_sprite.x = 0;
		player_3_sprite.y = 0;
		const player_3_button = new Button(player_3_sprite, () => {
			SoundManager.play(SoundType.OPTION_SELECT);
			player_3_sprite.filters = null;
			player_1_sprite.filters = [new GrayscaleFilter()];
			player_2_sprite.filters = [new GrayscaleFilter()];
			Constants.SELECTED_HONK_BUSTER_TEMPLATE = 2;
		});
		player_3_button.setPosition(this.sceneContainer.width / 2 + player_3_sprite.width, this.sceneContainer.height / 2 - player_3_sprite.height / 2 + 10);
		this.sceneContainer.addChild(player_3_button);

		const button = new Button(new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 250, 50, 10).endFill(), () => {

			if (player_1_sprite.filters || player_2_sprite.filters || player_3_sprite.filters) {
				SoundManager.play(SoundType.OPTION_SELECT);
				SceneManager.isNavigating = true;
			}
			else {
				SoundManager.play(SoundType.PLAYER_HEALTH_LOSS);
			}

		}, "Begin");
		button.setPosition(this.sceneContainer.width / 2 - button.width / 2, this.sceneContainer.height - button.height * 2);
		this.sceneContainer.addChild(button);
	}

	public update(_framesPassed: number) {
		if (SceneManager.isNavigating) {
			this.sceneContainer.alpha -= 0.06;

			if (this.sceneContainer.alpha <= 0) {
				this.removeChild(this.sceneContainer);
				SceneManager.changeScene(new GameScene());
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

