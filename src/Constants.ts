import { Texture } from "pixi.js";
import { ConstructTemplate } from "./ConstructTemplate";
import { GameObject } from "./GameObject";

//#region Enums

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

//#endregion

//class ConstructSize {

//	public ConstructType: ConstructType = 0;
//	public Height: number = 0;
//	public Width: number = 0;
//}

export abstract class Constants {

	//#region Properties

	public static DEFAULT_GAME_VIEW_WIDTH: number = 1900;
	public static DEFAULT_GAME_VIEW_HEIGHT: number = 940;

	public static DEFAULT_CONSTRUCT_DELTA: number = 3;
	public static DEFAULT_CONSTRUCT_SPEED: number = 3 * Constants.DEFAULT_CONSTRUCT_DELTA;
	public static DEFAULT_BLAST_SHRINK_SCALE: number = 0.8;

	public static CONSTRUCT_TEMPLATES: (ConstructTemplate)[] = [

		new ConstructTemplate(ConstructType.ROAD_MARK, "road_marks.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, "tree_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, "tree_2.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK, "road_side_walk_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_HEDGE, "road_side_hedge_1.png"),

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

		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, "road_side_light_billboard_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, "road_side_light_billboard_2.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, "road_side_light_billboard_3.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, "billboard_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, "billboard_2.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, "billboard_3.png"),

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

		new ConstructTemplate(ConstructType.HEALTH_PICKUP,"health_pickup.png"),

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

		const treeTemplates = Constants.CONSTRUCT_TEMPLATES.filter(x => x.ConstructType == constructType);
		const uri = treeTemplates[this.getRandomNumber(0, treeTemplates.length - 1)].Uri;

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

		const a = objA.getBounds();
		const b = objB.getBounds();

		const aLeft = a.left + a.width / 4;
		const bLeft = b.left + b.width / 4;

		const aRight = a.right - a.width / 4;
		const bRight = b.right - b.width / 4;

		const rightmostLeft = aLeft < bLeft ? bLeft : aLeft;
		const leftmostRight = aRight > bRight ? bRight : aRight;

		if (leftmostRight <= rightmostLeft) {
			return false;
		}

		const aTop = a.top + a.height / 4;
		const bTop = b.top + b.height / 4;

		const aBottom = a.bottom - a.height / 4;
		const bBottom = b.bottom - b.height / 4;

		const bottommostTop = aTop < bTop ? bTop : aTop;
		const topmostBottom = aBottom > bBottom ? bBottom : aBottom;

		return topmostBottom > bottommostTop;
	}

	//#endregion
}