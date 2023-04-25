﻿import { BitmapText, Container, Graphics, BitmapFont, FederatedPointerEvent, DisplayObject } from "pixi.js";
import { Constants, ConstructType } from "./Constants";
import { GameObject } from "./GameObject";
import { GameObjectSprite } from "./GameObjectSprite";
import { GameScene } from "./GameScene";
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

		const button = new Button(new Graphics().beginFill(0x5FC4F8).drawRoundedRect(0, 0, 250, 50, 5), "New Game", this.newGame);
		button.setPosition(this._coverContainer.width / 2 - button.width / 2, this._coverContainer.height / 2 - button.height / 2);

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

	private newGame(_e: FederatedPointerEvent) {
		this.removeChild(this._coverContainer);

		// Change scene to the menu scene!
		Manager.changeScene(new GameScene());
	}
}

export class Button extends Container {

	constructor(background: DisplayObject, text: string, onPressed: any) {
		super();

		// If you need to know, this is the expensive part. This creates the font atlas
		BitmapFont.from("gameplay", {
			fill: "#ffffff",
			fontFamily: "gameplay",
			fontSize: 26,
			align: "center",
		});

		this.interactive = true;

		this.addChild(background);

		const buttonText = new BitmapText(text, {
			fontName: "gameplay",
			fontSize: 26,
			align: "center",
		});

		buttonText.x = this.width / 2 - buttonText.width / 2;
		buttonText.y = (this.height / 2 - buttonText.height / 2) + 2;

		this.addChild(buttonText);

		this.on("pointertap", onPressed, this);
	}

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

}