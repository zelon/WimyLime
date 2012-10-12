
google.load("search", "1");

var imageSearch;
var imageSearchCallback;
function searchComplete()
{
	if (imageSearch.results && imageSearch.results.length > 0)
	{
		 var results = imageSearch.results;
         for (var i = 0; i < results.length; i++) {
           // For each result write it's title and image to the screen
           var result = results[i];
           
           imageSearchCallback(result.url);
           return;
         }
	}
}

function findImage(searchWord, onSuccess)
{
	imageSearchCallback = onSuccess;
    // Create an Image Search instance.
    imageSearch = new google.search.ImageSearch();

    // Set searchComplete as the callback function when a search is 
    // complete.  The imageSearch object will have results in it.
    imageSearch.setSearchCompleteCallback(this, searchComplete, null);

    // Find me a beautiful car.
    imageSearch.execute(searchWord);
}