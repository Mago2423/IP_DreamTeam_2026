// Initialize carousel
const myCarouselEl = document.querySelector('#myCarousel');
const carousel = new bootstrap.Carousel(myCarouselEl, {
  interval: 5000,   // slide every 5s
  ride: 'carousel',  // start automatically
  wrap: true
});

// Optional: jump to slide when indicator clicked
myCarouselEl.querySelectorAll('.carousel-indicators button').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    carousel.to(index);
  });
});

// Optional: programmatic prev/next (already handled by buttons)
myCarouselEl.querySelector('.carousel-control-prev').addEventListener('click', () => carousel.prev());
myCarouselEl.querySelector('.carousel-control-next').addEventListener('click', () => carousel.next());
