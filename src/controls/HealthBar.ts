import { ProgressBar } from "@pixi/ui";
import { Container, Graphics, Texture } from "pixi.js";
import { LabeledIcon } from "./LabeledIcon";


export class HealthBar extends Container {

	private maximum: number = 0;
	private value: number = 0;
	
	private progressBar: ProgressBar;
	private iconTexture: Texture;
	private iconLabel: LabeledIcon;
	private iconLabelFontSize: number = 17;

	private displayValueInstead: boolean = false;

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

		this.iconLabel = new LabeledIcon(uri, 45, 45, this.progressBar.progress.toString(), this.iconLabelFontSize);
		this.addChild(this.iconLabel);

		scene.addChild(this);
	}

	setToDisplayValueInstead(displayValueInstead: boolean): HealthBar {
		this.displayValueInstead = displayValueInstead;
		return this;
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
		return this;
	}

	setValue(value: number): HealthBar {
		if (this.maximum == 0)
			this.maximum = 100;

		this.value = value;

		this.progressBar.progress = this.value / this.maximum * 100;

		if (this.displayValueInstead) {
			this.iconLabel.setLabel(this.value.toString(), this.iconLabelFontSize);
		}
		else {
			this.iconLabel.setLabel(this.progressBar.progress.toString(), this.iconLabelFontSize);
		}		

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

