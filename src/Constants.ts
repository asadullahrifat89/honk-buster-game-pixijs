import { Texture } from "pixi.js";
import { ConstructTemplate } from "./core/ConstructTemplate";
import { GameObjectContainer } from "./core/GameObjectContainer";
import { SoundTemplate } from "./core/SoundTemplate";

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

export enum PlayerRideStance {
	Idle,
	Attack,
	Hit,
	Win,
}

export enum PlayerRideTemplate {
	BALLOON,
	CHOPPER,
}

export enum PlayerHonkBombTemplate {
	Cracker,
	TrashCan,
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
	PLAYER_ROCKET_BULLS_EYE,
	PLAYER_HONK_BOMB,

	VEHICLE_ENEMY_SMALL,
	VEHICLE_ENEMY_LARGE,
	VEHICLE_BOSS,

	VEHICLE_BOSS_ROCKET,

	ROAD_MARK,
	ROAD_SIDE_WALK_TOP,
	ROAD_SIDE_WALK_BOTTOM,

	ROAD_SIDE_TREE,
	ROAD_SIDE_HEDGE,
	ROAD_SIDE_LAMP,
	ROAD_SIDE_LIGHT_BILLBOARD,
	ROAD_SIDE_BILLBOARD,

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

	TITLE_SCREEN,
	CHOPPER_BLADES,
}

export enum SoundType {
	NONE,

	GAME_START,
	GAME_PAUSE,
	GAME_OVER,

	CRACKER_DROP,
	CRACKER_BLAST,

	CHOPPER_HOVERING,

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

	public static SELECTED_PLAYER_CHARACTER_TEMPLATE: number = 0;
	public static SELECTED_PLAYER_RIDE_TEMPLATE: number = 0;
	public static SELECTED_HONK_BUSTER_TEMPLATE: number = 0;
	//public static MESSAGE_BOX_LINE_COLOR: number = 0x2f3a5a;
	//public static MESSAGE_BOX_TEXT_COLOR: string = "#2f3a5a";

	public static MESSAGE_BOX_BORDER_COLOR: number = 0x000000;
	public static MESSAGE_BOX_TEXT_COLOR: string = "#000000";

	public static GAME_SCORE: number = 0;

	private static soundsDirectory = "sounds/";
	private static imagessDirectory = "images/";

	public static SOUND_TEMPLATES: (SoundTemplate)[] = [

		new SoundTemplate(SoundType.CHOPPER_HOVERING, this.soundsDirectory + "chopper_hovering.mp3"),

		new SoundTemplate(SoundType.CRACKER_DROP, this.soundsDirectory + "cracker_drop_1.mp3"),
		new SoundTemplate(SoundType.CRACKER_DROP, this.soundsDirectory + "cracker_drop_2.mp3"),

		new SoundTemplate(SoundType.CRACKER_BLAST, this.soundsDirectory + "cracker_blast_1.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, this.soundsDirectory + "cracker_blast_2.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, this.soundsDirectory + "cracker_blast_3.mp3"),
		new SoundTemplate(SoundType.CRACKER_BLAST, this.soundsDirectory + "cracker_blast_4.mp3"),

		new SoundTemplate(SoundType.TRASH_CAN_HIT, this.soundsDirectory + "trashcan_hit_1.mp3"),
		new SoundTemplate(SoundType.TRASH_CAN_HIT, this.soundsDirectory + "trashcan_hit_2.mp3"),
		new SoundTemplate(SoundType.TRASH_CAN_HIT, this.soundsDirectory + "trashcan_hit_3.mp3"),

		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_1.mp3"),
		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_2.mp3"),
		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_3.mp3"),

		new SoundTemplate(SoundType.ROCKET_BLAST, this.soundsDirectory + "rocket_blast_1.mp3"),
		new SoundTemplate(SoundType.ROCKET_BLAST, this.soundsDirectory + "rocket_blast_2.mp3"),
		new SoundTemplate(SoundType.ROCKET_BLAST, this.soundsDirectory + "rocket_blast_3.mp3"),

		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_1.mp3"),
		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_2.mp3"),
		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_3.mp3"),

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
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_22.mp3", "Heyy"),
		new SoundTemplate(SoundType.HONK_BUST_REACTION, this.soundsDirectory + "honk_bust_reaction_23.mp3", "Why?"),

		new SoundTemplate(SoundType.SEEKER_ROCKET_LAUNCH, this.soundsDirectory + "seeker_rocket_launch_1.mp3"),
		new SoundTemplate(SoundType.SEEKER_ROCKET_LAUNCH, this.soundsDirectory + "seeker_rocket_launch_2.mp3"),

		new SoundTemplate(SoundType.BULLS_EYE_ROCKET_LAUNCH, this.soundsDirectory + "bulls_eye_rocket_launch_1.mp3"),

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

		new SoundTemplate(SoundType.PLAYER_HEALTH_LOSS, this.soundsDirectory + "player_health_loss_1.mp3"),

		new SoundTemplate(SoundType.UFO_ENEMY_ENTRY, this.soundsDirectory + "ufo_enemy_entry_1.mp3"),
		new SoundTemplate(SoundType.UFO_ENEMY_ENTRY, this.soundsDirectory + "ufo_enemy_entry_2.mp3"),

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

		new SoundTemplate(SoundType.ORB_LAUNCH, this.soundsDirectory + "orb_launch.mp3"),

		new SoundTemplate(SoundType.LEVEL_UP, this.soundsDirectory + "level_up.mp3"),
		new SoundTemplate(SoundType.OPTION_SELECT, this.soundsDirectory + "option_select.mp3"),
	];

