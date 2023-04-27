import { GrayscaleFilter } from "@pixi/filter-grayscale";
import { Container, DisplayObject, FederatedPointerEvent, Text, TextStyle } from "pixi.js";


export class Button extends Container {

	constructor(background: DisplayObject, onPressed: any, text: string = "") {
		super();

		this.filters = null;

		const buttonTextStyle: TextStyle = new TextStyle({
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 26
		});

		this.interactive = true;

		this.addChild(background);

		if (text != "") {
			const buttonText = new Text(text, buttonTextStyle);

			buttonText.x = this.width / 2 - buttonText.width / 2;
			buttonText.y = (this.height / 2 - buttonText.height / 2);

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
		this.filters = [new GrayscaleFilter()];
		this.scale.set(1.1);
		this.x -= 7;
		this.y -= 3.5;
	}

	onButtonOut(_e: FederatedPointerEvent) {
		this.filters = null;
		this.scale.set(1);
		this.x += 7;
		this.y += 3.5;
	}
}