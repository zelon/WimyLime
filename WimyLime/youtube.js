
/*
google.load("swfobject", "2.1");

var ytplayer = null;
function onYouTubePlayerReady(playerId)
{
	ytplayer = document.getElementById("ytPlayer");

	ytplayer.playVideo();
}

function _run()
{
	// The video to load.
    var videoID = "3fy4cqWMhyI"; ///< be my baby
    //var videoID = "1UwAUAayvbY"; ///< oblivion
    // Lets Flash from another domain call JavaScript
    var params = { allowScriptAccess: "always" };
    // The element id of the Flash embed
    var atts = { id: "ytPlayer" };
    // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
    swfobject.embedSWF("http://www.youtube.com/v/" + videoID + "?version=3&enablejsapi=1&playerapiid=player1", 
                           "videoDiv", "480", "300", "9", null, null, params, atts);
    
}

google.setOnLoadCallback(_run);
*/


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var g_youtubePlayer;
var g_youtubeReady = false;
var g_youtubeVideoID = "";
var g_youtubeReadyCallback = null;

function waitingYouTubeAndPlay()
{
	if ( g_youtubeReady == false )
	{
		setTimeout(waitingYouTubeAndPlay, 1000);
		return;
	}
	
	var videoID = g_youtubeVideoID;
	  
	g_youtubePlayer = new YT.Player('videoDiv',
		{
			width: '480',
			height: '300',
			videoId: videoID,
			events:
			{
		        'onReady': onPlayerReady,
		        'onStateChange': onPlayerStateChange
			},
			playerVars :
			{
				'autohide' : 1
			}
		}
    );
}

function playYouTubeWhenReady(videoid, readyCallback)
{
	g_youtubeVideoID = videoid;
	g_youtubeReadyCallback = readyCallback;
	
	setTimeout(waitingYouTubeAndPlay, 1000);
}
  
function onYouTubeIframeAPIReady()
{
	g_youtubeReady = true;
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event)
{
	if ( g_youtubeReadyCallback )
	{
		g_youtubeReadyCallback(g_youtubePlayer);
	}

	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event)
{
    if (event.data == YT.PlayerState.PLAYING && !done)
    {
    	done = true;
    }
}

function stopVideo()
{
	g_youtubePlayer.stopVideo();
}
  
  
var g_lastYoutubeCurrentTimeUpdatedTime = 0;
var g_lastYoutubeCurrentTime = 0;

function getFixedYoutubeCurrentTime()
{
	return getFixedYoutbueCurrentTimeEx();
	  
 	var currentVideoTime = g_youtubePlayer.getCurrentTime();
  	var fixedCurrentVideoTime = currentVideoTime; 
  	var time = new Date();
  	
  	if ( g_lastYoutubeCurrentTime != currentVideoTime )
  	{
  		g_lastYoutubeCurrentTimeUpdatedTime = time.getTime();
  		g_lastYoutubeCurrentTime = currentVideoTime;
  	}
  	else
  	{
  		if ( g_youtubePlayer.getPlayerState() != 2 /* paused */)
  		{
  			fixedCurrentVideoTime += ((time.getTime() - g_lastYoutubeCurrentTimeUpdatedTime) / 1000);
  			fixedCurrentVideoTime = fixedCurrentVideoTime.toFixed(3); 
  		}
  	}
  	
	return fixedCurrentVideoTime;
}

var g_youtubeStartedTime = 0;
var g_youtubeStartedTimeUTC = 0;
const g_youtubeMinimumStartSecond = 3;

function getFixedYoutbueCurrentTimeEx()
{
	if ( g_youtubePlayer == null || g_youtubePlayer.getCurrentTime == null )
	{
		return "0.0";
	}
	
	if ( g_youtubePlayer.getCurrentTime() <= g_youtubeMinimumStartSecond )
	{
		return "0.0";
	}
	
	if ( g_youtubeStartedTime == 0 )
	{
		g_youtubeStartedTime = g_youtubePlayer.getCurrentTime();
		g_youtubeStartedTimeUTC = (new Date()).getTime();
		
		return g_youtubeStartedTime;
	}
	
	var UTCDiff = ((new Date()).getTime() - g_youtubeStartedTimeUTC) / 1000.0;
	
	return g_youtubeStartedTime + UTCDiff; 
}
