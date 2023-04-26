import { Constants, SoundType } from './Constants';
import { SoundObject } from './SoundObject';


export class SoundObjectPlayer {

    private audioObjects: SoundObject[];

    constructor(soundType: SoundType, volume: number, loop: boolean) {

        // hold all sound objects for the sound type
        this.audioObjects = Constants.SOUND_TEMPLATES.filter(x => x.soundType == soundType).map(u => new SoundObject(u.uri, volume, loop));
    }

    play() {
        this.audioObjects.forEach(audioObject => {
            if (audioObject.isPlaying())
                audioObject.stop();
        });

        var index = Constants.getRandomNumber(0, this.audioObjects.length - 1);
        var audioObject = this.audioObjects[index];

        if (audioObject)
            audioObject.play();
    }

    pause() {
        var playings = this.audioObjects.filter(x => x.isPlaying());

        if (playings) {
            playings.forEach(playing => {
                playing.pause();
            });
        }
    }

    resume() {
        var playings = this.audioObjects.filter(x => x.isPaused());

        if (playings) {
            playings.forEach(playing => {
                playing.resume();
            });
        }
    }

    stop() {
        this.audioObjects.forEach(audioObject => {
            if (audioObject.isPlaying())
                audioObject.stop();
        });
    }

    setVolume(volume: number) {
        this.audioObjects.forEach(audioObject => {
            if (audioObject.isPlaying())
                audioObject.setVolume(volume);
        });
    }
}
