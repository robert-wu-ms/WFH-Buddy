
function ping(host, port) {

	var started = new Date().getTime();
  
	var http = new XMLHttpRequest();
  
	http.open("GET", "http://" + host + ":" + port, true);
	http.onreadystatechange = function() {
	  if (http.readyState == 4) {
		var ended = new Date().getTime();
  
		var milliseconds = ended - started;
  
		 $('#ping').text(milliseconds + ' ms');
	  }
	};
	try {
	  http.send(null);
	} catch(exception) {
	  // this is expected
	}
}


function timeout1() {
    setTimeout(function () {
        ping('bing.com', 80);
        timeout1();
    }, 1000);
}

timeout1();

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame;
}

var t = [];
function animate(now) {
    
    t.unshift(now);
    if (t.length > 50) {
        var t0 = t.pop();
        var fps = Math.floor(1000 * 50 / (now - t0));
        $('#fps').text(fps + ' fps');
    }

    window.requestAnimationFrame(animate);
};

window.requestAnimationFrame(animate);



var imageAddr = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Animated_Wallpaper_Windows_10_-_Wallpaper_Engine.gif/800px-Animated_Wallpaper_Windows_10_-_Wallpaper_Engine.gif"; 
var downloadSize = 1911868 ; //bytes
var totalPacketsRecieved = 0;
var goodPacketsRecieved = 0;

function InitiateSpeedDetection() {
    window.setTimeout(MeasureConnectionSpeed, 1);
}

function MeasureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    }

    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;

    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        totalPacketsRecieved += 1;
        if (speedMbps >= 50)
        {
            goodPacketsRecieved += 1;
        }
        $('#speed').text(speedMbps + ' Mbps');
        $('#percentGoodNetwork').text(Math.round(100 * goodPacketsRecieved / totalPacketsRecieved));
    }
}

function timeout2() {
    setTimeout(function () {
        InitiateSpeedDetection();
        timeout2();
    }, 1000);
}

timeout2();