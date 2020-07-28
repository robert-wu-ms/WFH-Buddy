var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

function changeBackgroundColor()
{
    var yTotal = 0;
    var canvasColor = context.getImageData(0, 0, 640, 480);
    var pixels = canvasColor.data;
    for (var i = 0; i < 640 * 480; i++)
    {
        yTotal += (pixels[i * 4] * .299000 + pixels[i * 4 + 1] * .587000 + pixels[i * 4 + 2] * .114000) / (640 * 480);
    }

    console.log(yTotal);

    $('#light').css("opacity", yTotal / 200);
}

function takePictureLoop() {
  setTimeout(function () {
      context.drawImage(video, 0, 0, 640, 480);
      changeBackgroundColor();
      takePictureLoop();
  }, 1000);
}

takePictureLoop();