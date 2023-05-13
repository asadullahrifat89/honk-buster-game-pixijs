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

	constructor(speed: number, message: string = "", fontSize: number = 26) {
		super(speed);

		this.messageContainer = new Container();

		this.messageGraphics = new Graphics();
		this.messageContainer.addChild(this.messageGraphics);

		this.messageText = new Text(message, {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: Constants.MESSAGE_BOX_TEXT_COLOR,
			fontSize: fontSize
		});
		this.messageText.x = 10;
		this.messageText.y = 5;
		this.messageContainer.addChild(this.messageText);

		if (message != "") {
			this.messageGraphics = this.drawMessageGraphics();
			this.messageContainer.addChildAt(this.messageGraphics, 0);
		}

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

	reposition(source: GameObjectContainer, message: string, fontSize: number = 26) {
		this.source = source;		
		this.setMessage(message, fontSize);
		this.move();
	}

	setMessage(message: string, fontSize: number = 26) {
		this.messageText.text = message;
		if (fontSize != 26) {
			this.messageText.style = {
				fontFamily: Constants.GAME_DEFAULT_FONT,
				align: "center",
				fill: Constants.MESSAGE_BOX_TEXT_COLOR,
				fontSize: fontSize
			};
		}
		this.messageContainer.removeChild(this.messageGraphics);
		this.messageGraphics.destroy();
		this.messageGraphics = this.drawMessageGraphics();
		this.messageContainer.addChildAt(this.messageGraphics, 0);
	}

	move() {
		this.setPosition(this.source.x + this.source.width / 2, this.source.y - this.messageContainer.height);
	}

	private drawMessageGraphics(): Graphics {
		return new Graphics().beginFill(0xffffff).lineStyle(3, Constants.MESSAGE_BOX_BORDER_COLOR).drawRoundedRect(0, 0, this.messageText.width + 20, this.messageText.height + 5, 4).endFill();
	}
}
