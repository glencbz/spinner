var Backing = React.createClass({
	displayName: 'Backing',

	render: function () {
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousedown', this.onMouseDown);
		document.addEventListener('touchstart', this.onMouseDown);
		document.addEventListener('touchend', this.onMouseUp);
		return React.createElement(
			'div',
			{ className: 'backing' },
			React.createElement(
				'div',
				{ className: 'pure-g' },
				React.createElement(
					'div',
					{ className: 'section top-left pure-u-1-2' },
					React.createElement(
						'div',
						{ className: 'color-circle' },
						React.createElement('i', { className: 'fa-arrow-down fa' })
					)
				),
				React.createElement(
					'div',
					{ className: 'section top-right pure-u-1-2' },
					React.createElement(
						'div',
						{ className: 'color-circle' },
						React.createElement('i', { className: 'fa-arrow-down fa' })
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'pure-g' },
				React.createElement(
					'div',
					{ className: 'section bot-left pure-u-1-2' },
					React.createElement(
						'div',
						{ className: 'color-circle' },
						React.createElement('i', { className: 'fa-arrow-down fa' })
					)
				),
				React.createElement(
					'div',
					{ className: 'section bot-right pure-u-1-2' },
					React.createElement(
						'div',
						{ className: 'color-circle' },
						React.createElement('i', { className: 'fa-arrow-down fa' })
					)
				)
			),
			React.createElement(Pointer, { rotation: this.state.rotation })
		);
	},
	onMouseUp: function (e) {
		if (e.type == "touchend") {
			this.setState({
				endMouseX: e.changedTouches[0].pageX,
				endMouseY: e.changedTouches[0].pageY,
				timeEnd: Date.now()
			});
		} else this.setState({
			endMouseX: e.pageX,
			endMouseY: e.pageY,
			timeEnd: Date.now()
		});
		var distance = dist(this.state.endMouseX, this.state.startMouseX, this.state.endMouseY, this.state.startMouseY);
		var speed = getSpeed(distance, this.state.timeStart, this.state.timeEnd);
		this.rotate(speedToRotation(speed));
	},
	onMouseDown: function (e) {
		if (e.type == "touchstart") {
			this.setState({
				startMouseX: e.changedTouches[0].pageX,
				startMouseY: e.changedTouches[0].pageY,
				timeStart: Date.now()
			});
		} else this.setState({
			startMouseX: e.pageX,
			startMouseY: e.pageY,
			timeStart: Date.now()
		});
	},
	getInitialState: function () {
		return {
			rotation: 0,
			startMouseX: NaN,
			startMouseY: NaN,
			endMouseX: NaN,
			endMouseY: NaN,
			timeStart: Date.now(),
			timeEnd: Date.now()
		};
	},
	rotate: function (rotateAmount) {
		var finalPosition = this.state.rotation + rotateAmount;
		this.setState({ rotation: finalPosition });
	}
});
var Pointer = React.createClass({
	displayName: 'Pointer',

	render: function () {
		return React.createElement(
			'div',
			{ className: 'pointer', style: this.style() },
			React.createElement('div', { className: 'head' }),
			React.createElement('div', { className: 'body' }),
			React.createElement('div', { className: 'tail' }),
			React.createElement('div', { className: 'pin' })
		);
	},
	style: function () {
		return {
			transform: 'rotate(' + this.props.rotation + 'deg)'
		};
	}
});

var reactBacking = React.createElement(Backing, null);
ReactDOM.render(reactBacking, document.getElementById("backing"));

var currentRotation = 0;

$(function () {
	var $pointer = $(".pointer");
	var $topLeft = $(".top-left .fa");
	var $topRight = $(".top-right .fa");
	var $bottomRight = $(".bot-right .fa");
	var $bottomLeft = $(".bot-left .fa");

	var timer = setInterval(function () {
		currentRotation = getRotationAngle($pointer.css("transform"));
		console.log(currentRotation);
		if (currentRotation >= 0 && currentRotation < 90) {
			$topRight.css("display", "inline-block");
			$topRight.css("transform", "rotate(" + currentRotation * 4 + "deg)");
		} else $topRight.css("display", "none");
		if (currentRotation >= 90 && currentRotation < 180) {
			$bottomRight.css("display", "inline-block");
			$bottomRight.css("transform", "rotate(" + (currentRotation - 90) * 4 + "deg)");
		} else $bottomRight.css("display", "none");
		if (currentRotation >= -180 && currentRotation < -90) {
			$bottomLeft.css("display", "inline-block");
			$bottomLeft.css("transform", "rotate(" + (currentRotation + 180) * 4 + "deg)");
		} else $bottomLeft.css("display", "none");
		if (currentRotation >= -90 && currentRotation < 0) {
			$topLeft.css("display", "inline-block");
			$topLeft.css("transform", "rotate(" + (currentRotation + 90) * 4 + "deg)");
		} else $topLeft.css("display", "none");
	}, 1);
});

function dist(x1, x2, y1, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function getSpeed(dis, startTime, endTime) {
	return dis / (endTime - startTime);
}

function speedToRotation(originalCss, speed) {
	return "rotate(" + (speed * 720 + getRotationAngle(originalCss)) + "deg)";
}

function speedToRotation(speed) {
	return speed * 360;
}

function getRotationAngle(rawCss) {
	if (!rawCss) return NaN;
	var values = rawCss.split('(')[1],
	    values = values.split(')')[0],
	    values = values.split(',');
	var a = values[0];
	var b = values[1];
	var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
	return angle;
}