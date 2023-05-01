import { Container, Graphics, Text } from "pixi.js";
import { GameObjectContainer } from "./GameObjectContainer";


export class MessageBubble extends GameObjectContainer {

	public source: GameObjectContainer = new GameObjectContainer();
	private messageContainer: Container;
	private messageGraphics: Graphics;
	private messageText: Text;
	private messageOnScreenDelay: number = 0;
	private readonly messageOnScreenDelayDefault: number = 20;

	constructor(speed: number) {
		super(speed);

		this.messageContainer = new Container();

		this.messageGraphics = new Graphics();
		this.messageGraphics.x = 0;
		this.messageContainer.addChild(this.messageGraphics);

		this.messageText = new Text("", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 19
		});
		this.messageText.x = 5;
		this.messageText.y = 5;
		this.messageContainer.addChild(this.messageText);

		this.addChild(this.messageContainer);

		this.disableRendering();
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

	reposition(message: string, source: GameObjectContainer) {
		this.speed = source.speed;
		this.messageText.text = message;
		this.messageContainer.removeChild(this.messageGraphics);
		this.messageGraphics = this.drawMessageGraphics();
		this.messageContainer.addChildAt(this.messageGraphics, 0);

		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 40);
	}

	move() {
		this.setPosition(this.source.x, this.source.getTop());
	}

	private drawMessageGraphics(): Graphics {
		return new Graphics().beginFill(0x5FC4F8).lineStyle(4, 0x2f3a5a).drawRoundedRect(0, 0, this.messageText.width + 25, 40, 4).endFill();
	}
}
