import { BlurFilter, Container, Text, Texture } from "pixi.js";
import { GamePlayScene } from "./GamePlayScene";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { GrayscaleFilter } from "@pixi/filter-grayscale";
import { MessageBubble } from "../controls/MessageBubble";


export class PlayerGroundBombSelectionScene extends Container implements IScene {

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

		const title = new Text("Select a Ground Bomb", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		// grenade
		const grenade_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_explosive_1"));
		grenade_sprite.width = 256 / 2;
		grenade_sprite.height = 256 / 2;
		grenade_sprite.x = 0;
		grenade_sprite.y = 0;
		const grenade_button = new Button(() => {

			button.setText("Grenades").setIsEnabled(true);
			SoundManager.play(SoundType.OPTION_SELECT);
			grenade_sprite.filters = null;
			trash_sprite.filters = [new GrayscaleFilter()];
			dynamite_sprite.filters = [new GrayscaleFilter()];
			Constants.SELECTED_HONK_BUSTER_TEMPLATE = 0;

		}).setBackground(grenade_sprite);
		grenade_button.setPosition(this.uiContainer.width / 2 - grenade_sprite.width * 2, (this.uiContainer.height / 2 - grenade_sprite.height / 2) + 10);
		this.uiContainer.addChild(grenade_button);

		const grenade_msg = new MessageBubble(0, "Lvl 1", 20);
		grenade_msg.setPosition(grenade_button.x + grenade_button.width / 2, grenade_button.y + grenade_button.height / 2);
		this.uiContainer.addChild(grenade_msg);

		// trash
		const trash_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_trash_1"));
		trash_sprite.width = 256 / 2;
		trash_sprite.height = 256 / 2;
		trash_sprite.x = 0;
		trash_sprite.y = 0;
		const trash_button = new Button(() => {

			button.setText("Trash Bins").setIsEnabled(true);
			SoundManager.play(SoundType.OPTION_SELECT);
			trash_sprite.filters = null;
			grenade_sprite.filters = [new GrayscaleFilter()];
			dynamite_sprite.filters = [new GrayscaleFilter()];
			Constants.SELECTED_HONK_BUSTER_TEMPLATE = 1;

		}).setBackground(trash_sprite);
		trash_button.setPosition(this.uiContainer.width / 2 - trash_sprite.width / 2, (this.uiContainer.height / 2 - trash_sprite.height / 2) + 10).setIsEnabled(Constants.GAME_LEVEL_MAX >= Constants.TRASH_BIN_UNLOCK_LEVEL);
		this.uiContainer.addChild(trash_button);

		const trash_msg = new MessageBubble(0, "Lvl " + Constants.TRASH_BIN_UNLOCK_LEVEL, 20);
		trash_msg.setPosition(trash_button.x + trash_button.width / 2, trash_button.y + trash_button.height / 2);
		this.uiContainer.addChild(trash_msg);

		// dynamite
		const dynamite_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_sticky_2"));
		dynamite_sprite.width = 256 / 2;
		dynamite_sprite.height = 256 / 2;
		dynamite_sprite.x = 0;
		dynamite_sprite.y = 0;
		const dynamite_button = new Button(() => {

			button.setText("Dynamites").setIsEnabled(true);
			SoundManager.play(SoundType.OPTION_SELECT);
			dynamite_sprite.filters = null;
			grenade_sprite.filters = [new GrayscaleFilter()];
			trash_sprite.filters = [new GrayscaleFilter()];
			Constants.SELECTED_HONK_BUSTER_TEMPLATE = 2;

		}).setBackground(dynamite_sprite);
		dynamite_button.setPosition(this.uiContainer.width / 2 + dynamite_sprite.width, (this.uiContainer.height / 2 - dynamite_sprite.height / 2) + 10).setIsEnabled(Constants.GAME_LEVEL_MAX >= Constants.DYNAMITE_UNLOCK_LEVEL);
		this.uiContainer.addChild(dynamite_button);

		const dynamite_msg = new MessageBubble(0, "Lvl " + Constants.DYNAMITE_UNLOCK_LEVEL, 20);
		dynamite_msg.setPosition(dynamite_button.x + dynamite_button.width / 2, dynamite_button.y + dynamite_button.height / 2);
		this.uiContainer.addChild(dynamite_msg);

		const button = new Button(() => {

			if (button.getIsEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				SceneManager.changeScene(new GamePlayScene());
			}
			else {
				SoundManager.play(SoundType.PLAYER_HEALTH_LOSS);
			}

		}).setText("Select").setIsEnabled(false);
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);
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

