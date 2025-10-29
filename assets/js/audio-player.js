// Audio Player Functionality - Sử dụng Global Audio Player
document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('audio-toggle');
    const playIcon = document.getElementById('play-icon');
    const volumeSlider = document.getElementById('volume-slider');
    const audioPlayer = document.getElementById('audio-player');
    
    // Đợi global audio player được khởi tạo
    setTimeout(() => {
        if (window.globalAudioPlayer) {
            // Cập nhật UI với trạng thái hiện tại
            window.globalAudioPlayer.updateUI();
            
            // Play/Pause functionality
            if (playButton) {
                playButton.addEventListener('click', function() {
                    window.globalAudioPlayer.toggle();
                });
            }
            
            // Volume control
            if (volumeSlider) {
                volumeSlider.addEventListener('input', function() {
                    window.globalAudioPlayer.setVolume(this.value);
                });
            }
            
            // Auto-play when user interacts (first time)
            document.addEventListener('click', function() {
                if (!window.globalAudioPlayer.isPlaying) {
                    window.globalAudioPlayer.play();
                }
            }, { once: true });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                    e.preventDefault();
                    if (playButton) {
                        playButton.click();
                    }
                }
            });
        }
    }, 200);
    
    // Show play message if auto-play is blocked
    function showPlayMessage() {
        const message = document.createElement('div');
        message.className = 'audio-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-music"></i>
                <p>Click anywhere to start background music</p>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
});
