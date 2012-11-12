
function trim(str)
{
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

String.prototype.trim = function()
{
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function $(id)
{
	return document.getElementById(id);
}

function getUrlVars()
{
    var vars = [], hash;
    
    /// url 중에서 첫번째 '?' 이후만 가져온다.
    var findIndex = window.location.href.indexOf('?');
    
    if ( findIndex == -1 )
    {
    	return vars;
    }
    
    var params = window.location.href.slice(findIndex + 1);
    
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
    return vars;
}

function hasSubstring(wholeString, substring)
{
	if ( wholeString.toLowerCase().indexOf(substring) != -1 )
	{
		return true;
	}
	return false;
}

function isTouchableDevice()
{
	if ( hasSubstring(navigator.userAgent, "iphone") 
			|| hasSubstring(navigator.userAgent, "android")
			|| hasSubstring(navigator.userAgent, "opera mini")
			)
	{
		return true;
	}
	
	return false;
}

function newXMLHttpRequest()
{
	var ret = null;
	
	try
	{
		ret = new XMLHttpRequest();
	}
	catch ( e )/// ie 6 에서는 exception 발생
	{
		//alert("Internet 6.0 이하 버젼을 사용할 경우 제대로 동작하지 않습니다. 7.0 이상을 사용하시거나, 파이어폭스, 크롬 웹 브라우저를 사용해보세요.");
		
		try
		{
			ret = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch ( e2 )
		{
			alert("지원되지 않는 브라우저입니다.");
		}
	}
	
	if ( ret == null )
	{
		alert("XML 요청 실패");
	}
	
	return ret;
}

function getLang()
{
	var language = window.navigator.userLanguage || window.navigator.language;
	return language;
}

function debugAlert(msg)
{
    if ( -1 != window.location.href.indexOf("localhost") )
    {
    	alert(msg);
    }
}

function request(url, onResponse, onError, postdata)
{
	//statusMsg("Requesting " + url + "...");
	
	var statusRequest = newXMLHttpRequest();
    
	statusRequest.onreadystatechange = function()
	{
	    if ( statusRequest.readyState == 4 )
	    	
	    {
	       // statusMsg("Got " + url + " response");

	        if ( statusRequest.status == 200 && statusRequest.responseText != null )
	        {
	        	if ( onResponse )
	        	{
			      	onResponse(JSON.parse(statusRequest.responseText));
	        	}
	        }
	        else
	        {
	        	if ( onError )
	        	{
		        	if ( statusRequest.responseText != null)
		        	{
			        	onError(JSON.parse(statusRequest.responseText));
		        	}
		        	else
		        	{
		        		onError(null);
		        	}
	        	}
	        }
	    }
    };
    
    if ( postdata )
    {
    	statusRequest.open("POST", url);
    	statusRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    	statusRequest.send(postdata);
    }
    else
    {
    	statusRequest.open("GET", url);
    	statusRequest.send(null);
    }
}

function post_to_url(path, params, method)
{
    method = method || "post";
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    for(var key in params)
    {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}

