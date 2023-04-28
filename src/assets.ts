import type { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
	bundles: [		
		{
			name: "fontsBundle",
			assets: {
				"gameplay": "./gameplay.ttf"
			},
		},
		{
			name: "imagesBundle",
			assets:
			{
				"attack_button": "./attack_button.png",
				"pause_button": "./pause_button.png",
				"resume_button": "./resume_button.png",

				"bang_1": "./bang_1.png",
				"bang_2": "./bang_2.png",

				"billboard_1": "./billboard_1.png",
				"billboard_2": "./billboard_2.png",
				"billboard_3": "./billboard_3.png",

				"blast_1": "./blast_1.png",
				"blast_2": "./blast_2.png",

				"cloud_1": "./cloud_1.png",
				"cloud_2": "./cloud_2.png",
				"cloud_3": "./cloud_3.png",

				"cover_image": "./cover_image.png",

				"cracker_1": "./cracker_1.png",
				"cracker_2": "./cracker_2.png",
				"cracker_3": "./cracker_3.png",

				"enemy_1": "./enemy_1.png",
				"enemy_2": "./enemy_2.png",
				"enemy_3": "./enemy_3.png",
				"enemy_4": "./enemy_4.png",

				"enemy_bomb": "./enemy_bomb.png",				

				"health_pickup": "./health_pickup.png",

				"honk_1": "./honk_1.png",
				"honk_2": "./honk_2.png",
				"honk_3": "./honk_3.png",

				"honk_buster_1": "./honk_buster_1.png",
				"honk_buster_2": "./honk_buster_2.png",

				"joystick": "./joystick.png",
				"joystick_handle": "./joystick_handle.png",

				"mafia_boss_1_hit": "./mafia_boss_1_hit.png",
				"mafia_boss_1_idle": "./mafia_boss_1_idle.png",
				"mafia_boss_1_win": "./mafia_boss_1_win.png",

				"mafia_boss_rocket_1": "./mafia_boss_rocket_1.png",
				"mafia_boss_rocket_2": "./mafia_boss_rocket_2.png",
				"mafia_boss_rocket_3": "./mafia_boss_rocket_3.png",

				"mafia_boss_rocket_bulls_eye": "./mafia_boss_rocket_bulls_eye.png",

				"player_1_character": "./player_1_character.png",
				"player_2_character": "./player_2_character.png",

				"player_balloon_1_attack": "./player_balloon_1_attack.png",
				"player_balloon_1_hit": "./player_balloon_1_hit.png",
				"player_balloon_1_idle": "./player_balloon_1_idle.png",
				"player_balloon_1_win": "./player_balloon_1_win.png",

				"player_balloon_2_attack": "./player_balloon_2_attack.png",
				"player_balloon_2_hit": "./player_balloon_2_hit.png",
				"player_balloon_2_idle": "./player_balloon_2_idle.png",
				"player_balloon_2_win": "./player_balloon_2_win.png",

				"player_rocket_1": "./player_rocket_1.png",
				"player_rocket_2": "./player_rocket_2.png",
				"player_rocket_3": "./player_rocket_3.png",

				"player_rocket_bulls_eye_1": "./player_rocket_bulls_eye_1.png",

				"player_rocket_seeking_1": "./player_rocket_seeking_1.png",
				"player_rocket_seeking_2": "./player_rocket_seeking_2.png",

				"powerup_pickup_armor": "./powerup_pickup_armor.png",
				"powerup_pickup_bulls_eye": "./powerup_pickup_bulls_eye.png",
				"powerup_pickup_seeking_snitch": "./powerup_pickup_seeking_snitch.png",

				"road_marks": "./road_marks.png",

				"road_side_hedge_1": "./road_side_hedge_1.png",

				"road_side_lamp_1": "./road_side_lamp_1.png",
				"road_side_lamp_2": "./road_side_lamp_2.png",

				"road_side_light_billboard_1": "./road_side_light_billboard_1.png",
				"road_side_light_billboard_2": "./road_side_light_billboard_2.png",
				"road_side_light_billboard_3": "./road_side_light_billboard_3.png",

				"road_side_walk_1": "./road_side_walk_1.png",

				"trash_1": "./trash_1.png",
				"trash_2": "./trash_2.png",
				"trash_3": "./trash_3.png",

				"tree_1": "./tree_1.png",
				"tree_2": "./tree_2.png",

				"ufo_boss_1_hit": "./ufo_boss_1_hit.png",
				"ufo_boss_1_idle": "./ufo_boss_1_idle.png",
				"ufo_boss_1_win": "./ufo_boss_1_win.png",

				"ufo_boss_rocket_1": "./ufo_boss_rocket_1.png",
				"ufo_boss_rocket_2": "./ufo_boss_rocket_2.png",
				"ufo_boss_rocket_3": "./ufo_boss_rocket_3.png",

				"ufo_boss_rocket_seeking": "./ufo_boss_rocket_seeking.png",

				"vehicle_boss_rocket": "./vehicle_boss_rocket.png",

				"vehicle_large_1": "./vehicle_large_1.png",
				"vehicle_large_2": "./vehicle_large_2.png",
				"vehicle_large_3": "./vehicle_large_3.png",
				"vehicle_large_4": "./vehicle_large_4.png",
				"vehicle_large_5": "./vehicle_large_5.png",

				"vehicle_small_1": "./vehicle_small_1.png",
				"vehicle_small_2": "./vehicle_small_2.png",
				"vehicle_small_3": "./vehicle_small_3.png",
				"vehicle_small_4": "./vehicle_small_4.png",
				"vehicle_small_5": "./vehicle_small_5.png",
				"vehicle_small_6": "./vehicle_small_6.png",
				"vehicle_small_7": "./vehicle_small_7.png",
				"vehicle_small_8": "./vehicle_small_8.png",
				"vehicle_small_9": "./vehicle_small_9.png",
				"vehicle_small_10": "./vehicle_small_10.png",
				"vehicle_small_11": "./vehicle_small_11.png",
				"vehicle_small_12": "./vehicle_small_12.png",
				"vehicle_small_13": "./vehicle_small_13.png",
				"vehicle_small_14": "./vehicle_small_14.png",
				"vehicle_small_15": "./vehicle_small_15.png",

				"zombie_boss_1_hit": "./zombie_boss_1_hit.png",
				"zombie_boss_1_idle": "./zombie_boss_1_idle.png",
				"zombie_boss_1_win": "./zombie_boss_1_win.png",

				"zombie_boss_cube_1": "./zombie_boss_cube_1.png",
				"zombie_boss_cube_2": "./zombie_boss_cube_2.png",
				"zombie_boss_cube_3": "./zombie_boss_cube_3.png",
			},
		},
		{
			name: "soundsBundle",
			assets: {
				"option_select": "./option_select.mp3",

				"game_over": "./game_over.mp3",
				"game_pause": "./game_pause.mp3",
				"game_start": "./game_start.mp3",

				"level_up": "./level_up.mp3",

				"power_up_pickup_1": "./power_up_pickup_1.mp3",
				"health_pickup_1": "./health_pickup_1.mp3",

				"car_honk_1": "./car_honk_1.mp3",
				"car_honk_2": "./car_honk_2.mp3",
				"car_honk_3": "./car_honk_3.mp3",

				"cracker_drop_1": "./cracker_drop_1.mp3",
				"cracker_drop_2": "./cracker_drop_2.mp3",

				"cracker_blast_1": "./cracker_blast_1.mp3",
				"cracker_blast_2": "./cracker_blast_2.mp3",
				"cracker_blast_3": "./cracker_blast_3.mp3",
				"cracker_blast_4": "./cracker_blast_4.mp3",

				"trashcan_hit_1": "./trashcan_hit_1.mp3",
				"trashcan_hit_2": "./trashcan_hit_2.mp3",
				"trashcan_hit_3": "./trashcan_hit_3.mp3",
				"trashcan_hit_4": "./trashcan_hit_4.mp3",
				"trashcan_hit_5": "./trashcan_hit_5.mp3",

				"rocket_blast_1": "./rocket_blast_1.mp3",
				"rocket_blast_2": "./rocket_blast_2.mp3",
				"rocket_blast_3": "./rocket_blast_3.mp3",

				"rocket_launch_1": "./rocket_launch_1.mp3",
				"rocket_launch_2": "./rocket_launch_2.mp3",
				"rocket_launch_3": "./rocket_launch_3.mp3",

				"orb_launch": "./orb_launch.mp3",

				"ambience_1": "./ambience_1.mp3",
				"ambience_2": "./ambience_2.mp3",
				"ambience_3": "./ambience_3.mp3",	

				"ufo_boss_dead_1": "./ufo_boss_dead_1.mp3",
				"ufo_boss_dead_2": "./ufo_boss_dead_2.mp3",

				"ufo_boss_entry_1": "./ufo_boss_entry_1.mp3",
				"ufo_boss_entry_2": "./ufo_boss_entry_2.mp3",

				"ufo_boss_hovering_1": "./ufo_boss_hovering_1.mp3",
				"ufo_boss_hovering_2": "./ufo_boss_hovering_2.mp3",
				"ufo_boss_hovering_3": "./ufo_boss_hovering_3.mp3",

				"ufo_enemy_entry_1": "./ufo_enemy_entry_1.mp3",
				"ufo_enemy_entry_2": "./ufo_enemy_entry_2.mp3",
			},
		},
	]
}