import { Graphics } from 'pixi.js';
import { GameObject } from './GameObject';


export class DropShadow extends GameObject {

	public source: GameObject = new GameObject(0);

	constructor(source: GameObject) {
		super(0);

		this.source = source;

		const graphics = new Graphics().beginFill(0x202020).drawEllipse(0, 0, source.width * 0.5, 25).endFill();
		graphics.x = 0;
		graphics.y = 0;

		this.x = (source.getLeft() + source.width / 2) - this.width / 2;
		this.y = source.getBottom() + (source.dropShadowDistance);

		this.addChild(graphics);
	}

	reset() {
		this.x = (this.source.getLeft() + this.source.width / 2) - this.width / 2;
		this.y = this.source.getBottom() + (this.source.dropShadowDistance);
	}
}
