const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime= document.getElementById("currentTime");
const totalTime= document.getElementById("totalTime");
const timeLine = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullSreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;


const handlePlayClick = (e) => {
    console.log("click");
    if(video.paused){
        video.play();
    } 
    else{
        video.pause();
    }

    playIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

video.onkeydown = function() {
    console.log(event.keyCode);
}

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    }else{
        video.muted = true;
    }
    muteIcon.className = video.muted ? "fas fa-volume-mute" :  (volumeValue >= 0.5 ? "fas fa-volume-up" : "fas fa-volume-down");
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {target: {value}, }=event
    if(video.muted){
        video.muted = false;
        muteBtn.textContent = "Mute";
    }
    volumeValue = value;
    video.volume = value;
    muteIcon.className = volumeValue >= 0.5 ? "fas fa-volume-up" : "fas fa-volume-down"
};

const formatTime = (seconds) => new Date(seconds * 1000).toISOString(seconds).substr(11, 8);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(video.duration);
    timeLine.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(video.currentTime);
    timeLine.value = video.currentTime;
};

const handleTimelineChange = () => {
    const { target : {value}} = event;

    video.currentTime = value;
};

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        fullScreenIcon.className = "fas fa-expand";
    }else{
        videoContainer.requestFullscreen();
        fullScreenIcon.className = "fas fa-compress";
    }
};

const hideControls = () => {
    videoControls.classList.remove("showing");
}

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleKeydown = (event) => {
    if(event.code === "Space"){
        handlePlayClick();
    }
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeLine.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("keydown", handleKeydown);
