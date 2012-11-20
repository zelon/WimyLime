
var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 400;

const NOTE_TOUCH_CHECK_BAR_POSITION = 20.0;
const JUDGE_TEXT_Y_POSITION = CANVAS_HEIGHT - NOTE_TOUCH_CHECK_BAR_POSITION - 20; 

var KEYCODE_Z = 90;
var KEYCODE_X = 88;
var KEYCODE_C = 67;
var KEYCODE_V = 86;

var CHARCODE_PLUS = 43;
var CHARCODE_MINUS = 45;

var FPS = 30;

const GAME_JUDGE_FONT = "bold 25px sans-serif";
const GAME_STATUS_FONT = "bold 20px sans-serif";


const MAX_HP = 10;
const WARNING_HP = 3;
var hp = MAX_HP;

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

var pop_effect = null;

var loadedCount = 0;

function onLoadedImage()
{
	console.log("onLoadedImage");
	loadedCount++;
	
	if ( loadedCount == 9 )
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

	pop_effect = new Image();
	pop_effect.src = "/images/pop_effect.png";
	pop_effect.onload = onLoadedImage;
}

function pressInputPad(id)
{
	//$(id).style.position = "relative";
	//$(id).style.top = "1px";
	//$(id).style.fontSize = "180%";
	
	$(id).style.opacity = "0.9";
}

function upInputPad(id)
{
	//$(id).style.position = "static";
	//$(id).style.top = "";
	//$(id).style.fontSize = "200%";

	$(id).style.opacity = "1";
}

function onKey_Z()
{
	if ( onGamePad1 )
	{
		onGamePad1();
	}
	pressed_Z=true;
	pressInputPad("inputPad1");
	//debugMsg("Z");

	draw();
}

function onKey_X()
{
	if ( onGamePad2 )
	{
		onGamePad2();
	}
	pressed_X=true;
	pressInputPad("inputPad2");
	//debugMsg("X");

	draw();
}

function onKey_C()
{
	if ( onGamePad3 )
	{
		onGamePad3();
	}
	pressed_C=true;
	pressInputPad("inputPad3");
	//debugMsg("C");

	draw();
}

function onKey_V()
{
	if ( onGamePad4 )
	{
		onGamePad4();
	}
	pressed_V=true;
	pressInputPad("inputPad4");

	draw();
	//debugMsg("V");
}

function onKeyUp_Z()
{
	pressed_Z=false;
	//debugMsg("Z");
	upInputPad("inputPad1");
	draw();
}

function onKeyUp_X()
{
	pressed_X=false;
	upInputPad("inputPad2");
	//debugMsg("X");

	draw();
}

function onKeyUp_C()
{
	pressed_C=false;
	upInputPad("inputPad3");
	//debugMsg("C");

	draw();
}

function onKeyUp_V()
{
	pressed_V=false;
	upInputPad("inputPad4");
	//debugMsg("V");

	draw();
}

function debugMsg(msg)
{
	console.log(msg);
	
	var output = document.getElementById("output");
	
	output.innerHTML = msg + "<br/>" + output.innerHTML;
}

function onCommandKeyPress(event)
{
	if ( event.charCode == CHARCODE_PLUS )
	{
		if ( onGameSpeedUp )
		{
			onGameSpeedUp();
		}
	}
	
	if ( event.charCode == CHARCODE_MINUS )
	{
		if ( onGameSpeedDown )
		{
			onGameSpeedDown();
		}
	}
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

function extractVideoIDFromYouTubeURL(url)
{
    var vars = [], hash;
    
    var trimmedURL = url.trim();
    
    /// url 중에서 첫번째 '?' 이후만 가져온다.
    var findIndex = trimmedURL.indexOf('?');
    
    if ( findIndex == -1 )
    {
    	return vars;
    }
    
    var params = trimmedURL.slice(findIndex + 1);
    
    /// GET 변수 중에 # 은 제거한다.
    params = params.replace("#", "");
    
    /// '&' 을 기준으로 split 한다.
    var hashes = params.split('&');
    
    for(var i = 0; i < hashes.length; i++)
    {
    	/// '=' 를 기준으로 key 와 value 를 나눈다.
	    hash = hashes[i].split('=');
	    vars.push(hash[0]);
	    vars[hash[0]] = hash[1];
    }
    return vars["v"];
}

function getVideoID()
{
	var vars = getUrlVars();
	
	var videoURL = decodeURIComponent(vars["videoURL"]);
	
	return extractVideoIDFromYouTubeURL(videoURL);
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

function addTextAnimationObjects(x,y,msg, frame, strRGB)
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
		
		context.font = GAME_JUDGE_FONT;
		
		if ( strRGB )
		{
			context.fillStyle = "rgba(" + strRGB + ", " + 1.0 * ( this.remainFrames / frame) + ")";
		}
		else
		{
			context.fillStyle = "rgba(255,255,255, " + 1.0 * ( this.remainFrames / frame) + ")";
		}
		context.fillText(this.msg, this.x, this.y);
		
		if ( strRGB )
		{
			context.strokeStyle = "rgba(" + strRGB + ", " + 1.0 * ( this.remainFrames / frame) + ")";
		}
		else
		{
			context.strokeStyle = "rgba(0,0,0, " + 1.0 * ( this.remainFrames / frame) + ")";
		}
		
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

var g_frameAcc = 0;
function drawBackground(context)
{
	++g_frameAcc;
	
	var max_strength = 30;
	var frequence = 30.0; ///< if frequence is low, blank speed is up
	
	if ( hp <= WARNING_HP )
	{
		frequence /= 6.0;
		max_strength *= 2;
	}
	
	var strength = Math.floor(Math.abs(Math.sin(g_frameAcc/frequence)) * max_strength);
	var rgb = "rgb(" + strength + "," + strength + "," + strength + ")";
	
	if ( hp <= WARNING_HP )
	{
		rgb = "rgb(" + strength + ",0,0)";
		
	}
	context.fillStyle = rgb;
	context.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

document.onkeypress = onCommandKeyPress;
document.onkeydown=onGameKeyDown;
document.onkeyup=onGameKeyUp;
