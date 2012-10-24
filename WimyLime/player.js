
var TOUCH_HEIGHT = 40.0;
var TOUCH_WIDTH = CANVAS_WIDTH / 3.0;
var NOTE_SHOWING_LENGTH = 5.0;
var NOTE_HEIGHT = 3.0;

var NOTE_AREA_HEIGHT = CANVAS_HEIGHT - TOUCH_HEIGHT;
var NOTE_TOUCH_CHECK_BAR_POSITION = 20.0;

var notes = {pad1 : [ 5.738, 6.115, 6.488, 6.856000000000001, 7.2250000000000005, 7.57, 7.905, 8.233, 20.397000000000002, 20.708000000000002, 21.024, 21.367, 21.726, 22.065, 22.439, 22.819, 23.516, 24.278, 25.037, 25.74, 26.456, 30.526, 31.221, 31.361, 31.506, 31.643, 31.78, 31.925, 35.219, 37.699, 38.499, 39.258, 39.956, 40.7, 41.405, 42.129, 42.915, 58.472, 59.226, 59.921, 60.589999999999996, 61.378, 63.947, 64.629, 66.86, 67.895, 68.644, 69.399],pad2 : [ 8.634, 8.971, 9.338000000000001, 9.752, 10.118, 10.488, 10.809000000000001, 11.233, 11.608, 12, 12.339, 12.705, 13.038, 13.392, 13.715, 14.115000000000002, 26.122, 26.8, 27.907, 35.988, 43.592999999999996, 45.058, 46.497, 47.205, 47.929, 48.664, 55.211999999999996, 56.635, 58.103, 58.861, 59.611, 60.274, 62.136, 65.36800000000001, 65.732, 65.914, 66.128, 66.322, 66.529, 67.57600000000001, 68.284, 68.979],pad3 : [ 18.79, 27.598, 28.294999999999998, 29.427, 36.67, 46.822, 47.564, 48.328, 49.047, 52.627, 53.397999999999996, 54.1, 54.809, 62.869, 65.561, 65.855, 66.036, 66.235, 66.434, 69.804, 70.845, 71.56099999999999, 72.292],pad4 : [ 14.474, 14.839000000000002, 15.165, 15.536000000000001, 15.881, 16.243000000000002, 16.581, 17.026, 17.393, 17.737000000000002, 18.086000000000002, 18.424, 29.081, 29.724999999999998, 30.854, 37.356, 49.422, 50.9, 52.278999999999996, 52.946, 53.738, 54.455, 63.557, 64.272, 64.967, 70.521, 71.175, 71.887],};
var end_second = 99999;

function loadData()
{
	request("/loadLime.py?lime_index=" + getUrlVars()["lime_index"],
			function(responseJSON)
			{
				notes = JSON.parse( responseJSON["notes"] );
				videoid = responseJSON["videoid"];
				end_second = responseJSON["end_second"];
				
				requestBackgroundImage(videoid);
				
				playYouTubeWhenReady(videoid);
			}
			,
			function(responseJSON)
			{
				alert("failed to load lime");
			}
			);
}

function findClosestNoteIndex(notes)
{
	var current = getFixedYoutubeCurrentTime();
	
	var minDistance = 99999;
	var minIndex = -1;
	for ( var i=0; i<notes.length; ++i )
	{
		var dist = Math.abs(current - notes[i]);
		
		if ( dist < minDistance )
		{
			minDistance = dist;
			minIndex = i;
		}
	}
	
	const minimumJudgeTimeSecond = 0.2;
	if ( minDistance > minimumJudgeTimeSecond )
	{
		return -1;
	}
	
	return minIndex;
}

var combo = 0;
const MINIMUM_COMBO = 5;

function onHitNote()
{
	++combo;
	
	if ( combo >= MINIMUM_COMBO )
	{
		var text = combo.toString() + " combo";
		
		mainContext.font = "italic bold 20px sans-serif";

		var width = mainContext.measureText(text).width;
		var x = ( CANVAS_WIDTH - width ) / 2;
		addTextAnimationObjects(x,100, text, 20);
	}
}

