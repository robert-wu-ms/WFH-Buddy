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

var flipHorizontal = false;

var imageElement = document.getElementById('video');

var globalNet;

async function getGlobalNet()
{
    globalNet = await posenet.load();
}

getGlobalNet();

imageElement.onloadeddata = function() {
  pictureSnap();
}

var totalPostureCount = 0;
var goodPostureCount = 0;

async function getPose()
{
    if (globalNet)
    {
        globalNet.estimateSinglePose(imageElement, {
            flipHorizontal: true
            }).then(function(pose){
            //console.log(pose);
            //console.log(pose.keypoints[0].part, pose.keypoints[0].position.x, pose.keypoints[0].position.y);
        
            nose = pose.keypoints[0];
            leftEar = pose.keypoints[3];
            rightEar = pose.keypoints[4];
            leftShoulder = pose.keypoints[5];
            rightShoulder = pose.keypoints[6];
            leftElbow = pose.keypoints[7];
            rightElbow = pose.keypoints[8];
            
            isGoodPosture = true;
            isUnknownPosture = true;

            if ((nose.score < .7) || (leftEar.score < .7) || (rightEar.score < .7))
            {
                $('#faceForward').text('Unknown');
            }
            else if ((rightEar.position.x - nose.position.x + 15 > nose.position.x - leftEar.position.x) &&
                (rightEar.position.x - nose.position.x < nose.position.x - leftEar.position.x + 15))
            {
                $('#faceForward').text('True');
                isUnknownPosture = false;
            }
            else
            {
                $('#faceForward').text('False');
                isGoodPosture = false;
                isUnknownPosture = false;
            }
        
            if ((leftShoulder.score < .7) || (rightShoulder.score < .7))
            {
                $('#parallelShoulders').text('Unknown');
            }
            else if ((leftShoulder.position.y + 15 > rightShoulder.position.y) &&
                (leftShoulder.position.y < rightShoulder.position.y + 15))
            {
                $('#parallelShoulders').text('True');
                isUnknownPosture = false;
            }
            else
            {
                $('#parallelShoulders').text('False');
                isGoodPosture = false;
                isUnknownPosture = false;
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
                isUnknownPosture = false;
            }
            else
            {
                $('#straightArms').text('False');
                isGoodPosture = false;
                isUnknownPosture = false;
            }

            if (!isUnknownPosture)
            {
                totalPostureCount += 1;
                if (isGoodPosture)
                {
                    goodPostureCount += 1;
                }
                $('#postureGoodPercent').text(Math.round(100 * goodPostureCount / totalPostureCount));
            }
        })
    }
}

function pictureSnap() {
    setTimeout(function () {
        getPose();
        pictureSnap();
    }, 1000);
}