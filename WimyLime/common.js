
var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 400;

var KEYCODE_Z = 90;
var KEYCODE_X = 88;
var KEYCODE_C = 67;
var KEYCODE_V = 86;

var FPS = 30;

function startLoop()
{
	setInterval(mainFrameFunction, 1000/FPS);
}

var mainFrameFunction;
function startMainLoop(frameFunction)
{
	mainFrameFunction = frameFunction;
	loadImages();
}

var image_note1 = null;
var image_note2 = null;
var image_note3 = null;
var image_note4 = null;

var image_note1pop = null;
var image_note2pop = null;
var image_note3pop = null;
var image_note4pop = null;

var loadedCount = 0;

function onLoadedImage()
{
	console.log("onLoadedImage");
	loadedCount++;
	
	if ( loadedCount == 8 )
	{
		startLoop();
		console.log("startLoop");
	}
}

function loadImages()
{
	image_note1 = new Image();
	image_note1.src = "/images/note1.png";
	image_note1.onload = onLoadedImage;

	image_note2 = new Image();
	image_note2.src = "/images/note2.png";
	image_note2.onload = onLoadedImage;

	image_note3 = new Image();
	image_note3.src = "/images/note3.png";
	image_note3.onload = onLoadedImage;

	image_note4 = new Image();
	image_note4.src = "/images/note4.png";
	image_note4.onload = onLoadedImage;

	image_note1pop = new Image();
	image_note1pop.src = "/images/note1pop.png";
	image_note1pop.onload = onLoadedImage;

	image_note2pop = new Image();
	image_note2pop.src = "/images/note2pop.png";
	image_note2pop.onload = onLoadedImage;

	image_note3pop = new Image();
	image_note3pop.src = "/images/note3pop.png";
	image_note3pop.onload = onLoadedImage;

	image_note4pop = new Image();
	image_note4pop.src = "/images/note4pop.png";
	image_note4pop.onload = onLoadedImage;

}

function onKey_Z()
{
	if ( onGamePad1 )
	{
		onGamePad1();
	}
	pressed_Z=true;
	debugMsg("Z");

	draw();
}

function onKey_X()
{
	if ( onGamePad2 )
	{
		onGamePad2();
	}
	pressed_X=true;
	debugMsg("X");

	draw();
}

function onKey_C()
{
	if ( onGamePad3 )
	{
		onGamePad3();
	}
	pressed_C=true;
	debugMsg("C");

	draw();
}

function onKey_V()
{
	if ( onGamePad4 )
	{
		onGamePad4();
	}
	pressed_V=true;

	draw();
	debugMsg("V");
}

function onKeyUp_Z()
{
	pressed_Z=false;
	debugMsg("Z");

	draw();
}

function onKeyUp_X()
{
	pressed_X=false;
	debugMsg("X");

	draw();
}

function onKeyUp_C()
{
	pressed_C=false;
	debugMsg("C");

	draw();
}

function onKeyUp_V()
{
	pressed_V=false;
	debugMsg("V");

	draw();
}

function debugMsg(msg)
{
	console.log(msg);
	
	var output = document.getElementById("output");
	
	output.innerHTML = msg + "<br/>" + output.innerHTML;
}

function onGameKeyDown(event)
{
	if ( event.keyCode == KEYCODE_Z ) onKey_Z();
	if ( event.keyCode == KEYCODE_X ) onKey_X();
	if ( event.keyCode == KEYCODE_C ) onKey_C();
	if ( event.keyCode == KEYCODE_V ) onKey_V();
}

function onGameKeyUp(event)
{
	if ( event.keyCode == KEYCODE_Z ) onKeyUp_Z();
	if ( event.keyCode == KEYCODE_X ) onKeyUp_X();
	if ( event.keyCode == KEYCODE_C ) onKeyUp_C();
	if ( event.keyCode == KEYCODE_V ) onKeyUp_V();
}

function onTouchPad1(e)
{
	e.preventDefault();
	onKey_Z();
}

function onTouchPad2(e)
{
	e.preventDefault();
	onKey_X();
}

function onTouchPad3(e)
{
	e.preventDefault();
	onKey_C();
}

function onTouchPad4(e)
{
	e.preventDefault();
	onKey_V();
}
function onTouchPadEnd1(e)
{
	e.preventDefault();
	onKeyUp_Z();
}

function onTouchPadEnd2(e)
{
	e.preventDefault();
	onKeyUp_X();
}

function onTouchPadEnd3(e)
{
	e.preventDefault();
	onKeyUp_C();
}

function onTouchPadEnd4(e)
{
	e.preventDefault();
	onKeyUp_V();
}

document.onkeydown=onGameKeyDown;
document.onkeyup=onGameKeyUp;
