import { Container, Texture } from "pixi.js";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "./Button";
import { MessageBubble } from "./MessageBubble";


export class SelectionButton extends Container {

	constructor(uri: string, width: number, height: number, label: string, action: any, isEnabled: boolean = true) {
		super();
		const sprite: GameObjectSprite = new GameObjectSprite(Texture.from(uri));
		sprite.width = width;
		sprite.height = height;
		sprite.x = 0;
		sprite.y = 0;

		const button = new Button(() => {
			action();
		}).setBackground(sprite).setIsEnabled(isEnabled);
		this.addChild(button);

		const msg = new MessageBubble(0, label, 20);
		msg.setPosition(button.x + button.width / 2, button.y + button.height / 2);
		this.addChild(msg);
	}

	setPosition(x: number, y: number): SelectionButton {
		this.x = x;
		this.y = y;

		return this;
	}
}
