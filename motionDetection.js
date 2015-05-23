var video = document.querySelector('video');
var diff = [];
var COLS = 40;
var ROWS = 30;
var WIDTH = 1200;
var HEIGHT = 900;

function getWebcam(){
	navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  
  if (navigator.getMedia) {
		navigator.getMedia (
			{
				video: true,
				autio: false
			},
			function(localMediaStream){
				console.log('success callback');
				video.src = window.URL.createObjectURL(localMediaStream);
				video.onloadedmetadata = function(e) {
		      setTimeout(function(){
		      	onFrame()
		      },1000);
		    };
			},
		  function(e){
	   		console.log(e);
	   	}
		);
	}
}

function Source(width, height) {
	this.cols = COLS;
	this.rows = ROWS;
	this.width = width;
	this.height = height;
	this.colWidth = width / this.cols;
	this.rowHeight = height / this.rows;
	this.currentFrame = null;
	this.previousFrame = null;
	this.canvas = document.getElementById('sourceCanvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
}

Source.prototype.drawCanvas = function() {
	var c = this.canvas.getContext('2d');
	var width = this.canvas.width;
	var height = this.canvas.height;
	c.save();
	c.scale(-1, 1);
  c.drawImage(video, -width, 0, width, height);
  c.restore();
  this.storeFrames();
}

Source.prototype.storeFrames = function() {
	var c = this.canvas.getContext('2d');
	var width = this.canvas.width;
	var height = this.canvas.height;

	if (this.previousFrame === null) {
		this.previousFrame = c.getImageData(0, 0, width, height);

	}
	else {
		if (this.currentFrame !== null) {
			this.previousFrame = this.currentFrame;
		}
		this.currentFrame = c.getImageData(0, 0, width, height);
		this.detect();
	}
}

Source.prototype.detect = function() {
	diff = [];
	var previous = this.previousFrame;
	var current = this.currentFrame;

	for(var r = 0; r < this.rows; r++) {
		for(var c = 0; c < this.cols; c++) {
			var x = c * this.colWidth + Math.floor(this.colWidth / 2);
			var y = r * this.rowHeight + Math.floor(this.rowHeight / 2);
			var pixelPos = (this.canvas.width * 4) * y + x * 4;

			var dr = Math.abs(previous.data[pixelPos] - current.data[pixelPos]);
			var dg = Math.abs(previous.data[pixelPos + 1] - current.data[pixelPos + 1]);
			var db = Math.abs(previous.data[pixelPos + 2] - current.data[pixelPos + 2]);

			// motion detected
			if((dr + dg + db) >= 90) {
				diff.push([c, r]);
			}
		}
	}
}

function Back(width, height) {
	this.width = width;
	this.height = height;
	this.canvas = document.getElementById('backCanvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
}

Back.prototype.drawCanvas = function() {
	var c = this.canvas.getContext('2d');
	var width = this.canvas.width;
	var height = this.canvas.height;
	if(scratching) {
		c.save();
		c.scale(-1, 1);
	  c.drawImage(video, -width, 0, width, height);
	  c.restore();
	}
	else{
		c.putImageData(this.captureFrame, 0, 0);
	}
}


function onFrame(event){
	
}

var sourceCanvas = new Source(1200,900);

var backCanvas = new Back(1200,900);

view.size = new Size(this.width, this.height);
getWebcam();
