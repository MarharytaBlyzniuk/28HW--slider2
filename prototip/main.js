function Slider(container, slides, prevBtn, nextBtn, dots, config) {
    this.container = document.querySelector(container);
    this.slides = document.querySelectorAll(slides);
    this.prevBtn = document.getElementById(prevBtn);
    this.nextBtn = document.getElementById(nextBtn);
    this.dots = document.querySelectorAll(dots);
    this.config = config || {};
    this.currentIndex = 0;
    this.autoplay = false;
    this.autoplayInterval = null;
    this.isDragging = false; // Для обработки перетаскивания
    this.startX = 0;

    this.init();
}

Slider.prototype.init = function () {
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
};

Slider.prototype.updateSlider = function () {
    this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentIndex);
    });
};

Slider.prototype.nextSlide = function () {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlider();
};

Slider.prototype.prevSlide = function () {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlider();
};

Slider.prototype.goToSlide = function (index) {
    this.currentIndex = index;
    this.updateSlider();
};

Slider.prototype.handleKeyboard = function (e) {
    if (e.key === 'ArrowRight') this.nextSlide();
    if (e.key === 'ArrowLeft') this.prevSlide();
};

Slider.prototype.startAutoplay = function () {
    this.autoplay = true;
    this.autoplayInterval = setInterval(() => this.nextSlide(), this.config.autoScrollInterval || 3000);
};

Slider.prototype.stopAutoplay = function () {
    this.autoplay = false;
    clearInterval(this.autoplayInterval);
};

Slider.prototype.toggleAutoplay = function () {
    if (this.autoplay) {
        this.stopAutoplay();
    } else {
        this.startAutoplay();
    }
};

// Реализация Slider с поддержкой тач и перетаскивания
function TouchSlider(container, slides, prevBtn, nextBtn, dots, config) {
    Slider.call(this, container, slides, prevBtn, nextBtn, dots, config);
}

TouchSlider.prototype = Object.create(Slider.prototype);
TouchSlider.prototype.constructor = TouchSlider;

TouchSlider.prototype.init = function () {
    Slider.prototype.init.call(this);
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));

    this.container.addEventListener('mousedown', this.handleMouseStart.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseEnd.bind(this));
    this.container.addEventListener('mouseleave', this.handleMouseEnd.bind(this)); // Для выхода за пределы контейнера
};

TouchSlider.prototype.handleTouchStart = function (e) {
    this.startX = e.touches[0].clientX;
};

TouchSlider.prototype.handleTouchMove = function (e) {
    let diffX = this.startX - e.touches[0].clientX;
    if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
            this.nextSlide();
        } else {
            this.prevSlide();
        }
        this.startX = e.touches[0].clientX; // обновляем для продолжительных свайпов
    }
};

TouchSlider.prototype.handleTouchEnd = function () {
    this.startX = 0; // сброс после завершения свайпа
};

TouchSlider.prototype.handleMouseStart = function (e) {
    this.isDragging = true;
    this.startX = e.clientX;
};

TouchSlider.prototype.handleMouseMove = function (e) {
    if (!this.isDragging) return;
    let diffX = this.startX - e.clientX;
    if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
            this.nextSlide();
        } else {
            this.prevSlide();
        }
        this.startX = e.clientX; // обновляем для плавного перетаскивания
    }
};

TouchSlider.prototype.handleMouseEnd = function () {
    this.isDragging = false;
    this.startX = 0; // сброс после завершения перетаскивания
};

// Инициализация
document.addEventListener('DOMContentLoaded', function () {
    const slider = new TouchSlider(
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

