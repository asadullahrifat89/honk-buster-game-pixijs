import { BlurFilter, Container, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants} from "../Constants";
import { TextureType, PlayerRideTemplate, SoundType } from "../Enums";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { PlayerGearSelectionScene } from "./PlayerGearSelectionScene";
import { SelectionButton } from "../controls/SelectionButton";

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

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.GAME_COVER_IMAGE));
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
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 220;
		this.uiContainer.addChild(title);

		//#region air balloon

		const air_balloon_button = new SelectionButton("player_ride_1", 256 / 2, 256 / 2, "Lvl " + 1, () => {

			button.setText("Air Balloon").setIsEnabled(true);
			air_balloon_button.select();
			chopper_button.unselect();
			sphere_button.unselect();
			Constants.SELECTED_PLAYER_RIDE_TEMPLATE = PlayerRideTemplate.AIR_BALLOON;
			SoundManager.play(SoundType.ITEM_SELECT);
		});

		air_balloon_button.setPosition((this.uiContainer.width / 2 - air_balloon_button.width * 2), (this.uiContainer.height / 2 - air_balloon_button.height / 2) + 10);
		this.uiContainer.addChild(air_balloon_button);

		//#endregion

		//#region chopper

		Constants.CHOPPER_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.CHOPPER_UNLOCK_LEVEL;

		const chopper_button = new SelectionButton("player_ride_2", 256 / 2, 256 / 2, "Lvl " + Constants.CHOPPER_UNLOCK_LEVEL, () => {

			button.setText("Chopper").setIsEnabled(true);
			chopper_button.select();
			air_balloon_button.unselect();
			sphere_button.unselect();
			Constants.SELECTED_PLAYER_RIDE_TEMPLATE = PlayerRideTemplate.CHOPPER;
			SoundManager.play(SoundType.ITEM_SELECT);

		}, Constants.CHOPPER_UNLOCKED);
		chopper_button.setPosition((this.uiContainer.width / 2 - chopper_button.width / 2.5), (this.uiContainer.height / 2 - chopper_button.height / 2) + 10);
		this.uiContainer.addChild(chopper_button);

		//#endregion

		//#region sphere

		Constants.SPHERE_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.SPHERE_UNLOCK_LEVEL;

		const sphere_button = new SelectionButton("player_ride_3", 256 / 2, 256 / 2, "Lvl " + Constants.SPHERE_UNLOCK_LEVEL, () => {

			button.setText("Sphere").setIsEnabled(true);
			sphere_button.select();
			air_balloon_button.unselect();
			chopper_button.unselect();
			Constants.SELECTED_PLAYER_RIDE_TEMPLATE = PlayerRideTemplate.SPHERE;
			SoundManager.play(SoundType.ITEM_SELECT);

		}, Constants.SPHERE_UNLOCKED);
		sphere_button.setPosition((this.uiContainer.width / 2 + sphere_button.width), (this.uiContainer.height / 2 - sphere_button.height / 2) + 10);
		this.uiContainer.addChild(sphere_button);

		//#endregion

		const button = new Button(() => {
			if (button.getIsEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				this.uiContainer.destroy();
				SceneManager.changeScene(new PlayerGearSelectionScene());
			}
			else {
				SoundManager.play(SoundType.DAMAGE_TAKEN);
			}

		}).setText("Select").setIsEnabled(false);
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 1);
		this.uiContainer.addChild(button);
	}

	public update() {
		//this.bg_container.hover();
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


