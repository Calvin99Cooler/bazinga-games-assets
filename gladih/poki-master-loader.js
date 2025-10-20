"use strict";
var scripts = document.getElementsByTagName("script"),
  scriptUrl = scripts[scripts.length - 1].src,
  root = "https://cdn.jsdelivr.net/gh/Calvin99Cooler/bazinga-games-assets@latest/main/gladih/",
  loaders = {
    unity: root + "unity/dist/unity.js",
    "unity-beta": root + "unity-beta/dist/unity-beta.js",
    "unity-2020": root + "unity-2020/dist/unity-2020.js"
  };

if (!window.config)
  throw Error("window.config not found");

var loader = loaders[window.config.loader];
if (!loader)
  throw Error('Loader "' + window.config.loader + '" not found');

if (!window.config.unityWebglLoaderUrl) {
  var versionSplit = window.config.unityVersion ? window.config.unityVersion.split(".") : [],
    year = versionSplit[0],
    minor = versionSplit[1];
  switch (year) {
    case "2019":
      window.config.unityWebglLoaderUrl =
        minor === "1"
          ? root + "patch/js/UnityLoader.2019.1.js"
          : root + "patch/js/UnityLoader.2019.2.js";
      break;
    default:
      window.config.unityWebglLoaderUrl = root + "patch/js/UnityLoader.js";
  }
}

var sdkScript = document.createElement("script");
sdkScript.src = root + "patch/js/poki-sdk.js";
sdkScript.onload = function () {
  var i = document.createElement("script");
  i.src = loader;
  document.body.appendChild(i);
};
document.body.appendChild(sdkScript);
