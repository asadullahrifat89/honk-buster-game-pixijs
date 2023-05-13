import { ProgressBar } from "@pixi/ui";
import { Container, Graphics, Texture } from "pixi.js";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { LabeledIcon } from "./LabeledIcon";


export class HealthBar extends Container {

	private maximum: number = 0;
	private value: number = 0;

	private progressBar: ProgressBar;
	private iconContainer: GameObjectContainer;
	private iconTexture: Texture;
	private iconLabel: LabeledIcon;

	public tag: any;

	constructor(uri: string, scene: Container, foreground: number = 0xf73e3e, background: number = 0xd9e2e9) {
		super();

		this.iconTexture = Texture.from(uri);

		this.progressBar = new ProgressBar();
		this.progressBar.width = 58;
		this.progressBar.height = 10;
		this.progressBar.x = 30;
		this.progressBar.y = 10;
		this.progressBar.setBackground(new Graphics().beginFill(background).drawRoundedRect(0, 0, 58, 22, 3).endFill());
		this.progressBar.setFill(new Graphics().beginFill(foreground).drawRoundedRect(0, 0, 58, 22, 3).endFill());
		this.progressBar.progress = 0;
		this.addChild(this.progressBar);

		this.iconContainer = new GameObjectContainer();
		this.addChild(this.iconContainer);		

		this.iconLabel = new LabeledIcon(uri, 45, 45, this.progressBar.progress.toString());
		this.iconContainer.addChild(this.iconLabel);

		scene.addChild(this);
	}

	hasHealth(): boolean {
		return this.progressBar.progress > 0;
	}

	setMaximumValue(value: number): HealthBar {
		this.maximum = value;
		return this;
	}

	setIcon(icon: Texture): HealthBar {
		this.iconTexture = icon;
		this.iconLabel.setIcon(icon);
		this.iconContainer.setTexture(icon);
		return this;
	}

	setValue(value: number): HealthBar {
		if (this.maximum == 0)
			this.maximum = 100;

		this.value = value;

		this.progressBar.progress = this.value / this.maximum * 100;

		this.iconLabel.setLabel(this.progressBar.progress.toString());

		if (this.value > 0)
			this.alpha = 1;
		else
			this.alpha = 0;

		return this;
	}

	getValue(): number {
		return this.value;
	}

	getIcon(): Texture {
		return this.iconTexture;
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

