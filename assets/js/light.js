const brightness = require('brightness');

brightness.get().then(level => {
	document.getElementById("brightnessSlider").value = Math.round(level * 100);
});


document.getElementById("brightnessSlider").value = suggestedBrightness;

var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    const videoConstraints = {
        facingMode: 'user'
      };
    navigator.mediaDevices.getUserMedia({ video: videoConstraints }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var autobrightnessOn = false;

function changeBackgroundColor()
{
    var yTotal = 0;
    var canvasColor = context.getImageData(0, 0, 640, 480);
    var pixels = canvasColor.data;
    for (var i = 0; i < 640 * 480; i++)
    {
        yTotal += (pixels[i * 4] * .299000 + pixels[i * 4 + 1] * .587000 + pixels[i * 4 + 2] * .114000) / (640 * 480);
    }

    //$('#light').css("opacity", yTotal / 200);

    var suggestedBrightness = Math.min(Math.round(yTotal / 2), 100);
    $('#suggestedBrightness').text(suggestedBrightness);

    if (autobrightnessOn)
    {
        brightness.set(Math.min(yTotal / 200, 1.0)).then(() => {
            document.getElementById("brightnessSlider").value = suggestedBrightness; 
            brightness.get().then(level => {
                var screenBrightness = Math.round(level * 100);
                $('#screenBrightness').text(screenBrightness);
                $('#brightnessEvaluation').text("at a good level");
            });
        });
    }
    else
    {
        brightness.get().then(level => {
            var screenBrightness = Math.round(level * 100);
            $('#screenBrightness').text(screenBrightness);
            if(screenBrightness > suggestedBrightness + 20)
            {
                $('#brightnessEvaluation').text("too high");
            }
            else if(screenBrightness + 20 < suggestedBrightness)
            {
                $('#brightnessEvaluation').text("too low");
            }
            else
            {
                $('#brightnessEvaluation').text("at a good level");
            }
        });
    }
}

function toggleAutoBrightness()
{
    if (autobrightnessOn)
    {
        autobrightnessOn = false;
        $('#autoBrightnessOnButton').text('Off');
        $('#autoBrightnessOnButton').css("background-color", "#aa0000");
    }
    else
    {
        autobrightnessOn = true;
        $('#autoBrightnessOnButton').text('On');
        $('#autoBrightnessOnButton').css("background-color", "#009900");
    }
}

function setBrightness(newBrightness)
{
    brightness.set(newBrightness / 100.0).then(() => {
    });
}

function takePictureLoop() {
  setTimeout(function () {
      context.drawImage(video, 0, 0, 640, 480);
      changeBackgroundColor();
      takePictureLoop();
  }, 1000);
}

takePictureLoop();