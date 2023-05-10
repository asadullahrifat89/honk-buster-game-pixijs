import { SpriteSheetJson, Texture } from "pixi.js";
import { ConstructTemplate } from "./core/ConstructTemplate";
import { GameObjectContainer } from "./core/GameObjectContainer";
import { SoundTemplate } from "./core/SoundTemplate";

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
	AIR_BALLOON,
	CHOPPER,
}

export enum PlayerGroundBombTemplate {
	GRENADE,
	TRASH_BIN,
	DYNAMITE,
}

export enum PlayerAirBombTemplate {
	BALLs,
	ROCKETs,
}

export enum ConstructType {
	NONE,
	GAME_COVER_IMAGE,

	PLAYER_RIDE,
	PLAYER_RIDE_IDLE,
	PLAYER_RIDE_ATTACK,
	PLAYER_RIDE_WIN,
	PLAYER_RIDE_HIT,

	PLAYER_ROCKET,
	PLAYER_ROCKET_SEEKING,
	PLAYER_ROCKET_HURLING_BALLS,
	PLAYER_HONK_BOMB,

	VEHICLE_ENEMY_SMALL,
	VEHICLE_ENEMY_LARGE,
	VEHICLE_BOSS,

	VEHICLE_BOSS_ROCKET,

	ROAD_MARK,
	ROAD_SIDE_WALK_TOP,
	ROAD_SIDE_WALK_BOTTOM,
	ROAD_SIDE_WALK_BOTTOM_PILLARS,

	HONK,

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
	MAFIA_BOSS_ROCKET_HURLING_BALLS,

	ZOMBIE_BOSS_ROCKET_BLOCK,

	UFO_ENEMY,
	UFO_ENEMY_ROCKET,

	HEALTH_PICKUP,

	POWERUP_PICKUP,
	POWERUP_PICKUP_SEEKING_SNITCH,
	POWERUP_PICKUP_ARMOR,
	POWERUP_PICKUP_HURLING_BALLS,

	COLLECTABLE_PICKUP,
	FLOATING_NUMBER,

	TITLE_SCREEN,
	CHOPPER_BLADES,
	TRASH_BIN_OPEN,
}


export enum SoundType {
    NONE,

    GAME_START,
    GAME_PAUSE,
    GAME_OVER,

    CRACKER_DROP,
    CRACKER_BLAST,

    CHOPPER_HOVERING,

    TRASH_BIN_HIT,

    ROCKET_LAUNCH,
    ROCKET_BLAST,

    HONK,
    HONK_BUST_REACTION,

    SEEKER_ROCKET_LAUNCH,
    BALL_LAUNCH,

    AMBIENCE,

    UFO_BOSS_ENTRY,
    UFO_BOSS_HOVERING,
    UFO_BOSS_DEAD,

    POWERUP_PICKUP,
    HEALTH_PICKUP,

    HEALTH_LOSS,

    UFO_ENEMY_ENTRY,

    GAME_BACKGROUND_MUSIC,
    BOSS_BACKGROUND_MUSIC,

    ORB_LAUNCH,

    LEVEL_UP,
    OPTION_SELECT,
    BOOST_ACQUIRED,
    ITEM_SELECT,
    SCORE
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

	public static SELECTED_PLAYER_CHARACTER_TEMPLATE: number = 0;
	public static SELECTED_PLAYER_RIDE_TEMPLATE: number = 0;
	public static SELECTED_PLAYER_GROUND_BOMB_TEMPLATE: number = 0;
	public static SELECTED_PLAYER_AIR_BOMB_TEMPLATE: number = 0;

	public static MESSAGE_BOX_BORDER_COLOR: number = 0x000000;
	public static MESSAGE_BOX_TEXT_COLOR: string = "#000000";

	public static GAME_SCORE: number = 0;
	public static GAME_SCORE_MAX: number = 0;

	public static GAME_LEVEL: number = 0;
	public static GAME_LEVEL_MAX: number = 0;

