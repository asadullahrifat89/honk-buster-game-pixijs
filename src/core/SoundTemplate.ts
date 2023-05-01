import { SoundType } from "../Constants";


export class SoundTemplate {

    public soundType: SoundType = 0;
    public uri: string = "";

    constructor(soundType: SoundType, uri: string) {
        this.soundType = soundType;
        this.uri = uri;
    }
}