function onMissNote()
{
	combo = 0;
}

function judge(notes, x)
{
	var index = findClosestNoteIndex(notes);
	
	if ( index != -1 )
	{
		notes[index] = -1;
		notes.sort();
		notes.shift();
		
		var y = CANVAS_HEIGHT - NOTE_TOUCH_CHECK_BAR_POSITION;
		addImageAnimationObjects(x, y, image_note1pop); 
		addTextAnimationObjects(x, y + 2, "Cool", 20);
		
		onHitNote();
	}
}

function onGamePad1()
{
	judge(notes.pad1, 60);
}

function onGamePad2()
{
	judge(notes.pad2, 180);
}

function onGamePad3()
{
	judge(notes.pad3, 300);
}

function onGamePad4()
{
	judge(notes.pad4, 420);
}

var animationObjects = [];

function addImageAnimationObjects(x, y, img)
{
	var ani = {};
	
	ani.type = "text";
	ani.x = x;
	ani.y = y;
	ani.img = img;
	ani.remainFrames = img.height / img.width;
	ani.accFrames = 0;
	ani.draw = function(context)
	{
		if ( this.remainFrames <= 0 ) return false;

		var centerOfImage = img.width / 2;
		var tileUnitHeight = img.width;
		var drawTileIndex = this.accFrames;
		
		context.drawImage(img, 0, drawTileIndex * tileUnitHeight, img.width, tileUnitHeight, x - centerOfImage, y - centerOfImage, img.width, tileUnitHeight);

		this.remainFrames--;
		this.accFrames++;
		
		return true;
	}
	
	animationObjects.push(ani);
}

function addTextAnimationObjects(x,y,msg, frame)
{
	var ani = {};
	
	ani.type = "text";
	ani.x = x;
	ani.y = y;
	ani.msg = msg;
	ani.remainFrames = frame;
	ani.draw = function(context)
	{
		if ( this.remainFrames <= 0 ) return false;
		
		context.font = "italic bold 20px sans-serif";
		context.fillStyle = "rgba(255,255,255, " + 1.0 * ( this.remainFrames / frame) + ")";
		context.fillText(this.msg, this.x, this.y);
		
		context.strokeStyle = "rgba(0,0,0, " + 1.0 * ( this.remainFrames / frame) + ")";
		context.strokeText(this.msg, this.x, this.y);
		
		this.remainFrames--;
		
		return true;
	}
	
	animationObjects.push(ani);
}

function drawAnimationObjects(context)
{
	for ( var i=0; i<animationObjects.length; ++i )
	{
		if ( i == 0 && animationObjects[i] == null )
		{
			animationObjects.shift();
			i = -1;
			continue;
		}
		
		if ( animationObjects[i] != null )
		{
			var ret = animationObjects[i].draw(context);
			
			if ( ret == false )
			{
				animationObjects[i] = null;
			}
		}
	}
}

function drawNoteImage(context, img, centerX, centerY)
{
	var centerOfImage = img.width / 2;
	var tileUnitHeight = img.width;
	var numberOfTile = img.height / tileUnitHeight;
	
	var drawTileIndex = frameAcc % numberOfTile;
	
	context.drawImage(img, 0, drawTileIndex * tileUnitHeight, img.width, tileUnitHeight, centerX - centerOfImage, centerY - centerOfImage, img.width, tileUnitHeight);
}

function drawNote(context, currentVideoTime, notes, loadedImage, x)
{
	var SPEED = 1;
	
	for ( var i=0; i<notes.length; ++i )
   	{
		var y = (CANVAS_HEIGHT -  NOTE_TOUCH_CHECK_BAR_POSITION) - (( notes[i] - currentVideoTime ) * 200.0 * SPEED );
		
		if ( y <= 0 ) ///< 화면 밖에서 내려오고 있는 노트는 그리지 않는다.
		{
			continue;
		}
		
		if ( y >= (CANVAS_HEIGHT)) ///< 화면 아래로 내려간 노트는 miss 를 표시하면서 노트 배열에서 삭제.
		{
			addTextAnimationObjects(x, CANVAS_HEIGHT - NOTE_TOUCH_CHECK_BAR_POSITION + 2, "Miss", 20);
			
			notes.shift();
			i = -1;
			
			onMissNote();
		}
		else
		{
			drawNoteImage(context, loadedImage, x + CANVAS_WIDTH/4/2, y);
		}
	}
}