	public static CONSTRUCT_TEMPLATES: (ConstructTemplate)[] = [

		new ConstructTemplate(ConstructType.ROAD_MARK, this.imagessDirectory + "road_marks.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, this.imagessDirectory + "tree_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, this.imagessDirectory + "tree_2.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_TREE, this.imagessDirectory + "tree_3.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_TOP, this.imagessDirectory + "road_side_walk_top_1.png"),
		//new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_TOP, "road_side_walk_top_2.png"),
		//new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_TOP, "road_side_walk_top_3.png"),		

		new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_BOTTOM, this.imagessDirectory + "road_side_walk_bottom_1.png"),
		//new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_BOTTOM, "road_side_walk_bottom_2.png"),	
		//new ConstructTemplate(ConstructType.ROAD_SIDE_WALK_BOTTOM, "road_side_walk_bottom_3.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_HEDGE, this.imagessDirectory + "road_side_hedge_1.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, this.imagessDirectory + "billboard_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, this.imagessDirectory + "billboard_2.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_BILLBOARD, this.imagessDirectory + "billboard_3.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, this.imagessDirectory + "road_side_light_billboard_1.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, this.imagessDirectory + "road_side_light_billboard_2.png"),
		new ConstructTemplate(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD, this.imagessDirectory + "road_side_light_billboard_3.png"),

		new ConstructTemplate(ConstructType.ROAD_SIDE_LAMP, this.imagessDirectory + "road_side_lamp_1.png"),
		//new ConstructTemplate(ConstructType.ROAD_SIDE_LAMP, "road_side_lamp_2.png"),

