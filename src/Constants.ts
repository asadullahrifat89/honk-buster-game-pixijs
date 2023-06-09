﻿import { SpriteSheetJson, Texture } from "pixi.js";
import { TextureTemplate } from "./core/TextureTemplate";
import { GameObjectContainer } from "./core/GameObjectContainer";
import { SoundTemplate } from "./core/SoundTemplate";
import { PlayerAirBombTemplate, PlayerGroundBombTemplate, PlayerRideTemplate, SoundType, TextureType } from "./Enums";

export abstract class Constants {

	//#region Properties

	public static DEFAULT_GAME_VIEW_WIDTH: number = 1900;
	public static DEFAULT_GAME_VIEW_HEIGHT: number = 940;

	public static DEFAULT_CONSTRUCT_DELTA: number = 4;
	public static DEFAULT_CONSTRUCT_SPEED: number = 3 * Constants.DEFAULT_CONSTRUCT_DELTA;
	public static DEFAULT_BLAST_SHRINK_SCALE: number = 0.8;
	public static DEFAULT_DROP_SHADOW_DISTANCE: number = 40;

	public static SELECTED_PLAYER_CHARACTER_TEMPLATE: number = 0;
	public static SELECTED_PLAYER_RIDE_TEMPLATE: number = PlayerRideTemplate.AIR_BALLOON;
	public static SELECTED_PLAYER_GROUND_BOMB_TEMPLATE: number = PlayerGroundBombTemplate.TRASH_BIN;
	public static SELECTED_PLAYER_AIR_BOMB_TEMPLATE: number = PlayerAirBombTemplate.GRAVITY_BALL;

	public static MESSAGE_BOX_BORDER_COLOR: number = 0x000000;
	public static MESSAGE_BOX_TEXT_COLOR: string = "#000000";

	public static GAME_SCORE: number = 0;
	public static GAME_SCORE_MAX: number = 0;

	public static GAME_LEVEL: number = 0;
	public static GAME_LEVEL_MAX: number = 0;

	public static HEALTH_LEVEL_MAX: number = 0;
	public static ATTACK_LEVEL_MAX: number = 0;

	//TODO: reset these to the commented values after testing
	public static MISSILE_UNLOCK_LEVEL: number = 3; // 3
	public static MISSILE_UNLOCKED: boolean = false;

	public static BULLET_BALL_UNLOCK_LEVEL: number = 7; // 7
	public static BULLET_BALL_UNLOCKED: boolean = false;

	public static GRENADE_UNLOCK_LEVEL: number = 3; // 3
	public static GRENADE_UNLOCKED: boolean = false;

	public static DYNAMITE_UNLOCK_LEVEL: number = 7; // 7
	public static DYNAMITE_UNLOCKED: boolean = false;

	public static CHOPPER_UNLOCK_LEVEL: number = 3; // 3
	public static CHOPPER_UNLOCKED: boolean = false;

	public static SPHERE_UNLOCK_LEVEL: number = 7; // 7
	public static SPHERE_UNLOCKED: boolean = false;

	public static GAME_TITLE_FONT = "stitchnschool";
	public static GAME_DEFAULT_FONT = "emilio";

