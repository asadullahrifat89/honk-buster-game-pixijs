//#region Enums

export enum ExplosionType {
	RING_EXPLOSION,
	RING_SMOKE_EXPLOSION,
	BLOW_SMOKE_EXPLOSION,
	FLASH_EXPLOSION,
}

export enum PowerUpType {
	ARMOR,
	HURLING_BALLS,
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

export enum PlayerRideStance {
	Idle,
	Attack,
	Hit,
	Win,
}

export enum PlayerRideTemplate {
	AIR_BALLOON = 1,
	CHOPPER = 2,
	SPHERE = 3,
}

export enum PlayerGroundBombTemplate {
	TRASH_BIN,
	GRENADE,
	DYNAMITE,
}

export enum PlayerAirBombTemplate {
	GRAVITY_BALL,
	MISSILE,
	BULLET_BALL,
}




export enum TextureType {
	NONE,
	GAME_COVER_IMAGE,

	PLAYER_RIDE_IDLE,
	PLAYER_RIDE_ATTACK,
	PLAYER_RIDE_WIN,
	PLAYER_RIDE_HIT,

	PLAYER_AIR_BOMB,
	PLAYER_AIR_BOMB_HURLING_BALLS,
	PLAYER_GROUND_BOMB,

	VEHICLE_ENEMY_SMALL,
	VEHICLE_ENEMY_LARGE,
	VEHICLE_BOSS,

	VEHICLE_BOSS_AIR_BOMB,

	ROAD_MARK,
	ROAD_SIDE_WALK_TOP,
	ROAD_SIDE_WALK_BOTTOM,
	ROAD_SIDE_WALK_BOTTOM_PILLARS,

	HONK,

	LEAF,

	BLAST,

	CAST_SHADOW,

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

	UFO_BOSS_AIR_BOMB,
	UFO_BOSS_AIR_BOMB_SEEKING,

	MAFIA_BOSS_AIR_BOMB,
	MAFIA_BOSS_AIR_BOMB_HURLING_BALLS,

	ZOMBIE_BOSS_ROCKET_BLOCK,

	UFO_ENEMY,
	UFO_ENEMY_AIR_BOMB,

	HEALTH_PICKUP,

	POWERUP_PICKUP,
	POWERUP_PICKUP_ARMOR,
	POWERUP_PICKUP_HURLING_BALLS,

	COLLECTABLE_PICKUP,
	FLOATING_NUMBER,
	
	CHOPPER_BLADES,
	TRASH_BIN_BLAST,
	GRAND_EXPLOSION_RING,
	GRENADE_BLAST,
	VEHICLE_SMOKE,

	TITLE_SCREEN,
	STAGE
}


export enum SoundType {
	NONE,

	AMBIENCE,
	HONK,

	GAME_START,
	GAME_PAUSE,
	GAME_OVER,

	GROUND_BOMB_DROP,

	GRAND_EXPLOSION_RING,
	GROUND_BOMB_BLAST,
	AIR_BOMB_BLAST,
	TRASH_BIN_BLAST,

	BALL_LAUNCH,
	BULLET_LAUNCH,
	ORB_LAUNCH,
	ROCKET_LAUNCH,
	SEEKER_ROCKET_LAUNCH,

	UFO_HOVERING,
	CHOPPER_HOVERING,
	UFO_BOSS_DEAD,

	POWERUP_PICKUP,
	HEALTH_PICKUP,

	DAMAGE_TAKEN,

	UFO_ENEMY_ENTRY,
	UFO_BOSS_ENTRY,

	GAME_INTRO_MUSIC,
	GAME_BACKGROUND_MUSIC,
	BOSS_BACKGROUND_MUSIC,

	LEVEL_UP,

	SCORE_ACQUIRED,
	BOOST_ACQUIRED,

	OPTION_SELECT,
	ITEM_SELECT,
	SPHERE_FLOATING,	
}

//#endregion