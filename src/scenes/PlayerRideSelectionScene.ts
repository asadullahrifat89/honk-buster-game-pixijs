import { BlurFilter, Container, Text, Texture } from "pixi.js";
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
import { PlayerBattlementSelectionScene } from "./PlayerBattlementSelectionScene";


export class PlayerRideSelectionScene extends Container implements IScene {

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

		const title = new Text("Choose a Ride", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		//#region air balloon
		const air_balloon_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_ride_1"));
		air_balloon_sprite.width = 256 / 2;
		air_balloon_sprite.height = 256 / 2;
		air_balloon_sprite.x = 0;
		air_balloon_sprite.y = 0;
		const air_balloon_button = new Button(() => {

			button.setText("Air Balloon").setIsEnabled(true);

			SoundManager.play(SoundType.ITEM_SELECT);

			chopper_sprite.filters = [new GrayscaleFilter()];
			air_balloon_sprite.filters = null;

			Constants.SELECTED_PLAYER_RIDE_TEMPLATE = 0;

		}).setBackground(air_balloon_sprite);
		air_balloon_button.setPosition((this.uiContainer.width / 2 - air_balloon_sprite.width * 2) + 45, this.uiContainer.height / 2 - air_balloon_sprite.height / 2 + 10);
		this.uiContainer.addChild(air_balloon_button);

		const air_balloon_msg = new MessageBubble(0, "Lvl " + 1, 20);
		air_balloon_msg.setPosition(air_balloon_button.x + air_balloon_button.width / 2, air_balloon_button.y + air_balloon_button.height / 2);
		this.uiContainer.addChild(air_balloon_msg);

		//#endregion

		//#region chopper

		Constants.CHOPPER_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.CHOPPER_UNLOCK_LEVEL;

		const chopper_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_ride_2"));
		chopper_sprite.width = 256 / 2;
		chopper_sprite.height = 256 / 2;
		chopper_sprite.x = 0;
		chopper_sprite.y = 0;
		const chopper_button = new Button(() => {

			button.setText("Chopper").setIsEnabled(true);

			SoundManager.play(SoundType.ITEM_SELECT);

			air_balloon_sprite.filters = [new GrayscaleFilter()];
			chopper_sprite.filters = null;

			Constants.SELECTED_PLAYER_RIDE_TEMPLATE = 1;

		}).setBackground(chopper_sprite);
		chopper_button.setPosition((this.uiContainer.width / 2 - chopper_sprite.width / 2) + 100, this.uiContainer.height / 2 - chopper_sprite.height / 2 + 10).setIsEnabled(Constants.CHOPPER_UNLOCKED);
		this.uiContainer.addChild(chopper_button);

		const chopper_msg = new MessageBubble(0, "Lvl " + Constants.CHOPPER_UNLOCK_LEVEL, 20);
		chopper_msg.setPosition(chopper_button.x + chopper_button.width / 2, chopper_button.y + chopper_button.height / 2);
		this.uiContainer.addChild(chopper_msg);

		//#endregion

		const button = new Button(() => {
			if (button.getIsEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				SceneManager.changeScene(new PlayerBattlementSelectionScene());
			}
			else {
				SoundManager.play(SoundType.PLAYER_HEALTH_LOSS);
			}

		}).setText("Select").setIsEnabled(false);
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);
	}

	public update() {
		//this.bg_container.hover();
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


