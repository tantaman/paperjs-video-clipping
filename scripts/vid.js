var video;
var n = navigator;
var $vidCanvas = $("<canvas width=640 height=480></canvas>");
var vidCanvas = $vidCanvas[0];
var ctx = vidCanvas.getContext("2d");
function onSuccess(stream) {
    video = document.createElement('video');
    var source;

    if (stream) {
        var url = window.URL || window.webkitURL;
        if (url) {
            source = url.createObjectURL(stream);
        } else {
            source = stream;
        }
    } else {
        source = "http://tantaman.github.com/paperjs-video-clipping/res/media/vid.webm";
    }

    video.src = source;
    video.width = 640;
    video.height = 480;
    video.loop = true;
    video.load();
    video.play();

    console.log("Video dimensions");
    console.log(video.width);
    console.log(video.height);
}

function onError() {
    console.log("Error getting video");
}

n.getUserMedia_ = n.getUserMedia || 
                    n.webkitGetUserMedia || 
                    n.mozGetUserMedia || 
                    n.msGetUserMedia;

if (n.getUserMedia_) {
    try {
        n.getUserMedia_({video: true, audio: false}, onSuccess, onError);
    } catch (e) {
        n.webkitGetUserMedia('video', onSuccess, onError);
    }
} else {
    onSuccess(null);
}