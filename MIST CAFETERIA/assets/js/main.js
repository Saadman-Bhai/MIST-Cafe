// assets/js/main.js

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
  const currentYear = new Date().getFullYear();
  const yearElements = document.querySelectorAll('#year');
  yearElements.forEach(el => el.textContent = currentYear);
});

// Helper function to show error messages
function showError(fieldId, message) {
  const errorElement = document.querySelector(`.error[data-for="${fieldId}"]`);
  const inputElement = document.getElementById(fieldId);
  
  if (errorElement) {
    errorElement.textContent = message;
  }
  
  if (inputElement) {
    inputElement.classList.add('error-border');
  }
}

// Helper function to clear error messages
function clearError(fieldId) {
  const errorElement = document.querySelector(`.error[data-for="${fieldId}"]`);
  const inputElement = document.getElementById(fieldId);
  
  if (errorElement) {
    errorElement.textContent = '';
  }
  
  if (inputElement) {
    inputElement.classList.remove('error-border');
  }
}

// Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
