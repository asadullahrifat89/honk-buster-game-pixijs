﻿import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { Container, Graphics, FederatedPointerEvent, Text, BlurFilter } from "pixi.js";
import { Button } from "./Button";
import { Constants, ConstructType, SoundType } from "./Constants";
import { GameObject } from "./GameObject";
import { GameObjectSprite } from "./GameObjectSprite";
import { IScene } from "./IScene";
import { PlayerSelectionScene } from "./PlayerSelectionScene";
import { SceneManager } from "./SceneManager";
import { SoundManager } from "./SoundManager";


export class GameOverScene extends Container implements IScene {

	private sceneContainer: GameObject;

	constructor() {
		super();

		this.sceneContainer = new GameObject(0);
		this.sceneContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.sceneContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.sceneContainer.setPosition(SceneManager.width / 2 - this.sceneContainer.width / 2, SceneManager.height / 2 - this.sceneContainer.height / 2);
		this.sceneContainer.filters = [new DropShadowFilter()];
		this.addChild(this.sceneContainer);

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));
		sprite.x = 0;
		sprite.y = 0;
		sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		sprite.filters = [new BlurFilter()];
		this.sceneContainer.addChild(sprite);

		const title = new Text("Game Over", {
			fontFamily: "gameplay",
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.sceneContainer.width / 2 - title.width / 2;
		title.y = (this.sceneContainer.height / 2 - title.height / 2) - 120;
		this.sceneContainer.addChild(title);

		const subTitle = new Text("Score " + Constants.GAME_SCORE, {
			fontFamily: "gameplay",
			fontSize: 32,
			align: "center",
			fill: "#ffffff",
		});
		subTitle.x = this.sceneContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this.sceneContainer.height / 2 - subTitle.height / 2) - 60;
		this.sceneContainer.addChild(subTitle);

		const button = new Button(new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 250, 50, 10).endFill(), this.onProceed, "Play Again");
		button.setPosition(this.sceneContainer.width / 2 - button.width / 2, this.sceneContainer.height - button.height * 2);
		this.sceneContainer.addChild(button);

		SoundManager.play(SoundType.GAME_OVER);
	}

	public update(_framesPassed: number) {
	}

	public resize(scale: number): void {
		this.sceneContainer.scale.set(scale);
		this.sceneContainer.setPosition(SceneManager.width / 2 - this.sceneContainer.width / 2, SceneManager.height / 2 - this.sceneContainer.height / 2);
	}

	private onProceed(_e: FederatedPointerEvent) {
		SoundManager.play(SoundType.OPTION_SELECT);
		this.removeChild(this.sceneContainer);
		SceneManager.changeScene(new PlayerSelectionScene());
	}
}