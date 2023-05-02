import { AnimatedSprite, BaseTexture, Spritesheet, SpriteSheetJson } from 'pixi.js';
import { Constants, ExplosionType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class Explosion extends GameObjectContainer {

	private explosionAnimation: AnimatedSprite;

	constructor(speed: number, explosionType: ExplosionType = ExplosionType.RING_EXPLOSION) {
		super(speed);
		this.explosionAnimation = this.getExplosionAnimation(explosionType);
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

	private getExplosionAnimation(explosionType: ExplosionType): AnimatedSprite {
		switch (explosionType) {
			case ExplosionType.RING_EXPLOSION: {				
				const atlasData: SpriteSheetJson = Constants.DEFAULT_EXPLOSION_SPRITE_SHEET_JSON;
				return this.getAnimationSprite(atlasData, 0.2);
			} break;
			case ExplosionType.SMOKE_EXPLOSION: {
				const atlasData: SpriteSheetJson = Constants.SMOKE_EXPLOSION_SPRITE_SHEET_JSON;
				return this.getAnimationSprite(atlasData, 0.3);
			} break;
			case ExplosionType.PUFF_EXPLOSION: {
				const atlasData: SpriteSheetJson = Constants.PUFF_EXPLOSION_SPRITE_SHEET_JSON;
				return this.getAnimationSprite(atlasData, 0.3);
			} break;
		}
	}

	private getAnimationSprite(atlasData: SpriteSheetJson, animationSpeed: number, loop: boolean = false): AnimatedSprite {		
		const spritesheet: Spritesheet = new Spritesheet(BaseTexture.from(atlasData.meta.image), atlasData);
		spritesheet.parse();

		let animation = new AnimatedSprite(spritesheet.animations.frames);
		animation.animationSpeed = animationSpeed;
		animation.loop = loop;
		animation.anchor.set(0.5);
		
		return animation;
	}
}