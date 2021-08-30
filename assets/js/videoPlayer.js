/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/videoPlayer.js":
/*!**************************************!*\
  !*** ./src/client/js/videoPlayer.js ***!
  \**************************************/
/***/ (() => {

eval("var video = document.querySelector(\"video\");\nvar playBtn = document.getElementById(\"play\");\nvar playIcon = playBtn.querySelector(\"i\");\nvar muteBtn = document.getElementById(\"mute\");\nvar muteIcon = muteBtn.querySelector(\"i\");\nvar volumeRange = document.getElementById(\"volume\");\nvar currentTime = document.getElementById(\"currentTime\");\nvar totalTime = document.getElementById(\"totalTime\");\nvar timeLine = document.getElementById(\"timeline\");\nvar fullScreenBtn = document.getElementById(\"fullSreen\");\nvar fullScreenIcon = fullScreenBtn.querySelector(\"i\");\nvar videoContainer = document.getElementById(\"videoContainer\");\nvar videoControls = document.getElementById(\"videoControls\");\nvar controlsTimeout = null;\nvar controlsMovementTimeout = null;\nvar volumeValue = 0.5;\nvideo.volume = volumeValue;\n\nvar handlePlayClick = function handlePlayClick(e) {\n  console.log(\"click\");\n\n  if (video.paused) {\n    video.play();\n  } else {\n    video.pause();\n  }\n\n  playIcon.className = video.paused ? \"fas fa-play\" : \"fas fa-pause\";\n};\n\nvideo.onkeydown = function () {\n  console.log(event.keyCode);\n};\n\nvar handleMute = function handleMute(e) {\n  if (video.muted) {\n    video.muted = false;\n  } else {\n    video.muted = true;\n  }\n\n  muteIcon.className = video.muted ? \"fas fa-volume-mute\" : volumeValue >= 0.5 ? \"fas fa-volume-up\" : \"fas fa-volume-down\";\n  volumeRange.value = video.muted ? 0 : volumeValue;\n};\n\nvar handleVolumeChange = function handleVolumeChange(event) {\n  var value = event.target.value;\n\n  if (video.muted) {\n    video.muted = false;\n    muteBtn.textContent = \"Mute\";\n  }\n\n  volumeValue = value;\n  video.volume = value;\n  muteIcon.className = volumeValue >= 0.5 ? \"fas fa-volume-up\" : \"fas fa-volume-down\";\n};\n\nvar formatTime = function formatTime(seconds) {\n  return new Date(seconds * 1000).toISOString(seconds).substr(11, 8);\n};\n\nvar handleLoadedMetadata = function handleLoadedMetadata() {\n  totalTime.innerText = formatTime(video.duration);\n  timeLine.max = Math.floor(video.duration);\n};\n\nvar handleTimeUpdate = function handleTimeUpdate() {\n  currentTime.innerText = formatTime(video.currentTime);\n  timeLine.value = video.currentTime;\n};\n\nvar handleTimelineChange = function handleTimelineChange() {\n  var _event = event,\n      value = _event.target.value;\n  video.currentTime = value;\n};\n\nvar handleFullscreen = function handleFullscreen() {\n  var fullscreen = document.fullscreenElement;\n\n  if (fullscreen) {\n    document.exitFullscreen();\n    fullScreenIcon.className = \"fas fa-expand\";\n  } else {\n    videoContainer.requestFullscreen();\n    fullScreenIcon.className = \"fas fa-compress\";\n  }\n};\n\nvar hideControls = function hideControls() {\n  videoControls.classList.remove(\"showing\");\n};\n\nvar handleMouseMove = function handleMouseMove() {\n  if (controlsTimeout) {\n    clearTimeout(controlsTimeout);\n    controlsTimeout = null;\n  }\n\n  if (controlsMovementTimeout) {\n    clearTimeout(controlsMovementTimeout);\n    controlsMovementTimeout = null;\n  }\n\n  videoControls.classList.add(\"showing\");\n  controlsMovementTimeout = setTimeout(hideControls, 3000);\n};\n\nvar handleMouseLeave = function handleMouseLeave() {\n  controlsTimeout = setTimeout(hideControls, 3000);\n};\n\nvar handleKeydown = function handleKeydown(event) {\n  if (event.code === \"Space\") {\n    handlePlayClick();\n  }\n};\n\nplayBtn.addEventListener(\"click\", handlePlayClick);\nmuteBtn.addEventListener(\"click\", handleMute);\nvolumeRange.addEventListener(\"input\", handleVolumeChange);\nvideo.addEventListener(\"loadedmetadata\", handleLoadedMetadata);\nvideo.addEventListener(\"timeupdate\", handleTimeUpdate);\ntimeLine.addEventListener(\"input\", handleTimelineChange);\nfullScreenBtn.addEventListener(\"click\", handleFullscreen);\nvideoContainer.addEventListener(\"mousemove\", handleMouseMove);\nvideoContainer.addEventListener(\"mouseleave\", handleMouseLeave);\nwindow.addEventListener(\"keydown\", handleKeydown);\n\n//# sourceURL=webpack://wetube/./src/client/js/videoPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/videoPlayer.js"]();
/******/ 	
/******/ })()
;