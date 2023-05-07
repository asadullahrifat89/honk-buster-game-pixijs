import { GrayscaleFilter } from "@pixi/filter-grayscale";
import { Container, Text, BlurFilter } from "pixi.js";
import { Constants, ConstructType, SoundType } from "../Constants";
import { Button } from "../controls/Button";
import { MessageBubble } from "../controls/MessageBubble";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { IScene } from "../managers/IScene";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { GameTitleScene } from "./GameTitleScene";
import { ScreenOrientationScene } from "./ScreenOrientationScene";



export class GameOverScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;

	constructor() {
		super();

		// record max score
		if (Constants.GAME_SCORE > Constants.GAME_SCORE_MAX) {
			Constants.GAME_SCORE_MAX = Constants.GAME_SCORE;
		}

		// record max level
		if (Constants.GAME_LEVEL > Constants.GAME_LEVEL_MAX) {
			Constants.GAME_LEVEL_MAX = Constants.GAME_LEVEL;
		}

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
		this.uiContainer.addChild(bg_sprite);

		// game over title
		const title = new Text("GAME OVER", {
			fontFamily: Constants.GAME_TITLE_FONT,
			fontSize: 42,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		// score
		const score = new Text("Score " + Constants.GAME_SCORE, {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 30,
			align: "center",
			fill: "#ffffff",
		});
		score.x = this.uiContainer.width / 2 - score.width / 2;
		score.y = (this.uiContainer.height / 2 - score.height / 2) - 60;
		this.uiContainer.addChild(score);

		// level
		const level = new Text("Lvl " + Constants.GAME_LEVEL, {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 20,
			align: "center",
			fill: "#ffffff",
		});
		level.x = this.uiContainer.width / 2 - level.width / 2;
		level.y = (this.uiContainer.height / 2 - level.height / 2) - 20;
		this.uiContainer.addChild(level);

		//TODO: check unlockables

		// health		
		if (Constants.GAME_LEVEL_MAX > 1 && Constants.GAME_LEVEL_MAX > Constants.HEALTH_LEVEL_MAX) {
			Constants.HEALTH_LEVEL_MAX = Constants.GAME_LEVEL_MAX;
		}

		const health = new GameObjectContainer();
		health.filters = [new GrayscaleFilter(), new BlurFilter()];

		const health_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.HEALTH_PICKUP));
		health_sprite.width = 256 / 3;
		health_sprite.height = 256 / 3;
		health_sprite.x = 0;
		health_sprite.y = 0;

		const health_container = new GameObjectContainer();
		health_container.addChild(health_sprite);
		health.addChild(health_container);

		const health_msg = new MessageBubble(0, "+ " + 5 * Constants.HEALTH_LEVEL_MAX, 20); // player hitpoint multiplied by health level max
		health_msg.setPosition(health_container.x + health_container.width, health_container.y + health_container.height - health_msg.height);
		health.addChild(health_msg);

		health.setPosition((this.uiContainer.width / 2 - (health.width / 2) * 2), (this.uiContainer.height / 2 - health.height / 2) + 50);
		this.uiContainer.addChild(health);

		if (Constants.HEALTH_LEVEL_MAX > 1) {
			health.filters = null;
		}

		// play again button
		const button = new Button(() => {

			SoundManager.play(SoundType.OPTION_SELECT);
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new GameTitleScene());

		}).setText("Play Again");
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);

		SoundManager.play(SoundType.GAME_OVER);
	}

	public update(_framesPassed: number) {
		//TODO: animate unlockables
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
