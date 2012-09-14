
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
