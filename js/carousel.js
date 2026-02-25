// ===== OFDSS - Carousels =====

class Carousel {
  constructor(element, options = {}) {
    this.el = element;
    this.track = element.querySelector(options.trackSelector || '.carousel__track');
    this.slides = [...this.track.children];
    this.dots = [...element.querySelectorAll(options.dotSelector || '.carousel__dot')];
    this.prevBtn = element.querySelector(options.prevSelector || '.carousel__arrow--prev');
    this.nextBtn = element.querySelector(options.nextSelector || '.carousel__arrow--next');
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = options.autoPlayDelay || 8000;
    this.autoPlay = options.autoPlay !== false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
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

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goTo(index);
        this.restartAutoPlay();
      });
    });

    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });

    this.el.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.el.addEventListener('mouseleave', () => {
      if (this.autoPlay) this.startAutoPlay();
    });

    if (this.autoPlay) this.startAutoPlay();
  }

  goTo(index) {
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;

    this.currentIndex = index;
    this.track.style.transform = `translateX(-${index * 100}%)`;

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
      if (diff > 0) this.next();
      else this.prev();
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
    if (this.autoPlay) this.startAutoPlay();
  }
}

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Testimonials carousel
  const testimonialEl = document.querySelector('.carousel');
  if (testimonialEl) {
    new Carousel(testimonialEl, {
      autoPlayDelay: 8000,
      autoPlay: true
    });
  }

  // Domains carousel
  const domainsEl = document.querySelector('.domains-carousel');
  if (domainsEl) {
    new Carousel(domainsEl, {
      trackSelector: '.domains-carousel__track',
      dotSelector: '.domains-carousel__dot',
      prevSelector: '.domains-carousel__arrow--prev',
      nextSelector: '.domains-carousel__arrow--next',
      autoPlayDelay: 6000,
      autoPlay: true
    });
  }
});
