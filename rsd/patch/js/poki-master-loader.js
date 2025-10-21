"use strict";

const BASE_URL = "https://cdn.jsdelivr.net/gh/Calvin99Cooler/bazinga-games-assets@main/rsd/";

var scripts = document.getElementsByTagName("script"),
    scriptUrl = scripts[scripts.length - 1].src,
    root = BASE_URL,  // use CDN base
    loaders = {
        unity: BASE_URL + "unity.js",
        "unity-beta": BASE_URL + "unity/unity-beta.js",
        "unity-2020": BASE_URL + "unity/unity-2020.js"
    };

if (0 <= window.location.href.indexOf("pokiForceLocalLoader")) {
    loaders.unity = BASE_URL + "unity/dist/unity.js";
    loaders["unity-beta"] = BASE_URL + "unity-beta/dist/unity-beta.js";
    loaders["unity-2020"] = BASE_URL + "unity-2020/dist/unity-2020.js";
    root = BASE_URL + "loaders/";
}

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
            window.config.unityWebglLoaderUrl = (minor === "1") ? BASE_URL + "js/unity/UnityLoader.2019.1.js" : BASE_URL + "js/unity/UnityLoader.2019.2.js";
            break;
        default:
            window.config.unityWebglLoaderUrl = BASE_URL + "js/unity/UnityLoader.js";
    }
}

var sdkScript = document.createElement("script");
sdkScript.src = BASE_URL + "patch/js/poki-sdk-v2.js";
sdkScript.onload = function () {
    var i = document.createElement("script");
    i.src = loader; // already has BASE_URL
    document.body.appendChild(i);
};
document.body.appendChild(sdkScript);