function moveToScorePage()
{
	alert("end");
}

var moving = false;
function drawAllNote(context)
{
	if ( g_youtubePlayer && g_youtubePlayer.getCurrentTime )
	{
		var currentVideoTime = getFixedYoutubeCurrentTime();
		
		drawNote(context, currentVideoTime, notes.pad1, image_note1, 0);
		drawNote(context, currentVideoTime, notes.pad2, image_note2, 120);
		drawNote(context, currentVideoTime, notes.pad3, image_note3, 240);
		drawNote(context, currentVideoTime, notes.pad4, image_note4, 360);
		
		if ( currentVideoTime >= end_second )
		{
			if ( moving == false )
			{
				moving = true;
				moveToScorePage();
			}
		}
	}
}

var frameAcc = 0;
function drawBackground(context)
{
	++frameAcc;
	
	var strength = Math.floor(Math.abs(Math.sin(frameAcc/30.0)) * 30.0);
	var rgb = "rgb(" + strength + "," + strength + "," + strength + ")";
	context.fillStyle = rgb;
	context.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

var pressed_Z = false;
var pressed_X = false;
var pressed_C = false;
var pressed_V = false;

function drawPadEffect(context)
{
	const EFFECT_WIDTH = CANVAS_WIDTH / 4;
	const EFFECT_HEIGHT = CANVAS_HEIGHT;
	const EFFECT_MARGIN = 2;

	var startX = 0;

	context.fillStyle="rgba(255,255,255, 0.1)";
	if ( pressed_Z )
	{
		context.fillRect(startX + EFFECT_MARGIN, 0, EFFECT_WIDTH - ( 2 * EFFECT_MARGIN ), EFFECT_HEIGHT);
	}
	
	startX += EFFECT_WIDTH;
	
	if ( pressed_X )
	{
		context.fillRect(startX + EFFECT_MARGIN, 0, EFFECT_WIDTH - ( 2 * EFFECT_MARGIN ), EFFECT_HEIGHT);
	}
	
	startX += EFFECT_WIDTH;
	if ( pressed_C )
	{
		context.fillRect(startX + EFFECT_MARGIN, 0, EFFECT_WIDTH - ( 2 * EFFECT_MARGIN ), EFFECT_HEIGHT);
	}
	
	startX += EFFECT_WIDTH;
	if ( pressed_V )
	{
		context.fillRect(startX + EFFECT_MARGIN, 0, EFFECT_WIDTH - ( 2 * EFFECT_MARGIN ), EFFECT_HEIGHT);
	}
}

function drawCheckBar(context)
{
	context.fillStyle = "rgb(255,255,255)";
	context.fillRect(0, CANVAS_HEIGHT - NOTE_TOUCH_CHECK_BAR_POSITION, CANVAS_WIDTH, 2);
}

var mainContext = null;
function draw()
{
	var canvas = document.getElementById("mycanvas");
	
	if ( canvas == null ) return;
	
	
	var context = canvas.getContext("2d");
	mainContext = context;

	drawBackground(context);
	
	drawAllNote(context);
	
	drawCheckBar(context);
	drawPadEffect(context);
	drawAnimationObjects(context);
}

function requestBackgroundImage(videoid)
{
	request("/getVideoTitle.py?videoid=" + videoid,
			function(responseJSON)
			{
				findImage(responseJSON["title"], function(result)
						{
							var body = document.getElementById("mainBody");
							body.style.backgroundImage = "url('" + result + "')";
							//body.style.opacity = 0.048;
						});
				
			}, null);
}

startMainLoop(draw);
