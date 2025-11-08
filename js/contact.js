// ===================================
// CONTACT PAGE JAVASCRIPT
// ===================================

// DOM Elements
const contactForm = document.getElementById('contactForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const subject = document.getElementById('subject');
const recipeSelectionGroup = document.getElementById('recipeSelectionGroup');
const message = document.getElementById('message');
const consent = document.getElementById('consent');
const characterCount = document.getElementById('character-count');
const currentCount = characterCount.querySelector('.current');
const maxCount = characterCount.querySelector('.max').textContent;
const submissionStatus = document.querySelector('.submission-status');
const sending = document.querySelector('.sending');
const toastContainer = document.getElementById('toastContainer');

// Email Validation Regex
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Show Error Message
function showError(input, message) {
  const formGroup = input.closest('.form-group') || input.closest('.checkbox-group');
  const errorEl = formGroup.querySelector('.error-message');
  errorEl.textContent = message;
  errorEl.classList.add('visible');
  input.classList.add('error');
  input.classList.remove('success');
}

// Show Success State
function showSuccess(input) {
  const formGroup = input.closest('.form-group') || input.closest('.checkbox-group');
  const errorEl = formGroup.querySelector('.error-message');
  const successEl = formGroup.querySelector('.success-message');
  errorEl.classList.remove('visible');
  successEl.classList.add('visible');
  input.classList.add('success');
  input.classList.remove('error');
}

// Clear All Errors
function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.classList.remove('visible');
  });
  document.querySelectorAll('.form-control, .checkbox-group input').forEach(input => {
    input.classList.remove('error', 'success');
  });
  document.querySelectorAll('.success-message').forEach(el => {
    el.classList.remove('visible');
  });
}

// Update Character Counter
function updateCharacterCount() {
  const length = message.value.length;
  currentCount.textContent = length;

  characterCount.classList.remove('warning', 'error');

  if (length > 900) {
    characterCount.classList.add('error');
  } else if (length > 750) {
    characterCount.classList.add('warning');
  }
}

// Show/Hide Related Recipe Field
function toggleRecipeField() {
  if (subject.value === 'recipe-request' || subject.value === 'cooking-question') {
    recipeSelectionGroup.style.display = 'block';
    setTimeout(() => {
      recipeSelectionGroup.style.opacity = '1';
      recipeSelectionGroup.style.transform = 'translateY(0)';
    }, 10);
  } else {
    recipeSelectionGroup.style.opacity = '0';
    recipeSelectionGroup.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      recipeSelectionGroup.style.display = 'none';
    }, 300);
  }
}

// Create Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? 'Check' : 'Warning'}</span>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Reset Form
function resetForm() {
  contactForm.reset();
  clearErrors();
  updateCharacterCount();
  recipeSelectionGroup.style.display = 'none';
  sending.classList.remove('visible');
  submissionStatus.querySelector('button').disabled = false;
}

// Form Submit Handler
async function handleSubmit(e) {
  e.preventDefault();

  // Re-validate on submit
  let isValid = true;
  clearErrors();

  // Name
  if (!firstName.value.trim()) { showError(firstName, 'First name is required'); isValid = false; }
  else showSuccess(firstName);

  if (!lastName.value.trim()) { showError(lastName, 'Last name is required'); isValid = false; }
  else showSuccess(lastName);

  // Email
  if (!email.value.trim()) { showError(email, 'Email is required'); isValid = false; }
  else if (!validateEmail(email.value)) { showError(email, 'Invalid email'); isValid = false; }
  else showSuccess(email);

  // Subject
  if (!subject.value) { showError(subject, 'Select a subject'); isValid = false; }
  else showSuccess(subject);

  // Message
  if (!message.value.trim()) { showError(message, 'Message is required'); isValid = false; }
  else if (message.value.length < 10) { showError(message, 'Too short (min 10 chars)'); isValid = false; }
  else showSuccess(message);

  // Consent
  if (!consent.checked) { showError(consent, 'You must agree'); isValid = false; }
  else showSuccess(consent);

  if (!isValid) return;

  // Show loading
  sending.classList.add('visible');
  contactForm.querySelector('.btn-submit').disabled = true;

  try {
    // Simulate API call (replace with real endpoint)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success
    showToast('Thank you! Your message has been sent. We\'ll reply within 24 hours.', 'success');
    resetForm();
  } catch (error) {
    showToast('Oops! Something went wrong. Please try again.', 'error');
    sending.classList.remove('visible');
    contactForm.querySelector('.btn-submit').disabled = false;
  }
}

// Event Listeners
contactForm.addEventListener('submit', handleSubmit);

[firstName, lastName, email, subject, message].forEach(input => {
  input.addEventListener('blur', () => {
    if (input.value.trim()) {
      if (input === email) {
        validateEmail(input.value) ? showSuccess(input) : showError(input, 'Invalid email');
      } else if (input === message) {
        input.value.length >= 10 ? showSuccess(input) : showError(input, 'Too short');
      } else {
        showSuccess(input);
      }
    }
  });

  input.addEventListener('input', () => {
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.error-message');
    if (errorEl.classList.contains('visible') && input.value.trim()) {
      clearErrors();
    }
  });
});

message.addEventListener('input', updateCharacterCount);
subject.addEventListener('change', toggleRecipeField);
consent.addEventListener('change', () => {
  consent.checked ? showSuccess(consent) : clearErrors();
});

// Initialize
updateCharacterCount();
toggleRecipeField();

// Scroll reveal for .reveal elements (reuse from main.js if needed)
document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
});