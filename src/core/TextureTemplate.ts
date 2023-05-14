import { TextureType } from "../Enums";

export class TextureTemplate {

	public textureType: TextureType = 0;
	public uri: string = "";
	public tag: any;

	constructor(constructType: TextureType, uri: string, tag: any = null) {
		this.textureType = constructType;
		this.uri = uri;
		this.tag = tag;
	}
}