import { Container, Graphics, Text } from "pixi.js";
import { Constants } from "../Constants";
import { GameObjectContainer } from "../core/GameObjectContainer";


export class MessageBubble extends GameObjectContainer {

	public source: GameObjectContainer = new GameObjectContainer();
	private messageContainer: Container;
	private messageGraphics: Graphics;
	private messageText: Text;
	private messageOnScreenDelay: number = 0;
	private readonly messageOnScreenDelayDefault: number = 15;

	constructor(speed: number) {
		super(speed);

		this.messageContainer = new Container();

		this.messageGraphics = new Graphics();
		this.messageContainer.addChild(this.messageGraphics);

		this.messageText = new Text("", {
			fontFamily: "diloworld",
			align: "center",
			fill: Constants.MESSAGE_BOX_TEXT_COLOR,
			fontSize: 22
		});
		this.messageText.x = 10;
		this.messageText.y = 5;
		this.messageContainer.addChild(this.messageText);

		this.addChild(this.messageContainer);
	}

	reset() {
		this.messageOnScreenDelay = this.messageOnScreenDelayDefault;
	}

	depleteOnScreenDelay() {
		this.messageOnScreenDelay -= 0.1;
	}

	isDepleted() {
		return this.messageOnScreenDelay <= 0;;
	}

	reposition(source: GameObjectContainer, message: string) {
		this.source = source;
		this.messageText.text = message;
		this.messageContainer.removeChild(this.messageGraphics);
		this.messageGraphics = this.drawMessageGraphics();
		this.messageContainer.addChildAt(this.messageGraphics, 0);

		this.move();
	}

	move() {
		this.setPosition(this.source.x + this.source.width / 2, this.source.y - this.messageContainer.height);
	}

	private drawMessageGraphics(): Graphics {
		return new Graphics().beginFill(0xffffff).lineStyle(3, Constants.MESSAGE_BOX_BORDER_COLOR).drawRoundedRect(0, 0, this.messageText.width + 20, 35, 4).endFill();
	}
}
