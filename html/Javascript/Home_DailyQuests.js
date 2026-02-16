const popupModal = document.getElementById('popupModal');
const claimButtons = document.querySelectorAll('.claim-btn');

// Add click listeners to all claim buttons
claimButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Find the quest-bar-fill element in the parent quest-card
    const questCard = button.closest('.quest-card');
    const questBarFill = questCard.querySelector('.quest-bar-fill');
    const fillWidth = questBarFill.style.width;

    // Only show modal if quest bar fill is at 100%
    if (fillWidth === '100%') {
      const title = button.getAttribute('data-title');
      const content = button.getAttribute('data-content');

      popupModal.querySelector('.modal-title').textContent = title || '';
      popupModal.querySelector('.modal-body').textContent = content || 'No reward available.';

      // Show the modal using Bootstrap
      const modal = new bootstrap.Modal(popupModal);
      modal.show();
    } else {
      alert('Complete the quest first!');
    }
  });
});

