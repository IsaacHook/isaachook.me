$(document).ready(function(){
	channelArray = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff"];
	$.each(channelArray, function(index, value){
		$.getJSON('https://api.twitch.tv/kraken/streams/' + value + '?callback=?', function(data) {
  			console.log(data);
  			console.log(data.stream);
		});
	});
});

