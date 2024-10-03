class SliderClass {
    constructor(container, slides, prevBtn, nextBtn, dots, config) {
        this.container = document.querySelector(container);
        this.slides = document.querySelectorAll(slides);
        this.prevBtn = document.getElementById(prevBtn);
        this.nextBtn = document.getElementById(nextBtn);
        this.dots = document.querySelectorAll(dots);
        this.config = config || {};
        this.currentIndex = 0;
        this.autoplay = false;
        this.autoplayInterval = null;
        this.startX = 0;  // Для тач-событий

        this.init();
    }

    init() {
        this.updateSlider();
        this.prevBtn.addEventListener('click', this.prevSlide.bind(this));
        this.nextBtn.addEventListener('click', this.nextSlide.bind(this));
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        if (this.config.keyboardControl) {
            document.addEventListener('keydown', this.handleKeyboard.bind(this));
        }

        if (this.config.autoScroll) {
            this.startAutoplay();
        }

        this.addTouchEvents();  // Добавление тач-событий

        this.autoplayBtn = document.getElementById('autoplayBtn');
        if (this.autoplayBtn) {
            this.autoplayBtn.addEventListener('click', this.toggleAutoplay.bind(this));
        }
    }

    updateSlider() {
        this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlider();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    handleKeyboard(e) {
        if (e.key === 'ArrowRight') this.nextSlide();
        if (e.key === 'ArrowLeft') this.prevSlide();
    }

    startAutoplay() {
        this.autoplay = true;
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.config.autoScrollInterval || 3000);
    }

    stopAutoplay() {
        this.autoplay = false;
        clearInterval(this.autoplayInterval);
    }

    toggleAutoplay() {
        if (this.autoplay) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        if (!this.startX) return;
        const currentX = e.touches[0].clientX;
        const diffX = this.startX - currentX;

        if (diffX > 50) {
            this.nextSlide();
        } else if (diffX < -50) {
            this.prevSlide();
        }
        this.startX = null;
    }

    addTouchEvents() {
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }
}


// Инициализация
document.addEventListener('DOMContentLoaded', function () {
    const slider = new SliderClass(
        '.slider__container-inner',
        '.slider__container-item',
        'prevBtn',
        'nextBtn',
        '.slider__dots-item',
        {
            autoScroll: true,
            autoScrollInterval: 3000,
            keyboardControl: true
        }
    );
});
// slider.js