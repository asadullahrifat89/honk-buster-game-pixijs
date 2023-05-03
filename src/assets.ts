import type { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
	bundles: [
		{
			name: "fontsBundle",
			assets: {
				"gamefont": "./gamefont.ttf"
			},
		},
		{
			name: "imagesBundle",
			assets:
			{
				"attack_button": "./images/attack_button.png",
				"pause_button": "./images/pause_button.png",
				"resume_button": "./images/resume_button.png",
				"quit_button": "./images/quit_button.png",

				"bang_1": "./images/bang_1.png",
				"bang_2": "./images/bang_2.png",				

				"blast_1": "./images/blast_1.png",
				"blast_2": "./images/blast_2.png",

				//"cloud_1": "./images/cloud_1.png",
				//"cloud_2": "./images/cloud_2.png",
				//"cloud_3": "./images/cloud_3.png",

				"cover_image": "./images/cover_image.png",

				"chopper_blades": "./images/chopper_blades.png",

				"enemy_1": "./images/enemy_1.png",
				"enemy_2": "./images/enemy_2.png",
				"enemy_3": "./images/enemy_3.png",
				"enemy_4": "./images/enemy_4.png",

				"enemy_bomb": "./images/enemy_bomb.png",

				"explosion_1": "./images/explosion_1.png",
				"explosion_2": "./images/explosion_2.png",
				"explosion_3": "./images/explosion_3.png",

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

				"player_rocket_1": "./images/player_rocket_1.png",
				"player_rocket_2": "./images/player_rocket_2.png",
				"player_rocket_3": "./images/player_rocket_3.png",

				"player_rocket_bulls_eye_1": "./images/player_rocket_bulls_eye_1.png",

				"player_rocket_seeking_1": "./images/player_rocket_seeking_1.png",
				"player_rocket_seeking_2": "./images/player_rocket_seeking_2.png",

				"powerup_pickup_armor": "./images/powerup_pickup_armor.png",
				"powerup_pickup_bulls_eye": "./images/powerup_pickup_bulls_eye.png",
				"powerup_pickup_seeking_snitch": "./images/powerup_pickup_seeking_snitch.png",

				"player_honk_bomb_sticky_1": "./images/player_honk_bomb_sticky_1.png",
				"player_honk_bomb_sticky_2": "./images/player_honk_bomb_sticky_2.png",				

				"player_honk_bomb_explosive_1": "./images/player_honk_bomb_explosive_1.png",
				"player_honk_bomb_explosive_2": "./images/player_honk_bomb_explosive_2.png",				

				"player_honk_bomb_trash_1": "./images/player_honk_bomb_trash_1.png",
				"player_honk_bomb_trash_2": "./images/player_honk_bomb_trash_2.png",				

				"road_marks": "./images/road_marks.png",

				"road_side_lamp_1": "./images/road_side_lamp_1.png",			

				"road_side_walk_top_1": "./images/road_side_walk_top_1.png",
				"road_side_walk_bottom_1": "./images/road_side_walk_bottom_1.png",

				"tree_1": "./images/tree_1.png",
				"tree_2": "./images/tree_2.png",
				"tree_3": "./images/tree_3.png",

				"ufo_boss_1_hit": "./images/ufo_boss_1_hit.png",
				"ufo_boss_1_idle": "./images/ufo_boss_1_idle.png",
				"ufo_boss_1_win": "./images/ufo_boss_1_win.png",

				"ufo_boss_rocket_1": "./images/ufo_boss_rocket_1.png",
				"ufo_boss_rocket_2": "./images/ufo_boss_rocket_2.png",
				"ufo_boss_rocket_3": "./images/ufo_boss_rocket_3.png",

				"ufo_boss_rocket_seeking": "./images/ufo_boss_rocket_seeking.png",

				"vehicle_boss_rocket": "./images/vehicle_boss_rocket.png",

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

				"barrel_break_1": "./sounds/barrel_break_1.mp3",
				"barrel_break_2": "./sounds/barrel_break_2.mp3",
				"barrel_break_3": "./sounds/barrel_break_3.mp3",

				"boss_background_music_1": "./sounds/boss_background_music_1.mp3",
				"boss_background_music_2": "./sounds/boss_background_music_2.mp3",
				"boss_background_music_3": "./sounds/boss_background_music_3.mp3",

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

				"game_background_music_1": "./sounds/game_background_music_1.mp3",
				"game_background_music_2": "./sounds/game_background_music_2.mp3",
				"game_background_music_3": "./sounds/game_background_music_3.mp3",

				"game_over": "./sounds/game_over.mp3",
				"game_pause": "./sounds/game_pause.mp3",
				"game_start": "./sounds/game_start.mp3",

				"health_pickup_1": "./sounds/health_pickup_1.mp3",

				"level_up": "./sounds/level_up.mp3",

				"option_select": "./sounds/option_select.mp3",
				"orb_launch": "./sounds/orb_launch.mp3",

				"player_health_loss_1": "./sounds/player_health_loss_1.mp3",
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

				"ufo_boss_hovering_1": "./sounds/ufo_boss_hovering_1.mp3",
				"ufo_boss_hovering_2": "./sounds/ufo_boss_hovering_2.mp3",
				"ufo_boss_hovering_3": "./sounds/ufo_boss_hovering_3.mp3",

				"ufo_enemy_entry_1": "./sounds/ufo_enemy_entry_1.mp3",
				"ufo_enemy_entry_2": "./sounds/ufo_enemy_entry_2.mp3",
			},
		},
	]
}