import { TextureType } from "../Constants";

export class TextureTemplate {

	public constructType: TextureType = 0;
	public uri: string = "";
	public tag: any;

	constructor(constructType: TextureType, uri: string, tag: any = null) {
		this.constructType = constructType;
		this.uri = uri;
		this.tag = tag;
	}
}