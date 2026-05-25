(function () {
    // Compatibility shim for older pages. The portfolio no longer starts background music automatically.
    window.globalAudioPlayer = {
        isPlaying: false,
        play() {},
        pause() {},
        toggle() {},
        setVolume() {},
        updateUI() {},
        saveStateBeforeUnload() {}
    };
})();
