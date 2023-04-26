import { Sound } from '@pixi/sound';


export class SoundObject {

	private sound: Sound;

	constructor(source: string, volume: number, loop: boolean) {
		this.sound = Sound.from(source);
		this.sound.volume = volume;
		this.sound.loop = loop;
	}

	play() {
		this.sound.play();
	}

	pause() {
		this.sound.pause();
	}

	resume() {
		this.sound.resume();
	}

	stop() {
		this.sound.stop();
	}

	setVolume(volume: number) {
		this.sound.volume = volume;
	}

	setSource(source: string) {
		this.sound = Sound.from(source);
	}

	setLoop(loop: boolean) {
		this.sound.loop = loop;
	}

	isPlaying(): boolean {
		return this.sound.isPlaying;
	}

	isPaused(): boolean {
		return this.sound.paused;
	}
}

