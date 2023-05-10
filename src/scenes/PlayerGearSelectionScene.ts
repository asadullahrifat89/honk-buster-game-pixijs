import { BlurFilter, Container, Text, Texture } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, PlayerAirBombTemplate, PlayerGroundBombTemplate, PlayerRideTemplate, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { GrayscaleFilter } from "@pixi/filter-grayscale";
import { MessageBubble } from "../controls/MessageBubble";
import { PlayerAirBombSelectionScene } from "./PlayerAirBombSelectionScene";
import { PlayerRideSelectionScene } from "./PlayerRideSelectionScene";
import { PlayerCharacterSelectionScene } from "./PlayerCharacterSelectionScene";
import { PlayerGroundBombSelectionScene } from "./PlayerGroundBombSelectionScene";
import { GamePlayScene } from "./GamePlayScene";



export class PlayerGearSelectionScene extends Container implements IScene {

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

		let characterTexture: Texture = Texture.from("player_1_character");
		let characterName: string = "";

		switch (Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE) {
			case 0: {
				characterTexture = Texture.from("player_1_character");
				characterName = "Rad";
			} break;
			case 1: {
				characterTexture = Texture.from("player_2_character");
				characterName = "Rodney";
			} break;
			default: {
				characterTexture = Texture.from("player_1_character");
				characterName = "Character?";
			} break;
		}

