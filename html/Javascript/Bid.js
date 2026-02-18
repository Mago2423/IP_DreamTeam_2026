// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // ===== DOM Element References =====
  const usernameInput = document.getElementById("usernameInput"); // Input field for user's bidder name
  const confirmBidBtn = document.getElementById("confirmBidBtn"); // Submit bid button
  const pendingBidDisplay = document.getElementById("pendingBidDisplay"); // Display pending bid amount
  const bidHistoryList = document.getElementById("bidHistoryList"); // List container for bid history

  // ===== Configuration =====
  // Minimum gold increment required between bids
  const MIN_INCREMENT = 10000;

  // Get the database table name from button's data attribute (bid, bid2, or bid3)
  const TABLE_NAME = (confirmBidBtn?.dataset?.table || "bids").trim();

  // ===== Load Pending Bid from Storage =====
  // Retrieve the bid amount passed from the Auction page via localStorage
  const tempPrice = Number(localStorage.getItem("pendingBid")) || 0;
  // Display the pending bid amount on the page
  pendingBidDisplay.textContent = tempPrice;

  // ===== Fetch Highest Bid from Database =====
  // Query Supabase to get the current highest bid to validate against
  async function getHighestBid() {
    // Query the table, sort by amount descending, get only the top 1 result
    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select("amount,user")
      .order("amount", { ascending: false })
      .limit(1);

    // Handle database errors
    if (error) throw error;

    // Return empty bid if no bids exist yet
    if (!data || data.length === 0) {
      return { amount: 0, user: null };
    }

    // Return the highest bid info
    return { amount: Number(data[0].amount) || 0, user: data[0].user || null };
  }

  // ===== Confirm Bid Button Click Handler =====
  // Submit the bid to the database when user clicks confirm
  confirmBidBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // ===== Input Validation =====
    // Get and trim the username input
    const username = usernameInput.value.trim();
    // Check that username is not empty
    if (!username) {
      alert("Enter your username");
      return;
    }

    // Validate that bid amount is a valid positive number
    if (!Number.isFinite(tempPrice) || tempPrice <= 0) {
      alert("Invalid bid amount.");
      return;
    }

    // ===== Prevent Double-Click Submission =====
    // Disable button and show submitting state to prevent duplicate bids
    confirmBidBtn.disabled = true;
    confirmBidBtn.textContent = "Submitting...";

    try {
      // ===== Server-side Validation: Check Bid Increment =====
      // Get the current highest bid from database
      const highest = await getHighestBid();
      // Calculate minimum allowed bid (highest + MIN_INCREMENT)
      const minAllowed = highest.amount + MIN_INCREMENT;

      // Reject bid if it doesn't meet minimum increment requirement
      if (tempPrice < minAllowed) {
        alert(`Bid must be at least ${minAllowed} Gold (current highest is ${highest.amount}).`);
        return;
      }

      // ===== Insert New Bid into Database =====
      // Create and insert the new bid record
      const { error } = await supabaseClient
        .from(TABLE_NAME)
        .insert([{ user: username, amount: tempPrice }]);

      // ===== Handle Database Error =====
      if (error) {
        console.error(error);

        // Check if error is due to row-level security policy violation
        if (String(error.message || "").toLowerCase().includes("row-level security")) {
          alert(`Bid rejected. Minimum bid is ${minAllowed} Gold.`);
        } else {
          alert("Insert failed: " + error.message);
        }
        return;
      }

      // ===== Save Bid to Local Storage =====
      // Store the bid info locally for UI updates (optional)
      localStorage.setItem("latestBidAmount", String(tempPrice));
      localStorage.setItem("latestBidUser", username);
      // Clear pending bid since it's now submitted
      localStorage.removeItem("pendingBid");

      // ===== Redirect to Appropriate Auction Page =====
      // Navigate back to the correct auction page based on which table was used
      if (TABLE_NAME=="bids") {
        window.location.href = "../Auction/Auction.html";
      }
      else if (TABLE_NAME=="bids2") {
        window.location.href = "../Auction/Auction2.html";
      }
      else {TABLE_NAME=="bids3"
        window.location.href = "../Auction/Auction3.html";
      }
      
    } catch (err) {
      // ===== Error Handling =====
      // Handle any unexpected errors during bid submission
      console.error(err);
      alert("Failed to send bid. Check console for details.");
    } finally {
      // ===== Reset Button State =====
      // Re-enable button if submission didn't redirect
      confirmBidBtn.disabled = false;
      confirmBidBtn.textContent = "Confirm Bid";
    }
  });

  // ===== Load and Display Bid History =====
  // Fetch the 10 highest bids from the database and display them in the history list
  async function loadBidHistory() {
    try {
      // ===== Query Bid History from Database =====
      // Fetch all bids, sorted by highest amount first, limited to 10 results
      const { data, error } = await supabaseClient
        .from(TABLE_NAME)
        .select("*")
        .order("amount", { ascending: false })
        .limit(10);

      // Handle database errors
      if (error) throw error;

      // ===== Clear Existing History =====
      // Remove previous history items to refresh the list
      bidHistoryList.innerHTML = "";
      
      // ===== Render Bid History Items =====
      // Loop through each bid and create list items for display
      data.forEach((bid) => {
        // Create a new list item element
        const li = document.createElement("li");
        // list-group-item: Bootstrap styling for list items | d-flex: Flexbox | justify-content-between: Space items apart
        li.className = "list-group-item d-flex justify-content-between";
        // Display bidder username
        li.textContent = bid.user;

        // Create a span element for the bid amount
        const span = document.createElement("span");
        // Display the amount with 'Gold' suffix
        span.textContent = `${bid.amount} Gold`;
        // Add the amount span to the list item
        li.appendChild(span);

        // Add the list item to the bid history list
        bidHistoryList.appendChild(li);
      });
    } catch (err) {
      // Handle errors when loading bid history
      console.error("Failed to load bid history:", err);
    }
  }

  // ===== Initialize Page =====
  // Load bid history when page first loads
});
