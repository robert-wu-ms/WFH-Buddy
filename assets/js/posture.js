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

var flipHorizontal = false;

var imageElement = document.getElementById('video');

var globalnet;

imageElement.onloadeddata = function() {
  pictureSnap();
}

function getPose()
{
  posenet.load()
  .then(function(net) {
    const pose = net.estimateSinglePose(imageElement, {
      flipHorizontal: true
    });
    return pose;
  }).then(function(pose){
    //console.log(pose);
    //console.log(pose.keypoints[0].part, pose.keypoints[0].position.x, pose.keypoints[0].position.y);

    nose = pose.keypoints[0];
    leftEye = pose.keypoints[1];
    rightEye = pose.keypoints[2];
    leftShoulder = pose.keypoints[5];
    rightShoulder = pose.keypoints[6];
    leftElbow = pose.keypoints[7];
    rightElbow = pose.keypoints[8];

    if ((nose.score < .7) || (leftEye.score < .7) || (rightEye.score < .7))
    {
        $('#faceForward').text('Unknown');
    }
    else if ((rightEye.position.x - nose.position.x + 15 > nose.position.x - leftEye.position.x) &&
        (rightEye.position.x - nose.position.x < nose.position.x - leftEye.position.x + 15))
    {
        $('#faceForward').text('True');
    }
    else
    {
        $('#faceForward').text('False');
    }

    if ((leftShoulder.score < .7) || (rightShoulder.score < .7))
    {
        $('#parallelShoulders').text('Unknown');
    }
    else if ((leftShoulder.position.y + 15 > rightShoulder.position.y) &&
        (leftShoulder.position.y < rightShoulder.position.y + 15))
    {
        $('#parallelShoulders').text('True');
    }
    else
    {
        $('#parallelShoulders').text('False');
    }
    
    if ((leftShoulder.score < .7) || (rightShoulder.score < .7) || (leftElbow.score < .7) || (rightElbow.score < .7))
    {
        $('#straightArms').text('Unknown');
    }
    else if ((leftElbow.position.x < leftShoulder.position.x) &&
        (leftElbow.position.x + 60 > leftShoulder.position.x) &&
        (rightElbow.position.x < rightShoulder.position.x + 60) &&
        (rightElbow.position.x > rightShoulder.position.x))
    {
        $('#straightArms').text('True');
    }
    else
    {
        $('#straightArms').text('False');
    }
  })
}

function pictureSnap() {
    setTimeout(function () {
        getPose();
        pictureSnap();
    }, 1000);
}