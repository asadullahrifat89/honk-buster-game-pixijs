import { Container, Graphics, Text, Texture } from "pixi.js";
import { Constants } from "../Constants";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { GameObjectSprite } from "../core/GameObjectSprite";


export class OnScreenMessage {

	public isAnimating: boolean = false;

	private messageContainer: GameObjectContainer;
	private messageGraphics: Graphics;
	private messageAuthor: GameObjectSprite;
	private messageText: Text;
	private messageOnScreenDelay: number = 0;
	private readonly messageOnScreenDelayDefault: number = 17;

	constructor(scene: Container) {
		this.messageContainer = new GameObjectContainer();

		this.messageAuthor = new GameObjectSprite(Texture.from("character_maleAdventurer_talk"));
		this.messageAuthor.width = 256 / 2.2;
		this.messageAuthor.height = 256 / 2.2;
		this.messageAuthor.x = 50;
		this.messageAuthor.y = 0;
		this.messageAuthor.anchor.set(0.5);
		this.messageContainer.addChild(this.messageAuthor);

		this.messageGraphics = new Graphics();
		this.messageGraphics.x = this.messageAuthor.width / 1.8;
		this.messageContainer.addChild(this.messageGraphics);

		this.messageText = new Text("", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			align: "center",
			fill: Constants.MESSAGE_BOX_TEXT_COLOR,
			fontSize: 20
		});
		this.messageText.x = this.messageAuthor.width / 1.5;
		this.messageText.y = 8;
		this.messageContainer.addChild(this.messageText);

		scene.addChild(this.messageContainer);

		this.disableRendering();
	}

	disableRendering() {
		this.isAnimating = false;
		this.messageContainer.renderable = false;
	}

	enableRendering() {
		this.isAnimating = true;
		this.messageContainer.renderable = true;
	}

	reset() {
		this.messageOnScreenDelay = this.messageOnScreenDelayDefault;
	}

	depleteOnScreenDelay() {
		this.messageContainer.pop();
		this.messageOnScreenDelay -= 0.1;
	}

	isDepleted() {
		return this.messageOnScreenDelay <= 0;;
	}

	setContent(message: string, icon: Texture) {
		this.messageContainer.setPopping();
		this.messageText.text = message;
		this.messageAuthor.setTexture(icon);

		this.messageGraphics.destroy();
		this.messageContainer.removeChild(this.messageGraphics);
		this.messageGraphics = this.drawMessageGraphics();
		this.messageGraphics.x = this.messageAuthor.width / 1.8;
		this.messageContainer.addChildAt(this.messageGraphics, 1);
	}

	reposition(x: number, y: number) {
		this.messageContainer.x = x - this.messageContainer.width / 2;
		this.messageContainer.y = y - 15;
	}

	getText(): string {
		return this.messageText.text;
	}

	private drawMessageGraphics(): Graphics {
		return new Graphics().beginFill(0xffffff).lineStyle(3, Constants.MESSAGE_BOX_BORDER_COLOR).drawRoundedRect(0, 0, this.messageText.width + 28, 40, 4).endFill();
	}
}

