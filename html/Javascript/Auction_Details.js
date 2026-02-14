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

const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const bidBtn = document.getElementById("bidBtn");
const priceDisplay = document.getElementById("priceDisplay");

const step = 10000; // price increment

// 1️⃣ Load base price: either from API, or fallback to localStorage, or default
let basePrice = Number(localStorage.getItem("price")) || 150000;

// 2️⃣ If coming back from Bid page, check latest confirmed bid
const latestBidAmount = Number(localStorage.getItem("latestBidAmount"));
const latestBidUser = localStorage.getItem("latestBidUser");

if (latestBidAmount && latestBidAmount > basePrice) {
  basePrice = latestBidAmount; // update base price
  localStorage.setItem("price", basePrice); // store as new base
}

// 3️⃣ tempPrice starts at basePrice
let tempPrice = basePrice;

// 4️⃣ show immediately
priceDisplay.value = `G${tempPrice}`;

// Handle + button
plusBtn.addEventListener("click", () => {
  tempPrice += step;
  updateDisplay();
});

// Handle − button
minusBtn.addEventListener("click", () => {
  if (tempPrice > basePrice) {
    tempPrice -= step;
    updateDisplay();
  }
});

// Update input display
function updateDisplay() {
  priceDisplay.value = `G${tempPrice}`;
}

// Bid button: save pending bid and navigate
bidBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("pendingBid", tempPrice); // save temp bid
  window.location.href = bidBtn.href;            // go to Bid page
});

// Display latest confirmed bid and user
const currentBidText = document.getElementById("currentBidText");
if (latestBidAmount && latestBidUser) {
  currentBidText.textContent = `${latestBidAmount} Gold by ${latestBidUser}`;
} else {
  currentBidText.textContent = `${basePrice} Gold`;
}

// fetch from API to get real highest bid

fetch("https://cbricgiqjcfkreigcuxk.supabase.co")
  .then(res => res.json())
  .then(data => {
    basePrice = data.highestBid;
    tempPrice = basePrice;
    updateDisplay();
    currentBidText.textContent = `${data.highestBid} Gold`;
  });