	public static CONSTRUCT_TEMPLATES: (TextureTemplate)[] = [

		new TextureTemplate(TextureType.STAGE, "stage_1"),

		new TextureTemplate(TextureType.GRAND_EXPLOSION_RING, "grand_explosion_ring_1"),
		new TextureTemplate(TextureType.HONK, "honk_1"),

		new TextureTemplate(TextureType.ROAD_MARK, "road_marks"),

		new TextureTemplate(TextureType.ROAD_SIDE_WALK_TOP, "road_side_walk_top_1"),
		new TextureTemplate(TextureType.ROAD_SIDE_WALK_BOTTOM, "road_side_walk_bottom_1"),
		new TextureTemplate(TextureType.ROAD_SIDE_WALK_BOTTOM_PILLARS, "road_side_walk_bottom_pillars_1"),

		new TextureTemplate(TextureType.LEAF, "leaf_1"),
		new TextureTemplate(TextureType.LEAF, "leaf_2"),
		new TextureTemplate(TextureType.LEAF, "leaf_3"),
		new TextureTemplate(TextureType.LEAF, "leaf_4"),

		new TextureTemplate(TextureType.VEHICLE_SMOKE, "vehicle_smoke_1"),
		new TextureTemplate(TextureType.VEHICLE_SMOKE, "vehicle_smoke_2"),

		new TextureTemplate(TextureType.VEHICLE_BOSS, "vehicle_boss_1"),
		new TextureTemplate(TextureType.VEHICLE_BOSS, "vehicle_boss_2"),
		new TextureTemplate(TextureType.VEHICLE_BOSS, "vehicle_boss_3"),

		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_1"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_2", true),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_3"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_4"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_5"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_6"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_7"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_8"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_9", true),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_10"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_11"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_12"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_SMALL, "vehicle_small_13"),

		new TextureTemplate(TextureType.VEHICLE_ENEMY_LARGE, "vehicle_large_1", true),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_LARGE, "vehicle_large_2"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_LARGE, "vehicle_large_3"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_LARGE, "vehicle_large_4"),
		new TextureTemplate(TextureType.VEHICLE_ENEMY_LARGE, "vehicle_large_5"),

		new TextureTemplate(TextureType.PLAYER_RIDE_IDLE, "player_balloon_1_idle", PlayerRideTemplate.AIR_BALLOON),
		new TextureTemplate(TextureType.PLAYER_RIDE_WIN, "player_balloon_1_win", PlayerRideTemplate.AIR_BALLOON),
		new TextureTemplate(TextureType.PLAYER_RIDE_HIT, "player_balloon_1_hit", PlayerRideTemplate.AIR_BALLOON),
		new TextureTemplate(TextureType.PLAYER_RIDE_ATTACK, "player_balloon_1_attack", PlayerRideTemplate.AIR_BALLOON),

		new TextureTemplate(TextureType.PLAYER_RIDE_IDLE, "player_chopper_1_idle", PlayerRideTemplate.CHOPPER),
		new TextureTemplate(TextureType.PLAYER_RIDE_WIN, "player_chopper_1_win", PlayerRideTemplate.CHOPPER),
		new TextureTemplate(TextureType.PLAYER_RIDE_HIT, "player_chopper_1_hit", PlayerRideTemplate.CHOPPER),
		new TextureTemplate(TextureType.PLAYER_RIDE_ATTACK, "player_chopper_1_attack", PlayerRideTemplate.CHOPPER),

		new TextureTemplate(TextureType.PLAYER_RIDE_IDLE, "player_sphere_1_idle", PlayerRideTemplate.SPHERE),
		new TextureTemplate(TextureType.PLAYER_RIDE_WIN, "player_sphere_1_win", PlayerRideTemplate.SPHERE),
		new TextureTemplate(TextureType.PLAYER_RIDE_HIT, "player_sphere_1_hit", PlayerRideTemplate.SPHERE),
		new TextureTemplate(TextureType.PLAYER_RIDE_ATTACK, "player_sphere_1_attack", PlayerRideTemplate.SPHERE),

		new TextureTemplate(TextureType.PLAYER_GROUND_BOMB, "player_honk_bomb_grenade_1", PlayerGroundBombTemplate.GRENADE),
		new TextureTemplate(TextureType.PLAYER_GROUND_BOMB, "player_honk_bomb_grenade_2", PlayerGroundBombTemplate.GRENADE),

		new TextureTemplate(TextureType.PLAYER_GROUND_BOMB, "player_honk_bomb_trash_1", PlayerGroundBombTemplate.TRASH_BIN),
		new TextureTemplate(TextureType.PLAYER_GROUND_BOMB, "player_honk_bomb_trash_2", PlayerGroundBombTemplate.TRASH_BIN),

		new TextureTemplate(TextureType.PLAYER_GROUND_BOMB, "player_honk_bomb_dynamite_1", PlayerGroundBombTemplate.DYNAMITE),
		new TextureTemplate(TextureType.PLAYER_GROUND_BOMB, "player_honk_bomb_dynamite_2", PlayerGroundBombTemplate.DYNAMITE),

		new TextureTemplate(TextureType.GRENADE_BLAST, "player_honk_bomb_grenade_1_open", PlayerGroundBombTemplate.GRENADE),
		new TextureTemplate(TextureType.GRENADE_BLAST, "player_honk_bomb_grenade_2_open", PlayerGroundBombTemplate.GRENADE),

		new TextureTemplate(TextureType.TRASH_BIN_BLAST, "player_honk_bomb_trash_1_open", PlayerGroundBombTemplate.TRASH_BIN),
		new TextureTemplate(TextureType.TRASH_BIN_BLAST, "player_honk_bomb_trash_2_open", PlayerGroundBombTemplate.TRASH_BIN),

		new TextureTemplate(TextureType.PLAYER_AIR_BOMB, "player_gravity_ball_1", PlayerAirBombTemplate.GRAVITY_BALL),
		new TextureTemplate(TextureType.PLAYER_AIR_BOMB, "player_gravity_ball_2", PlayerAirBombTemplate.GRAVITY_BALL),

		new TextureTemplate(TextureType.PLAYER_AIR_BOMB, "player_rocket_1", PlayerAirBombTemplate.MISSILE),
		new TextureTemplate(TextureType.PLAYER_AIR_BOMB, "player_rocket_2", PlayerAirBombTemplate.MISSILE),
		new TextureTemplate(TextureType.PLAYER_AIR_BOMB, "player_rocket_3", PlayerAirBombTemplate.MISSILE),

		new TextureTemplate(TextureType.PLAYER_AIR_BOMB, "player_bullet_ball_1", PlayerAirBombTemplate.BULLET_BALL),
		new TextureTemplate(TextureType.PLAYER_AIR_BOMB, "player_bullet_ball_2", PlayerAirBombTemplate.BULLET_BALL),

		new TextureTemplate(TextureType.PLAYER_AIR_BOMB_HURLING_BALLS, "player_hurling_ball"),

		new TextureTemplate(TextureType.CHOPPER_BLADES, "player_chopper_blades"),

		new TextureTemplate(TextureType.BLAST, "blast_1"),
		new TextureTemplate(TextureType.BLAST, "blast_2"),

		new TextureTemplate(TextureType.VEHICLE_BOSS_AIR_BOMB, "vehicle_boss_rocket_1"),
		new TextureTemplate(TextureType.VEHICLE_BOSS_AIR_BOMB, "vehicle_boss_rocket_2"),

		new TextureTemplate(TextureType.UFO_BOSS_HIT, "ufo_boss_1_hit"),
		new TextureTemplate(TextureType.UFO_BOSS_IDLE, "ufo_boss_1_idle"),
		new TextureTemplate(TextureType.UFO_BOSS_WIN, "ufo_boss_1_win"),

		new TextureTemplate(TextureType.UFO_BOSS_AIR_BOMB, "ufo_boss_rocket_1"),
		new TextureTemplate(TextureType.UFO_BOSS_AIR_BOMB, "ufo_boss_rocket_2"),
		new TextureTemplate(TextureType.UFO_BOSS_AIR_BOMB, "ufo_boss_rocket_3"),
		new TextureTemplate(TextureType.UFO_BOSS_AIR_BOMB_SEEKING, "ufo_boss_seeking_ball"),

		new TextureTemplate(TextureType.UFO_ENEMY, "ufo_enemy_1"),
		new TextureTemplate(TextureType.UFO_ENEMY, "ufo_enemy_2"),
		new TextureTemplate(TextureType.UFO_ENEMY, "ufo_enemy_3"),
		new TextureTemplate(TextureType.UFO_ENEMY, "ufo_enemy_4"),

		new TextureTemplate(TextureType.UFO_ENEMY_AIR_BOMB, "ufo_enemy_bomb"),

		new TextureTemplate(TextureType.ZOMBIE_BOSS_HIT, "zombie_boss_1_hit"),
		new TextureTemplate(TextureType.ZOMBIE_BOSS_IDLE, "zombie_boss_1_idle"),
		new TextureTemplate(TextureType.ZOMBIE_BOSS_WIN, "zombie_boss_1_win"),

		new TextureTemplate(TextureType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_1"),
		new TextureTemplate(TextureType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_2"),
		new TextureTemplate(TextureType.ZOMBIE_BOSS_ROCKET_BLOCK, "zombie_boss_cube_3"),

		new TextureTemplate(TextureType.MAFIA_BOSS_HIT, "mafia_boss_1_hit"),
		new TextureTemplate(TextureType.MAFIA_BOSS_IDLE, "mafia_boss_1_idle"),
		new TextureTemplate(TextureType.MAFIA_BOSS_WIN, "mafia_boss_1_win"),

		new TextureTemplate(TextureType.MAFIA_BOSS_AIR_BOMB, "mafia_boss_rocket_1"),
		new TextureTemplate(TextureType.MAFIA_BOSS_AIR_BOMB, "mafia_boss_rocket_2"),
		new TextureTemplate(TextureType.MAFIA_BOSS_AIR_BOMB, "mafia_boss_rocket_3"),
		new TextureTemplate(TextureType.MAFIA_BOSS_AIR_BOMB_HURLING_BALLS, "mafia_boss_hurling_ball"),

		new TextureTemplate(TextureType.HEALTH_PICKUP, "health_pickup"),
		new TextureTemplate(TextureType.POWERUP_PICKUP_ARMOR, "powerup_pickup_armor"),
		new TextureTemplate(TextureType.POWERUP_PICKUP_HURLING_BALLS, "powerup_pickup_bulls_eye"),

		new TextureTemplate(TextureType.GAME_COVER_IMAGE, "cover_image"),
	];

	private static soundsDirectory = "sounds/";

	public static SOUND_TEMPLATES: (SoundTemplate)[] = [

		new SoundTemplate(SoundType.GRAND_EXPLOSION_RING, this.soundsDirectory + "grand_explosion_1.mp3"),
		new SoundTemplate(SoundType.GRAND_EXPLOSION_RING, this.soundsDirectory + "grand_explosion_2.mp3"),
		new SoundTemplate(SoundType.GRAND_EXPLOSION_RING, this.soundsDirectory + "grand_explosion_3.mp3"),

		new SoundTemplate(SoundType.CHOPPER_HOVERING, this.soundsDirectory + "chopper_hovering.mp3"),
		new SoundTemplate(SoundType.SPHERE_FLOATING, this.soundsDirectory + "sphere_floating.mp3"),

		new SoundTemplate(SoundType.GROUND_BOMB_DROP, this.soundsDirectory + "ground_bomb_drop_1.mp3"),
		new SoundTemplate(SoundType.GROUND_BOMB_DROP, this.soundsDirectory + "ground_bomb_drop_2.mp3"),
		new SoundTemplate(SoundType.GROUND_BOMB_DROP, this.soundsDirectory + "ground_bomb_drop_3.mp3"),

		new SoundTemplate(SoundType.GROUND_BOMB_BLAST, this.soundsDirectory + "cracker_blast_1.mp3"),
		new SoundTemplate(SoundType.GROUND_BOMB_BLAST, this.soundsDirectory + "cracker_blast_2.mp3"),
		new SoundTemplate(SoundType.GROUND_BOMB_BLAST, this.soundsDirectory + "cracker_blast_3.mp3"),
		new SoundTemplate(SoundType.GROUND_BOMB_BLAST, this.soundsDirectory + "cracker_blast_4.mp3"),

		new SoundTemplate(SoundType.TRASH_BIN_BLAST, this.soundsDirectory + "trashcan_hit_1.mp3"),
		new SoundTemplate(SoundType.TRASH_BIN_BLAST, this.soundsDirectory + "trashcan_hit_2.mp3"),
		new SoundTemplate(SoundType.TRASH_BIN_BLAST, this.soundsDirectory + "trashcan_hit_3.mp3"),

		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_1.mp3"),
		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_2.mp3"),
		new SoundTemplate(SoundType.ROCKET_LAUNCH, this.soundsDirectory + "rocket_launch_3.mp3"),

		new SoundTemplate(SoundType.AIR_BOMB_BLAST, this.soundsDirectory + "rocket_blast_1.mp3"),
		new SoundTemplate(SoundType.AIR_BOMB_BLAST, this.soundsDirectory + "rocket_blast_2.mp3"),
		new SoundTemplate(SoundType.AIR_BOMB_BLAST, this.soundsDirectory + "rocket_blast_3.mp3"),

		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_1.mp3"),
		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_2.mp3"),
		new SoundTemplate(SoundType.HONK, this.soundsDirectory + "car_honk_3.mp3"),

		new SoundTemplate(SoundType.SEEKER_ROCKET_LAUNCH, this.soundsDirectory + "seeker_rocket_launch_1.mp3"),
		new SoundTemplate(SoundType.SEEKER_ROCKET_LAUNCH, this.soundsDirectory + "seeker_rocket_launch_2.mp3"),

		new SoundTemplate(SoundType.ORB_LAUNCH, this.soundsDirectory + "orb_launch_1.mp3"),
		new SoundTemplate(SoundType.BALL_LAUNCH, this.soundsDirectory + "ball_launch_1.mp3"),
		new SoundTemplate(SoundType.BULLET_LAUNCH, this.soundsDirectory + "bullet_launch_1.mp3"),

		new SoundTemplate(SoundType.AMBIENCE, this.soundsDirectory + "ambience_1.mp3"),
		new SoundTemplate(SoundType.AMBIENCE, this.soundsDirectory + "ambience_2.mp3"),
		new SoundTemplate(SoundType.AMBIENCE, this.soundsDirectory + "ambience_3.mp3"),

		new SoundTemplate(SoundType.UFO_HOVERING, this.soundsDirectory + "ufo_boss_hovering_1.mp3"),
		new SoundTemplate(SoundType.UFO_HOVERING, this.soundsDirectory + "ufo_boss_hovering_2.mp3"),
		new SoundTemplate(SoundType.UFO_HOVERING, this.soundsDirectory + "ufo_boss_hovering_3.mp3"),

		new SoundTemplate(SoundType.UFO_BOSS_ENTRY, this.soundsDirectory + "ufo_boss_entry_1.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_ENTRY, this.soundsDirectory + "ufo_boss_entry_2.mp3"),

		new SoundTemplate(SoundType.UFO_BOSS_DEAD, this.soundsDirectory + "ufo_boss_dead_1.mp3"),
		new SoundTemplate(SoundType.UFO_BOSS_DEAD, this.soundsDirectory + "ufo_boss_dead_2.mp3"),

		new SoundTemplate(SoundType.POWERUP_PICKUP, this.soundsDirectory + "power_up_pickup_1.mp3"),
		new SoundTemplate(SoundType.HEALTH_PICKUP, this.soundsDirectory + "health_pickup_1.mp3"),

		new SoundTemplate(SoundType.DAMAGE_TAKEN, this.soundsDirectory + "health_loss_1.mp3"),

		new SoundTemplate(SoundType.UFO_ENEMY_ENTRY, this.soundsDirectory + "ufo_enemy_entry_1.mp3"),
		new SoundTemplate(SoundType.UFO_ENEMY_ENTRY, this.soundsDirectory + "ufo_enemy_entry_2.mp3"),

		new SoundTemplate(SoundType.GAME_INTRO_MUSIC, this.soundsDirectory + "intro_music_1.mp3"),
		new SoundTemplate(SoundType.GAME_INTRO_MUSIC, this.soundsDirectory + "intro_music_2.mp3"),
		new SoundTemplate(SoundType.GAME_INTRO_MUSIC, this.soundsDirectory + "intro_music_3.mp3"),
		new SoundTemplate(SoundType.GAME_INTRO_MUSIC, this.soundsDirectory + "intro_music_4.mp3"),
		new SoundTemplate(SoundType.GAME_INTRO_MUSIC, this.soundsDirectory + "intro_music_5.mp3"),

		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_1.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_2.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_3.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_4.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_5.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_6.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_7.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_8.mp3"),
		new SoundTemplate(SoundType.GAME_BACKGROUND_MUSIC, this.soundsDirectory + "game_background_music_9.mp3"),

		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_1.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_2.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_3.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_4.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_5.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_6.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_7.mp3"),
		new SoundTemplate(SoundType.BOSS_BACKGROUND_MUSIC, this.soundsDirectory + "boss_background_music_8.mp3"),

		new SoundTemplate(SoundType.GAME_START, this.soundsDirectory + "game_start.mp3"),
		new SoundTemplate(SoundType.GAME_PAUSE, this.soundsDirectory + "game_pause.mp3"),
		new SoundTemplate(SoundType.GAME_OVER, this.soundsDirectory + "game_over.mp3"),

		new SoundTemplate(SoundType.LEVEL_UP, this.soundsDirectory + "level_up.mp3"),
		new SoundTemplate(SoundType.OPTION_SELECT, this.soundsDirectory + "option_select.mp3"),
		new SoundTemplate(SoundType.BOOST_ACQUIRED, this.soundsDirectory + "boost_acquired.mp3"),
		new SoundTemplate(SoundType.ITEM_SELECT, this.soundsDirectory + "item_select.mp3"),
		new SoundTemplate(SoundType.SCORE_ACQUIRED, this.soundsDirectory + "score.mp3"),
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
			frame3: {
				frame: { x: this.puffWidth * 3, y: 0, w: this.puffWidth, h: this.puffHeight },
				sourceSize: { w: this.puffWidth, h: this.puffHeight },
				spriteSourceSize: { x: 0, y: 0 }
			},
		},
		animations: {
			frames: ["frame0", "frame1", "frame2", "frame3"],
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

	static getRandomUri(constructType: TextureType): string {

		const templates = Constants.CONSTRUCT_TEMPLATES.filter(x => x.textureType == constructType);
		let uri: string = "";

		if (templates.length > 1) {
			uri = templates[this.getRandomNumber(0, templates.length - 1)].uri;
		}
		else {
			uri = templates[0].uri;
		}

		return uri;
	}

	static getRandomTexture(constructType: TextureType): Texture {

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

	static getTextureFromUri(uri: string): Texture {
		const texture = Texture.from(uri);
		return texture;
	}

	static checkCollision(objA: GameObjectContainer, objB: GameObjectContainer): boolean {
		const a = objA.getBounds(true);
		const b = objB.getBounds(true);

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