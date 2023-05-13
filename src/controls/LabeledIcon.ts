import { Container, Texture } from "pixi.js";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { MessageBubble } from "./MessageBubble";


export class LabeledIcon extends Container {

    private sprite: GameObjectSprite;
    private msg: MessageBubble;

    constructor(uri: string, width: number, height: number, label: string, fontSize: number = 20) {
        super();
        this.sprite = new GameObjectSprite(Texture.from(uri));
        this.sprite.width = width;
        this.sprite.height = height;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.addChild(this.sprite);

        this.msg = new MessageBubble(0, label, fontSize);
        this.msg.setPosition(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2);
        this.addChild(this.msg);
    }

    setIcon(uri: Texture) {
        this.sprite.setTexture(uri);
    }

    setPosition(x: number, y: number): LabeledIcon {
        this.x = x;
        this.y = y;
        return this;
    }

    setLabel(label: string, fontSize: number = 20) {
        this.msg.setMessage(label, fontSize);
    }
}
