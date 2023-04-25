﻿import { Graphics } from 'pixi.js';
import { GameObject } from './GameObject';


export class CastShadow extends GameObject {

	public source: GameObject = new GameObject(0);

	constructor(source: GameObject, width: number, height: number) {

		super(source.speed);

		this.alpha = 0.7;
		this.expandSpeed = 0.013;
		this.source = source;

		this.width = width;
		this.height = height;

		const graphics = new Graphics().beginFill(0x202020).drawEllipse(0, 0, width, height).endFill();
		graphics.x = 0;
		graphics.y = 0;

		this.x = (source.getLeft() + source.width / 2) - this.width / 2;
		this.y = source.getBottom() + (source.castShadowDistance);

		this.addChild(graphics);

	}

	reset() {
		this.scale.set(1);
		this.setPosition(this.source.getLeft(), this.source.getBottom() + (this.source.castShadowDistance));
	}

	move() {
		if (this.source.gravitatesDown) {
			this.setPosition(this.source.x, this.y + this.speed / 1.5);
			this.shrink();
		}
		else if (this.source.gravitatesUp) {
			this.x = this.source.x;
		}
		else {
			this.setPosition(this.source.x, this.source.getBottom() + (this.source.castShadowDistance));
		}
	}
}