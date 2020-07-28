timeRemaining = 60 * 25;
started = false;

function pomodomoTimer()
{
    timeRemaining = 60 * 25;
    $('#time').text(Math.floor(timeRemaining / 60) + ':' + ('0' + timeRemaining % 60).slice(-2));
    timeRemaining = timeRemaining + 1;
}

function shortBreakTimer()
{
    timeRemaining = 60 * 5;
    $('#time').text(Math.floor(timeRemaining / 60) + ':' + ('0' + timeRemaining % 60).slice(-2));
    timeRemaining = timeRemaining + 1;
}

function longBreakTimer()
{
    timeRemaining = 60 * 15;
    $('#time').text(Math.floor(timeRemaining / 60) + ':' + ('0' + timeRemaining % 60).slice(-2));
    timeRemaining = timeRemaining + 1;
}

function stopStart()
{
    if (started)
    {
        started = false;
        $('#startStopButton').text('Stopped');
        $('#startStopButton').css("background-color", "#990000");
    }
    else
    {
        started = true;
        $('#startStopButton').text('Running');
        $('#startStopButton').css("background-color", "#007700");
    }
}

var alarm = document.getElementById("alarmAudio");

function decrementTime()
{
    if (started)
    {
        timeRemaining = timeRemaining - 1;
        $('#time').text(Math.floor(timeRemaining / 60) + ':' + ('0' + timeRemaining % 60).slice(-2));
        if (timeRemaining == 0)
        {
            started = false;
            timeRemaining = 60 * 25;
            $('#startStopButton').text('Stopped');
            $('#startStopButton').css("background-color", "#990000");
            alarm.play();
        }
    }
}

function recursiveTimer() {
    setTimeout(function () {
        decrementTime();
        recursiveTimer();
    }, 1000);
}

recursiveTimer();