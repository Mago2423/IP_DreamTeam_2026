document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://cbricgiqjcfkreigcuxk.supabase.co"; 
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicmljZ2lxamNma3JlaWdjdXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzIzNTksImV4cCI6MjA4NjY0ODM1OX0.vWIrfG85DCVKXVjJcxY40nOcmdgXUZDA48eEM-KFntc";

  // Make sure the library loaded
  if (!window.supabase) {
    console.error("Supabase library not loaded. Check the <script src='@supabase/supabase-js@2'> tag.");
    return;
  }

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // Select all posts that should have reviews
  const posts = document.querySelectorAll(".post");

  if (!posts.length) {
    console.warn("No elements found with class .post. Add class='post' to your post containers.");
    return;
  }

  posts.forEach((post) => {
    const postId = post.dataset.postId; // data-post-id="1" -> dataset.postId === "1"
    const form = post.querySelector(".replyForm");
    const replyList = post.querySelector(".replyList");

    // Skip if structure missing (prevents null errors)
    if (!postId || !form || !replyList) {
      console.warn("Skipping a post because it is missing data-post-id, .replyForm, or .replyList", post);
      return;
    }

    // Load Reviews on start
    loadReviews(supabase, postId, replyList);

    // Submit handler
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const usernameEl = form.querySelector('input[name="username"]');
      const messageEl = form.querySelector('textarea[name="message"]');

      const username = usernameEl?.value.trim();
      const message = messageEl?.value.trim();

      if (!username || !message) {
        alert("Please enter username and message!");
        return;
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from("reviews")
        .insert([{ user: username, message: message, post_id: Number(postId) }])
        .select();

      if (error) {
        console.error("Insert error full object:", error);
        alert("Failed to post: " + (error.message || "Unknown error"));
        return;
      }

      console.log("Insert successful:", data);

      form.reset();
      loadReviews(supabase, postId, replyList);
    });
  });
});

// Fetch + render Reviews
async function loadReviews(supabase, postId, replyListContainer) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, user, message, post_id")
    .eq("post_id", Number(postId))
    .order("id", { ascending: true });

  if (error) {
    console.error("Fetch error full object:", error);
    return;
  }

  replyListContainer.innerHTML = "";

  data.forEach((reply) => {
    const div = document.createElement("div");
    div.className = "panel p-3 mb-2";
    div.innerHTML = `<strong>${escapeHtml(reply.user)}</strong><p class="mb-1">${escapeHtml(reply.message)}</p>`;
    replyListContainer.appendChild(div);
  });
}

// Basic HTML escaping (prevents someone injecting HTML into your page)
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll(".vip-rating").forEach(block => {
  const stars = block.querySelectorAll(".vip-star");

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const value = star.dataset.value;

      stars.forEach(s => {
        s.classList.toggle("active", s.dataset.value <= value);
      });

      console.log("VIP rating clicked:", value);
    });
  });
});
