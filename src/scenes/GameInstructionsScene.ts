import { BlurFilter, Container, Text, Texture } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { GameTitleScene } from "./GameTitleScene";
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

		this.addPlayer();
		this.addVehicleEnemy();

		// title
		const subTitle = new Text("How to Play", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 42,
		});
		subTitle.x = this.uiContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.uiContainer.height / 2 - subTitle.height / 2) - 200;
		this.uiContainer.addChild(subTitle);

		// new game button
		const newGameButton = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			SceneManager.isNavigating = true;
		}).setText("Okay");
		newGameButton.setPosition(this.uiContainer.width / 2 - newGameButton.width / 2, (this.uiContainer.height / 2 - newGameButton.height / 2) + 200);
		this.uiContainer.addChild(newGameButton);
	}

	private addPlayer() {
		const player: GameObjectSprite = new GameObjectSprite(Texture.from("./images/player_balloon_1_idle.png"));
		player.width = 150;
		player.height = 150;
		player.x = this.uiContainer.width / 2 - player.width / 2;
		player.y = this.uiContainer.height / 2 - player.height / 2;
		this.uiContainer.addChild(player);

		const playerMsg: MessageBubble = new MessageBubble(0, "This is you.");
		playerMsg.x = player.x + player.width / 2;
		playerMsg.y = player.y + 20;
		playerMsg.scale.set(0.8);
		this.uiContainer.addChild(playerMsg);
	}

	private addVehicleEnemy() {
		const vehicle: GameObjectSprite = new GameObjectSprite(Texture.from("./images/vehicle_small_1.png"));
		vehicle.width = 150;
		vehicle.height = 150;
		vehicle.x = this.uiContainer.width;
		vehicle.y = this.uiContainer.height / 2;
		this.uiContainer.addChild(vehicle);

		const honk: GameObjectSprite = new GameObjectSprite(Texture.from("./images/honk_1.png"));
		honk.width = 70;
		honk.height = 70;
		honk.x = vehicle.x;
		honk.y = vehicle.y;
		this.uiContainer.addChild(honk);

		const vehicleMsg: MessageBubble = new MessageBubble(0, "Drop bombs on these.");
		vehicleMsg.x = vehicle.x - vehicle.width;
		vehicleMsg.y = vehicle.y + vehicle.height;
		vehicleMsg.scale.set(0.8);
		this.uiContainer.addChild(vehicleMsg);
	}

	public update(_framesPassed: number) {

		if (SceneManager.isNavigating) {
			this.uiContainer.alpha -= 0.06;

			if (this.uiContainer.alpha <= 0) {
				this.removeChild(this.uiContainer);
				SceneManager.changeScene(new GameTitleScene());
				SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC, 0.5, true);
			}
		}
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
