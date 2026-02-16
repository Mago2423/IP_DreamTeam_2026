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
  const bidHistoryList = document.getElementById("bidHistoryList");

  // ✅ CHANGE THIS if needed
  const MIN_INCREMENT = 10000;

  const step = MIN_INCREMENT;
  let basePrice = 150000; // fallback if DB empty
  let tempPrice = basePrice;

  function updateDisplay() {
    priceDisplay.value = `G${tempPrice+MIN_INCREMENT}`;
  }

  async function fetchCurrentHighestBid() {
    try {
      const { data, error } = await supabaseClient
        .from("bids3")
        .select("amount,user")
        .order("amount", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        basePrice = Number(data[0].amount) || basePrice;

        // If tempPrice is behind, snap it up to basePrice (so user can't bid lower)
        if (tempPrice < basePrice) tempPrice = basePrice;

        currentBidText.textContent = `${basePrice} Gold by ${data[0].user}`;
      } else {
        currentBidText.textContent = `${basePrice} Gold`;
      }

      updateDisplay();
    } catch (err) {
      console.error("Failed to fetch current bid:", err);
      currentBidText.textContent = `${basePrice} Gold`;
      updateDisplay();
    }
  }

  async function loadBidHistory() {
    try {
      const { data, error } = await supabaseClient
        .from("bids3")
        .select("*")
        .order("amount", { ascending: false })
        .limit(10);

      if (error) throw error;

      bidHistoryList.innerHTML = "";
      data.forEach((bid) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";
        li.textContent = bid.user;

        const span = document.createElement("span");
        span.textContent = `${bid.amount} Gold`;
        li.appendChild(span);

        bidHistoryList.appendChild(li);
      });
    } catch (err) {
      console.error("Failed to load bid history:", err);
    }
  }

  // Buttons
  plusBtn.addEventListener("click", () => {
    // If user hasn't started, jump to minimum valid bid (base + increment)
    if (tempPrice < basePrice + step) tempPrice = basePrice + step;
    else tempPrice += step;

    updateDisplay();
  });

  minusBtn.addEventListener("click", () => {
    // Never allow below the minimum valid bid once user starts raising
    const minTemp = basePrice; // display can sit at basePrice until they press +
    if (tempPrice > minTemp) {
      tempPrice -= step;
      if (tempPrice < minTemp) tempPrice = minTemp;
      updateDisplay();
    }
  });

  // Bid button → store pending bid and go to Bid page
  bidBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // If user never pressed +, they’d be bidding basePrice (invalid). Force minimum valid.
    const minAllowed = basePrice + step;
    const bidToSend = tempPrice < minAllowed ? minAllowed : tempPrice;

    localStorage.setItem("pendingBid", String(bidToSend));
    window.location.href = bidBtn.href;
  });

  // Init + refresh
  fetchCurrentHighestBid();
  loadBidHistory();

  setInterval(() => {
    fetchCurrentHighestBid();
    loadBidHistory();
  }, 5000);
});
