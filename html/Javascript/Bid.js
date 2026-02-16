document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("usernameInput");
  const confirmBidBtn = document.getElementById("confirmBidBtn");
  const pendingBidDisplay = document.getElementById("pendingBidDisplay");
  const bidHistoryList = document.getElementById("bidHistoryList");

  // ✅ CHANGE THIS if needed
  const MIN_INCREMENT = 10000;

  const TABLE_NAME = (confirmBidBtn?.dataset?.table || "bids").trim();

  // Pending bid from Auction page
  const tempPrice = Number(localStorage.getItem("pendingBid")) || 0;
  pendingBidDisplay.textContent = tempPrice;

  // Helper: get current highest bid from DB
  async function getHighestBid() {
    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select("amount,user")
      .order("amount", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { amount: 0, user: null };
    }

    return { amount: Number(data[0].amount) || 0, user: data[0].user || null };
  }

  // Confirm bid
  confirmBidBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    if (!username) {
      alert("Enter your username");
      return;
    }

    if (!Number.isFinite(tempPrice) || tempPrice <= 0) {
      alert("Invalid bid amount.");
      return;
    }

    // Disable button to prevent double clicks
    confirmBidBtn.disabled = true;
    confirmBidBtn.textContent = "Submitting...";

    try {
      // ✅ Client-side min increment check (better UX)
      const highest = await getHighestBid();
      const minAllowed = highest.amount + MIN_INCREMENT;

      if (tempPrice < minAllowed) {
        alert(`Bid must be at least ${minAllowed} Gold (current highest is ${highest.amount}).`);
        return;
      }

      // ✅ Insert bid
      const { error } = await supabaseClient
        .from(TABLE_NAME)
        .insert([{ user: username, amount: tempPrice }]);

      if (error) {
        console.error(error);

        // If your DB policy blocks it, show a human message
        if (String(error.message || "").toLowerCase().includes("row-level security")) {
          alert(`Bid rejected. Minimum bid is ${minAllowed} Gold.`);
        } else {
          alert("Insert failed: " + error.message);
        }
        return;
      }

      // Save latest bid locally for UI (optional)
      localStorage.setItem("latestBidAmount", String(tempPrice));
      localStorage.setItem("latestBidUser", username);
      localStorage.removeItem("pendingBid");

      // Redirect after success
      if (TABLE_NAME=="bid") {
        window.location.href = "../Auction/Auction.html";
      }
      else if (TABLE_NAME=="bid2") {
        window.location.href = "../Auction/Auction2.html";
      }
      else {
        window.location.href = "../Auction/Auction3.html";
      }
      
    } catch (err) {
      console.error(err);
      alert("Failed to send bid. Check console for details.");
    } finally {
      // Re-enable button if we didn’t redirect
      confirmBidBtn.disabled = false;
      confirmBidBtn.textContent = "Confirm Bid";
    }
  });

  // Load bid history
  async function loadBidHistory() {
    try {
      const { data, error } = await supabaseClient
        .from(TABLE_NAME)
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

  loadBidHistory();
});
