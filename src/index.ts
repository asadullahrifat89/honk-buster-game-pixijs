import { Application, Sprite, Container } from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1900,
	height: 940
});

const conty: Container = new Container();
conty.x = 0;
conty.y = 0;
app.stage.addChild(conty);

const clampy: Sprite = Sprite.from("clampy.png");
clampy.x = 0;
clampy.y = 0;
clampy.width = 100;
clampy.height = 100;
conty.addChild(clampy);

app.ticker.add(() => {

	clampy.x += 1;
	// clampy.y += 0.5;
	// clampy.rotation += 0.01;

	if (clampy.x > app.screen.width) {
		clampy.x = 0;
	}


});