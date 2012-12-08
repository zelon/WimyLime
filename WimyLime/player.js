
var TOUCH_HEIGHT = 40.0;
var TOUCH_WIDTH = CANVAS_WIDTH / 3.0;
var NOTE_SHOWING_LENGTH = 5.0;
var NOTE_HEIGHT = 3.0;

var NOTE_AREA_HEIGHT = CANVAS_HEIGHT - TOUCH_HEIGHT;


var notes = {pad1 : [ 5.738, 6.115, 6.488, 6.856000000000001, 7.2250000000000005, 7.57, 7.905, 8.233, 20.397000000000002, 20.708000000000002, 21.024, 21.367, 21.726, 22.065, 22.439, 22.819, 23.516, 24.278, 25.037, 25.74, 26.456, 30.526, 31.221, 31.361, 31.506, 31.643, 31.78, 31.925, 35.219, 37.699, 38.499, 39.258, 39.956, 40.7, 41.405, 42.129, 42.915, 58.472, 59.226, 59.921, 60.589999999999996, 61.378, 63.947, 64.629, 66.86, 67.895, 68.644, 69.399],pad2 : [ 8.634, 8.971, 9.338000000000001, 9.752, 10.118, 10.488, 10.809000000000001, 11.233, 11.608, 12, 12.339, 12.705, 13.038, 13.392, 13.715, 14.115000000000002, 26.122, 26.8, 27.907, 35.988, 43.592999999999996, 45.058, 46.497, 47.205, 47.929, 48.664, 55.211999999999996, 56.635, 58.103, 58.861, 59.611, 60.274, 62.136, 65.36800000000001, 65.732, 65.914, 66.128, 66.322, 66.529, 67.57600000000001, 68.284, 68.979],pad3 : [ 18.79, 27.598, 28.294999999999998, 29.427, 36.67, 46.822, 47.564, 48.328, 49.047, 52.627, 53.397999999999996, 54.1, 54.809, 62.869, 65.561, 65.855, 66.036, 66.235, 66.434, 69.804, 70.845, 71.56099999999999, 72.292],pad4 : [ 14.474, 14.839000000000002, 15.165, 15.536000000000001, 15.881, 16.243000000000002, 16.581, 17.026, 17.393, 17.737000000000002, 18.086000000000002, 18.424, 29.081, 29.724999999999998, 30.854, 37.356, 49.422, 50.9, 52.278999999999996, 52.946, 53.738, 54.455, 63.557, 64.272, 64.967, 70.521, 71.175, 71.887],};
var end_second = 99999;
var lime_index = -1;

var scoreData = {};
var videoid = "";

var playerJS_youTubePlayerRef = null;
var playerJS_youTubePlayerVolumeBackup = null;

var SPEED = 1;
var ToBeSPEED = 1;

var SPEED_CANDIDATE = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
var SPEED_CURRENT_INDEX = 1;

function onGameSpeedUp()
{
	++SPEED_CURRENT_INDEX;
	
	if ( SPEED_CURRENT_INDEX == SPEED_CANDIDATE.length )
	{
		SPEED_CURRENT_INDEX = SPEED_CANDIDATE.length - 1;
	}
	ToBeSPEED = SPEED_CANDIDATE[SPEED_CURRENT_INDEX];
}

function onGameSpeedDown()
{
	--SPEED_CURRENT_INDEX;
	
	if ( SPEED_CURRENT_INDEX < 0 )
	{
		SPEED_CURRENT_INDEX = 0;
	}
	ToBeSPEED = SPEED_CANDIDATE[SPEED_CURRENT_INDEX];
}

function countNotes(notes)
{
	return notes.pad1.length + notes.pad2.length + notes.pad3.length + notes.pad4.length;
}

function onYouTubePlayerReady(youtubePlayer)
{
	playerJS_youTubePlayerRef = youtubePlayer;
	playerJS_youTubePlayerVolumeBackup = youtubePlayer.getVolume();
	
	youtubePlayer.setVolume(100);
}

