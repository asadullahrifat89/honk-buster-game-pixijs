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


export class PlayerAirBombSelectionScene extends Container implements IScene {

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

		//#region title
		const title = new Text("Select an Air Bomb", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		//#endregion

		//#region gravity_balls
		const gravity_balls_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_ball_2"));
		gravity_balls_sprite.width = 256 / 2.5;
		gravity_balls_sprite.height = 256 / 2.5;
		gravity_balls_sprite.x = 0;
		gravity_balls_sprite.y = 0;
		const gravity_balls_button = new Button(() => {

			button.setText("Baseballs").setIsEnabled(true);

			SoundManager.play(SoundType.BALL_LAUNCH, 0.6);
			missiles_sprite.filters = [new GrayscaleFilter()];
			gravity_balls_sprite.filters = null;
			Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE = 0;

		}).setBackground(gravity_balls_sprite);
		gravity_balls_button.setPosition((this.uiContainer.width / 2 - gravity_balls_sprite.width * 2) + 45, (this.uiContainer.height / 2 - gravity_balls_sprite.height / 2) + 10);
		this.uiContainer.addChild(gravity_balls_button);

		const gravity_balls_msg = new MessageBubble(0, "Lvl " + 1, 20);
		gravity_balls_msg.setPosition(gravity_balls_button.x + gravity_balls_button.width / 2, gravity_balls_button.y + gravity_balls_button.height / 2);
		this.uiContainer.addChild(gravity_balls_msg);

		//#endregion

		//#region missiles

		Constants.MISSILE_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.MISSILE_UNLOCK_LEVEL;

		const missiles_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_rocket_1"));
		missiles_sprite.width = 256 / 2;
		missiles_sprite.height = 256 / 2;
		missiles_sprite.x = 0;
		missiles_sprite.y = 0;
		const missiles_button = new Button(() => {

			button.setText("Missiles").setIsEnabled(true);

			SoundManager.play(SoundType.ROCKET_LAUNCH, 0.4);
			gravity_balls_sprite.filters = [new GrayscaleFilter()];
			missiles_sprite.filters = null;
			Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE = 1;

		}).setBackground(missiles_sprite);
		missiles_button.setPosition((this.uiContainer.width / 2 - missiles_sprite.width / 2) + 100, (this.uiContainer.height / 2 - missiles_sprite.height / 2) + 10).setIsEnabled(Constants.MISSILE_UNLOCKED);
		this.uiContainer.addChild(missiles_button);

		const missiles_msg = new MessageBubble(0, "Lvl " + Constants.MISSILE_UNLOCK_LEVEL, 20);
		missiles_msg.setPosition(missiles_button.x + missiles_button.width / 2, missiles_button.y + missiles_button.height / 2);
		this.uiContainer.addChild(missiles_msg);

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
