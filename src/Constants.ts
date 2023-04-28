import { Texture } from "pixi.js";
import { ConstructTemplate } from "./ConstructTemplate";
import { GameObject } from "./GameObject";
import { SoundTemplate } from "./SoundTemplate";

//#region Enums

export enum PowerUpType {
	//SEEKING_SNITCH,
	ARMOR,
	BULLS_EYE,
}

export enum RotationDirection {
	Forward,
	Backward,
}

export enum MafiaBossMovementPattern {
	PLAYER_SEEKING,
	RECTANGULAR_SQUARE,
	RIGHT_LEFT,
	UP_DOWN,
}

export enum UfoBossMovementPattern {
	PLAYER_SEEKING,
	ISOMETRIC_SQUARE,
	UPRIGHT_DOWNLEFT,
	UPLEFT_DOWNRIGHT,
	RIGHT_LEFT,
	UP_DOWN,
}

export enum BossStance {
	Idle,
	Hit,
	Win,
}

export enum MovementDirection {
	None,

	Up,
	UpLeft,
	UpRight,

	Down,
	DownLeft,
	DownRight,

	Right,
	Left,
}

export enum PlayerBalloonStance {
	Idle,
	Attack,
	Hit,
	Win,
}

export enum PlayerBalloonTemplate {
	Blue,
	Red,
}

export enum PlayerHonkBombTemplate {
	Cracker,
	TrashCan,
}

export enum ConstructType {
	NONE,
	GAME_COVER_IMAGE,

	PLAYER_BALLOON,
	PLAYER_BALLOON_IDLE,
	PLAYER_BALLOON_ATTACK,
	PLAYER_BALLOON_WIN,
	PLAYER_BALLOON_HIT,

	PLAYER_ROCKET,
	PLAYER_ROCKET_SEEKING,
	PLAYER_ROCKET_BULLS_EYE,
	PLAYER_HONK_BOMB,

	VEHICLE_ENEMY_SMALL,
	VEHICLE_ENEMY_LARGE,
	VEHICLE_BOSS,

	VEHICLE_BOSS_ROCKET,

	ROAD_MARK,
	ROAD_SIDE_WALK,

	ROAD_SIDE_TREE,
	ROAD_SIDE_HEDGE,
	ROAD_SIDE_LAMP,
	ROAD_SIDE_LIGHT_BILLBOARD,
	ROAD_SIDE_BILLBOARD,

	HONK,
	HONK_BUSTER,

	CLOUD,

	BLAST,
	BANG,

	DROP_SHADOW,

	UFO_BOSS,
	UFO_BOSS_IDLE,
	UFO_BOSS_HIT,
	UFO_BOSS_WIN,

	MAFIA_BOSS,
	MAFIA_BOSS_IDLE,
	MAFIA_BOSS_HIT,
	MAFIA_BOSS_WIN,

	ZOMBIE_BOSS,
	ZOMBIE_BOSS_IDLE,
	ZOMBIE_BOSS_HIT,
	ZOMBIE_BOSS_WIN,

	UFO_BOSS_ROCKET,
	UFO_BOSS_ROCKET_SEEKING,

	MAFIA_BOSS_ROCKET,
	MAFIA_BOSS_ROCKET_BULLS_EYE,

	ZOMBIE_BOSS_ROCKET_BLOCK,

	UFO_ENEMY,
	UFO_ENEMY_ROCKET,

	HEALTH_PICKUP,

	POWERUP_PICKUP,
	POWERUP_PICKUP_SEEKING_SNITCH,
	POWERUP_PICKUP_ARMOR,
	POWERUP_PICKUP_BULLS_EYE,

	COLLECTABLE_PICKUP,
	FLOATING_NUMBER,

	TITLE_SCREEN
}

export enum SoundType {
	NONE,

	GAME_START,
	GAME_PAUSE,
	GAME_OVER,

	CRACKER_DROP,
	CRACKER_BLAST,

	TRASH_CAN_HIT,

	ROCKET_LAUNCH,
	ROCKET_BLAST,

	HONK,
	HONK_BUST_REACTION,

	SEEKER_ROCKET_LAUNCH,
	BULLS_EYE_ROCKET_LAUNCH,

	AMBIENCE,

	UFO_BOSS_ENTRY,
	UFO_BOSS_HOVERING,
	UFO_BOSS_DEAD,

	POWERUP_PICKUP,
	HEALTH_PICKUP,

	PLAYER_HEALTH_LOSS,

