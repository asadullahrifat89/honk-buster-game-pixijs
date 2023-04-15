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

class ConstructTemplate {

	public ConstructType: ConstructType = 0;
	public Uri: string = "";

	constructor(constructType: ConstructType, uri: string) {
		this.ConstructType = constructType;
		this.Uri = uri;
	}
}

export abstract class Constants {

	public static DEFAULT_GAME_VIEW_WIDTH: number = 1900;
	public static DEFAULT_GAME_VIEW_HEIGHT: number = 940;

	public static CONSTRUCT_TEMPLATES: (ConstructTemplate)[] = [
		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, "tree_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, "tree_2.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK, "road_side_walk_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_HEDGE, "road_side_hedge_1.png"),
	];

	static degreesToRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	static randomNumberBetween(min: number, max: number): number {
		// return Math.floor(Math.random() * (max - min) + min);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static GetRandomUri(constructType: ConstructType): string {

		const treeTemplates = Constants.CONSTRUCT_TEMPLATES.filter(x => x.ConstructType == constructType);
		const uri = treeTemplates[this.randomNumberBetween(0, treeTemplates.length - 1)].Uri;

		return uri;
	}
}



