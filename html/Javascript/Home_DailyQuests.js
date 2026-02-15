const popupModal = document.getElementById('popupModal');

popupModal.addEventListener('show.bs.modal', event => {
  const button = event.relatedTarget;

  const title = button.getAttribute('data-title');
  const content = button.getAttribute('data-content');

  popupModal.querySelector('.modal-title').textContent =
    title || '';

  popupModal.querySelector('.modal-body').textContent =
    content || 'No reward available.';
});

