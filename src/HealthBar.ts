import { ProgressBar } from "@pixi/ui";
import { Container, Texture } from "pixi.js";
import { GameObject } from "./GameObject";
import { GameObjectSprite } from "./GameObjectSprite";


export class HealthBar extends Container {

	private progressBar: ProgressBar;
	private icon: GameObject;
	private maximumHealth: number = 0;
	private value: number = 100;

	public tag: any;

	constructor(texture: Texture, scene: Container) {
		super();

		this.width = 100;
		this.height = 30;

		this.progressBar = new ProgressBar();
		this.progressBar.width = 60;
		this.progressBar.height = 10;

		let progressBarBackgroundContainer = new Container();
		progressBarBackgroundContainer.width = 60;
		progressBarBackgroundContainer.height = 10;

		let healthBar_bg_sprite = new GameObjectSprite(Texture.from('healthBar_bg.png'));
		healthBar_bg_sprite.width = 60;
		healthBar_bg_sprite.height = 10;
		progressBarBackgroundContainer.addChild(healthBar_bg_sprite);

		this.progressBar.setBackground(progressBarBackgroundContainer);

		let progressBarForegroundContainer = new Container();
		progressBarForegroundContainer.width = 60;
		progressBarForegroundContainer.height = 10;

		let healthBar_sprite = new GameObjectSprite(Texture.from('healthBar.png'));
		healthBar_sprite.width = 60;
		healthBar_sprite.height = 10;
		progressBarForegroundContainer.addChild(healthBar_sprite);

		this.progressBar.setFill(progressBarForegroundContainer);

		this.progressBar.progress = 0;

		this.progressBar.x = 35;
		this.progressBar.y = 10;

		this.addChild(this.progressBar);

		this.icon = new GameObject(0);
		this.icon.height = 30;
		this.icon.width = 30;

		this.icon.x = 0;
		this.icon.y = 0;

		let sprite: GameObjectSprite = new GameObjectSprite(texture);
		sprite.width = 30;
		sprite.height = 30;
		sprite.x = 0;
		sprite.y = 0;
		this.icon.addChild(sprite);

		this.addChild(this.icon);

		scene.addChild(this);
	}

	hasHealth(): boolean {
		return this.progressBar.progress > 0;
	}

	setMaximumValue(value: number) {
		this.maximumHealth = value;
	}

	setIcon(texture: Texture) {
		this.icon.setTexture(texture);
	}

	setValue(value: number) {
		if (this.maximumHealth == 0)
			this.maximumHealth = 100;

		this.value = value;

		this.progressBar.progress = this.value / this.maximumHealth * 100;

		if (this.value > 0)
			this.alpha = 1;
		else
			this.alpha = 0;
	}

	getValue(): number {
		return this.value;
	}

	getProgress(): number {
		return this.progressBar.progress;
	}

	reset() {
		this.setValue(0);
	}

	reposition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

