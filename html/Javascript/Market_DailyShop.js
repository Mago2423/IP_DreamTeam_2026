const myCarouselEl = document.querySelector('#myCarousel');

if (myCarouselEl) {
  const carousel = new bootstrap.Carousel(myCarouselEl, {
    interval: 5000,
    ride: 'carousel',
    wrap: true
  });

  myCarouselEl.querySelectorAll('.carousel-indicators button').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      carousel.to(index);
    });
  });

  myCarouselEl.querySelector('.carousel-control-prev')
    ?.addEventListener('click', () => carousel.prev());

  myCarouselEl.querySelector('.carousel-control-next')
    ?.addEventListener('click', () => carousel.next());
}


const modal = document.getElementById('dynamicModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalImage = document.getElementById('modalImage');
const claimBtn = document.getElementById('claimBtn');
const closeBtn = document.getElementById('closeBtn');

let activeButton = null;

// When ANY Buy button is clicked
document.querySelectorAll('[data-bs-target="#dynamicModal"]').forEach(btn => {
  btn.addEventListener('click', () => {
    activeButton = btn;

    // FIRST POPUP
    modalTitle.textContent = btn.dataset.title;
    modalText.textContent = btn.dataset.content;
    modalImage.src = btn.dataset.img;

    claimBtn.style.display = 'inline-block';
    closeBtn.style.display = 'none';
  });
});

// When Claim is clicked → SECOND POPUP
claimBtn.addEventListener('click', () => {
  if (!activeButton) return;

  modalTitle.textContent = activeButton.dataset.btnTitle;
  modalText.textContent = activeButton.dataset.btnTextContent;
  modalImage.src = activeButton.dataset.btnImg;

  claimBtn.style.display = 'none';
  closeBtn.style.display = 'inline-block';
});

// Reset when modal closes
modal.addEventListener('hidden.bs.modal', () => {
  claimBtn.style.display = 'inline-block';
  closeBtn.style.display = 'none';
  activeButton = null;
});