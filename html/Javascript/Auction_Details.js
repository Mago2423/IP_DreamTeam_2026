document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll('#sectionNav .nav-link');
  const sections = document.querySelectorAll('.content-section');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;

      // Button styles
      buttons.forEach(b => {
        b.classList.remove('active', 'bg-primary', 'text-white');
        b.classList.add('text-secondary');
      });

      btn.classList.add('active', 'bg-primary', 'text-white');
      btn.classList.remove('text-secondary');

      // Section toggle
      sections.forEach(section => {
        section.classList.toggle('d-none', section.id !== target);
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const plusBtn = document.getElementById("plusBtn");
  const minusBtn = document.getElementById("minusBtn");
  const bidBtn = document.getElementById("bidBtn");
  const priceDisplay = document.getElementById("priceDisplay");
  const currentBidText = document.getElementById("currentBidText");

  const step = 10000; // increment/decrement

  // 1️⃣ Load the current highest bid from API on page load
  let basePrice = 150000; // fallback default
  let tempPrice = basePrice;

  fetch("https://your-api.com/auction/current") // ✅ replace with your actual API URL
    .then(res => res.json())
    .then(data => {
      basePrice = data.highestBid;
      tempPrice = basePrice;
      updateDisplay();
      currentBidText.textContent = `${data.highestBid} Gold`;
    })
    .catch(() => {
      // fallback if API fails
      updateDisplay();
      currentBidText.textContent = `${tempPrice} Gold`;
    });

  // 2️⃣ Check if there is a latest confirmed bid in localStorage (from Bid page)
  const latestBidAmount = Number(localStorage.getItem("latestBidAmount"));
  const latestBidUser = localStorage.getItem("latestBidUser");

  if (latestBidAmount && latestBidAmount > basePrice) {
    basePrice = latestBidAmount;
    tempPrice = basePrice;
    updateDisplay();
    currentBidText.textContent = `${latestBidAmount} Gold by ${latestBidUser}`;
  }

  // 3️⃣ Button handlers
  plusBtn.addEventListener("click", () => {
    tempPrice += step;
    updateDisplay();
  });

  minusBtn.addEventListener("click", () => {
    if (tempPrice > basePrice) {
      tempPrice -= step;
      updateDisplay();
    }
  });

  function updateDisplay() {
    priceDisplay.value = `G${tempPrice}`;
  }

  // 4️⃣ Bid button: save pending bid and go to Bid page
  bidBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("pendingBid", tempPrice);
    window.location.href = bidBtn.href;
  });
});
