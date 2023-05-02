import { AnimatedSprite, BaseTexture, Spritesheet, SpriteSheetJson } from 'pixi.js';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class Explosion extends GameObjectContainer {

	private explosionAnimation: AnimatedSprite;

	constructor(speed: number) {
		super(speed);
		this.explosionAnimation = getExplosionAnimation();
		this.addChild(this.explosionAnimation);
	}

	reset() {
		this.alpha = 1.0;
		this.explosionAnimation.stop();
	}

	reposition(source: GameObjectContainer) {
		this.x = source.x;
		this.y = source.y;
		this.explosionAnimation.gotoAndPlay(0);
	}

	override disableRendering() {
		this.explosionAnimation.stop();
		super.disableRendering();
	}
}

function getExplosionAnimation(): AnimatedSprite {
	// Create object to store sprite sheet data
	const atlasData: SpriteSheetJson = {
		frames: {
			frame0: {
				frame: { x: 138 * 0, y: 0, w: 138, h: 138 },
				sourceSize: { w: 138, h: 138 },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame1: {
				frame: { x: 138 * 1, y: 0, w: 138, h: 138 },
				sourceSize: { w: 138, h: 138 },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame2: {
				frame: { x: 138 * 2, y: 0, w: 138, h: 138 },
				sourceSize: { w: 138, h: 138 },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame3: {
				frame: { x: 138 * 3, y: 0, w: 138, h: 138 },
				sourceSize: { w: 138, h: 138 },
				spriteSourceSize: { x: 0, y: 0 }
			},
		},
		meta: {
			image: './images/explosion.png',
			scale: "1",
		},
		animations: {
			frames: ["frame0", "frame1", "frame2", "frame3"]
		}
	};

	// Create the SpriteSheet from data and image
	const spritesheet: Spritesheet = new Spritesheet(BaseTexture.from(atlasData.meta.image), atlasData);

	spritesheet.parse();

	let animation = new AnimatedSprite(spritesheet.animations.frames);

	// set the animation speed 
	animation.animationSpeed = 0.2;
	animation.loop = false;
	animation.anchor.set(0.5);

	// spritesheet is ready to use!
	return animation;
}
