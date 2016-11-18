$(document).ready(function() {
	$("input").focus();

    $(".btn-firstSearch").one("click", function() {
        $(".searchBox").slideUp('slow', function() {
        	$(this).removeClass('searchBox-vertical-center');
        	$(this).addClass('searchBox-margin');
            $(this).slideDown('slow', function(){
            	$(".searchResults").slideDown();
            });
            $(".btn-firstSearch").removeClass('btn-firstSearch');
        });
    });
	
	$(".btn").on("click", function(e) {
		$("searchResults").focus();	
		$(".searchResults").empty();
        searchTerm = $("input").val();
        console.log(searchTerm);

	    wikipediaApiurl = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" + searchTerm + "&prop=info|extracts&exsentences=10&exintro=1&exlimit=max&inprop=url";
	    
	    $.ajax({
	        url: wikipediaApiurl,
	        data: {
	            format: 'json'
	        },
	        error: function() {
	            console.log('An error has occurred');
	        },
	        dataType: 'jsonp',
	        success: function(data) {
	        	$.each(data.query.pages, function(key, value){
		        	html = '<div ' + 'onclick="' + "location.href='" + data.query.pages[key].fullurl + "'" + '"' + 'class="box col-xs-10 col-xs-offset-1">';
		        	html += '<h4>' + data.query.pages[key].title + '</h4>';
		        	html += '<p>' + data.query.pages[key].extract + '</p>';
		        	$(".searchResults").append(html);
	            });
	        },
	        type: 'GET'
		});
    });
});
