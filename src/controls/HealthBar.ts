import { ProgressBar } from "@pixi/ui";
import { Container, Graphics, Texture } from "pixi.js";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { GameObjectSprite } from "../core/GameObjectSprite";


export class HealthBar extends Container {

	private progressBar: ProgressBar;
	private iconContainer: GameObjectContainer;
	private maximumHealth: number = 0;
	private value: number = 100;
	private icon: Texture;

	public tag: any;

	constructor(icon: Texture, scene: Container) {
		super();

		this.icon = icon;
		this.width = 100;
		this.height = 30;

		//const graphics = new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 100, 35, 3).endFill();
		//this.addChild(graphics);

		this.progressBar = new ProgressBar();
		this.progressBar.width = 58;
		this.progressBar.height = 10;

		this.progressBar.setBackground(new Graphics().beginFill(0xd9e2e9).lineStyle(3, 0x2f3a5a).drawRoundedRect(0, 0, 58, 20, 2).endFill());

		this.progressBar.setFill(new Graphics().beginFill(0xf73e3e).lineStyle(3, 0x2f3a5a).drawRoundedRect(0, 0, 58, 20, 2).endFill());

		this.progressBar.progress = 0;
		this.progressBar.x = 37;
		this.progressBar.y = 7;
		this.addChild(this.progressBar);

		this.iconContainer = new GameObjectContainer();

		let iconSprite: GameObjectSprite = new GameObjectSprite(icon);
		iconSprite.width = 33;
		iconSprite.height = 33;
		iconSprite.x = 0;
		iconSprite.y = 2;
		this.iconContainer.addChild(iconSprite);

		this.addChild(this.iconContainer);

		scene.addChild(this);
	}

	hasHealth(): boolean {
		return this.progressBar.progress > 0;
	}

	setMaximumValue(value: number) {
		this.maximumHealth = value;
	}

	setIcon(icon: Texture) {
		this.icon = icon;
		this.iconContainer.setTexture(icon);
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

	getIcon(): Texture {
		return this.icon;
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