		new ConstructTemplate(ConstructType.CLOUD, this.imagessDirectory + "cloud_1.png"),
		new ConstructTemplate(ConstructType.CLOUD, this.imagessDirectory + "cloud_2.png"),
		new ConstructTemplate(ConstructType.CLOUD, this.imagessDirectory + "cloud_3.png"),

		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_1.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_2.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_3.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_4.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_5.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_6.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_7.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_8.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_9.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_10.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_11.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_12.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_SMALL, this.imagessDirectory + "vehicle_small_13.png"),

		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, this.imagessDirectory + "vehicle_large_1.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, this.imagessDirectory + "vehicle_large_2.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, this.imagessDirectory + "vehicle_large_3.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, this.imagessDirectory + "vehicle_large_4.png"),
		new ConstructTemplate(ConstructType.VEHICLE_ENEMY_LARGE, this.imagessDirectory + "vehicle_large_5.png"),

		new ConstructTemplate(ConstructType.HONK, this.imagessDirectory + "honk_1.png"),
		new ConstructTemplate(ConstructType.HONK, this.imagessDirectory + "honk_2.png"),
		new ConstructTemplate(ConstructType.HONK, this.imagessDirectory + "honk_3.png"),

		new ConstructTemplate(ConstructType.PLAYER_RIDE, this.imagessDirectory + "player_1_character.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_IDLE, this.imagessDirectory + "player_balloon_1_idle.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_ATTACK, this.imagessDirectory + "player_balloon_1_attack.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_WIN, this.imagessDirectory + "player_balloon_1_win.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_HIT, this.imagessDirectory + "player_balloon_1_hit.png"),

		new ConstructTemplate(ConstructType.PLAYER_RIDE, this.imagessDirectory + "player_1_character.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_IDLE, this.imagessDirectory + "player_chopper_1_idle.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_ATTACK, this.imagessDirectory + "player_chopper_1_attack.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_WIN, this.imagessDirectory + "player_chopper_1_win.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_HIT, this.imagessDirectory + "player_chopper_1_hit.png"),

		new ConstructTemplate(ConstructType.PLAYER_RIDE, this.imagessDirectory + "player_2_character.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_IDLE, this.imagessDirectory + "player_balloon_2_idle.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_ATTACK, this.imagessDirectory + "player_balloon_2_attack.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_WIN, this.imagessDirectory + "player_balloon_2_win.png"),
		new ConstructTemplate(ConstructType.PLAYER_RIDE_HIT, this.imagessDirectory + "player_balloon_2_hit.png"),

		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, this.imagessDirectory + "cracker_1.png"),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, this.imagessDirectory + "cracker_2.png"),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, this.imagessDirectory + "cracker_3.png"),

		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, this.imagessDirectory + "trash_1.png"),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, this.imagessDirectory + "trash_2.png"),
		new ConstructTemplate(ConstructType.PLAYER_HONK_BOMB, this.imagessDirectory + "trash_3.png"),

		new ConstructTemplate(ConstructType.CHOPPER_BLADES, this.imagessDirectory + "chopper_blades.png"),

		new ConstructTemplate(ConstructType.BANG, this.imagessDirectory + "bang_1.png"),
		new ConstructTemplate(ConstructType.BANG, this.imagessDirectory + "bang_2.png"),

		new ConstructTemplate(ConstructType.BLAST, this.imagessDirectory + "blast_1.png"),
		new ConstructTemplate(ConstructType.BLAST, this.imagessDirectory + "blast_2.png"),

		new ConstructTemplate(ConstructType.VEHICLE_BOSS_ROCKET, this.imagessDirectory + "vehicle_boss_rocket.png"),

		new ConstructTemplate(ConstructType.PLAYER_ROCKET, this.imagessDirectory + "player_rocket_1.png"),
		new ConstructTemplate(ConstructType.PLAYER_ROCKET, this.imagessDirectory + "player_rocket_2.png"),
		new ConstructTemplate(ConstructType.PLAYER_ROCKET, this.imagessDirectory + "player_rocket_3.png"),

		new ConstructTemplate(ConstructType.PLAYER_ROCKET_BULLS_EYE, this.imagessDirectory + "player_rocket_bulls_eye_1.png"),

		//new ConstructTemplate(ConstructType.PLAYER_ROCKET_SEEKING, "player_rocket_seeking_1.png"),
		//new ConstructTemplate(ConstructType.PLAYER_ROCKET_SEEKING, "player_rocket_seeking_2.png"),

		new ConstructTemplate(ConstructType.UFO_BOSS_HIT, this.imagessDirectory + "ufo_boss_1_hit.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_IDLE, this.imagessDirectory + "ufo_boss_1_idle.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_WIN, this.imagessDirectory + "ufo_boss_1_win.png"),

		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, this.imagessDirectory + "ufo_boss_rocket_1.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, this.imagessDirectory + "ufo_boss_rocket_2.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET, this.imagessDirectory + "ufo_boss_rocket_3.png"),
		new ConstructTemplate(ConstructType.UFO_BOSS_ROCKET_SEEKING, this.imagessDirectory + "ufo_boss_rocket_seeking.png"),

		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_HIT, this.imagessDirectory + "zombie_boss_1_hit.png"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_IDLE, this.imagessDirectory + "zombie_boss_1_idle.png"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_WIN, this.imagessDirectory + "zombie_boss_1_win.png"),

		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, this.imagessDirectory + "zombie_boss_cube_1.png"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, this.imagessDirectory + "zombie_boss_cube_2.png"),
		new ConstructTemplate(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK, this.imagessDirectory + "zombie_boss_cube_3.png"),

		new ConstructTemplate(ConstructType.MAFIA_BOSS_HIT, this.imagessDirectory + "mafia_boss_1_hit.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_IDLE, this.imagessDirectory + "mafia_boss_1_idle.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_WIN, this.imagessDirectory + "mafia_boss_1_win.png"),

		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, this.imagessDirectory + "mafia_boss_rocket_1.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, this.imagessDirectory + "mafia_boss_rocket_2.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET, this.imagessDirectory + "mafia_boss_rocket_3.png"),
		new ConstructTemplate(ConstructType.MAFIA_BOSS_ROCKET_BULLS_EYE, this.imagessDirectory + "mafia_boss_rocket_bulls_eye.png"),

		new ConstructTemplate(ConstructType.HEALTH_PICKUP, this.imagessDirectory + "health_pickup.png"),
		new ConstructTemplate(ConstructType.POWERUP_PICKUP_ARMOR, this.imagessDirectory + "powerup_pickup_armor.png"),
		new ConstructTemplate(ConstructType.POWERUP_PICKUP_BULLS_EYE, this.imagessDirectory + "powerup_pickup_bulls_eye.png"),

		new ConstructTemplate(ConstructType.UFO_ENEMY, this.imagessDirectory + "enemy_1.png"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, this.imagessDirectory + "enemy_2.png"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, this.imagessDirectory + "enemy_3.png"),
		new ConstructTemplate(ConstructType.UFO_ENEMY, this.imagessDirectory + "enemy_4.png"),

		new ConstructTemplate(ConstructType.UFO_ENEMY_ROCKET, this.imagessDirectory + "enemy_bomb.png"),

		new ConstructTemplate(ConstructType.GAME_COVER_IMAGE, this.imagessDirectory + "cover_image.png"),
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