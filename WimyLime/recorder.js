
var keylog = "";

var notePad1 = [];
var notePad2 = [];
var notePad3 = [];
var notePad4 = [];

window.addEventListener("load", function()
		{
			fillData();
			startMainLoop(draw);
		}, false
		);


function getCurrentYoutubeTimeString()
{
	if ( g_youtubePlayer == null )
	{
    	return 0.0;
	}
	else
	{
    	return getFixedYoutubeCurrentTime();
	}
}

function onGamePad1()
{
	notePad1.push(getCurrentYoutubeTimeString());
	generateResult();
}

function onGamePad2()
{
	notePad2.push(getCurrentYoutubeTimeString());
	generateResult();
}

function onGamePad3()
{
	notePad3.push(getCurrentYoutubeTimeString());
	generateResult();
}

function onGamePad4()
{
	notePad4.push(getCurrentYoutubeTimeString());
	generateResult();
}

function makeNote(key, arr)
{
	var note = "\"" + key + "\" : [ ";
	
	for ( var i=0; i<arr.length; ++i )
	{
		if ( i != 0 )
		{
			note += ", ";
		}
		note += arr[i].toString();
	}
	
	note += "]";
	if ( key != "pad4" )
	{
		note += ",";
	}
	
	return note;
}

function generateResult()
{
	var logDiv = document.getElementById("taOutput");

	var keylog = "{";
	
	keylog += makeNote("pad1", notePad1);
	keylog += makeNote("pad2", notePad2);
	keylog += makeNote("pad3", notePad3);
	keylog += makeNote("pad4", notePad4);
	
	keylog += "}";
	logDiv.value = keylog;
}

function drawStatusMsg(context)
{
	context.font = GAME_STATUS_FONT;
	context.fillStyle = "rgb(255,255,255)";

	var text = "Z,X,C,V 키를 통해 리듬을 입력하세요";
	
	var currentTime = getCurrentYoutubeTimeString(); 
	if ( currentTime == "0.0" )
	{
		text = "시작 후 " + g_youtubeMinimumStartSecond + " 초 후부터 입력 가능합니다";
	}
	
	var x = (CANVAS_WIDTH - context.measureText(text).width) / 2;
	
	
	context.fillText(text, x, 50);
}

function draw()
{
	var canvas = document.getElementById("mycanvas");
	
	if ( canvas == null ) return;
	var context = canvas.getContext("2d");
	
	drawBackground(context);
	
	drawStatusMsg(context);
	drawPadEffect(context);
	drawAnimationObjects(context);
}

function fillData()
{
	var vars = getUrlVars();
	
	var videoID = getVideoID();
	var author = decodeURIComponent(vars["author"]);
	
	requestBackgroundImage(videoID);

	$("videoid").value = videoID;
	$("author").value = author;
	$("show_author").innerHTML = author;
	request("/getVideoTitle.py?videoid=" + videoID,
			function(responseJSON)
			{
				var title = responseJSON["title"];
				
				$("videotitle").value = title;
				$("show_title").innerHTML = title;
			}, null);

}

function onRequestSubmit()
{
	var currentTime = getCurrentYoutubeTimeString();
	
	$("end_second").value = currentTime;
	
	return true;
}
