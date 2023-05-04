import { Container, Texture } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { GameTitleScene } from "./GameTitleScene";
import { MessageBubble } from "../controls/MessageBubble";


export class GameInstructionsScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	private uiWidth: number = 0;
	private uiHeight: number = 0;

	//private title: Text;

	constructor() {
		super();

		this.uiWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.uiHeight = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

		this.uiContainer = new GameObjectContainer();
		this.uiContainer.width = this.uiWidth;
		this.uiContainer.height = this.uiHeight;
		this.uiContainer.setPosition(SceneManager.width / 2 - this.uiWidth / 2, SceneManager.height / 2 - this.uiHeight / 2);
		this.addChild(this.uiContainer);

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("./images/cover_image.png"));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		//bg_sprite.filters = [new BlurFilter()];
		bg_sprite.alpha = 0;
		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);
		this.uiContainer.addChild(this.bg_container);

		this.addPlayer();
		this.addVehicle();
		this.addUfo();
		this.addUfoBoss();

		// title
		//const title = new Text("How to Play", {
		//	fontFamily: Constants.GAME_DEFAULT_FONT,
		//	align: "center",
		//	fill: "#ffffff",
		//	fontSize: 35,
		//});
		//title.x = this.uiWidth - title.width / 2;
		//title.y = (this.uiHeight / 2 - title.height / 2) - 120;		
		//this.uiContainer.addChild(title);

		// okay button
		const okayButton = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			SceneManager.isNavigating = true;
		}).setText("Okay");
		okayButton.setPosition(/*this.uiWidth / 2 -*/ okayButton.width / 2, this.uiHeight - okayButton.height / 2);
		this.uiContainer.addChild(okayButton);
	}

	private addPlayer() {
		const player: GameObjectSprite = new GameObjectSprite(Texture.from("./images/player_balloon_1_idle.png"));
		player.width = 150;
		player.height = 150;
		player.x = this.uiWidth - player.width;
		player.y = (this.uiHeight / 2 - player.height / 2) + 20;
		this.uiContainer.addChild(player);

		const playerMsg: MessageBubble = new MessageBubble(0, "Move with joystick or keyboard.");
		playerMsg.x = player.x + player.width / 2;
		playerMsg.y = player.y + 20;
		playerMsg.scale.set(0.8);
		this.uiContainer.addChild(playerMsg);

		const honkBomb: GameObjectSprite = new GameObjectSprite(Texture.from("./images/player_honk_bomb_explosive_1.png"));
		honkBomb.width = 70;
		honkBomb.height = 70;
		honkBomb.x = player.x + player.width;
		honkBomb.y = player.y + player.height;
		this.uiContainer.addChild(honkBomb);

		const rocket: GameObjectSprite = new GameObjectSprite(Texture.from("./images/player_rocket_1.png"));
		rocket.width = 70;
		rocket.height = 70;
		rocket.x = player.x;
		rocket.y = player.y + player.height;
		rocket.angle = 213;
		this.uiContainer.addChild(rocket);
	}

	private addVehicle() {
		const vehicle: GameObjectSprite = new GameObjectSprite(Texture.from("./images/vehicle_small_1.png"));
		vehicle.width = 150;
		vehicle.height = 150;
		vehicle.x = this.uiWidth + 100;
		vehicle.y = this.uiHeight - vehicle.height;
		this.uiContainer.addChild(vehicle);

		const vehicleMsg: MessageBubble = new MessageBubble(0, "Drop bombs on Honking Cars.");
		vehicleMsg.x = vehicle.x - vehicle.width;
		vehicleMsg.y = vehicle.y + vehicle.height;
		vehicleMsg.scale.set(0.8);
		this.uiContainer.addChild(vehicleMsg);

		const honk: GameObjectSprite = new GameObjectSprite(Texture.from("./images/honk_1.png"));
		honk.width = 70;
		honk.height = 70;
		honk.x = vehicle.x;
		honk.y = vehicle.y;
		this.uiContainer.addChild(honk);
	}

	private addUfo() {
		const ufo: GameObjectSprite = new GameObjectSprite(Texture.from("./images/enemy_1.png"));
		ufo.width = 150;
		ufo.height = 150;
		ufo.x = 0;
		ufo.y = 0;
		this.uiContainer.addChild(ufo);

		const ufoMsg: MessageBubble = new MessageBubble(0, "Shoot rockets at Ufos.");
		ufoMsg.x = ufo.x + ufo.width / 2;
		ufoMsg.y = ufo.y + 20;
		ufoMsg.scale.set(0.8);
		this.uiContainer.addChild(ufoMsg);

		const ufoBomb: GameObjectSprite = new GameObjectSprite(Texture.from("./images/enemy_bomb.png"));
		ufoBomb.width = 70;
		ufoBomb.height = 70;
		ufoBomb.x = ufo.x + ufo.width;
		ufoBomb.y = ufo.y + ufo.height;
		this.uiContainer.addChild(ufoBomb);
	}

	private addUfoBoss() {
		const ufoBoss: GameObjectSprite = new GameObjectSprite(Texture.from("./images/ufo_boss_1_idle.png"));
		ufoBoss.width = 150;
		ufoBoss.height = 150;
		ufoBoss.x = 300;
		ufoBoss.y = 150;
		this.uiContainer.addChild(ufoBoss);

		const ufoMsg: MessageBubble = new MessageBubble(0, "Shoot rockets at Bosses.");
		ufoMsg.x = ufoBoss.x + ufoBoss.width / 2;
		ufoMsg.y = ufoBoss.y + 20;
		ufoMsg.scale.set(0.8);
		this.uiContainer.addChild(ufoMsg);

		const ufoBossBomb: GameObjectSprite = new GameObjectSprite(Texture.from("./images/ufo_boss_rocket_1.png"));
		ufoBossBomb.width = 70;
		ufoBossBomb.height = 70;
		ufoBossBomb.x = ufoBoss.x + ufoBoss.width;
		ufoBossBomb.y = ufoBoss.y + ufoBoss.height;
		ufoBossBomb.angle = 33;
		this.uiContainer.addChild(ufoBossBomb);
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
