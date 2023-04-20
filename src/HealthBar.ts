import { ProgressBar } from "@pixi/ui";
import { Container, Texture } from "pixi.js";
import { GameObject } from "./GameObject";
import { GameObjectSprite } from "./GameObjectSprite";


export class HealthBar extends Container {

	private _progressBar: ProgressBar;
	private _imageContainer: GameObject;
	private _maximumHealth: number = 0;

	constructor(texture: Texture, scene: Container) {
		super();

		this.width = 100;
		this.height = 30;

		this._progressBar = new ProgressBar();
		this._progressBar.width = 60;
		this._progressBar.height = 10;

		//this._progressBar.setFill('healthBar.png');
		this._progressBar.progress = 0;

		this._progressBar.x = 10;
		this._progressBar.y = 0;

		this.addChild(this._progressBar);

		this._imageContainer = new GameObject(0);
		this._imageContainer.height = 30;
		this._imageContainer.width = 30;

		this._imageContainer.x = 0;
		this._imageContainer.y = 0;

		let sprite: GameObjectSprite = new GameObjectSprite(texture);
		sprite.width = 30;
		sprite.height = 30;
		sprite.x = 0;
		sprite.y = 0;
		this._imageContainer.addChild(sprite);

		this.addChild(this._imageContainer);

		scene.addChild(this);
	}

	hasHealth(): boolean {
		return this._progressBar.progress > 0;
	}

	setMaximumHealth(health: number) {
		this._maximumHealth = health;
	}

	setIcon(texture: Texture) {
		this._imageContainer.setTexture(texture);
	}

	setValue(value: number) {
		if (this._maximumHealth > 0)
			this._progressBar.progress = value / this._maximumHealth * 100;
		else
			this._progressBar.progress = value;

		if (this._progressBar.progress > 0)
			this.alpha = 0;
		else
			this.alpha = 0;
	}

	getValue(): number {
		return this._progressBar.progress;
	}

	reset() {
		this.setValue(0);
	}

	reposition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

