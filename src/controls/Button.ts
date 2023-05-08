import { GrayscaleFilter } from "@pixi/filter-grayscale";
import { OutlineFilter } from "@pixi/filter-outline";
import { Container, DisplayObject, FederatedPointerEvent, Graphics, Text, TextStyle, TextStyleAlign } from "pixi.js";
import { Constants, SoundType } from "../Constants";
import { SoundManager } from "../managers/SoundManager";


export class Button extends Container {

	private buttonFilter: OutlineFilter;
	private buttonDisabledFilter: GrayscaleFilter;
	private buttonText: Text;
	private buttonBackground: DisplayObject;
	private isEnabled: boolean = true;

	constructor(onPressed: any) {
		super();

		this.interactive = true;
		this.filters = null;

		this.buttonFilter = new OutlineFilter(4);
		this.buttonDisabledFilter = new GrayscaleFilter();

		// add the button background
		this.buttonBackground = this.getDefaultGraphics();
		this.addChild(this.buttonBackground);

		this.buttonText = new Text(); // this is not added yet

		this.on("pointertap", () => {
			if (this.isEnabled) {
				onPressed();
			}
			else {
				SoundManager.play(SoundType.PLAYER_HEALTH_LOSS);
			}				
		}, this);
		this.on('pointerover', this.onButtonOver, this);
		this.on('pointerout', this.onButtonOut, this);

		// Shows hand cursor
		this.cursor = 'pointer';
	}

	setBackground(content: DisplayObject = this.getDefaultGraphics()): Button {
		this.removeChild(this.buttonBackground);
		this.buttonBackground = content;
		this.addChild(this.buttonBackground);

		return this;
	}

	setText(text: string, fontSize: number = 26, fill: string = "#ffffff", align: TextStyleAlign = 'center'): Button {
		this.removeChild(this.buttonText);

		const buttonTextStyle: TextStyle = new TextStyle({
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: align,
			fill: fill,
			fontSize: fontSize
		});

		this.buttonText = new Text(text, buttonTextStyle);
		this.buttonText.x = this.width / 2 - this.buttonText.width / 2;
		this.buttonText.y = (this.height / 2 - this.buttonText.height / 2);
		this.addChild(this.buttonText);

		return this;
	}

	setPosition(x: number, y: number): Button {
		this.x = x;
		this.y = y;

		return this;
	}

	onButtonOver(_e: FederatedPointerEvent) {
		if (this.isEnabled)
			this.filters = [this.buttonFilter];
	}

	onButtonOut(_e: FederatedPointerEvent) {
		if (this.isEnabled)
			this.filters?.pop();
	}

	setIsEnabled(isEnabled: boolean): Button {
		this.isEnabled = isEnabled;

		if (!isEnabled) {
			this.filters = [this.buttonDisabledFilter];
		}
		else {
			this.filters = null;
		}
		return this;
	}

	getIsEnabled(): boolean {
		return this.isEnabled;
	}

	private getDefaultGraphics(): Graphics {
		return new Graphics().beginFill(0x5FC4F8).lineStyle(2, 0xffffff).drawRoundedRect(0, 0, 250, 50, 5).endFill();
	}
}