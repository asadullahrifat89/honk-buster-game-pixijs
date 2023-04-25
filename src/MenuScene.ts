import { Container } from "pixi.js";
import { Constants, ConstructType } from "./Constants";
import { GameObject } from "./GameObject";
import { GameObjectSprite } from "./GameObjectSprite";
import { IScene } from "./IScene";
import { Manager } from "./Manager";


export class MenuScene extends Container implements IScene {

	private _coverContainer: GameObject;

	constructor() {
		super();

		this._coverContainer = new GameObject(0);
		this._coverContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this._coverContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

		this._coverContainer.addChild(sprite);

		this._coverContainer.setPosition(Manager.width / 2 - this._coverContainer.width / 2, Manager.height / 2 - this._coverContainer.height / 2);

		this.addChild(this._coverContainer);
	}

	public update(_framesPassed: number) {

	}

	public resize(scale: number): void {
		this._coverContainer.scale.set(scale);
		this._coverContainer.setPosition(Manager.width / 2 - this._coverContainer.width / 2, Manager.height / 2 - this._coverContainer.height / 2);
	}
}
