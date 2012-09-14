
var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 300;

var KEYCODE_Z = 90;
var KEYCODE_X = 88;
var KEYCODE_C = 67;

var FPS = 30;

function startMainLoop(frameFunction)
{
	setInterval(function() {
		  frameFunction();
		}, 1000/FPS);
}