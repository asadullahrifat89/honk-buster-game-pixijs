import type { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
	bundles: [
		{
			name: "fontsBundle",
			assets: {
				"stitchnschool": "./stitchnschool.ttf",
				"diloworld": "./diloworld.ttf",
				"jackpot": "./jackpot.ttf",
				"emilio": "./emilio.ttf"
			},
		},
		{
			name: "imagesBundle",
			assets:
			{
				"attack_button": "./images/attack_button.png",
				"pause_button": "./images/pause_button.png",
				"play_button": "./images/play_button.png",
				"stop_button": "./images/stop_button.png",

				"character_maleAdventurer_talk": "./images/character_maleAdventurer_talk.png",
				"character_maleAdventurer_interact": "./images/character_maleAdventurer_interact.png",
				"character_maleAdventurer_cheer0": "./images/character_maleAdventurer_cheer0.png",
				"character_maleAdventurer_behindBack": "./images/character_maleAdventurer_behindBack.png",

				"cover_image": "./images/cover_image.png",

				"player_chopper_blades": "./images/player_chopper_blades.png",

				"explosion_1": "./images/explosion_1.png",
				"explosion_2": "./images/explosion_2.png",
				"explosion_3": "./images/explosion_3.png",
				"explosion_4": "./images/explosion_4.png",

				"explosion_ring_1": "./images/explosion_ring_1.png",

				"health_pickup": "./images/health_pickup.png",

				"honk_1": "./images/honk_1.png",
				"honk_2": "./images/honk_2.png",
				"honk_3": "./images/honk_3.png",

				"joystick": "./images/joystick.png",
				"joystick_handle": "./images/joystick_handle.png",

				"mafia_boss_1_hit": "./images/mafia_boss_1_hit.png",
				"mafia_boss_1_idle": "./images/mafia_boss_1_idle.png",
				"mafia_boss_1_win": "./images/mafia_boss_1_win.png",

				"mafia_boss_rocket_1": "./images/mafia_boss_rocket_1.png",
				"mafia_boss_rocket_2": "./images/mafia_boss_rocket_2.png",
				"mafia_boss_rocket_3": "./images/mafia_boss_rocket_3.png",

				"mafia_boss_rocket_bulls_eye": "./images/mafia_boss_rocket_bulls_eye.png",

				"player_1_character": "./images/player_1_character.png",
				"player_2_character": "./images/player_2_character.png",

				"player_ride_1": "./images/player_ride_1.png",
				"player_ride_2": "./images/player_ride_2.png",

				"player_balloon_1_attack": "./images/player_balloon_1_attack.png",
				"player_balloon_1_hit": "./images/player_balloon_1_hit.png",
				"player_balloon_1_idle": "./images/player_balloon_1_idle.png",
				"player_balloon_1_win": "./images/player_balloon_1_win.png",

				"player_chopper_1_attack": "./images/player_chopper_1_attack.png",
				"player_chopper_1_hit": "./images/player_chopper_1_hit.png",
				"player_chopper_1_idle": "./images/player_chopper_1_idle.png",
				"player_chopper_1_win": "./images/player_chopper_1_win.png",

				"player_balloon_2_attack": "./images/player_balloon_2_attack.png",
				"player_balloon_2_hit": "./images/player_balloon_2_hit.png",
				"player_balloon_2_idle": "./images/player_balloon_2_idle.png",
				"player_balloon_2_win": "./images/player_balloon_2_win.png",

				"player_gravity_ball_1": "./images/player_gravity_ball_1.png",
				"player_gravity_ball_2": "./images/player_gravity_ball_2.png",

				"player_target_ball_1": "./images/player_target_ball_1.png",
				"player_target_ball_2": "./images/player_target_ball_2.png",

				"player_rocket_1": "./images/player_rocket_1.png",
				"player_rocket_2": "./images/player_rocket_2.png",
				"player_rocket_3": "./images/player_rocket_3.png",

				"player_rocket_bulls_eye_1": "./images/player_rocket_bulls_eye_1.png",

				"powerup_pickup_armor": "./images/powerup_pickup_armor.png",
				"powerup_pickup_bulls_eye": "./images/powerup_pickup_bulls_eye.png",

				"player_honk_bomb_sticky_1": "./images/player_honk_bomb_sticky_1.png",
				"player_honk_bomb_sticky_2": "./images/player_honk_bomb_sticky_2.png",

				"player_honk_bomb_explosive_1": "./images/player_honk_bomb_explosive_1.png",
				"player_honk_bomb_explosive_2": "./images/player_honk_bomb_explosive_2.png",

				"player_honk_bomb_trash_1": "./images/player_honk_bomb_trash_1.png",
				"player_honk_bomb_trash_2": "./images/player_honk_bomb_trash_2.png",

				"player_honk_bomb_trash_1_open": "./images/player_honk_bomb_trash_1_open.png",
				"player_honk_bomb_trash_2_open": "./images/player_honk_bomb_trash_2_open.png",

				"road_marks": "./images/road_marks.png",

				"road_side_walk_top_1": "./images/road_side_walk_top_1.png",
				"road_side_walk_top_2": "./images/road_side_walk_top_2.png",

				"road_side_walk_bottom_1": "./images/road_side_walk_bottom_1.png",
				"road_side_walk_bottom_2": "./images/road_side_walk_bottom_2.png",

				"road_side_walk_bottom_pillars_1": "./images/road_side_walk_bottom_pillars_1.png",

				"ufo_enemy_1": "./images/ufo_enemy_1.png",
				"ufo_enemy_2": "./images/ufo_enemy_2.png",
				"ufo_enemy_3": "./images/ufo_enemy_3.png",
				"ufo_enemy_4": "./images/ufo_enemy_4.png",

				"ufo_enemy_bomb": "./images/ufo_enemy_bomb.png",

				"ufo_boss_1_hit": "./images/ufo_boss_1_hit.png",
				"ufo_boss_1_idle": "./images/ufo_boss_1_idle.png",
				"ufo_boss_1_win": "./images/ufo_boss_1_win.png",

				"ufo_boss_rocket_1": "./images/ufo_boss_rocket_1.png",
				"ufo_boss_rocket_2": "./images/ufo_boss_rocket_2.png",
				"ufo_boss_rocket_3": "./images/ufo_boss_rocket_3.png",

				"ufo_boss_rocket_seeking": "./images/ufo_boss_rocket_seeking.png",

				"vehicle_boss_rocket_1": "./images/vehicle_boss_rocket_1.png",
				"vehicle_boss_rocket_2": "./images/vehicle_boss_rocket_2.png",

				"vehicle_boss_1": "./images/vehicle_boss_1.png",
				"vehicle_boss_2": "./images/vehicle_boss_2.png",
				"vehicle_boss_3": "./images/vehicle_boss_3.png",

				"vehicle_large_1": "./images/vehicle_large_1.png",
				"vehicle_large_2": "./images/vehicle_large_2.png",
				"vehicle_large_3": "./images/vehicle_large_3.png",
				"vehicle_large_4": "./images/vehicle_large_4.png",
				"vehicle_large_5": "./images/vehicle_large_5.png",

				"vehicle_small_1": "./images/vehicle_small_1.png",
				"vehicle_small_2": "./images/vehicle_small_2.png",
				"vehicle_small_3": "./images/vehicle_small_3.png",
				"vehicle_small_4": "./images/vehicle_small_4.png",
				"vehicle_small_5": "./images/vehicle_small_5.png",
				"vehicle_small_6": "./images/vehicle_small_6.png",
				"vehicle_small_7": "./images/vehicle_small_7.png",
				"vehicle_small_8": "./images/vehicle_small_8.png",
				"vehicle_small_9": "./images/vehicle_small_9.png",
				"vehicle_small_10": "./images/vehicle_small_10.png",
				"vehicle_small_11": "./images/vehicle_small_11.png",
				"vehicle_small_12": "./images/vehicle_small_12.png",
				"vehicle_small_13": "./images/vehicle_small_13.png",

				"zombie_boss_1_hit": "./images/zombie_boss_1_hit.png",
				"zombie_boss_1_idle": "./images/zombie_boss_1_idle.png",
				"zombie_boss_1_win": "./images/zombie_boss_1_win.png",

				"zombie_boss_cube_1": "./images/zombie_boss_cube_1.png",
				"zombie_boss_cube_2": "./images/zombie_boss_cube_2.png",
				"zombie_boss_cube_3": "./images/zombie_boss_cube_3.png",
			},
		},
		{
			name: "soundsBundle",
			assets: {

				"ambience_1": "./sounds/ambience_1.mp3",
				"ambience_2": "./sounds/ambience_2.mp3",
				"ambience_3": "./sounds/ambience_3.mp3",

				"boost_acquired": "./sounds/boost_acquired.mp3",
				"item_select": "./sounds/item_select.mp3",

				"ball_launch_1": "./sounds/ball_launch_1.mp3",
				"ball_launch_2": "./sounds/ball_launch_2.mp3",

				"boss_explosion_1": "./sounds/boss_explosion_1.mp3",
				"boss_explosion_2": "./sounds/boss_explosion_2.mp3",

				"car_honk_1": "./sounds/car_honk_1.mp3",
				"car_honk_2": "./sounds/car_honk_2.mp3",
				"car_honk_3": "./sounds/car_honk_3.mp3",

				"chopper_hovering": "./sounds/chopper_hovering.mp3",

				"cracker_blast_1": "./sounds/cracker_blast_1.mp3",
				"cracker_blast_2": "./sounds/cracker_blast_2.mp3",
				"cracker_blast_3": "./sounds/cracker_blast_3.mp3",
				"cracker_blast_4": "./sounds/cracker_blast_4.mp3",

				"cracker_drop_1": "./sounds/cracker_drop_1.mp3",
				"cracker_drop_2": "./sounds/cracker_drop_2.mp3",

				"game_over": "./sounds/game_over.mp3",
				"game_pause": "./sounds/game_pause.mp3",
				"game_start": "./sounds/game_start.mp3",

				"health_pickup_1": "./sounds/health_pickup_1.mp3",

				"level_up": "./sounds/level_up.mp3",
				"score": "./sounds/score.mp3",

				"option_select": "./sounds/option_select.mp3",
				"orb_launch": "./sounds/orb_launch.mp3",

				"health_loss_1": "./sounds/health_loss_1.mp3",
				"power_up_pickup_1": "./sounds/power_up_pickup_1.mp3",

				"rocket_blast_1": "./sounds/rocket_blast_1.mp3",
				"rocket_blast_2": "./sounds/rocket_blast_2.mp3",
				"rocket_blast_3": "./sounds/rocket_blast_3.mp3",

				"rocket_launch_1": "./sounds/rocket_launch_1.mp3",
				"rocket_launch_2": "./sounds/rocket_launch_2.mp3",
				"rocket_launch_3": "./sounds/rocket_launch_3.mp3",

				"seeker_rocket_launch_1": "./sounds/seeker_rocket_launch_1.mp3",
				"seeker_rocket_launch_2": "./sounds/seeker_rocket_launch_2.mp3",

				"trashcan_hit_1": "./sounds/trashcan_hit_1.mp3",
				"trashcan_hit_2": "./sounds/trashcan_hit_2.mp3",
				"trashcan_hit_3": "./sounds/trashcan_hit_3.mp3",

				"ufo_boss_dead_1": "./sounds/ufo_boss_dead_1.mp3",
				"ufo_boss_dead_2": "./sounds/ufo_boss_dead_2.mp3",

				"ufo_boss_entry_1": "./sounds/ufo_boss_entry_1.mp3",
				"ufo_boss_entry_2": "./sounds/ufo_boss_entry_2.mp3",

				"ufo_enemy_entry_1": "./sounds/ufo_enemy_entry_1.mp3",
				"ufo_enemy_entry_2": "./sounds/ufo_enemy_entry_2.mp3",

				"ufo_boss_hovering_1": "./sounds/ufo_boss_hovering_1.mp3",
				"ufo_boss_hovering_2": "./sounds/ufo_boss_hovering_2.mp3",
				"ufo_boss_hovering_3": "./sounds/ufo_boss_hovering_3.mp3",

				//"game_background_music_1": "./sounds/game_background_music_1.mp3",
				//"game_background_music_2": "./sounds/game_background_music_2.mp3",
				//"game_background_music_3": "./sounds/game_background_music_3.mp3",

				//"boss_background_music_1": "./sounds/boss_background_music_1.mp3",
				//"boss_background_music_2": "./sounds/boss_background_music_2.mp3",
				//"boss_background_music_3": "./sounds/boss_background_music_3.mp3",
			},
		},
	]
}