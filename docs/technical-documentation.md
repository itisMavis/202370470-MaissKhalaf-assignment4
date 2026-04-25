# Technical Documentation

## Overview

This project is a static, responsive portfolio website built using HTML, CSS, and JavaScript. This version introduces polished academic and professional content, GitHub API integration, dynamic content updates, project filtering and sorting, application state management, and enhanced user interaction features. 

## Structure

1) `index.html` contains the overall layout and content of the website, including sections for About, Education, Experience, Projects, Achievements, GitHub Repositories, and Contact.  
2) `css/styles.css` manages typography, spacing, layout structure, responsive behavior, and visual styling.  
3) `js/script.js` implements all interactive features, including greeting updates, animated highlight cards, filtering logic, GitHub data loading, scroll-based animations, and theme state management.  
4) `assets/images/` stores images used throughout the website, including placeholder images for projects.  

## Responsive Design Implementation

The layout uses a combination of CSS Grid and Flexbox:

- Grid is used for structuring larger sections.  
- Flexbox is used for alignment and spacing within components.  
- Media queries are used to adjust layout and spacing across smaller screen sizes, ensuring compatibility on mobile and tablet devices.  

## JavaScript Functionality

### 1. Personalized Greeting
- Uses `Date().getHours()` to determine the appropriate greeting.  
- Updates dynamically based on user input.  
- Combines time-based logic with user interaction.  

### 2. GitHub API Integration
- Fetches public repositories dynamically using `fetch` and `async/await`.  
- Displays repository data such as name, description, and update time.  
- Allows sorting (e.g., newest or oldest) using JavaScript logic.  
- Handles loading and error states to ensure smooth user experience.  

### 3. Animated Highlight Cards
- Uses `IntersectionObserver` to trigger animations when elements enter the viewport.  
- Displays animated portfolio highlights such as projects built, technologies used, and development hours.
- Respects reduced motion preferences by disabling animation when necessary.  

### 4. Project Filtering and Sorting
- Filters projects based on categories (e.g., beginner, advanced).  
- Uses conditional logic to show or hide elements dynamically.  
- Sorting logic reorders content based on selected criteria.  

### 5. State Management
- Implements dark/light mode toggle.  
- Stores user preference using `localStorage`.  
- Applies the saved theme automatically on page load.  

### 6. Contact Form (Formspree Integration)
- Uses Formspree to enable real message submission without a backend server.  
- Submits form data asynchronously using `fetch`.  
- Prevents page reload using `event.preventDefault()`.  
- Displays success or error messages based on submission result.  

### 7. Navigation Enhancements
- Includes a back-to-top button that allows users to quickly return to the top of the page.  
- Uses smooth scrolling for improved user experience.  

## Form Implementation

The contact form includes:
- Name field  
- Email field  
- Message field  

Basic HTML validation ensures required fields are filled. Additional JavaScript validation checks for proper email format and prevents submission if invalid. A confirmation or error message is displayed to guide the user.

## Design Considerations

- Clean typography was selected to maintain readability.  
- Spacing and alignment were structured to create a balanced layout.  
- Hover effects and transitions were kept subtle to improve user experience without distraction.  
- Education and Experience sections were styled to match the existing glass-card visual language for consistency.  

## Testing & Compatibility

The website was tested using browser developer tools to simulate different screen sizes and ensure responsiveness across devices.

Performance was evaluated using Chrome Lighthouse, where the website achieved a score of 100. This confirms that the application is efficient, loads quickly, and follows best practices for performance optimization.

Basic optimizations were applied, including keeping resources lightweight, minimizing unnecessary code, and using efficient JavaScript and CSS structures.