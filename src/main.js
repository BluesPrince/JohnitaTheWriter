/**
 * The Devil's Baby - Audiobook Player
 * Custom audio player with chapter navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progress = document.getElementById('progress');
    const progressBar = document.querySelector('.progress-bar');
    const timeCurrent = document.querySelector('.time-current');
    const timeTotal = document.querySelector('.time-total');
    const chapterList = document.getElementById('chapterList');
    const chapterTitle = document.querySelector('.chapter-title');
    const chapterSubtitle = document.querySelector('.chapter-subtitle');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');

    // Chapter data - update sources when audio files are added
    const chapters = [
        { num: 1, name: 'The Beginning', src: 'audio/chapter-01.mp3' },
        { num: 2, name: 'First Encounter', src: 'audio/chapter-02.mp3' },
        { num: 3, name: 'The Revelation', src: 'audio/chapter-03.mp3' },
        { num: 4, name: 'Descent', src: 'audio/chapter-04.mp3' },
        { num: 5, name: 'The Choice', src: 'audio/chapter-05.mp3' },
        { num: 6, name: 'Awakening', src: 'audio/chapter-06.mp3' }
    ];

    let currentChapter = 0;
    let isPlaying = false;

    // Format time as M:SS
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update play/pause button icons
    function updatePlayButton() {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    // Load a chapter
    function loadChapter(index) {
        if (index < 0 || index >= chapters.length) return;

        currentChapter = index;
        const chapter = chapters[index];

        // Update audio source
        audio.src = chapter.src;
        audio.load();

        // Update UI
        chapterTitle.textContent = `Chapter ${chapter.num}`;
        chapterSubtitle.textContent = chapter.name;

        // Update active state in chapter list
        const items = chapterList.querySelectorAll('.chapter-item:not(.locked)');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // Reset progress
        progress.style.width = '0%';
        timeCurrent.textContent = '0:00';
    }

    // Play/Pause toggle
    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                isPlaying = true;
                updatePlayButton();
            }).catch(err => {
                console.log('Playback failed:', err);
                // Show user-friendly message if audio file not found
                if (err.name === 'NotSupportedError') {
                    chapterSubtitle.textContent = 'Audio coming soon...';
                }
            });
        } else {
            audio.pause();
            isPlaying = false;
            updatePlayButton();
        }
    }

    // Previous chapter
    function prevChapter() {
        if (currentChapter > 0) {
            loadChapter(currentChapter - 1);
            if (isPlaying) {
                audio.play();
            }
        }
    }

    // Next chapter
    function nextChapter() {
        if (currentChapter < chapters.length - 1) {
            loadChapter(currentChapter + 1);
            if (isPlaying) {
                audio.play();
            }
        }
    }

    // Update progress bar
    function updateProgress() {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${percent}%`;
            timeCurrent.textContent = formatTime(audio.currentTime);
        }
    }

    // Seek on progress bar click
    function seek(e) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        if (audio.duration) {
            audio.currentTime = percent * audio.duration;
        }
    }

    // Handle chapter item click
    function handleChapterClick(e) {
        const item = e.target.closest('.chapter-item');
        if (!item || item.classList.contains('locked')) return;

        const chapterNum = parseInt(item.dataset.chapter);
        const index = chapterNum - 1;

        loadChapter(index);
        togglePlay();
    }

    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevChapter);
    nextBtn.addEventListener('click', nextChapter);
    progressBar.addEventListener('click', seek);
    chapterList.addEventListener('click', handleChapterClick);

    // Audio events
    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('loadedmetadata', () => {
        timeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        // Auto-play next chapter
        if (currentChapter < chapters.length - 1) {
            nextChapter();
        } else {
            isPlaying = false;
            updatePlayButton();
        }
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayButton();
    });

    audio.addEventListener('play', () => {
        isPlaying = true;
        updatePlayButton();
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Only handle if not typing in an input
        if (e.target.tagName === 'INPUT') return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                if (audio.currentTime > 5) {
                    audio.currentTime -= 5;
                } else {
                    prevChapter();
                }
                break;
            case 'ArrowRight':
                if (audio.duration && audio.currentTime < audio.duration - 5) {
                    audio.currentTime += 5;
                } else {
                    nextChapter();
                }
                break;
        }
    });

    // Initialize first chapter
    loadChapter(0);
});

// Email signup form handler
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;

    // For now, just show a success message
    // In production, this would connect to an email service
    const button = this.querySelector('button');
    const originalText = button.textContent;

    button.textContent = 'Subscribed!';
    button.style.background = '#2e7d32';

    this.querySelector('input').value = '';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 3000);

    console.log('Email signup:', email);
});
