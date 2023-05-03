import { Container, Text, BlurFilter, Texture } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { PlayerRideSelectionScene } from "./PlayerRideSelectionScene";
import { GrayscaleFilter } from "@pixi/filter-grayscale";


export class PlayerCharacterSelectionScene extends Container implements IScene {

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
		bg_sprite.alpha = 0.4;

		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);

		this.uiContainer.addChild(this.bg_container);

		const title = new Text("Select a Character", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		const player_1_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_1_character"));
		player_1_sprite.width = 208 / 2;
		player_1_sprite.height = 256 / 2;
		player_1_sprite.x = 0;
		player_1_sprite.y = 0;
		const player_1_button = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			player_2_sprite.filters = [new BlurFilter(), new GrayscaleFilter()];
			player_1_sprite.filters = null;
			Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE = 0;
		}).setBackground(player_1_sprite);
		player_1_button.setPosition(this.uiContainer.width / 2 - player_1_sprite.width, this.uiContainer.height / 2 - player_1_sprite.height / 2 + 10);
		this.uiContainer.addChild(player_1_button);

		const player_2_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_2_character"));
		player_2_sprite.width = 208 / 2;
		player_2_sprite.height = 256 / 2;
		player_2_sprite.x = 0;
		player_2_sprite.y = 0;
		player_2_sprite.filters = [new GrayscaleFilter()]; // TODO: remove it after character 2 ride set creation
		const player_2_button = new Button(() => {

			//SoundManager.play(SoundType.OPTION_SELECT);
			//player_1_sprite.filters = [new BlurFilter()];
			//player_2_sprite.filters = null;
			//Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE = 1;

			SoundManager.play(SoundType.PLAYER_HEALTH_LOSS);
		}).setBackground(player_2_sprite);		
		player_2_button.setPosition(this.uiContainer.width / 2, this.uiContainer.height / 2 - player_2_sprite.height / 2 + 10);
		this.uiContainer.addChild(player_2_button);

		const button = new Button(() => {

			if (player_1_sprite.filters || player_2_sprite.filters) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				SceneManager.changeScene(new PlayerRideSelectionScene());
			}
			else {
				SoundManager.play(SoundType.PLAYER_HEALTH_LOSS);
			}

		}).setText("Next");
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);
	}

	public update(_framesPassed: number) {
		this.bg_container.hover();
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

