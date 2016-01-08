$(function(){
	var startMouseX = NaN;
	var startMouseY = NaN;
	var endMouseX = NaN;
	var endMouseY = NaN;
	var timeStart = Date.now();
	var timeEnd = Date.now();
	var $pointer = $(".pointer");
	$('html').mousedown(function(e){
		startMouseX = e.pageX;
		startMouseY = e.pageY;
		timeStart = Date.now();
	});

	$('html').mouseup(function(e){
		endMouseX = e.pageX;
		endMouseY = e.pageY;
		timeEnd = Date.now();
		var originalRoation = $pointer.css('transform');
		var distance = (endMouseX, startMouseX, endMouseY, startMouseY);
		var speed = getSpeed(distance, timeStart, timeEnd);
		$pointer.css('transform', speedToRotation(originalRoation, speed));
		console.log($pointer.css('transform'));
		console.log(speedToRotation(originalRoation, speed));
	});
});


function dist(x1, x2, y1, y2){
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function getSpeed(dis, startTime, endTime){
	return dis / (endTime - startTime);
}

function speedToRotation(originalCss, speed){
	return "rotate(" + (speed * 720 + getRotationAngle(originalCss)) + "deg)";
}

function getRotationAngle(rawCss){
	var values = rawCss.split('(')[1],
	    values = values.split(')')[0],
	    values = values.split(',');
    var a = values[0];
	var b = values[1];
	var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
	return angle;
}