		const character_sprite: GameObjectSprite = new GameObjectSprite(characterTexture);
		character_sprite.width = 208 / 2;
		character_sprite.height = 256 / 2;
		character_sprite.x = 0;
		character_sprite.y = 0;
		character_sprite.filters = Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE == -1 ? [new GrayscaleFilter()] : null;
		const character_button = new Button(() => {

			SoundManager.play(SoundType.ITEM_SELECT);
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new PlayerCharacterSelectionScene());

		}).setBackground(character_sprite);
		character_button.setPosition((this.uiContainer.width / 2 - optionsGap * 2), (this.uiContainer.height / 2 - character_sprite.height / 2)); // character button position
		this.uiContainer.addChild(character_button);

		const character_msg = new MessageBubble(0, characterName, 20);
		character_msg.setPosition(character_button.x + character_button.width / 2, (character_button.y + character_button.height / 2) + 25);
		this.uiContainer.addChild(character_msg);

		//#endregion

		//#region ride
		let rideTexture: Texture = Texture.from("player_ride_1");
		let rideName: string = "";

		switch (Constants.SELECTED_PLAYER_RIDE_TEMPLATE) {
			case PlayerRideTemplate.AIR_BALLOON: {
				rideTexture = Texture.from("player_ride_1");
				rideName = "Air Balloon";
			} break;
			case PlayerRideTemplate.CHOPPER: {
				rideTexture = Texture.from("player_ride_2");
				rideName = "Chopper";
			} break;
			default: {
				rideTexture = Texture.from("player_ride_1");
				rideName = "Ride?";
			} break;
		}

		const ride_sprite: GameObjectSprite = new GameObjectSprite(rideTexture);
		ride_sprite.width = 256 / 2;
		ride_sprite.height = 256 / 2;
		ride_sprite.x = 0;
		ride_sprite.y = 0;
		ride_sprite.filters = Constants.SELECTED_PLAYER_RIDE_TEMPLATE == -1 ? [new GrayscaleFilter()] : null;
		const ride_button = new Button(() => {

			SoundManager.play(SoundType.ITEM_SELECT);
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new PlayerRideSelectionScene());

		}).setBackground(ride_sprite);
		ride_button.setPosition(this.uiContainer.width / 2 - optionsGap * 1, (this.uiContainer.height / 2 - ride_sprite.height / 2)); // ride button position
		this.uiContainer.addChild(ride_button);

		const ride_msg = new MessageBubble(0, rideName, 20);
		ride_msg.setPosition(ride_button.x + ride_button.width / 2, (ride_button.y + ride_button.height / 2) + 25);
		this.uiContainer.addChild(ride_msg);

		//#endregion

		//#region ground_bomb
		let ground_bombTexture: Texture = Texture.from("player_honk_bomb_explosive_1");
		let ground_bombName: string = "";

		switch (Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE) {
			case PlayerGroundBombTemplate.GRENADE: {
				ground_bombTexture = Texture.from("player_honk_bomb_explosive_1");
				ground_bombName = "Grenades";
			} break;
			case PlayerGroundBombTemplate.TRASH_BIN: {
				ground_bombTexture = Texture.from("player_honk_bomb_trash_1");
				ground_bombName = "Trash Bins";
			} break;
			case PlayerGroundBombTemplate.DYNAMITE: {
				ground_bombTexture = Texture.from("player_honk_bomb_sticky_2");
				ground_bombName = "Dynamites";
			} break;
			default: {
				ground_bombTexture = Texture.from("player_honk_bomb_explosive_1");
				ground_bombName = "Ground Bomb?";
			} break;
		}

		const ground_bomb_sprite: GameObjectSprite = new GameObjectSprite(ground_bombTexture);
		ground_bomb_sprite.width = 256 / 2.5;
		ground_bomb_sprite.height = 256 / 2.5;
		ground_bomb_sprite.x = 0;
		ground_bomb_sprite.y = 0;
		ground_bomb_sprite.filters = Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE == -1 ? [new GrayscaleFilter()] : null;
		const ground_bomb_button = new Button(() => {

			SoundManager.play(SoundType.ITEM_SELECT);
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new PlayerGroundBombSelectionScene());

		}).setBackground(ground_bomb_sprite);
		ground_bomb_button.setPosition((this.uiContainer.width / 2 - optionsGap * 0), (this.uiContainer.height / 2 - ground_bomb_sprite.height / 2)); // ground_bomb button position
		this.uiContainer.addChild(ground_bomb_button);

		const ground_bomb_msg = new MessageBubble(0, ground_bombName, 20);
		ground_bomb_msg.setPosition(ground_bomb_button.x + ground_bomb_button.width / 2, (ground_bomb_button.y + ground_bomb_button.height / 2) + 25);
		this.uiContainer.addChild(ground_bomb_msg);

		//#endregion

		//#region air_bomb
		let air_bombTexture: Texture = Texture.from("player_gravity_ball_2");
		let air_bombName: string = "";

		switch (Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE) {
			case PlayerAirBombTemplate.GRAVITY_BALL: {
				air_bombTexture = Texture.from("player_gravity_ball_2");
				air_bombName = "Gravity Balls";
			} break;
			case PlayerAirBombTemplate.MISSILE: {
				air_bombTexture = Texture.from("player_rocket_1");
				air_bombName = "Missiles";
			} break;
			case PlayerAirBombTemplate.BULLET_BALL: {
				air_bombTexture = Texture.from("player_bullet_ball_1");
				air_bombName = "Bullet Balls";
			} break;
			default: {
				air_bombTexture = Texture.from("player_gravity_ball_2");
				air_bombName = "Air Bomb?";
			} break;
		}

		const air_bomb_sprite: GameObjectSprite = new GameObjectSprite(air_bombTexture);
		air_bomb_sprite.width = 256 / 3.5;
		air_bomb_sprite.height = 256 / 3.5;
		air_bomb_sprite.x = 0;
		air_bomb_sprite.y = 0;
		air_bomb_sprite.filters = Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE == -1 ? [new GrayscaleFilter()] : null;
		const air_bomb_button = new Button(() => {

			SoundManager.play(SoundType.ITEM_SELECT);
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new PlayerAirBombSelectionScene());

		}).setBackground(air_bomb_sprite);
		air_bomb_button.setPosition((this.uiContainer.width / 2 + optionsGap), (this.uiContainer.height / 2 - air_bomb_sprite.height / 2)); // air_bomb button position
		this.uiContainer.addChild(air_bomb_button);

		const air_bomb_msg = new MessageBubble(0, air_bombName, 20);
		air_bomb_msg.setPosition(air_bomb_button.x + air_bomb_button.width / 2, (air_bomb_button.y + air_bomb_button.height / 2) + 25);
		this.uiContainer.addChild(air_bomb_msg);

		//#endregion

		//#region next button
		const button = new Button(() => {

			if (button.getIsEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				SceneManager.changeScene(new GamePlayScene());
			}
			else {
				SoundManager.play(SoundType.DAMAGE_TAKEN);
			}

		}).setText("Confirm").setIsEnabled(this.allSelectionsComplete());
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);

		//#endregion
	}

	private allSelectionsComplete(): boolean {
		return Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE != -1 && Constants.SELECTED_PLAYER_RIDE_TEMPLATE != -1 && Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE != -1 && Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE != -1;
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
