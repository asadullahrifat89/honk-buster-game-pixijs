﻿import { BlurFilter, Container, Graphics, Rectangle, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { GameInstructionsScene } from "./GameInstructionsScene";
import { PlayerGearSelectionScene } from "./PlayerGearSelectionScene";
import { TextureType, SoundType } from "../Enums";


export class GameTitleScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	constructor() {
		super();

		this.eventMode = 'dynamic';

		this.on("pointertap", () => {
			if (!SceneManager.interacted) {
				SceneManager.interacted = true;
			}
			SceneManager.toggleFullscreen();
		}, this);

		this.hitArea = new Rectangle(0, 0, SceneManager.width, SceneManager.height);
		this.spawnRings();

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

		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);
		this.uiContainer.addChild(this.bg_container);

		//#region title

		//const title = new Text("HONKY ROADS", {
		//	fontFamily: Constants.GAME_TITLE_FONT,
		//	align: "center",
		//	fill: "#ffffff",
		//	fontSize: 44
		//});
		//title.x = this.uiContainer.width / 2 - title.width / 2;
		//title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		//this.uiContainer.addChild(title);

		const title = new Text("HONKY", {
			fontFamily: Constants.GAME_TITLE_FONT,
			align: "center",
			fill: "#fe3c3e",
			fontSize: 45
		});
		title.x = this.uiContainer.width / 2 - title.width / 2 - 100;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 140;		
		this.uiContainer.addChild(title);

		const title2 = new Text("ROADS", {
			fontFamily: Constants.GAME_TITLE_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 45
		});
		title2.x = title.x + title.width + 5;
		title2.y = title.y;
		this.uiContainer.addChild(title2);

		//#endregion

		//#region tag line

		const subTitle = new Text("THE BATTLE AGAINST HONKS", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 19,
		});
		subTitle.x = this.uiContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.uiContainer.height / 2 - subTitle.height / 2) - 70;
		this.uiContainer.addChild(subTitle);

		//#endregion

		//#region how to play button

		const howToPlayButtonButton = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new GameInstructionsScene());

		}).setText("How To Play");
		howToPlayButtonButton.setPosition(this.uiContainer.width / 2 - howToPlayButtonButton.width / 2, (this.uiContainer.height / 2 - howToPlayButtonButton.height / 2));
		this.uiContainer.addChild(howToPlayButtonButton);

		//#endregion

		//#region play button

		const newGameButton = new Button(() => {
			SoundManager.play(SoundType.OPTION_SELECT);
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new PlayerGearSelectionScene());

		}).setText("Start Game");
		newGameButton.setPosition(this.uiContainer.width / 2 - newGameButton.width / 2, (this.uiContainer.height / 2 - newGameButton.height / 2) + 65);
		this.uiContainer.addChild(newGameButton);

		//#endregion

		const bottomline = new Text("- Made with ❤️ & PixiJS -", {
			fontFamily: "diloworld",
			align: "center",
			fill: "#ffffff",
			fontSize: 18,
		});
		bottomline.x = this.uiContainer.width / 2 - bottomline.width / 2;
		bottomline.y = (this.uiContainer.height / 2 - bottomline.height / 2) + 250;
		this.uiContainer.addChild(bottomline);

		if (!SoundManager.isPlaying(SoundType.GAME_INTRO_MUSIC))
			SoundManager.play(SoundType.GAME_INTRO_MUSIC, 0.8);
	}

	public update() {
		this.bg_container.hover();
		this.generateRings();
		this.animateRings();
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

	//#region Rings

	private ringGameObjects: Array<GameObjectContainer> = [];
	private readonly ringPopDelayDefault: number = 15 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ringPopDelay: number = 0;

	private spawnRings() {

		for (let j = 0; j < 3; j++) {

			const gameObject: GameObjectContainer = new GameObjectContainer();
			gameObject.disableRendering();
			gameObject.expandSpeed = 0.1;
			gameObject.addChild(new Graphics().lineStyle(1, 0xffffff).drawCircle(0, 0, 50));
			gameObject.filters = [new BlurFilter()];
			this.ringGameObjects.push(gameObject);
			this.addChild(gameObject);
		}
	}

	private generateRings() {

		this.ringPopDelay -= 0.1;

		if (this.ringPopDelay < 0) {
			var gameObject = this.ringGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.alpha = 1;
				gameObject.scale.set(1);
				gameObject.x = SceneManager.width / 2;
				gameObject.y = SceneManager.height / 2;
				gameObject.enableRendering();
			}

			this.ringPopDelay = this.ringPopDelayDefault;
		}
	}

	private animateRings() {

		var animatingRings = this.ringGameObjects.filter(x => x.isAnimating == true);

		if (animatingRings) {

			animatingRings.forEach(gameObject => {
				gameObject.expand();

				if (gameObject.scale.x >= 25) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion
}


