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

	// explosion 1
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
			image: './images/explosion_1.png',
			scale: "1",
		},
		animations: {
			frames: ["frame0", "frame1", "frame2", "frame3"]
		}
	};

	// explosion 2
	//const atlasData: SpriteSheetJson = {
	//	frames: {
	//		frame0: {
	//			frame: { x: 283.33 * 0, y: 237.5 * 0, w: 283.33, h: 237.5 },
	//			sourceSize: { w: 283.33, h: 237.5 },
	//			spriteSourceSize: { x: 0, y: 0 }
	//		},
	//		frame1: {
	//			frame: { x: 283.33 * 1, y: 237.5 * 0, w: 283.33, h: 237.5 },
	//			sourceSize: { w: 283.33, h: 237.5 },
	//			spriteSourceSize: { x: 0, y: 0 }
	//		},
	//		frame2: {
	//			frame: { x: 283.33 * 2, y: 237.5 * 0, w: 283.33, h: 237.5 },
	//			sourceSize: { w: 283.33, h: 237.5 },
	//			spriteSourceSize: { x: 0, y: 0 }
	//		},	

	//		//frame3: {
	//		//	frame: { x: 283.33 * 0, y: 237.5 * 1, w: 283.33, h: 237.5 },
	//		//	sourceSize: { w: 283.33, h: 237.5 },
	//		//	spriteSourceSize: { x: 0, y: 0 }
	//		//},
	//		//frame4: {
	//		//	frame: { x: 283.33 * 1, y: 237.5 * 1, w: 283.33, h: 237.5 },
	//		//	sourceSize: { w: 283.33, h: 237.5 },
	//		//	spriteSourceSize: { x: 0, y: 0 }
	//		//},
	//		//frame5: {
	//		//	frame: { x: 283.33 * 2, y: 237.5 * 1, w: 283.33, h: 237.5 },
	//		//	sourceSize: { w: 283.33, h: 237.5 },
	//		//	spriteSourceSize: { x: 0, y: 0 }
	//		//},

	//		//frame6: {
	//		//	frame: { x: 283.33 * 0, y: 237.5 * 2, w: 283.33, h: 237.5 },
	//		//	sourceSize: { w: 283.33, h: 237.5 },
	//		//	spriteSourceSize: { x: 0, y: 0 }
	//		//},
	//		//frame7: {
	//		//	frame: { x: 283.33 * 1, y: 237.5 * 2, w: 283.33, h: 237.5 },
	//		//	sourceSize: { w: 283.33, h: 237.5 },
	//		//	spriteSourceSize: { x: 0, y: 0 }
	//		//},
	//		//frame8: {
	//		//	frame: { x: 283.33 * 2, y: 237.5 * 2, w: 283.33, h: 237.5 },
	//		//	sourceSize: { w: 283.33, h: 237.5 },
	//		//	spriteSourceSize: { x: 0, y: 0 }
	//		//},

	//		//frame9: {
	//		//	frame: { x: 283.33 * 1, y: 237.5 * 3, w: 283.33, h: 237.5 },
	//		//	sourceSize: { w: 283.33, h: 237.5 },
	//		//	spriteSourceSize: { x: 0, y: 0 }
	//		//},
	//	},
	//	meta: {
	//		image: './images/explosion_2.png',
	//		scale: "1",
	//	},
	//	animations: {
	//		frames: ["frame0", "frame1", "frame2", /*"frame3", "frame4", "frame5", "frame6", "frame7", "frame8", "frame9"*/]
	//	}
	//};

	// Create the SpriteSheet from data and image
	const spritesheet: Spritesheet = new Spritesheet(BaseTexture.from(atlasData.meta.image), atlasData);
	spritesheet.parse();

	let animation = new AnimatedSprite(spritesheet.animations.frames);
	animation.animationSpeed = 0.2;
	animation.loop = false;
	animation.anchor.set(0.5);

	// spritesheet is ready to use!
	return animation;
}
