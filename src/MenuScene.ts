import { Container, Graphics, BitmapFont, FederatedPointerEvent, BitmapText } from "pixi.js";
import { Button } from "./Button";
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
			fontSize: 35,
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

		const title = new BitmapText("Honk Buster", {
			fontName: "gameplay",
			fontSize: 35,
			align: "center",
		});
		title.x = this._coverContainer.width / 2 - title.width / 2;
		title.y = (this._coverContainer.height / 2 - title.height / 2) - 120;
		this._coverContainer.addChild(title);

		const subTitle = new BitmapText("Save the planet from honkers", {
			fontName: "gameplay",
			fontSize: 22,
			align: "center",
		});
		subTitle.x = this._coverContainer.width / 2 - subTitle.width / 2;
		subTitle.y = (this._coverContainer.height / 2 - subTitle.height / 2) - 60;
		this._coverContainer.addChild(subTitle);

		const button = new Button(new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 250, 50, 10).endFill(), "New Game", this.newGame);
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