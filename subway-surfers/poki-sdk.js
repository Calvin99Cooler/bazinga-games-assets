(() => {
    // base URL for your assets
    const BASE_URL = "https://cdn.jsdelivr.net/gh/Calvin99Cooler/bazinga-games-assets@main/subway-surfers/";

    // PokiSDK placeholder
    const PokiSDKQueue = [];
    let PokiSDKInstance;

    class PokiSDKWrapper {
        constructor() {
            this.queue = [];
        }
        init(options = {}) {
            return new Promise((resolve, reject) => this.enqueue("init", options, resolve, reject));
        }
        rewardedBreak() { return Promise.resolve(false); }
        noArguments(fnName) { return () => this.enqueue(fnName); }
        oneArgument(fnName) { return (arg) => this.enqueue(fnName, arg); }
        handleAutoResolvePromise() { return Promise.resolve(); }
        handleAutoResolvePromiseObj() { return Promise.resolve(); }
        throwNotLoaded() { console.debug("PokiSDK not loaded yet."); }
        enqueue(fn, options, resolve, reject) {
            const q = { fn, options, resolveFn: resolve, rejectFn: reject };
            PokiSDKQueue.push(q);
        }
        dequeue() {
            while (PokiSDKQueue.length > 0) {
                const item = PokiSDKQueue.shift();
                const fn = item.fn;
                if (typeof window.PokiSDK[fn] === "function") {
                    if (item.resolveFn || item.rejectFn) {
                        window.PokiSDK[fn](item.options)
                            .then(res => item.resolveFn && item.resolveFn(res))
                            .catch(err => item.rejectFn && item.rejectFn(err));
                    } else {
                        window.PokiSDK[fn](item.options);
                    }
                }
            }
        }
    }

    PokiSDKInstance = new PokiSDKWrapper();

    // Attach placeholder methods first
    window.PokiSDK = {
        init: PokiSDKInstance.init.bind(PokiSDKInstance),
        initWithVideoHB: PokiSDKInstance.init.bind(PokiSDKInstance),
        customEvent: PokiSDKInstance.throwNotLoaded.bind(PokiSDKInstance),
        destroyAd: PokiSDKInstance.throwNotLoaded.bind(PokiSDKInstance),
        getLeaderboard: PokiSDKInstance.handleAutoResolvePromiseObj.bind(PokiSDKInstance),
    };

    ["disableProgrammatic","gameLoadingStart","gameLoadingFinished","gameInteractive","roundStart","roundEnd","muteAd"]
        .forEach(fn => { window.PokiSDK[fn] = PokiSDKInstance.noArguments(fn); });

    ["setDebug","gameplayStart","gameplayStop","gameLoadingProgress","happyTime","setPlayerAge",
    "togglePlayerAdvertisingConsent","toggleNonPersonalized","setConsentString","logError",
    "sendHighscore","setDebugTouchOverlayController"]
        .forEach(fn => { window.PokiSDK[fn] = PokiSDKInstance.oneArgument(fn); });

    // Load actual SDK script
    const sdkScript = document.createElement("script");
    sdkScript.src = BASE_URL + "poki-sdk-core-v2.234.2.js";
    sdkScript.type = "text/javascript";
    sdkScript.crossOrigin = "anonymous";
    sdkScript.onload = () => PokiSDKInstance.dequeue();
    document.head.appendChild(sdkScript);
})();
