# IP_DreamTeam_2026


Celestial Forge

Celestial Forge is a web-based interactive platform that allows users to participate in community discussions and interactive features such as posting messages, viewing reply history, and engaging with dynamic data stored in a backend database.

The project focuses on combining a clean user interface with real-time data handling using a modern backend service. It demonstrates how frontend technologies work together with APIs to create a functional, user-driven website. This project is designed both as a learning experience and as a foundation for more advanced web features in the future.

Design Process
Target Audience

This website is designed for users who want a simple, interactive platform where they can:

Submit messages or replies

View message history in real time

Interact with shared data stored securely online

The interface is intentionally minimal and intuitive so that first-time users can understand how to use the site without instructions.

User Goals

Easily submit a username and message

See previously posted messages without refreshing the page

Interact with dynamic content stored in a database

Use the website across different screen sizes and browsers

Why This Project Works

Celestial Forge meets these goals by:

Using clear UI elements and layout structure

Connecting directly to a backend API for data storage and retrieval

Updating content dynamically using JavaScript

Enforcing data rules and security through backend policies

User Stories

As a visitor, I want to enter a username so that my messages are identifiable.

As a user, I want to submit a message so that I can participate in the discussion.

As a user, I want to see previous replies so that I understand the conversation history.

As a user, I want the interface to work on both desktop and mobile devices.

Wireframes / Mockups

Wireframes were designed before development to plan layout and user flow.

Adobe XD wireframes are included in a separate folder in the project directory (or via shared XD link if applicable).

Features
Existing Features

Username Input – allows users to identify themselves before posting.

Message Submission Form – allows users to send messages to the database.

Replies History Panel – displays previously submitted messages from the API.

Dynamic Updates – content updates without page reloads using JavaScript.

Backend Validation – database rules ensure valid data is stored.

Features Left to Implement

User authentication (login/logout)

Message editing and deletion

Pagination or load-more for long message histories

User profile pages

Real-time updates using subscriptions

Technologies Used

HTML5
Used to structure the content of the website.

CSS3 / Bootstrap 5
Used for layout, styling, responsiveness, and UI components.

JavaScript (Vanilla JS)
Used to handle user interactions, API calls, and dynamic DOM updates.

Supabase
Used as the backend service to store data, manage APIs, and enforce Row Level Security policies.

Git & GitHub
Used for version control and project management.

Assistive AI

AI tools were used during the development of this project to assist with debugging, learning, and feature implementation.

ChatGPT
ChatGPT was used to:

Debug JavaScript issues related to API calls

Help integrate Supabase with frontend JavaScript

Explain Row Level Security (RLS) errors and fixes

Refactor and improve existing code structure
Screenshots of AI-generated code and explanations are included as evidence.

(Other AI tools were not used unless explicitly stated.)

Testing
Manual Testing Scenarios

Message Submission Form

Navigate to the main page

Try submitting the form with empty inputs
→ Verify that submission fails or shows an error

Enter a username but no message
→ Verify that submission is blocked

Enter both username and message
→ Verify that the message appears in the replies history

Replies History

Refresh the page and verify that previous messages load correctly

Confirm messages are retrieved from the database

Browser & Screen Testing

Tested on Chrome and Edge

Tested on desktop and smaller screen sizes using browser dev tools

Layout remains usable and readable on different screen widths

Known Bugs / Issues

Occasional styling inconsistencies depending on screen size

Error handling messages could be improved for better user feedback

Credits
Content

All written content was created by the developer unless otherwise stated.

Media

No external images were used, or images were self-created / royalty-free.

Acknowledgements

Inspiration for this project came from learning modern full-stack web development concepts.

Special thanks to online documentation and learning resources for Supabase and Bootstrap.

Assistance and guidance provided by ChatGPT during development and debugging.



github:https://github.com/Mago2423/CelestialForge