	UFO_ENEMY_ENTRY,

	GAME_BACKGROUND_MUSIC,
	BOSS_BACKGROUND_MUSIC,

	ORB_LAUNCH,

	LEVEL_UP,
	OPTION_SELECT
}

//#endregion

export abstract class Constants {

	//#region Properties

	public static DEFAULT_GAME_VIEW_WIDTH: number = 1900;
	public static DEFAULT_GAME_VIEW_HEIGHT: number = 940;

	public static DEFAULT_CONSTRUCT_DELTA: number = 3;
	public static DEFAULT_CONSTRUCT_SPEED: number = 3 * Constants.DEFAULT_CONSTRUCT_DELTA;
	public static DEFAULT_BLAST_SHRINK_SCALE: number = 0.8;
	public static DEFAULT_DROP_SHADOW_DISTANCE: number = 40;

	public static SELECTED_PLAYER_TEMPLATE: number = 0;
	public static SELECTED_HONK_BUSTER_TEMPLATE: number = 0;
	public static GAME_SCORE: number = 0;

	public static SOUND_TEMPLATES: (SoundTemplate)[] = [

		new SoundTemplate(SoundType.CRACKER_DROP, "cracker_drop_1.mp3"),
		new SoundTemplate(SoundType.CRACKER_DROP, "cracker_drop_2.mp3"),

		new SoundTemplate(SoundType.CRACKER_BLAST, "cracker_blast_1.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, "cracker_blast_2.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, "cracker_blast_3.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, "cracker_blast_4.mp3"),

		new SoundTemplate(SoundType.TRASH_CAN_HIT, "trashcan_hit_1.mp3"),
		new SoundTemplate(SoundType.TRASH_CAN_HIT, "trashcan_hit_2.mp3"),
		new SoundTemplate(SoundType.TRASH_CAN_HIT, "trashcan_hit_3.mp3"),
		new SoundTemplate(SoundType.TRASH_CAN_HIT, "trashcan_hit_4.mp3"),
		new SoundTemplate(SoundType.TRASH_CAN_HIT, "trashcan_hit_5.mp3"),

		new SoundTemplate(SoundType.ROCKET_LAUNCH, "rocket_launch_1.mp3"),
		new SoundTemplate(SoundType.ROCKET_LAUNCH, "rocket_launch_2.mp3"),
		new SoundTemplate(SoundType.ROCKET_LAUNCH, "rocket_launch_3.mp3"),

		new SoundTemplate(SoundType.ROCKET_BLAST, "rocket_blast_1.mp3"),
		new SoundTemplate(SoundType.ROCKET_BLAST, "rocket_blast_2.mp3"),
		new SoundTemplate(SoundType.ROCKET_BLAST, "rocket_blast_3.mp3"),

		new SoundTemplate(SoundType.HONK, "car_honk_1.mp3"),
		new SoundTemplate(SoundType.HONK, "car_honk_2.mp3"),
		new SoundTemplate(SoundType.HONK, "car_honk_3.mp3"),

		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_1.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_2.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_3.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_4.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_5.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_6.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_7.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_8.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_9.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_10.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_11.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_12.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_13.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_14.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_15.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_16.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_17.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_18.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_19.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_20.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_21.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_22.mp3"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, "honk_bust_reaction_23.mp3"),

		new SoundTemplate(SoundType.SEEKER_ROCKET_LAUNCH, "seeker_rocket_launch_1.mp3"),
		new SoundTemplate(SoundType.SEEKER_ROCKET_LAUNCH, "seeker_rocket_launch_2.mp3"),

		new SoundTemplate(SoundType.BULLS_EYE_ROCKET_LAUNCH, "bulls_eye_rocket_launch_1.mp3"),

		new SoundTemplate(SoundType.AMBIENCE, "ambience_1.mp3"),
		new SoundTemplate(SoundType.AMBIENCE, "ambience_2.mp3"),
		new SoundTemplate(SoundType.AMBIENCE, "ambience_3.mp3"),

		new SoundTemplate(SoundType.UFO_BOSS_HOVERING, "ufo_boss_hovering_1.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_HOVERING, "ufo_boss_hovering_2.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_HOVERING, "ufo_boss_hovering_3.mp3"),

		new SoundTemplate(SoundType.UFO_BOSS_ENTRY, "ufo_boss_entry_1.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_ENTRY, "ufo_boss_entry_2.mp3"),

		new SoundTemplate(SoundType.UFO_BOSS_DEAD, "ufo_boss_dead_1.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_DEAD, "ufo_boss_dead_2.mp3"),

		new SoundTemplate(SoundType.POWERUP_PICKUP, "power_up_pickup_1.mp3"),
		new SoundTemplate(SoundType.HEALTH_PICKUP, "health_pickup_1.mp3"),

		new SoundTemplate(SoundType.PLAYER_HEALTH_LOSS, "player_health_loss_1.mp3"),

		new SoundTemplate(SoundType.UFO_ENEMY_ENTRY, "ufo_enemy_entry_1.mp3"),
		new SoundTemplate(SoundType.UFO_ENEMY_ENTRY, "ufo_enemy_entry_2.mp3"),

		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, "game_background_music_1.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, "game_background_music_2.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, "game_background_music_3.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, "game_background_music_4.mp3"),

		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, "boss_background_music_1.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, "boss_background_music_2.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, "boss_background_music_3.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, "boss_background_music_4.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, "boss_background_music_5.mp3"),

		new SoundTemplate(SoundType.GAME_START, "game_start.mp3"),
		new SoundTemplate(SoundType.GAME_PAUSE, "game_pause.mp3"),
		new SoundTemplate(SoundType.GAME_OVER, "game_over.mp3"),

		new SoundTemplate(SoundType.ORB_LAUNCH, "orb_launch.mp3"),

		new SoundTemplate(SoundType.LEVEL_UP, "level_up.mp3"),
		new SoundTemplate(SoundType.OPTION_SELECT, "option_select.mp3"),
	];

	public static CONSTRUCT_TEMPLATES: (ConstructTemplate)[] = [

		new ConstructTemplate(ConstructType.ROAD_MARK, "road_marks.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, "tree_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, "tree_2.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK, "road_side_walk_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_HEDGE, "road_side_hedge_1.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, "billboard_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, "billboard_2.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, "billboard_3.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, "road_side_light_billboard_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, "road_side_light_billboard_2.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, "road_side_light_billboard_3.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_LAMP, "road_side_lamp_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_LAMP, "road_side_lamp_2.png"),

		new ConstructTemplate(ConstructType.CLOUD, "cloud_1.png"),
		new ConstructTemplate(ConstructType.CLOUD, "cloud_2.png"),
		new ConstructTemplate(ConstructType.CLOUD, "cloud_3.png"),

		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_1.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_2.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_3.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_4.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_5.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_6.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_7.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_8.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_9.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_10.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_11.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_12.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_13.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_14.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_15.png"),

		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_1.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_2.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_3.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_4.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_5.png"),

		new ConstructTemplate(ConstructType.HONK, "honk_1.png"),
		new ConstructTemplate(ConstructType.HONK, "honk_2.png"),
		new ConstructTemplate(ConstructType.HONK, "honk_3.png"),

		new ConstructTemplate(ConstructType.PLAYER_BALLOON, "player_1_character.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON_IDLE, "player_balloon_1_idle.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON_ATTACK, "player_balloon_1_attack.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON_WIN, "player_balloon_1_win.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON_HIT, "player_balloon_1_hit.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON, "player_2_character.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON_IDLE, "player_balloon_2_idle.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON_ATTACK, "player_balloon_2_attack.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON_WIN, "player_balloon_2_win.png"),
		new ConstructTemplate(ConstructType.PLAYER_BALLOON_HIT, "player_balloon_2_hit.png"),

		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "cracker_1.png"),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "cracker_2.png"),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "cracker_3.png"),

		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "trash_1.png"),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "trash_2.png"),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "trash_3.png"),

		new ConstructTemplate(ConstructType.BANG, "bang_1.png"),
		new ConstructTemplate(ConstructType.BANG, "bang_2.png"),

		new ConstructTemplate(ConstructType.BLAST, "blast_1.png"),
		new ConstructTemplate(ConstructType.BLAST, "blast_2.png"),

		new ConstructTemplate(ConstructType.VEHICLE_BOSS_ROCKET, "vehicle_boss_rocket.png"),

		new ConstructTemplate(ConstructType.PLAYER_ROCKET, "player_rocket_1.png"),
		new ConstructTemplate(ConstructType.PLAYER_ROCKET, "player_rocket_2.png"),
		new ConstructTemplate(ConstructType.PLAYER_ROCKET, "player_rocket_3.png"),

		new ConstructTemplate(ConstructType.PLAYER_ROCKET_BULLS_EYE, "player_rocket_bulls_eye_1.png"),

		//new ConstructTemplate(ConstructType.PLAYER_ROCKET_SEEKING, "player_rocket_seeking_1.png"),
		//new ConstructTemplate(ConstructType.PLAYER_ROCKET_SEEKING, "player_rocket_seeking_2.png"),

		new ConstructTemplate(ConstructType.UFO_BOSS_HIT, "ufo_boss_1_hit.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_IDLE, "ufo_boss_1_idle.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_WIN, "ufo_boss_1_win.png"),

		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, "ufo_boss_rocket_1.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, "ufo_boss_rocket_2.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, "ufo_boss_rocket_3.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET_SEEKING, "ufo_boss_rocket_seeking.png"),

		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_HIT, "zombie_boss_1_hit.png"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_IDLE, "zombie_boss_1_idle.png"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_WIN, "zombie_boss_1_win.png"),

		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_1.png"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_2.png"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_3.png"),

		new ConstructTemplate(ConstructType.MAFIA_BOSS_HIT, "mafia_boss_1_hit.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_IDLE, "mafia_boss_1_idle.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_WIN, "mafia_boss_1_win.png"),

		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, "mafia_boss_rocket_1.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, "mafia_boss_rocket_2.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, "mafia_boss_rocket_3.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET_BULLS_EYE, "mafia_boss_rocket_bulls_eye.png"),

		new ConstructTemplate(ConstructType.HEALTH_PICKUP, "health_pickup.png"),
		new ConstructTemplate(ConstructType.POWERUP_PICKUP_ARMOR, "powerup_pickup_armor.png"),
		new ConstructTemplate(ConstructType.POWERUP_PICKUP_BULLS_EYE, "powerup_pickup_bulls_eye.png"),

		new ConstructTemplate(ConstructType.UFO_ENEMY, "enemy_1.png"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, "enemy_2.png"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, "enemy_3.png"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, "enemy_4.png"),

		new ConstructTemplate(ConstructType.UFO_ENEMY_ROCKET, "enemy_bomb.png"),

		new ConstructTemplate(ConstructType.GAME_COVER_IMAGE, "cover_image.png"),
	];

	//#endregion

	//#region Methods

	static degreesToRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	static getRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static getRandomUri(constructType: ConstructType): string {

		const treeTemplates = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == constructType);
		const uri = treeTemplates[this.getRandomNumber(0, treeTemplates.length - 1)].uri;

		return uri;
	}

	static getRandomTexture(constructType: ConstructType): Texture {

		const uri = Constants.getRandomUri(constructType);
		const texture = Texture.from(uri);
		return texture;
	}

	static getRandomUriFromUris(uris: string[]): string {

		const treeTemplates = uris;
		const uri = treeTemplates[this.getRandomNumber(0, treeTemplates.length - 1)];

		return uri;
	}

	static getRandomTextureFromUris(uris: string[]): Texture {

		const uri = this.getRandomUriFromUris(uris);
		const texture = Texture.from(uri);
		return texture;
	}

	static checkCollision(objA: GameObject, objB: GameObject): boolean {
		const a = objA.getBounds();
		const b = objB.getBounds();

		const rightmostLeft = a.left < b.left ? b.left : a.left;
		const leftmostRight = a.right > b.right ? b.right : a.right;

		if (leftmostRight <= rightmostLeft) {
			return false;
		}

		const bottommostTop = a.top < b.top ? b.top : a.top;
		const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;

		return topmostBottom > bottommostTop;
	}

	static checkCloseCollision(objA: GameObject, objB: GameObject): boolean {

		const a = objA.getBounds(true);
		const b = objB.getBounds(true);

		const aLeft = a.left + a.width / 4;
		const bLeft = b.left + b.width / 4;

		const aRight = a.right /*- a.width / 4*/;
		const bRight = b.right /*- b.width / 4*/;

		const rightmostLeft = aLeft < bLeft ? bLeft : aLeft;
		const leftmostRight = aRight > bRight ? bRight : aRight;

		if (leftmostRight <= rightmostLeft) {
			return false;
		}

		const aTop = a.top + a.height / 4;
		const bTop = b.top + b.height / 4;

		const aBottom = a.bottom /*- a.height / 4*/;
		const bBottom = b.bottom /*- b.height / 4*/;

		const bottommostTop = aTop < bTop ? bTop : aTop;
		const topmostBottom = aBottom > bBottom ? bBottom : aBottom;

		return topmostBottom > bottommostTop;
	}

	//#endregion
}