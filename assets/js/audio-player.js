(function () {
    document.addEventListener("DOMContentLoaded", () => {
        const audio = document.getElementById("background-music");
        const toggle = document.getElementById("audio-toggle");
        const icon = document.getElementById("play-icon");
        const volume = document.getElementById("volume-slider");

        if (!audio || !toggle) return;

        if (volume) {
            audio.volume = Number(volume.value || 40) / 100;
            volume.addEventListener("input", () => {
                audio.volume = Number(volume.value || 40) / 100;
            });
        }

        toggle.addEventListener("click", async () => {
            if (audio.paused) {
                try {
                    await audio.play();
                    if (icon) {
                        icon.classList.remove("fa-play");
                        icon.classList.add("fa-pause");
                    }
                } catch (error) {
                    console.warn("Audio playback was blocked by the browser.", error);
                }
            } else {
                audio.pause();
                if (icon) {
                    icon.classList.remove("fa-pause");
                    icon.classList.add("fa-play");
                }
            }
        });
    });
})();
