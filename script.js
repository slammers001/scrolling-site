class ScrollStory {
    constructor() {
        this.totalFrames = 240;
        this.currentFrame = 1;
        this.imageElement = document.getElementById('story-image');
        this.currentFrameElement = document.getElementById('current-frame');
        this.totalFramesElement = document.getElementById('total-frames');
        this.progressFill = document.querySelector('.progress-fill');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        
        this.init();
    }

    init() {
        // Set total frames display
        this.totalFramesElement.textContent = this.totalFrames;
        
        // Preload images for smooth transitions
        this.preloadImages();
        
        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Hide scroll indicator after first scroll
        let hasScrolled = false;
        window.addEventListener('scroll', () => {
            if (!hasScrolled && window.scrollY > 50) {
                this.scrollIndicator.classList.add('hidden');
                hasScrolled = true;
            } else if (hasScrolled && window.scrollY <= 10) {
                this.scrollIndicator.classList.remove('hidden');
                hasScrolled = false;
            }
        });
        
        // Initial update
        this.updateFrame();
    }

    preloadImages() {
        // Preload first few frames for immediate response
        for (let i = 1; i <= Math.min(10, this.totalFrames); i++) {
            const img = new Image();
            img.src = `ezgif/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
        }
    }

    handleScroll() {
        // Calculate scroll progress
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = window.scrollY / scrollHeight;
        
        // Calculate which frame to show
        const targetFrame = Math.min(
            Math.max(1, Math.floor(scrollProgress * this.totalFrames) + 1),
            this.totalFrames
        );
        
        // Only update if frame has changed
        if (targetFrame !== this.currentFrame) {
            this.currentFrame = targetFrame;
            this.updateFrame();
        }
        
        // Update progress bar
        this.updateProgressBar(scrollProgress);
    }

    updateFrame() {
        const frameNumber = this.currentFrame.toString().padStart(3, '0');
        const imagePath = `ezgif/ezgif-frame-${frameNumber}.jpg`;
        
        // Fade out effect
        this.imageElement.style.opacity = '0.8';
        
        // Change image source
        setTimeout(() => {
            this.imageElement.src = imagePath;
            // Fade in effect
            setTimeout(() => {
                this.imageElement.style.opacity = '1';
            }, 50);
        }, 100);
        
        // Update frame counter
        this.currentFrameElement.textContent = this.currentFrame;
        
        // Preload next few frames
        this.preloadNextFrames();
    }

    preloadNextFrames() {
        // Preload next 5 frames
        for (let i = 1; i <= 5; i++) {
            const nextFrame = this.currentFrame + i;
            if (nextFrame <= this.totalFrames) {
                const frameNumber = nextFrame.toString().padStart(3, '0');
                const img = new Image();
                img.src = `ezgif/ezgif-frame-${frameNumber}.jpg`;
            }
        }
    }

    updateProgressBar(progress) {
        this.progressFill.style.width = `${progress * 100}%`;
    }

    // Method to jump to specific frame (for debugging or navigation)
    jumpToFrame(frameNumber) {
        frameNumber = Math.max(1, Math.min(frameNumber, this.totalFrames));
        this.currentFrame = frameNumber;
        
        // Calculate corresponding scroll position
        const scrollProgress = (frameNumber - 1) / this.totalFrames;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScrollY = scrollProgress * scrollHeight;
        
        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });
    }
}

// Initialize the scroll story when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const scrollStory = new ScrollStory();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            scrollStory.jumpToFrame(scrollStory.currentFrame + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollStory.jumpToFrame(scrollStory.currentFrame - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            scrollStory.jumpToFrame(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            scrollStory.jumpToFrame(scrollStory.totalFrames);
        }
    });
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Detect horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - previous frame
                scrollStory.jumpToFrame(scrollStory.currentFrame - 1);
            } else {
                // Swipe left - next frame
                scrollStory.jumpToFrame(scrollStory.currentFrame + 1);
            }
        }
    });
});

// Add smooth scroll behavior for better experience
document.documentElement.style.scrollBehavior = 'smooth';
