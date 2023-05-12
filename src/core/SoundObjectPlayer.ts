import { Constants, SoundType } from '../Constants';
import { SoundObject } from './SoundObject';


export class SoundObjectPlayer {

	private soundObjects: SoundObject[];
	public soundType: SoundType = SoundType.NONE;

	constructor(soundType: SoundType, volume: number, loop: boolean) {
		this.soundType = soundType;		
		this.soundObjects = Constants.SOUND_TEMPLATES.filter(x => x.soundType == soundType).map(u => new SoundObject(u.uri, volume, loop)); // hold all sound objects for the sound type
	}

	isPlaying(): boolean {
		return this.soundObjects.some(x => x.isPlaying());
	}

	play(): number {
		this.soundObjects.forEach(audioObject => {
			if (audioObject.isPlaying() && audioObject.isLooping()) // stop a looping sound
				audioObject.stop();
		});

		var index = Constants.getRandomNumber(0, this.soundObjects.length - 1);
		var audioObject = this.soundObjects[index];

		if (audioObject)
			audioObject.play();

		return index;
	}

	pause() {
		var playings = this.soundObjects.filter(x => x.isPlaying());

		if (playings) {
			playings.forEach(playing => {
				playing.pause();
			});
		}
	}

	resume() {
		var playings = this.soundObjects.filter(x => x.isPaused());

		if (playings) {
			playings.forEach(playing => {
				playing.resume();
			});
		}
	}

	stop() {
		this.soundObjects.forEach(audioObject => {
			if (audioObject.isPlaying())
				audioObject.stop();
		});
	}

	setVolume(volume: number) {
		this.soundObjects.forEach(audioObject => {
			if (audioObject.isPlaying())
				audioObject.setVolume(volume);
		});
	}

	setLoop(loop: boolean) {
		this.soundObjects.forEach(audioObject => {
			if (audioObject.isPlaying())
				audioObject.setLoop(loop);
		});
	}
}

