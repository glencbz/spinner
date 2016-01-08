var reversed = false;
$(function(){
var $instruct = $("#instruct");
var $reverse = $("#reverse");
var $reset = $("#reset");
var currentRotation = 0;
var moved = false;

$reverse.click(function(){
	reversed = !reversed;
});

var Backing = React.createClass({
	render: function(){
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousedown', this.onMouseDown);
		document.addEventListener('touchstart', this.onMouseDown);
		document.addEventListener('touchend', this.onMouseUp);
		var outerThis = this;
		$reset.click(function(){
			$(this).css("transform", "rotate(0deg)");
			outerThis.setState({
				rotation: 0,
			});
		});
		return (    
	<div className="backing">
        <div className="pure-g">
            <div className="section top-left pure-u-1-2">
                <div className="color-circle">
                    <i className="fa"></i>
                </div>
            </div>
            <div className="section top-right pure-u-1-2">
                <div className="color-circle">
                    <i className="fa"></i>
                </div>
            </div>
        </div>
        <div className="pure-g">
            <div className="section bot-left pure-u-1-2">
                <div className="color-circle">
                    <i className="fa"></i>
                </div>
            </div>
            <div className="section bot-right pure-u-1-2">
                <div className="color-circle">
                    <i className="fa"></i>
                </div>
            </div>
        </div>
        <Pointer rotation={this.state.rotation}></Pointer>
    </div>);},
	onMouseUp: function(e){
		if (e.type == "touchend"){
			this.setState({
				endMouseX: e.changedTouches[0].pageX,
				endMouseY: e.changedTouches[0].pageY,
				timeEnd: Date.now(),
			});			
		}
		else
			this.setState({
				endMouseX: e.pageX,
				endMouseY: e.pageY,
				timeEnd: Date.now(),
			});
		moved = true;
		$instruct.addClass("hidden");
		$reset.css("opacity", 1);
		$reverse.css("opacity", 1);
		var distance = dist(this.state.endMouseX, this.state.startMouseX, this.state.endMouseY, this.state.startMouseY);
		var speed = getSpeed(distance, this.state.timeStart, this.state.timeEnd);
		this.rotate(speedToRotation(speed, reversed));
	},
	onMouseDown: function(e){
		if (e.type == "touchstart"){
			this.setState({
				startMouseX: e.changedTouches[0].pageX,
				startMouseY: e.changedTouches[0].pageY,
				timeStart: Date.now(),
			});			
		}
		else
			this.setState({
				startMouseX: e.pageX,
				startMouseY: e.pageY,
				timeStart: Date.now(),
			});
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
});
var Pointer = React.createClass({
	render: function(){
		return(
	        <div className="pointer" style={this.style()}>
	            <div className="head"></div>
	            <div className="body"></div>
	            <div className="tail"></div>
	            <div className="pin"></div>
	        </div>
        );
	},
	style: function(){
		return {
			transform: 'rotate(' + this.props.rotation + 'deg)'
		};
	},
});

var reactBacking = React.createElement(Backing, null);
ReactDOM.render(reactBacking, document.getElementById("backing"));
var $pointer = $(".pointer");
var $topLeft = $(".top-left .fa");
var $topRight = $(".top-right .fa");
var $bottomRight = $(".bot-right .fa");
var $bottomLeft = $(".bot-left .fa");
var $move = $("#move");
var timer = setInterval(function(){
    currentRotation = getRotationAngle($pointer.css("transform"));
	if (currentRotation >= 0 && currentRotation < 90){
		var sectionRotation = currentRotation * 4;
		$topRight.css("display", "inline-block");
		if (moved)
			$move.html(getLimbClass(sectionRotation, $topRight) + " on red");
	}
	else
		$topRight.css("display", "none");
	if (currentRotation >= 90 && currentRotation < 180){
		var sectionRotation = (currentRotation - 90) * 4;
		$bottomRight.css("display", "inline-block");
		if (moved)
			$move.html(getLimbClass(sectionRotation, $bottomRight) + " on green");
	}
	else
		$bottomRight.css("display", "none");
	if (currentRotation >= -180 && currentRotation < -90){
		var sectionRotation = (currentRotation + 180) * 4;
		$bottomLeft.css("display", "inline-block");
		if (moved){
			$move.html(getLimbClass(sectionRotation, $bottomLeft) + " on yellow");
		}
	}
	else
		$bottomLeft.css("display", "none");
	if (currentRotation >= -90 && currentRotation < 0){
		var sectionRotation = (currentRotation + 90) * 4;
		$topLeft.css("display", "inline-block");
		if (moved)
			$move.html(getLimbClass(sectionRotation, $topLeft) + " on blue");
	}
	else
		$topLeft.css("display", "none");
}, 1);
});

function getLimbClass(rotation, $target){
	if (rotation >= 0 && rotation < 90){
		$target.attr("class", "fi-foot");
		return "Left foot";
	}
	else if (rotation >= 90 && rotation < 180){
		$target.attr("class", "fi-foot reverse");
		return "Right foot";
	}
	else if (rotation >= 180 && rotation < 270){
		$target.attr("class", "fa fa-hand-paper-o");
		return "Left hand";
	}
	else if (rotation > 270){
		$target.attr("class", "fa fa-hand-paper-o reverse");
		return "Right hand";
	}
}

function dist(x1, x2, y1, y2){
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function getSpeed(dis, startTime, endTime){
	return dis / (endTime - startTime);
}

function getRotationAngle(rawCss){
	if (!rawCss)
		return NaN;
	var values = rawCss.split('(')[1],
	    values = values.split(')')[0],
	    values = values.split(',');
    var a = values[0];
	var b = values[1];
	var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
	return angle;
}

function speedToRotation(speed, reversed){
	return speed * 360 * (reversed ? -1 : 1);
}