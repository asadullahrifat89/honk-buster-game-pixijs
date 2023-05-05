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

		const joystick = new Container();		

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
		joystick_controller_container.setPosition(this.uiContainer.width / 2 - joystick_sprite.width * 3, this.uiContainer.height / 2 - joystick_sprite.height / 2 + 10);
		joystick.addChild(joystick_controller_container);

		const joystick_msg = new MessageBubble(0, "Use the 🕹️ or ⌨️ arrow keys to move.", 20);
		joystick_msg.setPosition(joystick_controller_container.x + joystick_controller_container.width, joystick_controller_container.y + 50);
		joystick.addChild(joystick_msg);

		this.uiContainer.addChild(joystick);

		const attack_button = new Container();
		attack_button.renderable = false;

		const attack_button_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("attack_button"));
		attack_button_sprite.width = 256 / 3;
		attack_button_sprite.height = 256 / 3;
		attack_button_sprite.x = 0;
		attack_button_sprite.y = 0;

		const attack_button_container = new GameObjectContainer();
		attack_button_container.addChild(attack_button_sprite);
		attack_button_container.setPosition(this.uiContainer.width / 2 - attack_button_sprite.width * 4, this.uiContainer.height / 2 - attack_button_sprite.height / 2 + 10);
		attack_button.addChild(attack_button_container);

		const attack_button_msg = new MessageBubble(0, "Press this or ⌨️ space key to attack.", 20);
		attack_button_msg.setPosition(attack_button_container.x + attack_button_container.width + 10, attack_button_container.y + 25);
		attack_button.addChild(attack_button_msg);

		this.uiContainer.addChild(attack_button);		

		const button = new Button(() => {

			if (joystick.renderable) {
				joystick.renderable = false;
				attack_button.renderable = true;
			}

			SoundManager.play(SoundType.OPTION_SELECT);
			//this.removeChild(this.uiContainer);
			//SceneManager.changeScene(new GameTitleScene());

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
