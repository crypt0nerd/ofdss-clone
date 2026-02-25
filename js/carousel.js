// ===== OFDSS - Testimonials Carousel =====

class Carousel {
  constructor(element) {
    this.el = element;
    this.track = element.querySelector('.carousel__track');
    this.slides = [...element.querySelectorAll('.carousel__slide')];
    this.dots = [...element.querySelectorAll('.carousel__dot')];
    this.prevBtn = element.querySelector('.carousel__arrow--prev');
    this.nextBtn = element.querySelector('.carousel__arrow--next');
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 8000;
    this.touchStartX = 0;
    this.touchEndX = 0;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    // Arrow navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.restartAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.restartAutoPlay();
      });
    }

    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goTo(index);
        this.restartAutoPlay();
      });
    });

    // Touch/swipe support
    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });

    // Pause on hover
    this.el.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.el.addEventListener('mouseleave', () => this.startAutoPlay());

    // Start autoplay
    this.startAutoPlay();
  }

  goTo(index) {
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;

    this.currentIndex = index;
    this.track.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
      this.restartAutoPlay();
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  restartAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const carouselEl = document.querySelector('.carousel');
  if (carouselEl) {
    new Carousel(carouselEl);
  }
});
