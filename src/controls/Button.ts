import { ColorMatrixFilter, Container, DisplayObject, FederatedPointerEvent, Text, TextStyle } from "pixi.js";
import { Constants } from "../Constants";


export class Button extends Container {

	private buttonFilter: ColorMatrixFilter;

	constructor(background: DisplayObject, onPressed: any, text: string = "") {
		super();

		this.buttonFilter = new ColorMatrixFilter();
		this.buttonFilter.saturate(1);

		this.filters = null;

		const buttonTextStyle: TextStyle = new TextStyle({
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: "#ffffff",
			fontSize: 26
		});

		this.interactive = true;

		this.addChild(background);

		if (text != "") {
			const buttonText = new Text(text, buttonTextStyle);
			buttonText.x = this.width / 2 - buttonText.width / 2;
			buttonText.y = (this.height / 2 - buttonText.height / 2) - 3;
			this.addChild(buttonText);
		}

		this.on("pointertap", onPressed, this);
		this.on('pointerover', this.onButtonOver, this);
		this.on('pointerout', this.onButtonOut, this);

		// Shows hand cursor
		this.cursor = 'pointer';
	}

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	onButtonOver(_e: FederatedPointerEvent) {
		this.filters = [this.buttonFilter];
	}

	onButtonOut(_e: FederatedPointerEvent) {
		this.filters?.pop();
	}
}