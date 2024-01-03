const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => 
{
    if(video.paused)
    {
        playBtn.innerText = "Pause";
        video.play();
    }
    else
    {
        playBtn.innerText = "Play";
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
}



const handlePause = () =>
{
    playBtn.innerText = "Pause";
}

const handlePlay = () =>
{
    playBtn.innerText = "Play";
}

const handleMute = (e) =>
{
    if(video.muted)
    {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    else
    {
        video.muted = true;
        muteBtn.innerText = "UnMute";
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : 0.5;
}

const handleVolumeChange = (event) =>
{
    const {target: {value}} = event;

    if(video.muted)
    {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
}

const formatTime = (seconds) =>
{
    new Date(seconds * 1000).toISOString().substring(11, 19);
}

const handleLoadedMetadata = () =>
{
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = () =>
{
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (event) =>
{ 
    const {target: {value}} = event;
    video.currentTime = value;
}

const handleFullscreen = (event) =>
{
    const fullscreen = document.fullscreenElement;
    if(fullscreen)
    {
        document.exitFullscreen();
        fullscreen.innerText = "Enter Full Screen";
    }
    else
    {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";
    }
    videoContainer.requestFullscreen();
}

const hideControls = () => videoControls.classList.add("showing");

const handleMouseMove = () =>
{
    if(controlsTimeout)
    {
        // 타임아웃 실행 취소할때
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout)
    {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
}

const handleMouseLeave = () =>
{
    // 실행할 함수, 몇초후에?
    controlsTimeout = setTimeout(hideControls, 3000);
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);