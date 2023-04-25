import { ProgressBar } from "@pixi/ui";
import { Container, Texture } from "pixi.js";
import { GameObject } from "./GameObject";
import { GameObjectSprite } from "./GameObjectSprite";


export class HealthBar extends Container {

	private _progressBar: ProgressBar;
	private _imageContainer: GameObject;
	private _maximumHealth: number = 0;
	public tag: any;
	private _value: number = 100;

	constructor(texture: Texture, scene: Container) {
		super();

		this.width = 100;
		this.height = 30;

		this._progressBar = new ProgressBar();
		this._progressBar.width = 60;
		this._progressBar.height = 10;

		let progressBarBackgroundContainer = new Container();
		progressBarBackgroundContainer.width = 60;
		progressBarBackgroundContainer.height = 10;

		let healthBar_bg_sprite = new GameObjectSprite(Texture.from('healthBar_bg.png'));
		healthBar_bg_sprite.width = 60;
		healthBar_bg_sprite.height = 10;
		progressBarBackgroundContainer.addChild(healthBar_bg_sprite);

		this._progressBar.setBackground(progressBarBackgroundContainer);

		let progressBarForegroundContainer = new Container();
		progressBarForegroundContainer.width = 60;
		progressBarForegroundContainer.height = 10;

		let healthBar_sprite = new GameObjectSprite(Texture.from('healthBar.png'));
		healthBar_sprite.width = 60;
		healthBar_sprite.height = 10;
		progressBarForegroundContainer.addChild(healthBar_sprite);

		this._progressBar.setFill(progressBarForegroundContainer);

		this._progressBar.progress = 0;

		this._progressBar.x = 35;
		this._progressBar.y = 10;

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

	setMaximumValue(health: number) {
		this._maximumHealth = health;
	}

	setIcon(texture: Texture) {
		this._imageContainer.setTexture(texture);
	}

	setValue(value: number) {
		if (this._maximumHealth == 0)
			this._maximumHealth = 100;

		this._value = value;

		this._progressBar.progress = this._value / this._maximumHealth * 100;

		if (this._value > 0)
			this.alpha = 1;
		else
			this.alpha = 0;
	}

	getValue(): number {
		return this._value;
	}

	reset() {
		this.setValue(0);
	}

	reposition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

