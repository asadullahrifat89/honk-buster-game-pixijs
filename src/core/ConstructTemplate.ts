import { ConstructType } from "../Constants";

export class ConstructTemplate {

	public constructType: ConstructType = 0;
	public uri: string = "";
	public tag: any;

	constructor(constructType: ConstructType, uri: string, tag: any = null) {
		this.constructType = constructType;
		this.uri = uri;
		this.tag = tag;
	}
}