	public static HEALTH_LEVEL_MAX: number = 0;
	public static ATTACK_LEVEL_MAX: number = 0;

	public static CHOPPER_UNLOCK_LEVEL: number = 5;
	public static CHOPPER_UNLOCKED: boolean = false;

	public static MISSILE_UNLOCK_LEVEL: number = 3;
	public static MISSILE_UNLOCKED: boolean = false;

	public static TRASH_BIN_UNLOCK_LEVEL: number = 3;
	public static TRASH_BIN_UNLOCKED: boolean = false;

	public static DYNAMITE_UNLOCK_LEVEL: number = 7;
	public static DYNAMITE_UNLOCKED: boolean = false;

	public static GAME_TITLE_FONT = "stitchnschool";
	public static GAME_DEFAULT_FONT = "emilio";	

	public static CONSTRUCT_TEMPLATES: (ConstructTemplate)[] = [

		new ConstructTemplate(ConstructType.ROAD_MARK, "road_marks"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_TOP, "road_side_walk_top_1"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_TOP, "road_side_walk_top_2"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_BOTTOM, "road_side_walk_bottom_1"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_BOTTOM, "road_side_walk_bottom_2"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_BOTTOM_PILLARS, "road_side_walk_bottom_pillars_1"),

		new ConstructTemplate(ConstructType.CLOUD, "cloud_1"),
		new ConstructTemplate(ConstructType.CLOUD, "cloud_2"),
		new ConstructTemplate(ConstructType.CLOUD, "cloud_3"),

		new ConstructTemplate(ConstructType.VEHICLE_BOSS, "vehicle_boss_1"),
		new ConstructTemplate(ConstructType.VEHICLE_BOSS, "vehicle_boss_2"),
		new ConstructTemplate(ConstructType.VEHICLE_BOSS, "vehicle_boss_3"),

		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_1"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_2"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_3"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_4"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_5"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_6"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_7"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_8"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_9"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_10"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_11"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_12"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, "vehicle_small_13"),

		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_1"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_2"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_3"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_4"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, "vehicle_large_5"),

		new ConstructTemplate(ConstructType.HONK, "honk_1"),
		new ConstructTemplate(ConstructType.HONK, "honk_2"),
		new ConstructTemplate(ConstructType.HONK, "honk_3"),

		new ConstructTemplate(ConstructType.PLAYER_RIDE, "player_1_character"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_IDLE, "player_balloon_1_idle"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_ATTACK, "player_balloon_1_attack"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_WIN, "player_balloon_1_win"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_HIT, "player_balloon_1_hit"),

		new ConstructTemplate(ConstructType.PLAYER_RIDE, "player_1_character"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_IDLE, "player_chopper_1_idle"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_ATTACK, "player_chopper_1_attack"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_WIN, "player_chopper_1_win"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_HIT, "player_chopper_1_hit"),

		new ConstructTemplate(ConstructType.PLAYER_RIDE, "player_2_character"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_IDLE, "player_balloon_2_idle"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_ATTACK, "player_balloon_2_attack"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_WIN, "player_balloon_2_win"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_HIT, "player_balloon_2_hit"),

		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "player_honk_bomb_explosive_1", PlayerGroundBombTemplate.GRENADE),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "player_honk_bomb_explosive_2", PlayerGroundBombTemplate.GRENADE),

		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "player_honk_bomb_trash_1", PlayerGroundBombTemplate.TRASH_BIN),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "player_honk_bomb_trash_2", PlayerGroundBombTemplate.TRASH_BIN),

		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "player_honk_bomb_sticky_1", PlayerGroundBombTemplate.DYNAMITE),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, "player_honk_bomb_sticky_2", PlayerGroundBombTemplate.DYNAMITE),

		new ConstructTemplate(ConstructType.TRASH_BIN_OPEN, "player_honk_bomb_trash_1_open"),
		new ConstructTemplate(ConstructType.TRASH_BIN_OPEN, "player_honk_bomb_trash_2_open"),

		new ConstructTemplate(ConstructType.PLAYER_ROCKET, "player_ball_1", PlayerAirBombTemplate.BALLs),
		new ConstructTemplate(ConstructType.PLAYER_ROCKET, "player_ball_2", PlayerAirBombTemplate.BALLs),

		new ConstructTemplate(ConstructType.PLAYER_ROCKET, "player_rocket_1", PlayerAirBombTemplate.ROCKETs),
		new ConstructTemplate(ConstructType.PLAYER_ROCKET, "player_rocket_2", PlayerAirBombTemplate.ROCKETs),
		new ConstructTemplate(ConstructType.PLAYER_ROCKET, "player_rocket_3", PlayerAirBombTemplate.ROCKETs),

		new ConstructTemplate(ConstructType.PLAYER_ROCKET_HURLING_BALLS, "player_rocket_bulls_eye_1"),

		new ConstructTemplate(ConstructType.CHOPPER_BLADES, "player_chopper_blades"),

		new ConstructTemplate(ConstructType.BANG, "bang_1"),
		new ConstructTemplate(ConstructType.BANG, "bang_2"),

		new ConstructTemplate(ConstructType.BLAST, "blast_1"),
		new ConstructTemplate(ConstructType.BLAST, "blast_2"),

		new ConstructTemplate(ConstructType.VEHICLE_BOSS_ROCKET, "vehicle_boss_rocket_1"),
		new ConstructTemplate(ConstructType.VEHICLE_BOSS_ROCKET, "vehicle_boss_rocket_2"),

		new ConstructTemplate(ConstructType.UFO_BOSS_HIT, "ufo_boss_1_hit"),
		new ConstructTemplate(ConstructType.UFO_BOSS_IDLE, "ufo_boss_1_idle"),
		new ConstructTemplate(ConstructType.UFO_BOSS_WIN, "ufo_boss_1_win"),

		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, "ufo_boss_rocket_1"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, "ufo_boss_rocket_2"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, "ufo_boss_rocket_3"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET_SEEKING, "ufo_boss_rocket_seeking"),

		new ConstructTemplate(ConstructType.UFO_ENEMY, "ufo_enemy_1"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, "ufo_enemy_2"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, "ufo_enemy_3"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, "ufo_enemy_4"),

		new ConstructTemplate(ConstructType.UFO_ENEMY_ROCKET, "ufo_enemy_bomb"),

		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_HIT, "zombie_boss_1_hit"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_IDLE, "zombie_boss_1_idle"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_WIN, "zombie_boss_1_win"),

		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_1"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_2"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_3"),

		new ConstructTemplate(ConstructType.MAFIA_BOSS_HIT, "mafia_boss_1_hit"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_IDLE, "mafia_boss_1_idle"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_WIN, "mafia_boss_1_win"),

		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, "mafia_boss_rocket_1"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, "mafia_boss_rocket_2"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, "mafia_boss_rocket_3"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET_HURLING_BALLS, "mafia_boss_rocket_bulls_eye"),

		new ConstructTemplate(ConstructType.HEALTH_PICKUP, "health_pickup"),
		new ConstructTemplate(ConstructType.POWERUP_PICKUP_ARMOR, "powerup_pickup_armor"),
		new ConstructTemplate(ConstructType.POWERUP_PICKUP_HURLING_BALLS, "powerup_pickup_bulls_eye"),

		new ConstructTemplate(ConstructType.GAME_COVER_IMAGE, "cover_image"),
	];

	private static soundsDirectory = "sounds/";

	public static SOUND_TEMPLATES: (SoundTemplate)[] = [

		new SoundTemplate(SoundType.CHOPPER_HOVERING, this.soundsDirectory + "chopper_hovering.mp3"),

		new SoundTemplate(SoundType.CRACKER_DROP, this.soundsDirectory + "cracker_drop_1.mp3"),
		new SoundTemplate(SoundType.CRACKER_DROP, this.soundsDirectory + "cracker_drop_2.mp3"),

		new SoundTemplate(SoundType.CRACKER_BLAST, this.soundsDirectory + "cracker_blast_1.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, this.soundsDirectory + "cracker_blast_2.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, this.soundsDirectory + "cracker_blast_3.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, this.soundsDirectory + "cracker_blast_4.mp3"),

		new SoundTemplate(SoundType.TRASH_BIN_HIT, this.soundsDirectory + "trashcan_hit_1.mp3"),
		new SoundTemplate(SoundType.TRASH_BIN_HIT, this.soundsDirectory + "trashcan_hit_2.mp3"),
		new SoundTemplate(SoundType.TRASH_BIN_HIT, this.soundsDirectory + "trashcan_hit_3.mp3"),

		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_1.mp3"),
		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_2.mp3"),
		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_3.mp3"),

		new SoundTemplate(SoundType.ROCKET_BLAST, this.soundsDirectory + "rocket_blast_1.mp3"),
		new SoundTemplate(SoundType.ROCKET_BLAST, this.soundsDirectory + "rocket_blast_2.mp3"),
		new SoundTemplate(SoundType.ROCKET_BLAST, this.soundsDirectory + "rocket_blast_3.mp3"),

		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_1.mp3"),
		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_2.mp3"),
		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_3.mp3"),	

		new SoundTemplate(SoundType.SEEKER_ROCKET_LAUNCH, this.soundsDirectory + "seeker_rocket_launch_1.mp3"),
		new SoundTemplate(SoundType.SEEKER_ROCKET_LAUNCH, this.soundsDirectory + "seeker_rocket_launch_2.mp3"),

		new SoundTemplate(SoundType.BALL_LAUNCH, this.soundsDirectory + "ball_launch_1.mp3"),
		new SoundTemplate(SoundType.BALL_LAUNCH, this.soundsDirectory + "ball_launch_2.mp3"),

		new SoundTemplate(SoundType.AMBIENCE, this.soundsDirectory + "ambience_1.mp3"),
		new SoundTemplate(SoundType.AMBIENCE, this.soundsDirectory + "ambience_2.mp3"),
		new SoundTemplate(SoundType.AMBIENCE, this.soundsDirectory + "ambience_3.mp3"),

		new SoundTemplate(SoundType.UFO_BOSS_HOVERING, this.soundsDirectory + "ufo_boss_hovering_1.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_HOVERING, this.soundsDirectory + "ufo_boss_hovering_2.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_HOVERING, this.soundsDirectory + "ufo_boss_hovering_3.mp3"),

		new SoundTemplate(SoundType.UFO_BOSS_ENTRY, this.soundsDirectory + "ufo_boss_entry_1.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_ENTRY, this.soundsDirectory + "ufo_boss_entry_2.mp3"),

		new SoundTemplate(SoundType.UFO_BOSS_DEAD, this.soundsDirectory + "ufo_boss_dead_1.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_DEAD, this.soundsDirectory + "ufo_boss_dead_2.mp3"),

		new SoundTemplate(SoundType.POWERUP_PICKUP, this.soundsDirectory + "power_up_pickup_1.mp3"),
		new SoundTemplate(SoundType.HEALTH_PICKUP, this.soundsDirectory + "health_pickup_1.mp3"),

		new SoundTemplate(SoundType.HEALTH_LOSS, this.soundsDirectory + "health_loss_1.mp3"),

		new SoundTemplate(SoundType.UFO_ENEMY_ENTRY, this.soundsDirectory + "ufo_enemy_entry_1.mp3"),
		new SoundTemplate(SoundType.UFO_ENEMY_ENTRY, this.soundsDirectory + "ufo_enemy_entry_2.mp3"),

		new SoundTemplate(SoundType.ORB_LAUNCH, this.soundsDirectory + "orb_launch.mp3"),

		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_1.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_2.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_3.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_4.mp3"),

		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_1.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_2.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_3.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_4.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_5.mp3"),

		new SoundTemplate(SoundType.GAME_START, this.soundsDirectory + "game_start.mp3"),
		new SoundTemplate(SoundType.GAME_PAUSE, this.soundsDirectory + "game_pause.mp3"),
		new SoundTemplate(SoundType.GAME_OVER, this.soundsDirectory + "game_over.mp3"),		

		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_1.mp3", "Hey yo!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_3.mp3", "Hey!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_4.mp3", "No!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_5.mp3", "Heyyy!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_6.mp3", "Heyy!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_7.mp3", "What?"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_8.mp3", "No!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_9.mp3", "Noo!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_10.mp3", "No no no no no!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_11.mp3", "Oh no!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_12.mp3", "Oh what the hell?"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_13.mp3", "Hey!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_14.mp3", "Hey!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_15.mp3", "Heey!"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_16.mp3", "What?"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_17.mp3", "What?"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_18.mp3", "What are you doing?"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_19.mp3", "What?"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_20.mp3", "What are you doing here?"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_21.mp3", "What the hell?"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_22.mp3", "Heyy."),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_23.mp3", "Why?"),

		new SoundTemplate(SoundType.LEVEL_UP, this.soundsDirectory + "level_up.mp3"),
		new SoundTemplate(SoundType.OPTION_SELECT, this.soundsDirectory + "option_select.mp3"),
		new SoundTemplate(SoundType.BOOST_ACQUIRED, this.soundsDirectory + "boost_acquired.mp3"),
		new SoundTemplate(SoundType.ITEM_SELECT, this.soundsDirectory + "item_select.mp3"),
		new SoundTemplate(SoundType.SCORE, this.soundsDirectory + "score.mp3"),
	];

	private static ringWidth = 138;
	private static ringHeight = 138;

	public static RING_EXPLOSION_JSON: SpriteSheetJson = {
		meta: {
			image: './images/explosion_1.png',
			scale: "1",
		},
		frames: {
			frame0: {
				frame: { x: this.ringWidth * 0, y: 0, w: this.ringWidth, h: this.ringHeight },
				sourceSize: { w: this.ringWidth, h: this.ringHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame1: {
				frame: { x: this.ringWidth * 1, y: 0, w: this.ringWidth, h: this.ringHeight },
				sourceSize: { w: this.ringWidth, h: this.ringHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame2: {
				frame: { x: this.ringWidth * 2, y: 0, w: this.ringWidth, h: this.ringHeight },
				sourceSize: { w: this.ringWidth, h: this.ringHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame3: {
				frame: { x: this.ringWidth * 3, y: 0, w: this.ringWidth, h: this.ringHeight },
				sourceSize: { w: this.ringWidth, h: this.ringHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
		},
		animations: {
			frames: ["frame0", "frame1", "frame2", "frame3"]
		}
	};

	private static smokeWidth = 128;
	private static smokeHeight = 128;

	public static RING_SMOKE_EXPLOSION_JSON: SpriteSheetJson = {
		meta: {
			image: './images/explosion_2.png',
			scale: "1",
		},
		frames: {
			frame0: {
				frame: { x: this.smokeWidth * 0, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame1: {
				frame: { x: this.smokeWidth * 1, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame2: {
				frame: { x: this.smokeWidth * 2, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame3: {
				frame: { x: this.smokeWidth * 3, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame4: {
				frame: { x: this.smokeWidth * 4, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame5: {
				frame: { x: this.smokeWidth * 5, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame6: {
				frame: { x: this.smokeWidth * 6, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame7: {
				frame: { x: this.smokeWidth * 7, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame8: {
				frame: { x: this.smokeWidth * 8, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame9: {
				frame: { x: this.smokeWidth * 9, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
		},
		animations: {
			frames: ["frame0", "frame1", "frame2", "frame3", "frame4", "frame5", "frame6", "frame7", "frame8", "frame9"]
		}
	};

	public static BLOW_SMOKE_EXPLOSION_JSON: SpriteSheetJson = {
		meta: {
			image: './images/explosion_4.png',
			scale: "1",
		},
		frames: {
			frame0: {
				frame: { x: this.smokeWidth * 0, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame1: {
				frame: { x: this.smokeWidth * 1, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame2: {
				frame: { x: this.smokeWidth * 2, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame3: {
				frame: { x: this.smokeWidth * 3, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame4: {
				frame: { x: this.smokeWidth * 4, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame5: {
				frame: { x: this.smokeWidth * 5, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame6: {
				frame: { x: this.smokeWidth * 6, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame7: {
				frame: { x: this.smokeWidth * 7, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame8: {
				frame: { x: this.smokeWidth * 8, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame9: {
				frame: { x: this.smokeWidth * 9, y: 0, w: this.smokeWidth, h: this.smokeHeight },
				sourceSize: { w: this.smokeWidth, h: this.smokeHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
		},
		animations: {
			frames: ["frame0", "frame1", "frame2", "frame3", "frame4", "frame5", "frame6", "frame7", "frame8", "frame9"]
		}
	};

	private static puffWidth = 44;
	private static puffHeight = 44;

	public static FLASH_EXPLOSION_JSON: SpriteSheetJson = {
		meta: {
			image: './images/explosion_3.png',
			scale: "1",
		},
		frames: {
			frame0: {
				frame: { x: this.puffWidth * 0, y: 0, w: this.puffWidth, h: this.puffHeight },
				sourceSize: { w: this.puffWidth, h: this.puffHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame1: {
				frame: { x: this.puffWidth * 1, y: 0, w: this.puffWidth, h: this.puffHeight },
				sourceSize: { w: this.puffWidth, h: this.puffHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
			frame2: {
				frame: { x: this.puffWidth * 2, y: 0, w: this.puffWidth, h: this.puffHeight },
				sourceSize: { w: this.puffWidth, h: this.puffHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
		},
		animations: {
			frames: ["frame0", "frame1", "frame2"],
		}
	};

	//#endregion

	//#region Methods

	static degreesToRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	static getRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static getRandomUri(constructType: ConstructType): string {

		const templates = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == constructType);
		let uri: string = "";

		if (templates.length > 1) {
			uri = templates[this.getRandomNumber(0, templates.length - 1)].uri;
		}
		else {
			uri = templates[0].uri;
		}

		return uri;
	}

	static getRandomTexture(constructType: ConstructType): Texture {

		const uri = Constants.getRandomUri(constructType);
		const texture = Texture.from(uri);
		return texture;
	}

	static getRandomUriFromUris(uris: string[]): string {

		const templates = uris;
		const uri = templates[this.getRandomNumber(0, templates.length - 1)];

		return uri;
	}

	static getRandomTextureFromUris(uris: string[]): Texture {

		const uri = this.getRandomUriFromUris(uris);
		const texture = Texture.from(uri);
		return texture;
	}

	static checkCollision(objA: GameObjectContainer, objB: GameObjectContainer): boolean {
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

	static checkCloseCollision(objA: GameObjectContainer, objB: GameObjectContainer): boolean {

		const a = objA.getBounds(true);
		const b = objB.getBounds(true);

		const aLeft = a.left + a.width / 4;
		const bLeft = b.left /*+ b.width / 4*/;

		const aRight = a.right - a.width / 4;
		const bRight = b.right/* - b.width / 4*/;

		const rightmostLeft = aLeft < bLeft ? bLeft : aLeft;
		const leftmostRight = aRight > bRight ? bRight : aRight;

		if (leftmostRight <= rightmostLeft) {
			return false;
		}

		const aTop = a.top + a.height / 4;
		const bTop = b.top /*+ b.height / 4*/;

		const aBottom = a.bottom - a.height / 4;
		const bBottom = b.bottom /*- b.height / 4*/;

		const bottommostTop = aTop < bTop ? bTop : aTop;
		const topmostBottom = aBottom > bBottom ? bBottom : aBottom;

		return topmostBottom > bottommostTop;
	}

	//#endregion
}