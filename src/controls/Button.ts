import { ColorMatrixFilter, Container, DisplayObject, FederatedPointerEvent, Graphics, Text, TextStyle, TextStyleAlign } from "pixi.js";
import { Constants } from "../Constants";


export class Button extends Container {

	private buttonFilter: ColorMatrixFilter;
	private buttonText: Text;
	private buttonBackground: DisplayObject;

	constructor(onPressed: any) {
		super();
		this.interactive = true;
		this.filters = null;

		this.buttonFilter = new ColorMatrixFilter();
		this.buttonFilter.saturate(1);

		// add the button background
		this.buttonBackground = new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 250, 50, 10).endFill();
		this.addChild(this.buttonBackground);

		this.buttonText = new Text(); // this is not added yet

		this.on("pointertap", onPressed, this);
		this.on('pointerover', this.onButtonOver, this);
		this.on('pointerout', this.onButtonOut, this);

		// Shows hand cursor
		this.cursor = 'pointer';
	}

	setBackground(content: DisplayObject = new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0xffffff).drawRoundedRect(0, 0, 250, 50, 10).endFill()): Button {
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
		this.buttonText.y = (this.height / 2 - this.buttonText.height / 2) - 3;
		this.addChild(this.buttonText);

		return this;
	}	

	setPosition(x: number, y: number): Button {
		this.x = x;
		this.y = y;

		return this;
	}

	onButtonOver(_e: FederatedPointerEvent) {
		this.filters = [this.buttonFilter];
	}

	onButtonOut(_e: FederatedPointerEvent) {
		this.filters?.pop();
	}
}