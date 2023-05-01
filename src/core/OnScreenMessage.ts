import { Container, Text, Texture } from "pixi.js";
import { GameObjectSprite } from "./GameObjectSprite";


export class OnScreenMessage {

	public isAnimating: boolean = false;

	private messageAuthor: GameObjectSprite;
	private messageContainer: Container;
	private messageText: Text;
	private messageOnScreenDelay: number = 0;
	private readonly messageOnScreenDelayDefault: number = 20;

	constructor(scene: Container) {

		this.messageContainer = new Container();

		this.messageAuthor = new GameObjectSprite(Texture.from("./images/character_maleAdventurer_talk.png"));
		this.messageAuthor.width = 192 / 1.5;
		this.messageAuthor.height = 256 / 1.5;
		this.messageAuthor.x = 0;
		this.messageAuthor.y = 0;
		this.messageAuthor.anchor.set(0.5);

		this.messageContainer.addChild(this.messageAuthor);



		this.messageText = new Text("", {
			fontFamily: "gameplay",
			align: "center",
			fill: "#ffffff",
			fontSize: 30
		});
		this.messageText.x = this.messageAuthor.width / 2;
		this.messageContainer.addChild(this.messageText);

		this.disableRendering();
		scene.addChild(this.messageContainer);
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
		this.messageOnScreenDelay -= 0.1;
	}

	isDepleted() {
		return this.messageOnScreenDelay <= 0;;
	}

	setTitle(title: string, icon: Texture = Texture.from("./images/character_maleAdventurer_talk.png")) {
		this.messageText.text = title;
		this.messageAuthor.setTexture(icon);
	}

	reposition(x: number, y: number) {
		this.messageContainer.x = x - this.messageContainer.width / 2;
		this.messageContainer.y = y /*- this.messageContainer.height / 2*/;
	}

	getText(): string {
		return this.messageText.text;
	}
}