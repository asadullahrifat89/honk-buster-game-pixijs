import { GrayscaleFilter } from "@pixi/filter-grayscale";
import { Container, Texture } from "pixi.js";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "./Button";
import { MessageBubble } from "./MessageBubble";


export class SelectionButton extends Container {

	private filter = new GrayscaleFilter();
	private sprite: GameObjectSprite;

	constructor(uri: string, width: number, height: number, label: string, action: any, isEnabled: boolean = true, centerLabelHorizontally: boolean = false, centerLabelVertically: boolean = false, fontSize: number = 20) {
		super();
		this.sprite = new GameObjectSprite(Texture.from(uri));
		this.sprite.width = width;
		this.sprite.height = height;
		this.sprite.x = 0;
		this.sprite.y = 0;

		const button = new Button(() => {
			action();
		}).setBackground(this.sprite).setIsEnabled(isEnabled);
		this.addChild(button);

		const msg = new MessageBubble(0, label, fontSize);
		msg.setPosition(
			centerLabelHorizontally ? button.width / 2 - msg.width / 2 : button.x + button.width / 2,
			centerLabelVertically ? button.height / 2 - msg.height / 2 : button.y + button.height - msg.height - 10);

		this.addChild(msg);
	}

	unselect() {
		this.sprite.filters = [this.filter];
	}

	select() {
		this.sprite.filters = null;
	}

	setPosition(x: number, y: number): SelectionButton {
		this.x = x;
		this.y = y;
		return this;
	}
}

