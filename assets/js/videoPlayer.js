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

eval("var video = document.querySelector(\"video\");\nvar playBtn = document.getElementById(\"play\");\nvar muteBtn = document.getElementById(\"mute\");\nvar time = document.getElementById(\"time\");\nvar volumeRange = document.getElementById(\"volume\");\nvar volumeValue = 0.5;\nvideo.volume = volumeValue;\n\nvar handlePlayClick = function handlePlayClick(e) {\n  if (video.paused) {\n    video.play();\n  } else {\n    video.pause();\n  }\n\n  playBtn.textContent = video.paused ? \"Pause\" : \"Play\";\n};\n\nvar handleMute = function handleMute(e) {\n  if (video.muted) {\n    video.muted = false;\n  } else {\n    video.muted = true;\n  }\n\n  muteBtn.innerText = video.muted ? \"Unmute\" : \"Mute\";\n  volumeRange.value = video.muted ? 0 : volumeValue;\n};\n\nvar handleVolumeChange = function handleVolumeChange(event) {\n  var value = event.target.value;\n\n  if (video.muted) {\n    video.muted = false;\n    muteBtn.textContent = \"Mute\";\n  }\n\n  volumeValue = value;\n  video.volume = value;\n};\n\nplayBtn.addEventListener(\"click\", handlePlayClick);\nmuteBtn.addEventListener(\"click\", handleMute);\nvolumeRange.addEventListener(\"input\", handleVolumeChange);\n\n//# sourceURL=webpack://wetube/./src/client/js/videoPlayer.js?");

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