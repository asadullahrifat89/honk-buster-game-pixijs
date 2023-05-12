import { BlurFilter, Container, Graphics, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, PlayerAirBombTemplate, PlayerGroundBombTemplate, PlayerRideTemplate, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { PlayerAirBombSelectionScene } from "./PlayerAirBombSelectionScene";
import { PlayerRideSelectionScene } from "./PlayerRideSelectionScene";
import { PlayerCharacterSelectionScene } from "./PlayerCharacterSelectionScene";
import { PlayerGroundBombSelectionScene } from "./PlayerGroundBombSelectionScene";
import { GamePlayScene } from "./GamePlayScene";
import { SelectionButton } from "../controls/SelectionButton";



export class PlayerGearSelectionScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	constructor() {
		super();

		this.spawnLines();

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

		const optionsGap = 256;

		//#region title
		const title = new Text("SELECT GEAR", {
			fontFamily: Constants.GAME_TITLE_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2.5;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		//#endregion

		//#region character

		let characterTexture: string = "player_1_character";
		let characterName: string = "";

		switch (Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE) {
			case 0: {
				characterTexture = "player_1_character";
				characterName = "Rad";
			} break;
			case 1: {
				characterTexture = "player_2_character";
				characterName = "Rodney";
			} break;
			default: {
				characterTexture = "player_1_character";
				characterName = "Character?";
			} break;
		}

		const character_button = new SelectionButton(characterTexture, 208 / 2, 256 / 2, characterName, () => {

			SoundManager.play(SoundType.ITEM_SELECT);
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new PlayerCharacterSelectionScene());
		});

		character_button.setPosition((this.uiContainer.width / 2 - optionsGap * 2), (this.uiContainer.height / 2 - character_button.height / 2));
		this.uiContainer.addChild(character_button);

		//#endregion

		//#region ride

		let rideTexture: string = "player_ride_1";
		let rideName: string = "";

		switch (Constants.SELECTED_PLAYER_RIDE_TEMPLATE) {
			case PlayerRideTemplate.AIR_BALLOON: {
				rideTexture = "player_ride_1";
				rideName = "Air Balloon";
			} break;
			case PlayerRideTemplate.CHOPPER: {
				rideTexture = "player_ride_2";
				rideName = "Chopper";
			} break;
			default: {
				rideTexture = "player_ride_1";
				rideName = "Ride?";
			} break;
		}

		const ride_button = new SelectionButton(rideTexture, 256 / 2, 256 / 2, rideName, () => {

			SoundManager.play(SoundType.ITEM_SELECT);
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new PlayerRideSelectionScene());
		});

		ride_button.setPosition(this.uiContainer.width / 2 - optionsGap * 1, (this.uiContainer.height / 2 - ride_button.height / 2));
		this.uiContainer.addChild(ride_button);

		//#endregion

		//#region ground_bomb

		let ground_bombTexture: string = "player_honk_bomb_grenade_1";
		let ground_bombName: string = "";

		switch (Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE) {
			case PlayerGroundBombTemplate.GRENADE: {
				ground_bombTexture = "player_honk_bomb_grenade_1";
				ground_bombName = "Grenades";
			} break;
			case PlayerGroundBombTemplate.TRASH_BIN: {
				ground_bombTexture = "player_honk_bomb_trash_1";
				ground_bombName = "Trash Bins";
			} break;
			case PlayerGroundBombTemplate.DYNAMITE: {
				ground_bombTexture = "player_honk_bomb_dynamite_2";
				ground_bombName = "Dynamites";
			} break;
			default: {
				ground_bombTexture = "player_honk_bomb_grenade_1";
				ground_bombName = "Ground Bomb?";
			} break;
		}

		const ground_bomb_button = new SelectionButton(ground_bombTexture, 256 / 2.5, 256 / 2.5, ground_bombName, () => {

			SoundManager.play(SoundType.ITEM_SELECT);
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new PlayerGroundBombSelectionScene());
		});

		ground_bomb_button.setPosition((this.uiContainer.width / 2 - optionsGap * 0), (this.uiContainer.height / 2 - ground_bomb_button.height / 2));
		this.uiContainer.addChild(ground_bomb_button);

		//#endregion

		//#region air_bomb

		let air_bombTexture: string = "player_gravity_ball_2";
		let air_bombName: string = "";

		switch (Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE) {
			case PlayerAirBombTemplate.GRAVITY_BALL: {
				air_bombTexture = "player_gravity_ball_2";
				air_bombName = "Gravity Balls";
			} break;
			case PlayerAirBombTemplate.MISSILE: {
				air_bombTexture = "player_rocket_1";
				air_bombName = "Missiles";
			} break;
			case PlayerAirBombTemplate.BULLET_BALL: {
				air_bombTexture = "player_bullet_ball_1";
				air_bombName = "Bullet Balls";
			} break;
			default: {
				air_bombTexture = "player_gravity_ball_2";
				air_bombName = "Air Bomb?";
			} break;
		}

		const air_bomb_button = new SelectionButton(air_bombTexture, 256 / 3.5, 256 / 3.5, air_bombName, () => {

			SoundManager.play(SoundType.ITEM_SELECT);
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new PlayerAirBombSelectionScene());
		});

		air_bomb_button.setPosition((this.uiContainer.width / 2 + optionsGap), (this.uiContainer.height / 2 - air_bomb_button.height / 2));
		this.uiContainer.addChild(air_bomb_button);

		//#endregion

		//#region next button

		const button = new Button(() => {

			if (button.getIsEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				this.uiContainer.destroy();
				SceneManager.changeScene(new GamePlayScene());
			}
			else {
				SoundManager.play(SoundType.DAMAGE_TAKEN);
			}

		}).setText("Confirm").setIsEnabled(this.allSelectionsComplete());
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);

		//#endregion

		if (!SoundManager.isPlaying(SoundType.GAME_INTRO_MUSIC))
			SoundManager.play(SoundType.GAME_INTRO_MUSIC, 0.8);
	}

	private allSelectionsComplete(): boolean {
		return Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE != -1 && Constants.SELECTED_PLAYER_RIDE_TEMPLATE != -1 && Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE != -1 && Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE != -1;
	}

	public update() {
		this.generateLines();
		this.animateLines();
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

	//#region Lines

	private ringGameObjects: Array<GameObjectContainer> = [];
	private readonly ringPopDelayDefault: number = 2 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ringPopDelay: number = 0;

	private spawnLines() {

		for (let j = 0; j < 10; j++) {

			const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED * 4);
			gameObject.disableRendering();
			gameObject.addChild(new Graphics().beginFill(0xffffff).lineStyle(1, 0xffffff).drawRoundedRect(0, 0, 300, 4, 4).endFill());
			gameObject.filters = [new BlurFilter()];
			this.ringGameObjects.push(gameObject);
			this.addChild(gameObject);
		}
	}

	private generateLines() {

		this.ringPopDelay -= 0.1;

		if (this.ringPopDelay < 0) {
			var gameObject = this.ringGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				//gameObject.alpha = 1;
				//gameObject.scale.set(1);
				gameObject.x = gameObject.width * -1;
				gameObject.y = Constants.getRandomNumber(10, SceneManager.height);
				gameObject.enableRendering();
			}

			this.ringPopDelay = this.ringPopDelayDefault;
		}
	}

	private animateLines() {

		var animatingRings = this.ringGameObjects.filter(x => x.isAnimating == true);

		if (animatingRings) {

			animatingRings.forEach(gameObject => {
				gameObject.moveRight();

				if (gameObject.x > SceneManager.width) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion
}
