// Read the pending bid from localStorage
let pendingBid = Number(localStorage.getItem("pendingBid")) || 0;
document.getElementById("pendingBidDisplay").textContent = pendingBid;

// Get the elements
const usernameInput = document.getElementById("usernameInput");
const confirmBidBtn = document.getElementById("confirmBidBtn");

// 1️⃣ Read pending bid from localStorage (set by Auction page)
let tempPrice = Number(localStorage.getItem("pendingBid")) || 0;

// 2️⃣ Display pending bid immediately
document.getElementById("pendingBidDisplay").textContent = tempPrice;

// 3️⃣ Confirm bid button
const usernameInput = document.getElementById("usernameInput");
const confirmBidBtn = document.getElementById("confirmBidBtn");

confirmBidBtn.addEventListener("click", (e) => {
  e.preventDefault(); // stop immediate navigation

  const username = usernameInput.value.trim();
  if (!username) {
    alert("Enter your username");
    return;
  }

  // 4️⃣ Save latest bid in localStorage
  localStorage.setItem("latestBidAmount", tempPrice);
  localStorage.setItem("latestBidUser", username);

  // send to API

  fetch("https://cbricgiqjcfkreigcuxk.supabase.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: tempPrice, user: username })
  })
  .then(res => res.json())
  .then(data => {
    // API response can update localStorage if needed
    localStorage.setItem("latestBidAmount", data.highestBid);
    localStorage.setItem("latestBidUser", data.user);
  });

  // 5️⃣ Go back to Auction page
  window.location.href = confirmBidBtn.href;
});

// OPTIONAL: Load bid history from API if available
function loadBidHistory() {
  fetch("https://cbricgiqjcfkreigcuxk.supabase.co")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("bidHistoryList");
      list.innerHTML = "";

      data.forEach(bid => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";
        li.textContent = bid.user;

        const span = document.createElement("span");
        span.textContent = `${bid.amount} Gold`;
        li.appendChild(span);

        list.appendChild(li);
      });
    });
}

// Call on page load if using API
loadBidHistory();
