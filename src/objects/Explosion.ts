import { AnimatedSprite, BaseTexture, Spritesheet, SpriteSheetJson } from 'pixi.js';
import { PlayerHonkBombTemplate } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class Explosion extends GameObjectContainer {

	private animation: AnimatedSprite;

	constructor(speed: number) {
		super(speed);

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
			//animations: {
			//	frame: ['frame0', 'frame1', 'frame2', 'frame3'] // array of frames by name
			//}
			animations: { frames: ["frame0", "frame1", "frame2", "frame3"] }
		}

		// Create the SpriteSheet from data and image
		const spritesheet: Spritesheet = new Spritesheet(BaseTexture.from(atlasData.meta.image), atlasData);

		spritesheet.parse();

		// spritesheet is ready to use!
		this.animation = new AnimatedSprite(spritesheet.animations.frames);

		// set the animation speed 
		this.animation.animationSpeed = 0.3;
		this.animation.loop = false;
		this.animation.anchor.set(0.5);

		this.addChild(this.animation);
	}

	reset(_playerHonkBombTemplate: PlayerHonkBombTemplate) {
		this.alpha = 1.0;
		this.animation.stop();
		//switch (playerHonkBombTemplate) {
		//	case PlayerHonkBombTemplate.Cracker: { this.setTexture(Constants.getRandomTexture(ConstructType.BLAST)); } break;
		//	case PlayerHonkBombTemplate.TrashCan: { this.setTexture(Constants.getRandomTexture(ConstructType.BANG)); } break;
		//	default:
		//}
	}

	reposition(source: GameObjectContainer) {
		this.x = source.x;
		this.y = source.y;
		this.animation.gotoAndPlay(0);
	}

	override disableRendering() {
		this.animation.stop();
		super.disableRendering();
	}
}
