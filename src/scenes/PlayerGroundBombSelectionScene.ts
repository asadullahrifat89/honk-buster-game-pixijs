import { BlurFilter, Container, Text } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, PlayerGroundBombTemplate, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { PlayerGearSelectionScene } from "./PlayerGearSelectionScene";
import { SelectionButton } from "../controls/SelectionButton";


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

		const title = new Text("Select a Ground Bomb", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		//#region grenade

		const grenade_button = new SelectionButton("player_honk_bomb_explosive_1", 256 / 2, 256 / 2, "Lvl " + 1, () => {

			button.setText("Grenades").setIsEnabled(true);
			SoundManager.play(SoundType.GROUND_BOMB_BLAST, 0.8);
			grenade_button.select();
			trash_button.unselect();
			dynamite_button.unselect();
			Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE = PlayerGroundBombTemplate.GRENADE;
		});

		grenade_button.setPosition((this.uiContainer.width / 2 - grenade_button.width * 2), (this.uiContainer.height / 2 - grenade_button.height / 2) + 10);
		this.uiContainer.addChild(grenade_button);

		//#endregion

		//#region trash

		Constants.TRASH_BIN_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.TRASH_BIN_UNLOCK_LEVEL;

		const trash_button = new SelectionButton("player_honk_bomb_trash_1", 256 / 2, 256 / 2, "Lvl " + Constants.TRASH_BIN_UNLOCK_LEVEL, () => {

			button.setText("Trash Bins").setIsEnabled(true);
			SoundManager.play(SoundType.TRASH_BIN_BLAST);
			trash_button.select();
			grenade_button.unselect();
			dynamite_button.unselect();
			Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE = PlayerGroundBombTemplate.TRASH_BIN;

		}, Constants.TRASH_BIN_UNLOCKED);

		trash_button.setPosition((this.uiContainer.width / 2 - trash_button.width / 2), (this.uiContainer.height / 2 - trash_button.height / 2) + 10);
		this.uiContainer.addChild(trash_button);

		//#endregion

		//#region dynamite

		Constants.DYNAMITE_UNLOCKED = Constants.GAME_LEVEL_MAX >= Constants.DYNAMITE_UNLOCK_LEVEL;

		const dynamite_button = new SelectionButton("player_honk_bomb_sticky_2", 256 / 2, 256 / 2, "Lvl " + Constants.DYNAMITE_UNLOCK_LEVEL, () => {

			button.setText("Dynamites").setIsEnabled(true);
			SoundManager.play(SoundType.GROUND_BOMB_BLAST, 0.8);
			dynamite_button.select();
			grenade_button.unselect();
			trash_button.unselect();
			Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE = PlayerGroundBombTemplate.DYNAMITE;

		}, Constants.DYNAMITE_UNLOCKED);

		dynamite_button.setPosition((this.uiContainer.width / 2 + dynamite_button.width), (this.uiContainer.height / 2 - dynamite_button.height / 2) + 10);
		this.uiContainer.addChild(dynamite_button);

		//#endregion

		const button = new Button(() => {

			if (button.getIsEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				this.uiContainer.destroy();
				SceneManager.changeScene(new PlayerGearSelectionScene());
			}
			else {
				SoundManager.play(SoundType.DAMAGE_TAKEN);
			}

		}).setText("Select").setIsEnabled(false);
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
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

