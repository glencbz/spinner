var Pointer = React.createClass({
	render: function(){
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousedown', this.onMouseDown);
		return(
	        <div className="pointer" style={this.style()}>
	            <div className="head"></div>
	            <div className="body"></div>
	            <div className="tail"></div>
	            <div className="pin"></div>
	        </div>
        );
	},
	getInitialState: function(){
		return {
			rotation: 0,
			startMouseX: NaN,
			startMouseY: NaN,
			endMouseX: NaN,
			endMouseY: NaN,
			timeStart: Date.now(),
			timeEnd: Date.now(),
		};
	},
	rotate: function(rotateAmount){
		var finalPosition = this.state.rotation + rotateAmount;
		this.setState({rotation: finalPosition});
	},
	style: function(){
		return {
			transform: 'rotate(' + this.state.rotation + 'deg)'
		};
	},
	onMouseUp: function(e){
		endMouseX = e.pageX;
		endMouseY = e.pageY;
		timeEnd = Date.now();
		var distance = dist(endMouseX, startMouseX, endMouseY, startMouseY);
		var speed = getSpeed(distance, timeStart, timeEnd);
		this.rotate(speedToRotation(speed));
		console.log(speed);
		console.log(speedToRotation(speed));
	},
	onMouseDown: function(e){
		startMouseX = e.pageX;
		startMouseY = e.pageY;
		timeStart = Date.now();
	}
});

var reactPointer = React.createElement(Pointer, null);
ReactDOM.render(reactPointer, document.getElementById("pointer"));

function dist(x1, x2, y1, y2){
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function getSpeed(dis, startTime, endTime){
	return dis / (endTime - startTime);
}

function speedToRotation(originalCss, speed){
	return "rotate(" + (speed * 720 + getRotationAngle(originalCss)) + "deg)";
}

function speedToRotation(speed){
	return speed * 360;
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