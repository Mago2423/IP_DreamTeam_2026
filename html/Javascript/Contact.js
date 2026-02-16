// ===== CONTACT FORM INITIALIZATION =====
// Initialize contact form when the DOM has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get references to form elements for validation and submission handling
  const contactForm = document.getElementById("contactForm");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  // ===== FORM SUBMISSION HANDLER =====
  // Listen for form submission and validate user input before processing
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission and page reload

    // ===== GET AND VALIDATE INPUT =====
    // Retrieve form values and remove leading/trailing whitespace
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Check that all required fields have been filled out
    if (!email || !subject || !message) {
      alert("Please fill in all fields");
      return;
    }

    // ===== EMAIL FORMAT VALIDATION =====
    // Verify email follows standard format using regex pattern matching
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // ===== SAVE MESSAGE =====
    // Store form data in browser's localStorage for future retrieval
    try {
      // Retrieve existing messages from localStorage or create empty array
      const messages = JSON.parse(localStorage.getItem("contactMessages")) || [];
      
      // Add new message object with timestamp
      messages.push({
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toLocaleString()
      });
      
      // Save updated messages array back to localStorage
      localStorage.setItem("contactMessages", JSON.stringify(messages));

      // Show success confirmation to user
      alert("Message sent successfully! Thank you for contacting us.");
      
      // Clear all form fields after successful submission
      contactForm.reset();

      // Optional: Uncomment to redirect to home page after 2 seconds
      // setTimeout(() => {
      //   window.location.href = "../../index.html";
      // }, 2000);

    } catch (error) {
      // Log error to console for debugging purposes
      console.error("Error sending message:", error);
      // Display error message to user
      alert("There was an error sending your message. Please try again.");
    }
  });
});
