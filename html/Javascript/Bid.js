document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("usernameInput");
  const confirmBidBtn = document.getElementById("confirmBidBtn");
  const pendingBidDisplay = document.getElementById("pendingBidDisplay");
  const bidHistoryList = document.getElementById("bidHistoryList");

  // Read pending bid from localStorage (set by Auction page)
    let tempPrice = Number(localStorage.getItem("pendingBid")) || 0;
    document.getElementById("pendingBidDisplay").textContent = tempPrice;

    confirmBidBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Stop immediate navigation

    const username = usernameInput.value.trim();
    if (!username) {
        alert("Enter your username");
        return;
    }

    try {
        // Send bid to API first
        const res = await fetch("https://YOUR_API_URL_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username, amount: tempPrice })
        });

        const data = await res.json();

        // Save the confirmed bid locally
        localStorage.setItem("latestBidAmount", data.highestBid);
        localStorage.setItem("latestBidUser", data.user);

        // Clear pending bid
        localStorage.removeItem("pendingBid");

        // Redirect to Auction page after successful API call
        window.location.href = confirmBidBtn.href;

    } catch (err) {
        console.error("Bid failed:", err);
        alert("Failed to send bid. Try again.");
    }
    });


  // 3️⃣ Optional: load bid history
  function loadBidHistory() {
    fetch("https://your-api.com/auction/history") // ✅ replace with API
      .then(res => res.json())
      .then(data => {
        bidHistoryList.innerHTML = "";
        data.forEach(bid => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between";
          li.textContent = bid.user;

          const span = document.createElement("span");
          span.textContent = `${bid.amount} Gold`;
          li.appendChild(span);

          bidHistoryList.appendChild(li);
        });
      });
  }

  loadBidHistory();
});
