import { SoundType } from "../Enums";


export class SoundTemplate {

	public soundType: SoundType;
	public uri: string;
	public subTitle: string;

	constructor(soundType: SoundType, uri: string, subTitle: string = "") {
		this.soundType = soundType;
		this.uri = uri;
		this.subTitle = subTitle;
	}
}