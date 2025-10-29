// Global Audio Player - Phát nhạc liên tục khi chuyển trang với playlist
class GlobalAudioPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.5;
        this.currentSongIndex = 0;
        this.playlist = [
            {
                name: 'MUSIC',
                artist: 'PIANO',
                file: 'assets/Music/Beethoven1.mp3'
            },
            {
                name: 'MUSIC',
                artist: 'PIANO',
                file: 'assets/Music/Beethoven2_Virus.mp3'
            },
            {
                name: 'MUSIC',
                artist: 'PIANO',
                file: 'assets/Music/Beethoven3.mp3'
            }
        ];
        this.currentSong = this.playlist[this.currentSongIndex];
        this.init();
    }

    init() {
        // Khôi phục trạng thái từ localStorage trước
        this.restoreState();
        
        // Tạo audio element global
        this.createGlobalAudio();
        
        // Lưu trạng thái định kỳ (bao gồm currentTime)
        this.startSavingState();
        
        // Lắng nghe sự kiện beforeunload để lưu trạng thái cuối cùng
        window.addEventListener('beforeunload', () => {
            this.saveStateBeforeUnload();
        });
        
        // Lắng nghe visibility change để pause/resume khi tab không active
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.audio && this.isPlaying) {
                // Tab bị ẩn - vẫn tiếp tục phát
            } else if (!document.hidden && this.isPlaying && this.audio.paused) {
                // Tab hiển thị lại - tiếp tục phát nếu đang pause
                this.audio.play().catch(() => {});
            }
        });
        
        // Tự động phát nếu đã được bật trước đó
        if (this.isPlaying) {
            // Đảm bảo audio được load và phát ngay
            const tryPlay = () => {
                if (this.audio.readyState >= 2) { // HAVE_CURRENT_DATA
                    if (this.savedCurrentTime && this.savedCurrentTime > 0) {
                        this.audio.currentTime = Math.min(this.savedCurrentTime, this.audio.duration || Infinity);
                        this.savedCurrentTime = 0;
                    }
                    this.audio.play().catch(() => {
                        // Nếu bị block, chờ user interaction
                        console.log('Auto-play blocked, waiting for user interaction');
                    });
                } else {
                    // Chờ metadata load
                    this.audio.addEventListener('loadedmetadata', tryPlay, { once: true });
                    this.audio.addEventListener('canplay', tryPlay, { once: true });
                }
            };
            
            tryPlay();
        }
    }

    createGlobalAudio() {
        // Loại bỏ các audio elements cũ trong HTML (nếu có)
        const oldAudios = document.querySelectorAll('audio[id="background-music"]');
        oldAudios.forEach(audio => {
            audio.pause();
            audio.remove();
        });
        
        // Kiểm tra xem có audio element global nào đã tồn tại chưa
        let existingAudio = document.getElementById('global-audio');
        
        if (existingAudio) {
            // Sử dụng audio element có sẵn
            this.audio = existingAudio;
            // Cập nhật volume và source nếu cần
            this.audio.volume = this.volume;
            this.updateAudioSource();
            return; // Không tạo mới, chỉ cập nhật
        } else {
            // Tạo audio element global mới
            this.audio = document.createElement('audio');
            this.audio.id = 'global-audio';
            this.audio.loop = false; // Không loop để có thể chuyển bài
            this.audio.style.display = 'none';
            document.body.appendChild(this.audio);
        }
        
        // Cập nhật volume
        this.audio.volume = this.volume;
        
        // Thêm source cho bài hát hiện tại
        this.updateAudioSource();
        
        // Lắng nghe sự kiện khi bài hát kết thúc để chuyển bài tiếp theo
        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });
        
        // Lắng nghe timeupdate để lưu currentTime
        this.audio.addEventListener('timeupdate', () => {
            this.lastUpdateTime = Date.now();
        });
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
            const wasPlaying = !this.audio.paused;
            const savedTime = this.audio.currentTime;
            const newSrc = this.getCorrectPath(this.currentSong.file);
            
            // Chỉ cập nhật source nếu bài hát thay đổi hoặc chưa có source
            let currentSrc = '';
            try {
                if (this.audio.src) {
                    currentSrc = new URL(this.audio.src).pathname;
                }
            } catch (e) {
                // Ignore
            }
            
            const newSrcPath = newSrc.startsWith('http') ? new URL(newSrc).pathname : newSrc;
            
            // Nếu cùng bài hát và đang phát, chỉ cập nhật currentTime nếu cần
            if (currentSrc && currentSrc.endsWith(this.currentSong.file.split('/').pop())) {
                if (this.savedCurrentTime && this.savedCurrentTime > 0 && Math.abs(this.audio.currentTime - this.savedCurrentTime) > 1) {
                    if (this.audio.readyState >= 2) {
                        this.audio.currentTime = Math.min(this.savedCurrentTime, this.audio.duration || Infinity);
                        this.savedCurrentTime = 0;
                    } else {
                        this.audio.addEventListener('loadedmetadata', () => {
                            this.audio.currentTime = Math.min(this.savedCurrentTime, this.audio.duration);
                            this.savedCurrentTime = 0;
                        }, { once: true });
                    }
                }
                // Đảm bảo tiếp tục phát nếu đang phát
                if (wasPlaying && this.audio.paused) {
                    this.audio.play().catch(() => {});
                }
                return;
            }
            
            // Lưu currentTime hiện tại trước khi load bài mới
            if (!this.savedCurrentTime && wasPlaying && savedTime > 0) {
                this.savedCurrentTime = savedTime;
            }
            
            this.audio.src = newSrc;
            this.audio.load();
            
            // Khôi phục currentTime và phát nếu cần
            const onCanPlay = () => {
                if (this.savedCurrentTime && this.savedCurrentTime > 0) {
                    this.audio.currentTime = Math.min(this.savedCurrentTime, this.audio.duration || Infinity);
                    this.savedCurrentTime = 0;
                }
                if (wasPlaying || this.isPlaying) {
                    this.audio.play().catch(() => {
                        // Auto-play bị block
                    });
                }
            };
            
            if (this.audio.readyState >= 3) { // HAVE_FUTURE_DATA
                onCanPlay();
            } else {
                this.audio.addEventListener('canplay', onCanPlay, { once: true });
                this.audio.addEventListener('loadedmetadata', onCanPlay, { once: true });
            }
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
            // Khôi phục currentTime trước khi phát
            if (this.savedCurrentTime && this.savedCurrentTime > 0) {
                this.audio.currentTime = this.savedCurrentTime;
                this.savedCurrentTime = 0; // Reset sau khi đã khôi phục
            }
            
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
            currentSong: this.currentSong,
            currentTime: this.audio ? this.audio.currentTime : 0,
            timestamp: Date.now()
        };
        localStorage.setItem('globalAudioState', JSON.stringify(state));
    }
    
    saveStateBeforeUnload() {
        // Lưu trạng thái cuối cùng trước khi unload
        if (this.audio && !this.audio.paused) {
            const state = {
                isPlaying: true,
                volume: this.volume,
                currentSongIndex: this.currentSongIndex,
                currentSong: this.currentSong,
                currentTime: this.audio.currentTime,
                timestamp: Date.now()
            };
            localStorage.setItem('globalAudioState', JSON.stringify(state));
        } else {
            this.saveState();
        }
    }
    
    startSavingState() {
        // Lưu trạng thái định kỳ mỗi 2 giây
        setInterval(() => {
            if (this.audio && !this.audio.paused) {
                this.saveState();
            }
        }, 2000);
    }

    restoreState() {
        // Khôi phục trạng thái từ localStorage
        const savedState = localStorage.getItem('globalAudioState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                const timeDiff = Date.now() - (state.timestamp || 0);
                
                // Chỉ khôi phục nếu trạng thái còn "tươi" (dưới 30 giây)
                if (timeDiff < 30000) {
                    this.isPlaying = state.isPlaying || false;
                    this.volume = state.volume || 0.5;
                    this.currentSongIndex = state.currentSongIndex || 0;
                    this.currentSong = this.playlist[this.currentSongIndex];
                    // Lưu currentTime để khôi phục sau
                    this.savedCurrentTime = state.currentTime || 0;
                    // Không cập nhật thời gian vì chưa biết duration, sẽ khôi phục chính xác khi audio load
                } else {
                    // Trạng thái quá cũ, reset
                    this.isPlaying = false;
                    this.volume = 0.5;
                    this.currentSongIndex = 0;
                    this.currentSong = this.playlist[this.currentSongIndex];
                    this.savedCurrentTime = 0;
                }
            } catch (error) {
                console.log('Error restoring audio state:', error);
                // Reset về mặc định
                this.isPlaying = false;
                this.volume = 0.5;
                this.currentSongIndex = 0;
                this.currentSong = this.playlist[this.currentSongIndex];
                this.savedCurrentTime = 0;
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
            
            // Đảm bảo audio tiếp tục phát nếu đang phát
            if (window.globalAudioPlayer.isPlaying && window.globalAudioPlayer.audio && window.globalAudioPlayer.audio.paused) {
                window.globalAudioPlayer.audio.play().catch(() => {
                    // Auto-play bị block
                });
            }
        }
    }, 100);
});

// Đảm bảo audio tiếp tục khi visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.globalAudioPlayer) {
        if (window.globalAudioPlayer.isPlaying && window.globalAudioPlayer.audio && window.globalAudioPlayer.audio.paused) {
            window.globalAudioPlayer.audio.play().catch(() => {});
        }
    }
});
