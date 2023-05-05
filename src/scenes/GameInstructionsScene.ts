import { BlurFilter, Container, Text, Texture } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { MessageBubble } from "../controls/MessageBubble";
import { GameTitleScene } from "./GameTitleScene";


export class GameInstructionsScene extends Container implements IScene {

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

		const title = new Text("How to play", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		// joy stick
		const joystick = new GameObjectContainer();

		const joystick_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick"));
		joystick_sprite.width = 256 / 2;
		joystick_sprite.height = 256 / 2;
		joystick_sprite.x = 0;
		joystick_sprite.y = 0;

		const joystick_handle_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		joystick_handle_sprite.width = 256 / 3;
		joystick_handle_sprite.height = 256 / 3;
		joystick_handle_sprite.x = joystick_sprite.width / 2 - joystick_handle_sprite.width / 2;
		joystick_handle_sprite.y = joystick_sprite.height / 2 - joystick_handle_sprite.height / 2;

		const joystick_controller_container = new GameObjectContainer();
		joystick_controller_container.addChild(joystick_sprite);
		joystick_controller_container.addChild(joystick_handle_sprite);
		joystick.addChild(joystick_controller_container);

		const joystick_msg = new MessageBubble(0, "Use this or ⌨️ arrow keys to move.", 20);
		joystick_msg.setPosition(joystick_controller_container.x + joystick_controller_container.width, joystick_controller_container.y + 50);
		joystick.addChild(joystick_msg);

		joystick.setPosition(this.uiContainer.width / 2 - joystick.width / 2, (this.uiContainer.height / 2 - joystick.height / 2) + 10);
		this.uiContainer.addChild(joystick);

		// attack button
		const attack_button = new GameObjectContainer();
		attack_button.renderable = false;

		const attack_button_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("attack_button"));
		attack_button_sprite.width = 256 / 2;
		attack_button_sprite.height = 256 / 2;
		attack_button_sprite.x = 0;
		attack_button_sprite.y = 0;

		const attack_button_container = new GameObjectContainer();
		attack_button_container.addChild(attack_button_sprite);
		attack_button.addChild(attack_button_container);

		const attack_button_msg = new MessageBubble(0, "Press this or ⌨️ space key to attack.", 20);
		attack_button_msg.setPosition(attack_button_container.x + attack_button_container.width + 10, attack_button_container.y + 25);
		attack_button.addChild(attack_button_msg);

		attack_button.setPosition(this.uiContainer.width / 2 - attack_button.width / 2, (this.uiContainer.height / 2 - attack_button.height / 2) + 10);
		this.uiContainer.addChild(attack_button);

		// honk_bomb
		const honk_bomb = new GameObjectContainer();
		honk_bomb.renderable = false;

		const honk_bomb_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_explosive_1"));
		honk_bomb_sprite.width = 256 / 2;
		honk_bomb_sprite.height = 256 / 2;
		honk_bomb_sprite.x = 0;
		honk_bomb_sprite.y = 0;

		const honk_bomb_container = new GameObjectContainer();
		honk_bomb_container.addChild(honk_bomb_sprite);
		honk_bomb.addChild(honk_bomb_container);

		const honk_bomb_msg = new MessageBubble(0, "These are your drop bombs.", 20);
		honk_bomb_msg.setPosition(honk_bomb_container.x + honk_bomb_container.width + 10, honk_bomb_container.y + 25);
		honk_bomb.addChild(honk_bomb_msg);

		honk_bomb.setPosition(this.uiContainer.width / 2 - honk_bomb.width / 2, (this.uiContainer.height / 2 - honk_bomb.height / 2) + 10);
		this.uiContainer.addChild(honk_bomb);

		// car
		const car = new GameObjectContainer();
		car.renderable = false;

		const car_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("vehicle_small_1"));
		car_sprite.width = 256 / 2;
		car_sprite.height = 256 / 2;
		car_sprite.x = 0;
		car_sprite.y = 0;

		const car_container = new GameObjectContainer();
		car_container.addChild(car_sprite);
		car.addChild(car_container);

		const car_msg = new MessageBubble(0, "Drop bombs on honking cars.", 20);
		car_msg.setPosition(car_container.x + car_container.width + 10, car_container.y + 25);
		car.addChild(car_msg);

		car.setPosition(this.uiContainer.width / 2 - car.width / 2, (this.uiContainer.height / 2 - car.height / 2) + 10);
		this.uiContainer.addChild(car);

		// player_rocket
		const player_rocket = new GameObjectContainer();
		player_rocket.renderable = false;

		const player_rocket_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_rocket_1"));
		player_rocket_sprite.width = 256 / 2;
		player_rocket_sprite.height = 256 / 2;
		player_rocket_sprite.x = 0;
		player_rocket_sprite.y = 0;
		player_rocket_sprite.angle = 213;

		const player_rocket_container = new GameObjectContainer();
		player_rocket_container.addChild(player_rocket_sprite);
		player_rocket.addChild(player_rocket_container);

		const player_rocket_msg = new MessageBubble(0, "These are your drop bombs.", 20);
		player_rocket_msg.setPosition(player_rocket_container.x + player_rocket_container.width + 10, player_rocket_container.y + 25);
		player_rocket.addChild(player_rocket_msg);

		player_rocket.setPosition(this.uiContainer.width / 2 - player_rocket.width / 2, (this.uiContainer.height / 2 - player_rocket.height / 2) + 10);
		this.uiContainer.addChild(player_rocket);

		const button = new Button(() => {

			SoundManager.play(SoundType.OPTION_SELECT);

			if (joystick.renderable) {
				joystick.renderable = false;
				attack_button.renderable = true;
			}
			else if (attack_button.renderable) {
				attack_button.renderable = false;
				honk_bomb.renderable = true;
			}
			else if (honk_bomb.renderable) {
				honk_bomb.renderable = false;
				car.renderable = true;
			}
			else if (car.renderable) {
				car.renderable = false;
				player_rocket.renderable = true;
			}
			else if (player_rocket.renderable) {
				player_rocket.renderable = false;
			}
			else {
				this.removeChild(this.uiContainer);
				SceneManager.changeScene(new GameTitleScene());
			}

		}).setText("Next");
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