function loadData()
{
	scoreData["miss"] = 0;
	scoreData["maxCombo"] = 0;
	scoreData["totalNotes"] = 0;
	scoreData["hit"] = 0;
	scoreData["score"] = 0;
	scoreData["clear"] = "not cleared";
	
	hp = MAX_HP;
	
	lime_index = getUrlVars()["lime_index"];

	request("/loadLime.py?lime_index=" + lime_index,
			function(responseJSON)
			{
				notes = JSON.parse( responseJSON["notes"] );
				
				scoreData["totalNotes"] = countNotes(notes);
				
				videoid = responseJSON["videoid"];
				
				if  ( responseJSON["end_second"] != null )
				{
					end_second = responseJSON["end_second"];
				}
				else
				{
					alert("End second is wrong");
				}
				
				requestBackgroundImage(videoid);
				
				playYouTubeWhenReady(videoid, onYouTubePlayerReady);
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

function calcAddingScore(combo)
{
	var score = 10;
	
	score += ( combo * 0.5 );
	
	return Number(score.toFixed(0));
}

function onHitNote()
{
	++hp;
	
	if ( hp > MAX_HP )
	{
		hp = MAX_HP;
	}
	
	++combo;
	
	++scoreData["hit"];
	
	scoreData["score"] += calcAddingScore(combo);
	
	if ( combo >= MINIMUM_COMBO )
	{
		var max = false;
		
		if ( scoreData["maxCombo"] < combo )
		{
			scoreData["maxCombo"] = combo;
			max = true;
		}
		
		var text = combo.toString();
		
		if ( max ) text += " MAX ";
		text += " COMBO";
		
		mainContext.font = GAME_JUDGE_FONT;

		var width = mainContext.measureText(text).width;
		var x = ( CANVAS_WIDTH - width ) / 2;
		addTextAnimationObjects(x,100, text, 20);
	}
}

function onMissNote()
{
	combo = 0;
	
	scoreData["miss"]++;
	
	--hp;
	
	if ( hp <= 0)
	{
		moveToScorePage();
	}
}

function judge(notes, x, pop_image)
{
	var index = findClosestNoteIndex(notes);
	
	if ( index != -1 )
	{
		notes[index] = null;
		
		var drawText = "COOL";
		var drawX = calcXforText(mainContext, drawText, CANVAS_WIDTH / 4);
		var centerOfImageAnimationY = CANVAS_HEIGHT - NOTE_TOUCH_CHECK_BAR_POSITION;

		var centerOfImageAnimationX = x + ( CANVAS_WIDTH / 4 / 2);
		
		addImageAnimationObjects(centerOfImageAnimationX, centerOfImageAnimationY, pop_image); 
		addImageAnimationObjects(centerOfImageAnimationX, centerOfImageAnimationY, pop_effect);
		addTextAnimationObjects(x + drawX, JUDGE_TEXT_Y_POSITION, drawText, 20);
		
		onHitNote();
	}
}

function onGamePad1()
{
	judge(notes.pad1, 0, image_note1pop);
}

function onGamePad2()
{
	judge(notes.pad2, 120, image_note2pop);
}

function onGamePad3()
{
	judge(notes.pad3, 240, image_note3pop);
}

function onGamePad4()
{
	judge(notes.pad4, 360, image_note4pop);
}

function drawNoteImage(context, img, centerX, centerY)
{
	var centerOfImage = img.width / 2;
	var tileUnitHeight = img.width;
	var numberOfTile = img.height / tileUnitHeight;
	
	var drawTileIndex = g_frameAcc % numberOfTile;
	
	context.drawImage(img, 0, drawTileIndex * tileUnitHeight, img.width, tileUnitHeight, centerX - centerOfImage, centerY - centerOfImage, img.width, tileUnitHeight);
}

function calcXforText(context, text, area_width)
{
	context.font = GAME_JUDGE_FONT;

	var width = mainContext.measureText(text).width;
	var x = ( area_width - width ) / 2;
	
	return x;
}

function drawNote(context, currentVideoTime, notes, loadedImage, x)
{
	
	for ( var i=0; i<notes.length; ++i )
   	{
		if ( notes[i] == null ) continue;
		
		var y = (CANVAS_HEIGHT -  NOTE_TOUCH_CHECK_BAR_POSITION) - (( notes[i] - currentVideoTime ) * 200.0 * SPEED );
		
		if ( y <= 0 ) ///< 화면 밖에서 내려오고 있는 노트는 그리지 않는다.
		{
			break;
		}
		
		if ( y >= (CANVAS_HEIGHT)) ///< 화면 아래로 내려간 노트는 miss 를 표시하면서 노트 배열에서 삭제.
		{
			var drawText = "BREAK";
			var drawX = calcXforText(context, drawText, CANVAS_WIDTH / 4);
			addTextAnimationObjects(x + drawX, JUDGE_TEXT_Y_POSITION, drawText, 20, "255,10,10");

			notes[i] = null;
			
			onMissNote();
		}
		else
		{
			drawNoteImage(context, loadedImage, x + CANVAS_WIDTH/4/2, y);
		}
	}
}

var moving = false;
function moveToScorePage()
{
	if ( moving == true ) return;
	
	moving = true;

	post_to_url("/score.py",
		{
			"videoid" : videoid,
			"totalNotes" : scoreData["totalNotes"],
			"hit" : scoreData["hit"],
			"maxCombo" : scoreData["maxCombo"],
			"miss" : scoreData["miss"],
			"clear" : scoreData["clear"],
			"score" : scoreData["score"],
			"lime_index" : lime_index
		}
	);
}

function volumeFadeoutAtEndOfRhythm(currentTime)
{
	var remainSeconds = Number(end_second) - Number(currentTime) - 0.3;
	
	if ( remainSeconds < 1.0 )
	{
		if ( g_youtubePlayer )
		{
			var newVolume = 100 * remainSeconds;
			
			g_youtubePlayer.setVolume ( newVolume );
			
			if ( newVolume <= 0 )
			{
				g_youtubePlayer.pauseVideo();
				
				if ( playerJS_youTubePlayerVolumeBackup )
				{
					g_youtubePlayer.setVolume ( playerJS_youTubePlayerVolumeBackup );
				}
			}
		}
	}
}

function drawAllNote(context)
{
	if ( g_youtubePlayer && g_youtubePlayer.getCurrentTime )
	{
		var currentVideoTime = getFixedYoutubeCurrentTime();
		
		drawNote(context, currentVideoTime, notes.pad1, image_note1, 0);
		drawNote(context, currentVideoTime, notes.pad2, image_note2, 120);
		drawNote(context, currentVideoTime, notes.pad3, image_note3, 240);
		drawNote(context, currentVideoTime, notes.pad4, image_note4, 360);

		volumeFadeoutAtEndOfRhythm(currentVideoTime);
		
		if ( currentVideoTime >= end_second )
		{
			scoreData["clear"] = "cleared";
			moveToScorePage();
		}
	}
}

function drawCheckBar(context)
{
	context.fillStyle = "rgb(255,255,255)";
	context.fillRect(0, CANVAS_HEIGHT - NOTE_TOUCH_CHECK_BAR_POSITION, CANVAS_WIDTH, 2);
}

function drawHP(context)
{
	context.fillStyle = "rgb(255,255,255)";
	context.fillRect(0, 0, 50, CANVAS_HEIGHT * hp / MAX_HP);
}

function checkSpeedChange()
{
	if ( ToBeSPEED == SPEED ) return;
	
	if ( ToBeSPEED > SPEED )
	{
		SPEED = SPEED + 0.1;
		
		if ( SPEED > ToBeSPEED )
		{
			SPEED = ToBeSPEED;
		}
	}
	else
	{
		SPEED = SPEED - 0.1;

		if ( SPEED < ToBeSPEED )
		{
			SPEED = ToBeSPEED;
		}
	}
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
	
	//drawHP(context);
	
	drawPadEffect(context);
	drawAnimationObjects(context);
	
	checkSpeedChange();
}



startMainLoop(draw);
