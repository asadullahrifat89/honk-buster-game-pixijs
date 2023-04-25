﻿import { ButtonContainer } from "@pixi/ui";
import { BitmapText, Container, Graphics, BitmapFont } from "pixi.js";
import { Constants, ConstructType } from "./Constants";
import { GameObject } from "./GameObject";
import { GameObjectSprite } from "./GameObjectSprite";
import { IScene } from "./IScene";
import { Manager } from "./Manager";


export class MenuScene extends Container implements IScene {

	private _coverContainer: GameObject;

	constructor() {
		super();

		// If you need to know, this is the expensive part. This creates the font atlas
		BitmapFont.from("gameplay", {
			fill: "#ffffff",
			fontFamily: "gameplay",
			fontSize: 26,
			align: "center",
		});

		this._coverContainer = new GameObject(0);
		this._coverContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this._coverContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

		this._coverContainer.addChild(sprite);

		const button = new ButtonContainer();
		button.addChild(new Graphics().beginFill(0x5FC4F8).drawRoundedRect(0, 0, 250, 50, 5));
		button.x = this._coverContainer.width / 2 - button.width / 2;
		button.y = this._coverContainer.height / 2 - button.height / 2;

		const textBlock = new BitmapText("New Game", {
			fontName: "gameplay",
			fontSize: 26,
			align: "center",
		});

		textBlock.x = button.width / 2 - textBlock.width / 2;
		textBlock.y = (button.height / 2 - textBlock.height / 2) + 2;

		button.addChild(textBlock);

		this._coverContainer.addChild(button);

		this._coverContainer.setPosition(Manager.width / 2 - this._coverContainer.width / 2, Manager.height / 2 - this._coverContainer.height / 2);

		this.addChild(this._coverContainer);
	}

	public update(_framesPassed: number) {
		//this._coverContainer.hover();
	}

	public resize(scale: number): void {
		this._coverContainer.scale.set(scale);
		this._coverContainer.setPosition(Manager.width / 2 - this._coverContainer.width / 2, Manager.height / 2 - this._coverContainer.height / 2);
	}
}
