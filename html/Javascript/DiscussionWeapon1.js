const SUPABASE_URL = "https://cbricgiqjcfkreigcuxk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicmljZ2lxamNma3JlaWdjdXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzIzNTksImV4cCI6MjA4NjY0ODM1OX0.vWIrfG85DCVKXVjJcxY40nOcmdgXUZDA48eEM-KFntc";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Select all posts
const posts = document.querySelectorAll(".post");

posts.forEach(post => {
  const postId = post.dataset.postId;
  const form = post.querySelector(".replyForm");
  const replyList = post.querySelector(".replyList");

  // Load replies for this post on page load
  loadReplies(postId, replyList);

  // Handle reply form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.querySelector('input[name="username"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    if (!username || !message) {
      alert("Please enter username and message!");
      return;
    }

    console.log(`Posting reply to post ${postId}:`, { username, message });

    const { data, error } = await supabase
      .from("replies")
      .insert([{ user: username, message: message, post_id: postId }])
      .select(); // return the inserted row

    if (error) {
      console.error("Insert error:", error.message);
      alert("Failed to post: " + error.message);
      return;
    }

    console.log("Insert successful:", data);

    form.reset();
    loadReplies(postId, replyList);
  });
});

// Function to load replies for a specific post
async function loadReplies(postId, replyListContainer) {
  const { data, error } = await supabase
    .from("replies")
    .select("*")
    .eq("post_id", postId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Fetch error:", error.message);
    return;
  }

  replyListContainer.innerHTML = "";

  data.forEach(reply => {
    const div = document.createElement("div");
    div.className = "panel p-3 mb-2";
    div.innerHTML = `<strong>${reply.user}</strong><p class="mb-1">${reply.message}</p>`;
    replyListContainer.appendChild(div);
  });
}
