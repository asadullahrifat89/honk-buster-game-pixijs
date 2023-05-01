import { SoundType } from "../Constants";
import { SoundObjectPlayer } from "../core/SoundObjectPlayer";


export class SoundManager {

	// constains sound type wise sound players
	private static soundObjectPlayers: SoundObjectPlayer[] = [];

	public static load(soundType: SoundType, volume: number, loop: boolean) {

		if (!this.soundObjectPlayers.some(x => x.soundType == soundType)) {
			this.soundObjectPlayers.push(new SoundObjectPlayer(soundType, volume, loop));
		}
	}

	public static play(soundType: SoundType, volume: number = 1, loop: boolean = false) {
		var soundObjectPlayer = this.soundObjectPlayers.find(x => x.soundType == soundType);

		if (soundObjectPlayer) {
			soundObjectPlayer.play();
		}
		else {
			let soundObjectPlayer = new SoundObjectPlayer(soundType, volume, loop);
			this.soundObjectPlayers.push(soundObjectPlayer);
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

	public static isPlaying(soundType: SoundType): boolean {
		return this.soundObjectPlayers.some(x => x.soundType == soundType && x.isPlaying());
	}
}
