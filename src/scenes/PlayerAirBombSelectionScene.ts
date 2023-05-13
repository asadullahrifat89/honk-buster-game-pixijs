import { BlurFilter, Container, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { PlayerGearSelectionScene } from "./PlayerGearSelectionScene";
import { SelectionButton } from "../controls/SelectionButton";
import { TextureType, SoundType, PlayerAirBombTemplate } from "../Enums";


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

		const gravity_balls_button = new SelectionButton("player_gravity_ball_2", 256 / 2.5, 256 / 2.5, "Lvl " + 1, () => {

			button.setText("Gravity Balls").setIsEnabled(true);
			SoundManager.play(SoundType.BALL_LAUNCH, 0.6);
			gravity_balls_button.select();
			missiles_button.unselect();
			bullet_balls_button.unselect();
			Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE = PlayerAirBombTemplate.GRAVITY_BALL;
		});

		gravity_balls_button.setPosition((this.uiContainer.width / 2 - gravity_balls_button.width * 2.5) + 45, (this.uiContainer.height / 2 - gravity_balls_button.height / 2) + 10);
		this.uiContainer.addChild(gravity_balls_button);

		//#endregion

		//#region missiles

		Constants.MISSILE_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.MISSILE_UNLOCK_LEVEL;

		const missiles_button = new SelectionButton("player_rocket_1", 256 / 2, 256 / 2, "Lvl " + Constants.MISSILE_UNLOCK_LEVEL, () => {

			button.setText("Missiles").setIsEnabled(true);
			SoundManager.play(SoundType.ROCKET_LAUNCH, 0.3);
			missiles_button.select();
			bullet_balls_button.unselect();
			gravity_balls_button.unselect();
			Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE = PlayerAirBombTemplate.MISSILE;

		}, Constants.MISSILE_UNLOCKED);

		missiles_button.setPosition((this.uiContainer.width / 2 - missiles_button.width / 2), (this.uiContainer.height / 2 - missiles_button.height / 2) + 10);
		this.uiContainer.addChild(missiles_button);

		//#endregion

		//#region bullet_balls

		Constants.BULLET_BALL_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.BULLET_BALL_UNLOCK_LEVEL;

		const bullet_balls_button = new SelectionButton("player_bullet_ball_1", 256 / 2.5, 256 / 2.5, "Lvl " + Constants.BULLET_BALL_UNLOCK_LEVEL, () => {

			button.setText("Bullet Balls").setIsEnabled(true);
			SoundManager.play(SoundType.BULLET_LAUNCH);
			bullet_balls_button.select();
			gravity_balls_button.unselect();
			missiles_button.unselect();
			Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE = PlayerAirBombTemplate.BULLET_BALL;

		}, Constants.BULLET_BALL_UNLOCKED);

		bullet_balls_button.setPosition((this.uiContainer.width / 2 + bullet_balls_button.width * 1.1), (this.uiContainer.height / 2 - bullet_balls_button.height / 2) + 10);
		this.uiContainer.addChild(bullet_balls_button);

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
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);
	}

	public update() {
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
