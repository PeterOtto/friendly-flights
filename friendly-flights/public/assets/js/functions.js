// Browser detection for when you get desperate. A measure of last resort.

// http://rog.ie/post/9089341529/html5boilerplatejs
// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }

// Uncomment the below to use:
// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);

$(function() {
	var startDate = new Date();
	var endDate = new Date();
	var numberOfDaysToAdd = 6;

	endDate.setDate(endDate.getDate() + numberOfDaysToAdd);

	$('input[name="daterange"]').daterangepicker({
    "autoApply": true,
    "startDate": startDate,
    "endDate": endDate
	}, function(start, end, label) {
	  console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
	});
});

function search(){
	document.getElementById("searchModal").style.display = "block";
}