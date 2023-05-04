import { AnimatedSprite, BaseTexture, Spritesheet, SpriteSheetJson, Texture } from 'pixi.js';
import { Constants, ExplosionType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class Explosion extends GameObjectContainer {

	private explosionAnimation: AnimatedSprite = new AnimatedSprite([Texture.from("./images/explosion_1.png")]);

	constructor(speed: number, explosionType: ExplosionType = ExplosionType.RING_EXPLOSION) {
		super(speed);
		this.loadExplosionAnimation(explosionType).then((animatedSprite: AnimatedSprite) => {
			this.explosionAnimation = animatedSprite;
			this.addChild(this.explosionAnimation);
		});
	}

	reset() {
		this.alpha = 1.0;
		this.explosionAnimation.stop();
	}

	reposition(source: GameObjectContainer) {
		this.x = source.x + Constants.getRandomNumber(-50, 50);
		this.y = source.y + Constants.getRandomNumber(-50, 50);;
		this.explosionAnimation.gotoAndPlay(0);
	}

	override disableRendering() {
		this.explosionAnimation.stop();
		super.disableRendering();
	}

	private async loadExplosionAnimation(explosionType: ExplosionType): Promise<AnimatedSprite> {
		switch (explosionType) {
			case ExplosionType.RING_EXPLOSION: {
				const atlasData: SpriteSheetJson = Constants.RING_EXPLOSION_JSON;
				return await this.loadAnimationSprite(atlasData, 0.2);
			}
			case ExplosionType.SMOKE_EXPLOSION: {
				const atlasData: SpriteSheetJson = Constants.SMOKE_EXPLOSION_JSON;
				return await this.loadAnimationSprite(atlasData);
			}
			case ExplosionType.FLASH_EXPLOSION: {
				const atlasData: SpriteSheetJson = Constants.FLASH_EXPLOSION_JSON;
				return await this.loadAnimationSprite(atlasData);
			}
		}
	}

	private async loadAnimationSprite(atlasData: SpriteSheetJson, animationSpeed: number = 0.3, loop: boolean = false): Promise<AnimatedSprite> {
		const spritesheet: Spritesheet = new Spritesheet(BaseTexture.from(atlasData.meta.image), atlasData);
		await spritesheet.parse();

		let animation = new AnimatedSprite(spritesheet.animations.frames);
		animation.animationSpeed = animationSpeed;
		animation.loop = loop;
		animation.anchor.set(0.5);

		return animation;
	}
}