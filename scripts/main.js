requirejs([],
function() {
	var n = navigator;
	var is_webkit = false;
	var video;

	var zTracker = {
		maxZ: 0,
		nextZ: function() {
			return (this.maxZ+=1);
		}
	}

	function onSuccess(stream) {
	    video = document.createElement('video');
	    var source;
	 
	    video.autoplay = true;
	    if (!is_webkit) {
	        source = stream;
	    } else {
	    	console.log("Create createObjectURL");
	        source = window.webkitURL.createObjectURL(stream);
	    }

	    console.log("Setting source: ");
	    console.log(source);
	    console.log(stream);
 
	    video.src = source;
	    video.width = 800;
	    video.height = 600;

	    console.log("Video dimensions");
	    console.log(video.width);
	    console.log(video.height);

	    var renderer = setupPuzzle();
	    webkitRequestAnimationFrame(renderer);
	}
 
	function onError() {
    	console.log("Error getting video");
	}

	if (n.getUserMedia) {
	    n.getUserMedia({video: true, audio: false}, onSuccess, onError);
	}
	else if (n.webkitGetUserMedia) {
    	is_webkit = true;
    	n.webkitGetUserMedia('video', onSuccess, onError);
	}


	function setupPuzzle() {
		var cols = 10;
		var rows = 8;
		var numPieces = rows*cols;
		var pieceWidth = video.width / cols;
		var pieceHeight = video.height / rows;

		var contexts = [];
		var canvases = [];
		var $body = $(".wrapper");

		var row = 0;
		var col = 0;
		for (var i = 0; i < numPieces; ++i) {
			col = i % cols;
			row = (i / cols) | 0;

			var x = col * pieceWidth;
			var y = row * pieceHeight;

			var canvas = document.createElement("canvas");
			contexts.push(canvas.getContext("2d"));
			var canvasInfo = {canvas: canvas, origTop: y, origLeft: x, rate: 20 + 2 * i};
			canvases.push(canvasInfo);
			canvas.width = pieceWidth;
			canvas.height = pieceHeight;

			var $canvas = $(canvas);
			$canvas.css({top: y, left: x})
			$body.append($canvas);

			(function() {
				var info = canvasInfo;
				$canvas.draggable({
					start: function() {
						info.dragging = true;
					},

					stop: function(e, ui) {
						info.origTop = ui.position.top;
						info.origLeft = ui.position.left;
						info.dragging = false;
					}
				});
			})();
			$canvas.mousedown(function() {
				$(this).css("z-index", zTracker.nextZ());
			});
		}

		var frame = 0;
		var factor = -1;
		var sign = -1;
		function renderPuzzle(time) {
			var i = 0;
			var row = 0;
			var col = 0;
			var mod = (frame/3%(pieceWidth/2));
			if (mod == 0) {
				sign = sign*-1;
				if (factor == 0)
					factor = 1;
				else
					factor = 0;
			}
			contexts.forEach(function(context) {
				col = i % cols;
				row = (i / cols) | 0;

				var x = col * pieceWidth;
				var y = row * pieceHeight;

				context.save();
				// context.clearRect(0,0,pieceWidth,pieceHeight);
				// context.beginPath();
  		// 		context.arc(pieceWidth/2,pieceHeight/2,
  		// 			pieceWidth/2 - (sign*mod + factor*pieceWidth/2),0,Math.PI*2,true);
  		// 		context.clip();


				context.drawImage(video,
					x, y, pieceWidth, pieceHeight,
					0, 0, pieceWidth, pieceHeight);
				context.restore();

				++i;
			});
			++frame;

			// var sinResult = Math.sin(time / 1000);
			// canvases.forEach(function(canvas) {
			// 	if (!canvas.dragging) {
			// 		canvas.canvas.style.top = canvas.origTop + sinResult*canvas.rate;
			// 		canvas.canvas.style.left = canvas.origLeft + sinResult*canvas.rate;
			// 	}
			// });

			webkitRequestAnimationFrame(renderPuzzle);
		}

		return renderPuzzle;
	}
});