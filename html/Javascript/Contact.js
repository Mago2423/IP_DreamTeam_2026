// Initialize contact form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // This script handles the contact form submission and validation
  
  const contactForm = document.getElementById("contactForm");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  // Form submission handler - validates and processes user input
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop the form from reloading the page

    // Get the form values and trim whitespace
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Validate that all fields are filled out
    if (!email || !subject || !message) {
      alert("Please fill in all fields");
      return;
    }

    // Validate email format using regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // If you have a backend service to send emails, use this:
    // Otherwise, you can save to localStorage, Firebase, or another service
    
    try {
      // Option 1: Save to localStorage (for demonstration)
      const messages = JSON.parse(localStorage.getItem("contactMessages")) || [];
      messages.push({
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toLocaleString()
      });
      localStorage.setItem("contactMessages", JSON.stringify(messages));

      // Show success message
      alert("Message sent successfully! Thank you for contacting us.");
      
      // Clear the form fields
      contactForm.reset();

      // Optional: Redirect to home page after a delay
      // setTimeout(() => {
      //   window.location.href = "../../index.html";
      // }, 2000);

    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again.");
    }
  });
});
