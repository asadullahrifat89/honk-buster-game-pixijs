﻿import { SoundType } from './Constants';
import { SoundObjectPlayer } from './SoundObjectPlayer';


export class SoundManager {

	// constains sound type wise sound players
	private static soundObjectPlayers: SoundObjectPlayer[] = [];

	public static load(soundType: SoundType, volume: number, loop: boolean) {

		if (!this.soundObjectPlayers.some(x => x.soundType == soundType)) {
			this.soundObjectPlayers.push(new SoundObjectPlayer(soundType, volume, loop));
		}
	}

	public static play(soundType: SoundType) {
		var soundObjectPlayer = this.soundObjectPlayers.find(x => x.soundType == soundType);

		if (soundObjectPlayer) {
			soundObjectPlayer.play();
		}
		else {
			let soundObjectPlayer = new SoundObjectPlayer(soundType, 1, false);
			this.soundObjectPlayers.push(soundObjectPlayer); // if play is called without a prior call to load play with default settings
			soundObjectPlayer.play();
		}
	}

	public static pause(soundType: SoundType) {
		var soundObjectPlayer = this.soundObjectPlayers.find(x => x.soundType == soundType);

		if (soundObjectPlayer) {
			soundObjectPlayer.pause();
		}
	}

	public static resume(soundType: SoundType) {
		var soundObjectPlayer = this.soundObjectPlayers.find(x => x.soundType == soundType);

		if (soundObjectPlayer) {
			soundObjectPlayer.resume();
		}
	}

	public static stop(soundType: SoundType) {
		var soundObjectPlayer = this.soundObjectPlayers.find(x => x.soundType == soundType);

		if (soundObjectPlayer) {
			soundObjectPlayer.stop();
		}
	}

	public static setVolume(soundType: SoundType, volume: number) {
		var soundObjectPlayer = this.soundObjectPlayers.find(x => x.soundType == soundType);

		if (soundObjectPlayer) {
			soundObjectPlayer.setVolume(volume);
		}
	}
}
