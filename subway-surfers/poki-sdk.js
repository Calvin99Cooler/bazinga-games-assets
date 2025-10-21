(() => {
    const o = new (function () {
        function SDKLoader() {
            this.queue = [];
            this.init = (options = {}) => new Promise((resolve, reject) => this.enqueue("init", options, resolve, reject));
            this.rewardedBreak = () => new Promise(resolve => resolve(false));
            this.noArguments = (method) => () => this.enqueue(method);
            this.oneArgument = (method) => (arg) => this.enqueue(method, arg);
            this.handleAutoResolvePromise = () => new Promise(resolve => resolve());
            this.handleAutoResolvePromiseObj = () => new Promise(resolve => resolve());
            this.throwNotLoaded = () => console.debug("PokiSDK is not loaded yet. Not all methods are available.");
        }

        SDKLoader.prototype.enqueue = function(method, options, resolve, reject) {
            this.queue.push({ fn: method, options, resolveFn: resolve, rejectFn: reject });
        };

        SDKLoader.prototype.dequeue = function() {
            while (this.queue.length > 0) {
                const item = this.queue.shift();
                const fn = window.PokiSDK[item.fn];
                if (typeof fn === "function") {
                    if (item.resolveFn || item.rejectFn) {
                        fn(item.options)
                            .then(...(item.resolveFn ? [item.resolveFn] : []))
                            .catch(...(item.rejectFn ? [item.rejectFn] : []));
                    } else {
                        fn(item.options);
                    }
                } else {
                    console.error("Cannot execute " + item.fn);
                }
            }
        };

        return SDKLoader;
    })();

    window.PokiSDK = {
        init: o.init,
        initWithVideoHB: o.init,
        customEvent: o.throwNotLoaded,
        destroyAd: o.throwNotLoaded,
        getLeaderboard: o.handleAutoResolvePromiseObj
    };

    ["disableProgrammatic", "gameLoadingStart", "gameLoadingFinished", "gameInteractive", "roundStart", "roundEnd", "muteAd"].forEach(m => {
        window.PokiSDK[m] = o.noArguments(m);
    });

    ["setDebug", "gameplayStart", "gameplayStop", "gameLoadingProgress", "happyTime", "setPlayerAge", "togglePlayerAdvertisingConsent", "toggleNonPersonalized", "setConsentString", "logError", "sendHighscore", "setDebugTouchOverlayController"].forEach(m => {
        window.PokiSDK[m] = o.oneArgument(m);
    });

    // **Load the SDK from your fixed URL**
    const sdkScript = document.createElement("script");
    sdkScript.src = "https://cdn.jsdelivr.net/gh/Calvin99Cooler/bazinga-games-assets@main/subway-surfers/poki-sdk-core-v2.234.2.js";
    sdkScript.type = "text/javascript";
    sdkScript.crossOrigin = "anonymous";
    sdkScript.onload = () => o.dequeue();
    document.head.appendChild(sdkScript);
})();
