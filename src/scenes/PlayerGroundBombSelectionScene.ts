﻿import { BlurFilter, Container, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants } from "../Constants";
import { TextureType, PlayerGroundBombTemplate, SoundType } from "../Enums";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { PlayerGearSelectionScene } from "./PlayerGearSelectionScene";
import { SelectionButton } from "../controls/SelectionButton";
import { LabeledIcon } from "../controls/LabeledIcon";


export class PlayerGroundBombSelectionScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	constructor() {
		super();

		this.uiContainer = new GameObjectContainer();
		this.uiContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.uiContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		this.addChild(this.uiContainer);

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.GAME_COVER_IMAGE));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		bg_sprite.filters = [new BlurFilter()];

		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);

		this.uiContainer.addChild(this.bg_container);

		const title = new Text("Select a Ground Bomb", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 220;
		this.uiContainer.addChild(title);

		//#region trash

		const trash_bin_button = new SelectionButton("player_honk_bomb_trash_1", 256 / 2, 256 / 2, "Lvl " + 1, () => {

			button.setText("Trash Bins").setIsEnabled(true);
			SoundManager.play(SoundType.TRASH_BIN_BLAST);
			
			trash_bin_button.select();
			grenade_button.unselect();
			dynamite_button.unselect();

			Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE = PlayerGroundBombTemplate.TRASH_BIN;

			scoreMod.setLabel("+1");
			hitPattern.setLabel("Hit");
		});

		trash_bin_button.setPosition((this.uiContainer.width / 2 - trash_bin_button.width * 2), (this.uiContainer.height / 2 - trash_bin_button.height / 2) + 10);
		this.uiContainer.addChild(trash_bin_button);

		//#endregion

		//#region grenade

		Constants.GRENADE_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.GRENADE_UNLOCK_LEVEL;

		const grenade_button = new SelectionButton("player_honk_bomb_grenade_2", 256 / 2, 256 / 2, "Lvl " + Constants.GRENADE_UNLOCK_LEVEL, () => {

			button.setText("Grenades").setIsEnabled(true);
			SoundManager.play(SoundType.GROUND_BOMB_BLAST, 0.8);

			grenade_button.select();
			trash_bin_button.unselect();
			dynamite_button.unselect();

			Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE = PlayerGroundBombTemplate.GRENADE;

			scoreMod.setLabel("+2");
			hitPattern.setLabel("Blast");

		}, Constants.GRENADE_UNLOCKED);

		grenade_button.setPosition((this.uiContainer.width / 2 - grenade_button.width / 2), (this.uiContainer.height / 2 - grenade_button.height / 2) + 10);
		this.uiContainer.addChild(grenade_button);

		//#endregion

		//#region dynamite

		Constants.DYNAMITE_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.DYNAMITE_UNLOCK_LEVEL;

		const dynamite_button = new SelectionButton("player_honk_bomb_dynamite_2", 256 / 2, 256 / 2, "Lvl " + Constants.DYNAMITE_UNLOCK_LEVEL, () => {

			button.setText("Dynamites").setIsEnabled(true);
			SoundManager.play(SoundType.GROUND_BOMB_BLAST, 0.8);

			dynamite_button.select();
			trash_bin_button.unselect();
			grenade_button.unselect();

			Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE = PlayerGroundBombTemplate.DYNAMITE;

			scoreMod.setLabel("+3");
			hitPattern.setLabel("Blast + Timer");

		}, Constants.DYNAMITE_UNLOCKED);

		dynamite_button.setPosition((this.uiContainer.width / 2 + dynamite_button.width), (this.uiContainer.height / 2 - dynamite_button.height / 2) + 10);
		this.uiContainer.addChild(dynamite_button);

		//#endregion

		//#region info

		const scoreMod = new LabeledIcon("attack_button", 50, 50, "?")
		scoreMod.setPosition(this.uiContainer.width / 2 - scoreMod.width * 2, this.uiContainer.height - scoreMod.height * 2.5);
		this.uiContainer.addChild(scoreMod);

		const hitPattern = new LabeledIcon("powerup_pickup_bulls_eye", 50, 50, "?")
		hitPattern.setPosition(this.uiContainer.width / 2 + hitPattern.width * 1, this.uiContainer.height - hitPattern.height * 2.5);
		this.uiContainer.addChild(hitPattern);

		//#endregion

		const button = new Button(() => {

			if (button.isEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				this.uiContainer.destroy();
				SceneManager.changeScene(new PlayerGearSelectionScene());
			}
			else {
				SoundManager.play(SoundType.DAMAGE_TAKEN);
			}

		}).setText("Select").setIsEnabled(false);
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 1);
		this.uiContainer.addChild(button);
	}

	public update() {

	}

	public resize(scale: number): void {

		if (SceneManager.width < SceneManager.height) {
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			this.uiContainer.scale.set(scale);
			this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		}
	}
}

