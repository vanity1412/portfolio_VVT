// Global Audio Player - Phát nhạc liên tục khi chuyển trang với playlist
class GlobalAudioPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.5;
        this.currentSongIndex = 0;
        this.playlist = [
            {
                name: 'Beethoven 1',
                artist: 'Classical',
                file: 'assets/Music/Beethoven1.mp3'
            },
            {
                name: 'Beethoven 2 Virus',
                artist: 'Classical',
                file: 'assets/Music/Beethoven2_Virus.mp3'
            },
            {
                name: 'Beethoven 3',
                artist: 'Classical',
                file: 'assets/Music/Beethoven3.mp3'
            }
        ];
        this.currentSong = this.playlist[this.currentSongIndex];
        this.init();
    }

    init() {
        // Tạo audio element global
        this.createGlobalAudio();
        
        // Khôi phục trạng thái từ localStorage
        this.restoreState();
        
        // Chuyển bài khi load trang mới (chỉ khi đã có trạng thái lưu trước đó)
        const savedState = localStorage.getItem('globalAudioState');
        if (savedState) {
            this.changeSongOnPageLoad();
        }
        
        // Lưu trạng thái khi có thay đổi
        this.saveState();
        
        // Tự động phát nếu đã được bật trước đó
        if (this.isPlaying) {
            this.play();
        }
    }

    createGlobalAudio() {
        // Tạo audio element ẩn
        this.audio = document.createElement('audio');
        this.audio.id = 'global-audio';
        this.audio.loop = false; // Không loop để có thể chuyển bài
        this.audio.volume = this.volume;
        this.audio.style.display = 'none';
        
        // Thêm source cho bài hát hiện tại
        this.updateAudioSource();
        
        // Lắng nghe sự kiện khi bài hát kết thúc để chuyển bài tiếp theo
        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });
        
        document.body.appendChild(this.audio);
    }

    getCorrectPath(songFile) {
        // Điều chỉnh đường dẫn dựa trên vị trí trang
        if (window.location.pathname.includes('/components/')) {
            return '../' + songFile;
        } else if (window.location.pathname.includes('/posts/')) {
            return '../../' + songFile;
        } else {
            return songFile;
        }
    }

    updateAudioSource() {
        // Cập nhật source cho bài hát hiện tại
        if (this.audio) {
            this.audio.src = this.getCorrectPath(this.currentSong.file);
            this.audio.load();
        }
    }

    nextSong() {
        // Chuyển sang bài tiếp theo
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.currentSong = this.playlist[this.currentSongIndex];
        this.updateAudioSource();
        this.updateUI();
        this.saveState();
        
        // Tiếp tục phát nếu đang phát
        if (this.isPlaying) {
            this.play();
        }
    }

    changeSongOnPageLoad() {
        // Chuyển bài khi load trang mới
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.currentSong = this.playlist[this.currentSongIndex];
        this.updateAudioSource();
        this.updateUI();
        this.saveState();
    }

    play() {
        if (this.audio) {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updateUI();
                this.saveState();
            }).catch(error => {
                console.log('Auto-play was prevented:', error);
            });
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updateUI();
            this.saveState();
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    setVolume(volume) {
        this.volume = volume / 100;
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.saveState();
    }

    updateUI() {
        // Cập nhật UI của audio player trên trang hiện tại
        const playButton = document.getElementById('audio-toggle');
        const playIcon = document.getElementById('play-icon');
        const volumeSlider = document.getElementById('volume-slider');
        const songTitle = document.querySelector('.song-title');
        const songArtist = document.querySelector('.song-artist');
        
        if (playButton && playIcon) {
            playIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        
        if (volumeSlider) {
            volumeSlider.value = this.volume * 100;
        }

        // Cập nhật thông tin bài hát
        if (songTitle) {
            songTitle.textContent = this.currentSong.name;
        }
        if (songArtist) {
            songArtist.textContent = this.currentSong.artist;
        }
    }

    saveState() {
        // Lưu trạng thái vào localStorage
        const state = {
            isPlaying: this.isPlaying,
            volume: this.volume,
            currentSongIndex: this.currentSongIndex,
            currentSong: this.currentSong
        };
        localStorage.setItem('globalAudioState', JSON.stringify(state));
    }

    restoreState() {
        // Khôi phục trạng thái từ localStorage
        const savedState = localStorage.getItem('globalAudioState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                this.isPlaying = state.isPlaying || false;
                this.volume = state.volume || 0.5;
                this.currentSongIndex = state.currentSongIndex || 0;
                this.currentSong = this.playlist[this.currentSongIndex];
            } catch (error) {
                console.log('Error restoring audio state:', error);
            }
        }
    }

    // Phương thức để các trang khác có thể sử dụng
    getAudioState() {
        return {
            isPlaying: this.isPlaying,
            volume: this.volume,
            currentSong: this.currentSong
        };
    }
}

// Khởi tạo global audio player
window.globalAudioPlayer = new GlobalAudioPlayer();

// Cập nhật audio player UI khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Đợi một chút để đảm bảo global audio đã được khởi tạo
    setTimeout(() => {
        if (window.globalAudioPlayer) {
            window.globalAudioPlayer.updateUI();
        }
    }, 100);
});
