import { BlurFilter, Container, Graphics, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { SoundType, TextureType } from "../Enums";
import { SelectionButton } from "../controls/SelectionButton";
import { SoundManager } from "../managers/SoundManager";
import { Button } from "../controls/Button";
import { GamePlayScene } from "./GamePlayScene";


export class GameStageScene extends Container implements IScene {

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

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.GAME_COVER_IMAGE));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		bg_sprite.filters = [new BlurFilter()];

		this.bg_container = new GameObjectContainer();
		/*this.bg_container.alpha = 0;*/
		this.bg_container.addChild(bg_sprite);
		this.uiContainer.addChild(this.bg_container);		

		const optionsGap = 256;

		//#region title

		const title = new Text("SELECT STAGE", {
			fontFamily: Constants.GAME_TITLE_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 220;
		this.uiContainer.addChild(title);

		//#endregion

		//#region title

		const stage_1_button = new SelectionButton("stage_1", 256, 256, "Country Roads", () => {

			SoundManager.play(SoundType.ITEM_SELECT);
			button.setIsEnabled(true);
			
		});

		stage_1_button.setPosition(this.uiContainer.width / 2 - (optionsGap / 2) * 1, (this.uiContainer.height / 2 - stage_1_button.height / 2));
		this.uiContainer.addChild(stage_1_button);

		//#endregion

		//#region confirm button

		const button = new Button(() => {

			if (button.isEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				this.uiContainer.destroy();
				SceneManager.changeScene(new GamePlayScene());
			}
			else {
				SoundManager.play(SoundType.DAMAGE_TAKEN);
			}

		}).setText("Confirm").setIsEnabled(false);
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 1);
		this.uiContainer.addChild(button);

		//#endregion
		
	}

	public update() {
		//this.bg_container.hover();
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


