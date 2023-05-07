import { BlurFilter, Container, Text, Texture } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { MessageBubble } from "../controls/MessageBubble";
import { GameTitleScene } from "./GameTitleScene";
import { HealthBar } from "../controls/HealthBar";


export class GameInstructionsScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	constructor() {
		super();

		let msg_line_2_gap = 40;

		this.uiContainer = new GameObjectContainer();
		this.uiContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.uiContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		this.addChild(this.uiContainer);

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		bg_sprite.filters = [new BlurFilter()];

		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);

		this.uiContainer.addChild(this.bg_container);

		const title = new Text("How to play", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});		
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		// player_ride
		const player_ride = new GameObjectContainer();

		const player_ride_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_ride_1"));
		player_ride_sprite.width = 256 / 2;
		player_ride_sprite.height = 256 / 2;
		player_ride_sprite.x = 0;
		player_ride_sprite.y = 0;

		const player_ride_sprite_2: GameObjectSprite = new GameObjectSprite(Texture.from("player_ride_2"));
		player_ride_sprite_2.width = 256 / 2;
		player_ride_sprite_2.height = 256 / 2;
		player_ride_sprite_2.x = 50;
		player_ride_sprite_2.y = 50;

		const player_ride_container = new GameObjectContainer();
		player_ride_container.addChild(player_ride_sprite);
		player_ride_container.addChild(player_ride_sprite_2);
		player_ride.addChild(player_ride_container);

		const player_ride_msg = new MessageBubble(0, "These are your air rides.", 20);
		player_ride_msg.setPosition(player_ride_container.x + player_ride_container.width + 10, player_ride_container.y + 25);
		player_ride.addChild(player_ride_msg);

		const player_ride_msg_2 = new MessageBubble(0, "Each one moves at different speeds.", 20);
		player_ride_msg_2.setPosition(player_ride_msg.x, player_ride_msg.y + msg_line_2_gap);
		player_ride.addChild(player_ride_msg_2);

		const player_ride_msg_3 = new MessageBubble(0, "They also shoot unique air bombs.", 20);
		player_ride_msg_3.setPosition(player_ride_msg_2.x, player_ride_msg_2.y + msg_line_2_gap);
		player_ride.addChild(player_ride_msg_3);

		player_ride.setPosition(this.uiContainer.width / 2 - player_ride.width / 2, (this.uiContainer.height / 2 - player_ride.height / 2) + 10);
		this.uiContainer.addChild(player_ride);

		// joy stick
		const joystick = new GameObjectContainer();
		joystick.renderable = false;

		const joystick_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick"));
		joystick_sprite.width = 256 / 1;
		joystick_sprite.height = 256 / 1;
		joystick_sprite.x = 0;
		joystick_sprite.y = 0;

		const joystick_handle_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		joystick_handle_sprite.width = 256 / 2;
		joystick_handle_sprite.height = 256 / 2;
		joystick_handle_sprite.x = joystick_sprite.width / 2 - joystick_handle_sprite.width / 2;
		joystick_handle_sprite.y = joystick_sprite.height / 2 - joystick_handle_sprite.height / 2;

		const joystick_controller_container = new GameObjectContainer();
		joystick_controller_container.addChild(joystick_sprite);
		joystick_controller_container.addChild(joystick_handle_sprite);
		joystick.addChild(joystick_controller_container);

		const joystick_msg = new MessageBubble(0, "Use this to move your ride.", 20);
		joystick_msg.setPosition(joystick_controller_container.x + joystick_controller_container.width, joystick_controller_container.y + 50);
		joystick.addChild(joystick_msg);

		const joystick_msg_2 = new MessageBubble(0, "Or press the ⌨️ arrow keys.", 20);
		joystick_msg_2.setPosition(joystick_msg.x, joystick_msg.y + msg_line_2_gap);
		joystick.addChild(joystick_msg_2);

		joystick.setPosition(this.uiContainer.width / 2 - joystick.width / 2, (this.uiContainer.height / 2 - joystick.height / 2) + 10);
		this.uiContainer.addChild(joystick);

		// attack_button
		const attack_button = new GameObjectContainer();
		attack_button.renderable = false;

		const attack_button_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("attack_button"));
		attack_button_sprite.width = 256 / 3;
		attack_button_sprite.height = 256 / 3;
		attack_button_sprite.x = 0;
		attack_button_sprite.y = 0;

		const attack_button_container = new GameObjectContainer();
		attack_button_container.addChild(attack_button_sprite);
		attack_button.addChild(attack_button_container);

		const attack_button_msg = new MessageBubble(0, "Press this to drop or shoot bombs.", 20);
		attack_button_msg.setPosition(attack_button_container.x + attack_button_container.width + 10, attack_button_container.y + 25);
		attack_button.addChild(attack_button_msg);

		const attack_button_msg_2 = new MessageBubble(0, "Or Press the ⌨️ space bar.", 20);
		attack_button_msg_2.setPosition(attack_button_msg.x, attack_button_msg.y + msg_line_2_gap);
		attack_button.addChild(attack_button_msg_2);

		attack_button.setPosition(this.uiContainer.width / 2 - attack_button.width / 2, (this.uiContainer.height / 2 - attack_button.height / 2) + 10);
		this.uiContainer.addChild(attack_button);

		// honk_bomb
		const honk_bomb = new GameObjectContainer();
		honk_bomb.renderable = false;

		const drop_bomb_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_explosive_1"));
		drop_bomb_sprite.width = 256 / 2;
		drop_bomb_sprite.height = 256 / 2;
		drop_bomb_sprite.x = 0;
		drop_bomb_sprite.y = 0;

		const drop_bomb_sprite_2: GameObjectSprite = new GameObjectSprite(Texture.from("player_honk_bomb_trash_1"));
		drop_bomb_sprite_2.width = 256 / 2;
		drop_bomb_sprite_2.height = 256 / 2;
		drop_bomb_sprite_2.x = 50;
		drop_bomb_sprite_2.y = 50;

		const honk_bomb_container = new GameObjectContainer();
		honk_bomb_container.addChild(drop_bomb_sprite);
		honk_bomb_container.addChild(drop_bomb_sprite_2);
		honk_bomb.addChild(honk_bomb_container);

		const honk_bomb_msg = new MessageBubble(0, "These are your ground bombs.", 20);
		honk_bomb_msg.setPosition(honk_bomb_container.x + honk_bomb_container.width + 10, honk_bomb_container.y + 25);
		honk_bomb.addChild(honk_bomb_msg);

		honk_bomb.setPosition(this.uiContainer.width / 2 - honk_bomb.width / 2, (this.uiContainer.height / 2 - honk_bomb.height / 2) + 10);
		this.uiContainer.addChild(honk_bomb);

		// car
		const car = new GameObjectContainer();
		car.renderable = false;

		const car_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("vehicle_small_1"));
		car_sprite.width = 256 / 2;
		car_sprite.height = 256 / 2;
		car_sprite.x = 0;
		car_sprite.y = 0;

		const car_container = new GameObjectContainer();
		car_container.addChild(car_sprite);
		car.addChild(car_container);

		const car_msg = new MessageBubble(0, "Drop ground bombs on honking cars.", 20);
		car_msg.setPosition(car_container.x + car_container.width + 10, car_container.y + 25);
		car.addChild(car_msg);

		car.setPosition(this.uiContainer.width / 2 - car.width / 2, (this.uiContainer.height / 2 - car.height / 2) + 10);
		this.uiContainer.addChild(car);

		// player_rocket
		const player_rocket = new GameObjectContainer();
		player_rocket.renderable = false;

		const air_bomb_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("player_rocket_1"));
		air_bomb_sprite.width = 256 / 2;
		air_bomb_sprite.height = 256 / 2;
		air_bomb_sprite.x = 100;
		air_bomb_sprite.y = 0;
		air_bomb_sprite.angle = 213;
		air_bomb_sprite.anchor.set(1);

		const air_bomb_sprite_2: GameObjectSprite = new GameObjectSprite(Texture.from("player_ball_1"));
		air_bomb_sprite_2.width = 256 / 3;
		air_bomb_sprite_2.height = 256 / 3;
		air_bomb_sprite_2.x = 0;
		air_bomb_sprite_2.y = 100;

		const player_rocket_container = new GameObjectContainer();
		player_rocket_container.addChild(air_bomb_sprite);
		player_rocket_container.addChild(air_bomb_sprite_2);
		player_rocket.addChild(player_rocket_container);

		const player_rocket_msg = new MessageBubble(0, "These are your air bombs.", 20);
		player_rocket_msg.setPosition(player_rocket_container.x + player_rocket_container.width + 10, player_rocket_container.y + 25);
		player_rocket.addChild(player_rocket_msg);

		player_rocket.setPosition(this.uiContainer.width / 2 - player_rocket.width / 2, (this.uiContainer.height / 2 - player_rocket.height / 2) + 10);
		this.uiContainer.addChild(player_rocket);

		// ufo
		const ufo = new GameObjectContainer();
		ufo.renderable = false;

		const ufo_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("ufo_enemy_1"));
		ufo_sprite.width = 256 / 2;
		ufo_sprite.height = 256 / 2;
		ufo_sprite.x = 0;
		ufo_sprite.y = 0;

		const ufo_container = new GameObjectContainer();
		ufo_container.addChild(ufo_sprite);
		ufo.addChild(ufo_container);

		const ufo_msg = new MessageBubble(0, "Shoot air bombs at aliens.", 20);
		ufo_msg.setPosition(ufo_container.x + ufo_container.width + 10, ufo_container.y + 25);
		ufo.addChild(ufo_msg);

		ufo.setPosition(this.uiContainer.width / 2 - ufo.width / 2, (this.uiContainer.height / 2 - ufo.height / 2) + 10);
		this.uiContainer.addChild(ufo);

		// health
		const health = new GameObjectContainer();
		health.renderable = false;

		const health_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("health_pickup"));
		health_sprite.width = 256 / 2;
		health_sprite.height = 256 / 2;
		health_sprite.x = 0;
		health_sprite.y = 0;

		const health_container = new GameObjectContainer();
		health_container.addChild(health_sprite);
		health.addChild(health_container);

		const health_msg = new MessageBubble(0, "These are health drops.", 20);
		health_msg.setPosition(health_container.x + health_container.width + 10, health_container.y + 25);
		health.addChild(health_msg);

		const health_msg_2 = new MessageBubble(0, "Collect 'em to replenish your health.", 20);
		health_msg_2.setPosition(health_msg.x, health_msg.y + msg_line_2_gap);
		health.addChild(health_msg_2);

		health.setPosition(this.uiContainer.width / 2 - health.width / 2, (this.uiContainer.height / 2 - health.height / 2) + 10);
		this.uiContainer.addChild(health);

		// player_health_bar
		const player_health_bar = new GameObjectContainer();
		player_health_bar.renderable = false;

		const player_health_bar_sprite = new HealthBar(Texture.from("health_pickup"), player_health_bar);
		player_health_bar_sprite.setMaximumValue(100);
		player_health_bar_sprite.setValue(50);
		player_health_bar_sprite.x = 0;
		player_health_bar_sprite.y = 0;

		const player_health_bar_container = new GameObjectContainer();
		player_health_bar_container.addChild(player_health_bar_sprite);
		player_health_bar.addChild(player_health_bar_container);

		const player_health_bar_msg = new MessageBubble(0, "This is your health bar.", 20);
		player_health_bar_msg.setPosition(player_health_bar_container.x + player_health_bar_container.width + 10, player_health_bar_container.y + 25);
		player_health_bar.addChild(player_health_bar_msg);

		const player_health_bar_msg_2 = new MessageBubble(0, "If this drops to zero, it's game over.", 20);
		player_health_bar_msg_2.setPosition(player_health_bar_msg.x, player_health_bar_msg.y + msg_line_2_gap);
		player_health_bar.addChild(player_health_bar_msg_2);

		player_health_bar.setPosition(this.uiContainer.width / 2 - player_health_bar.width / 2, (this.uiContainer.height / 2 - player_health_bar.height / 2) + 10);
		this.uiContainer.addChild(player_health_bar);

		// sound_pollution_bar
		const sound_pollution_bar = new GameObjectContainer();
		sound_pollution_bar.renderable = false;

		const sound_pollution_bar_sprite = new HealthBar(Texture.from("honk_1"), sound_pollution_bar, 0x7200ff);
		sound_pollution_bar_sprite.setMaximumValue(100);
		sound_pollution_bar_sprite.setValue(50);
		sound_pollution_bar_sprite.x = 0;
		sound_pollution_bar_sprite.y = 0;

		const sound_pollution_bar_container = new GameObjectContainer();
		sound_pollution_bar_container.addChild(sound_pollution_bar_sprite);
		sound_pollution_bar.addChild(sound_pollution_bar_container);

		const sound_pollution_bar_msg = new MessageBubble(0, "This is the sound pollution bar.", 20);
		sound_pollution_bar_msg.setPosition(sound_pollution_bar_container.x + sound_pollution_bar_container.width + 10, sound_pollution_bar_container.y + 25);
		sound_pollution_bar.addChild(sound_pollution_bar_msg);

		const sound_pollution_bar_msg_2 = new MessageBubble(0, "If this gets full, you take damage over time.", 20);
		sound_pollution_bar_msg_2.setPosition(sound_pollution_bar_msg.x, sound_pollution_bar_msg.y + msg_line_2_gap);
		sound_pollution_bar.addChild(sound_pollution_bar_msg_2);

		sound_pollution_bar.setPosition(this.uiContainer.width / 2 - sound_pollution_bar.width / 2, (this.uiContainer.height / 2 - sound_pollution_bar.height / 2) + 10);
		this.uiContainer.addChild(sound_pollution_bar);

		// power_up
		const power_up = new GameObjectContainer();
		power_up.renderable = false;

		const power_up_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("powerup_pickup_armor"));
		power_up_sprite.width = 256 / 2;
		power_up_sprite.height = 256 / 2;
		power_up_sprite.x = 0;
		power_up_sprite.y = 0;

		const power_up_container = new GameObjectContainer();
		power_up_container.addChild(power_up_sprite);
		power_up.addChild(power_up_container);

		const power_up_msg = new MessageBubble(0, "These are power up drops.", 20);
		power_up_msg.setPosition(power_up_container.x + power_up_container.width + 10, power_up_container.y + 25);
		power_up.addChild(power_up_msg);

		const power_up_msg_2 = new MessageBubble(0, "Collect 'em to get awesome powers.", 20);
		power_up_msg_2.setPosition(power_up_msg.x, power_up_msg.y + msg_line_2_gap);
		power_up.addChild(power_up_msg_2);

		power_up.setPosition(this.uiContainer.width / 2 - power_up.width / 2, (this.uiContainer.height / 2 - power_up.height / 2) + 10);
		this.uiContainer.addChild(power_up);

		// player_power_up_bar
		const player_power_up_bar = new GameObjectContainer();
		player_power_up_bar.renderable = false;

		const player_power_up_bar_sprite = new HealthBar(Texture.from("powerup_pickup_armor"), player_power_up_bar, 0xffaa00);
		player_power_up_bar_sprite.setMaximumValue(100);
		player_power_up_bar_sprite.setValue(50);
		player_power_up_bar_sprite.x = 0;
		player_power_up_bar_sprite.y = 0;

		const player_power_up_bar_container = new GameObjectContainer();
		player_power_up_bar_container.addChild(player_power_up_bar_sprite);
		player_power_up_bar.addChild(player_power_up_bar_container);

		const player_power_up_bar_msg = new MessageBubble(0, "This is your power up bar.", 20);
		player_power_up_bar_msg.setPosition(player_power_up_bar_container.x + player_power_up_bar_container.width + 10, player_power_up_bar_container.y + 25);
		player_power_up_bar.addChild(player_power_up_bar_msg);

		const player_power_up_bar_msg_2 = new MessageBubble(0, "Using your power depletes it.", 20);
		player_power_up_bar_msg_2.setPosition(player_power_up_bar_msg.x, player_power_up_bar_msg.y + msg_line_2_gap);
		player_power_up_bar.addChild(player_power_up_bar_msg_2);

		player_power_up_bar.setPosition(this.uiContainer.width / 2 - player_power_up_bar.width / 2, (this.uiContainer.height / 2 - player_power_up_bar.height / 2) + 10);
		this.uiContainer.addChild(player_power_up_bar);

		// ground_boss
		const ground_boss = new GameObjectContainer();
		ground_boss.renderable = false;

		const ground_boss_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("vehicle_boss_1"));
		ground_boss_sprite.width = 256 / 2;
		ground_boss_sprite.height = 256 / 2;
		ground_boss_sprite.x = 0;
		ground_boss_sprite.y = 0;

		const ground_boss_container = new GameObjectContainer();
		ground_boss_container.addChild(ground_boss_sprite);
		ground_boss.addChild(ground_boss_container);

		const ground_boss_msg = new MessageBubble(0, "These are ground bosses.", 20);
		ground_boss_msg.setPosition(ground_boss_container.x + ground_boss_container.width + 10, ground_boss_container.y + 25);
		ground_boss.addChild(ground_boss_msg);

		const ground_boss_msg_2 = new MessageBubble(0, "Drop ground bombs on 'em.", 20);
		ground_boss_msg_2.setPosition(ground_boss_msg.x, ground_boss_msg.y + msg_line_2_gap);
		ground_boss.addChild(ground_boss_msg_2);

		ground_boss.setPosition(this.uiContainer.width / 2 - ground_boss.width / 2, (this.uiContainer.height / 2 - ground_boss.height / 2) + 10);
		this.uiContainer.addChild(ground_boss);

		// air_boss
		const air_boss = new GameObjectContainer();
		air_boss.renderable = false;

		const air_boss_sprite: GameObjectSprite = new GameObjectSprite(Texture.from("ufo_boss_1_idle"));
		air_boss_sprite.width = 256 / 2;
		air_boss_sprite.height = 256 / 2;
		air_boss_sprite.x = 0;
		air_boss_sprite.y = 0;

		const air_boss_container = new GameObjectContainer();
		air_boss_container.addChild(air_boss_sprite);
		air_boss.addChild(air_boss_container);

		const air_boss_msg = new MessageBubble(0, "These are air bosses.", 20);
		air_boss_msg.setPosition(air_boss_container.x + air_boss_container.width + 10, air_boss_container.y + 25);
		air_boss.addChild(air_boss_msg);

		const air_boss_msg_2 = new MessageBubble(0, "Shoot air bombs on 'em.", 20);
		air_boss_msg_2.setPosition(air_boss_msg.x, air_boss_msg.y + msg_line_2_gap);
		air_boss.addChild(air_boss_msg_2);

		air_boss.setPosition(this.uiContainer.width / 2 - air_boss.width / 2, (this.uiContainer.height / 2 - air_boss.height / 2) + 10);
		this.uiContainer.addChild(air_boss);

		// boss_health_bar
		const boss_health_bar = new GameObjectContainer();
		boss_health_bar.renderable = false;

		const boss_health_bar_sprite = new HealthBar(Texture.from("vehicle_boss_1"), boss_health_bar, 0x7200ff);
		boss_health_bar_sprite.setMaximumValue(100);
		boss_health_bar_sprite.setValue(70);
		boss_health_bar_sprite.x = 0;
		boss_health_bar_sprite.y = 0;

		const boss_health_bar_sprite_2 = new HealthBar(Texture.from("ufo_boss_1_idle"), boss_health_bar, 0x7200ff);
		boss_health_bar_sprite_2.setMaximumValue(100);
		boss_health_bar_sprite_2.setValue(50);
		boss_health_bar_sprite_2.x = 0;
		boss_health_bar_sprite_2.y = 50;

		const boss_health_bar_container = new GameObjectContainer();
		boss_health_bar_container.addChild(boss_health_bar_sprite);
		boss_health_bar_container.addChild(boss_health_bar_sprite_2);
		boss_health_bar.addChild(boss_health_bar_container);

		const boss_health_bar_msg = new MessageBubble(0, "These are boss health bars.", 20);
		boss_health_bar_msg.setPosition(boss_health_bar_container.x + boss_health_bar_container.width + 10, boss_health_bar_container.y + 25);
		boss_health_bar.addChild(boss_health_bar_msg);

		const boss_health_bar_msg_2 = new MessageBubble(0, "Defeat a boss to complete a level.", 20);
		boss_health_bar_msg_2.setPosition(boss_health_bar_msg.x, boss_health_bar_msg.y + msg_line_2_gap);
		boss_health_bar.addChild(boss_health_bar_msg_2);

		boss_health_bar.setPosition(this.uiContainer.width / 2 - boss_health_bar.width / 2, (this.uiContainer.height / 2 - boss_health_bar.height / 2) + 10);
		this.uiContainer.addChild(boss_health_bar);

		// score
		const score = new GameObjectContainer();
		score.renderable = false;

		const score_sprite = new MessageBubble(0, "Score 25");
		score_sprite.x = 0;
		score_sprite.y = 0;

		const score_container = new GameObjectContainer();
		score_container.addChild(score_sprite);
		score.addChild(score_container);

		const score_msg = new MessageBubble(0, "This is your score bar.", 20);
		score_msg.setPosition(score_container.x + score_container.width + 10, score_container.y + 25);
		score.addChild(score_msg);

		score.setPosition(this.uiContainer.width / 2 - score.width / 2, (this.uiContainer.height / 2 - score.height / 2) + 10);
		this.uiContainer.addChild(score);

		// level
		const level = new GameObjectContainer();
		level.renderable = false;

		const level_sprite = new MessageBubble(0, "Lvl 1");
		level_sprite.x = 0;
		level_sprite.y = 0;

		const level_container = new GameObjectContainer();
		level_container.addChild(level_sprite);
		level.addChild(level_container);

		const level_msg = new MessageBubble(0, "This is your level bar.", 20);
		level_msg.setPosition(level_container.x + level_container.width + 10, level_container.y + 25);
		level.addChild(level_msg);

		level.setPosition(this.uiContainer.width / 2 - level.width / 2, (this.uiContainer.height / 2 - level.height / 2) + 10);
		this.uiContainer.addChild(level);

		// good_luck
		const good_luck = new GameObjectContainer();
		good_luck.renderable = false;

		const good_luck_sprite = new MessageBubble(0, "Good Luck!");
		good_luck_sprite.x = 0;
		good_luck_sprite.y = 0;

		const good_luck_container = new GameObjectContainer();
		good_luck_container.addChild(good_luck_sprite);
		good_luck.addChild(good_luck_container);

		good_luck.setPosition(this.uiContainer.width / 2 - good_luck.width / 2, (this.uiContainer.height / 2 - good_luck.height / 2) + 10);
		this.uiContainer.addChild(good_luck);

		const button = new Button(() => {

			SoundManager.play(SoundType.OPTION_SELECT);
			if (player_ride.renderable) {
				player_ride.renderable = false;
				joystick.renderable = true;
				title.text = "Controls";
			}
			else if (joystick.renderable) {
				joystick.renderable = false;
				attack_button.renderable = true;
				title.text = "Controls";
			}
			else if (attack_button.renderable) {
				attack_button.renderable = false;
				honk_bomb.renderable = true;
				title.text = "Armaments";
			}
			else if (honk_bomb.renderable) {
				honk_bomb.renderable = false;
				player_rocket.renderable = true;
			}
			else if (player_rocket.renderable) {
				player_rocket.renderable = false;
				car.renderable = true;
				title.text = "Enemies";
			}
			else if (car.renderable) {
				car.renderable = false;
				ufo.renderable = true;
			}
			else if (ufo.renderable) {
				ufo.renderable = false;
				health.renderable = true;
				title.text = "Health";
			}
			else if (health.renderable) {
				health.renderable = false;
				player_health_bar.renderable = true;
			}
			else if (player_health_bar.renderable) {
				player_health_bar.renderable = false;
				sound_pollution_bar.renderable = true;				
			}
			else if (sound_pollution_bar.renderable) {
				sound_pollution_bar.renderable = false;
				power_up.renderable = true;
				title.text = "Power";
			}
			else if (power_up.renderable) {
				power_up.renderable = false;
				player_power_up_bar.renderable = true;
			}
			else if (player_power_up_bar.renderable) {
				player_power_up_bar.renderable = false;
				ground_boss.renderable = true;
				title.text = "Boss";
			}
			else if (ground_boss.renderable) {
				ground_boss.renderable = false;
				air_boss.renderable = true;
			}
			else if (air_boss.renderable) {
				air_boss.renderable = false;
				boss_health_bar.renderable = true;
			}
			else if (boss_health_bar.renderable) {
				boss_health_bar.renderable = false;
				score.renderable = true;
				title.text = "Head Up Display";
			}
			else if (score.renderable) {
				score.renderable = false;
				level.renderable = true;
			}
			else if (level.renderable) {
				title.text = "You're Done";
				level.renderable = false;
				good_luck.renderable = true;
				button.setText("Okay");
			}
			else {
				this.removeChild(this.uiContainer);
				SceneManager.changeScene(new GameTitleScene());
			}

		}).setText("Next");
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);		
	}

	public update(_framesPassed: number) {
	}

	public resize(scale: number): void {

		if (SceneManager.width < SceneManager.height) {
			this.removeChild(this.uiContainer);
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			this.uiContainer.scale.set(scale);
			this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		}
	}
}
