// Tab switching (used on service pages with tabbed content)
function switchTab(idx) {
  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', i===idx));
  document.querySelectorAll('.tab-panel').forEach((p,i) => p.classList.toggle('active', i===idx));
}

// Modal
function openModal(serviceName) {
  const modal = document.getElementById('contactModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Pre-select a service in the dropdown if a page passes one in
  if (serviceName) {
    const select = document.getElementById('cf-service');
    if (select) {
      for (const opt of select.options) {
        if (opt.value === serviceName || opt.textContent.trim() === serviceName) {
          select.value = opt.value;
          break;
        }
      }
    }
  }
}

function closeModal() {
  const modal = document.getElementById('contactModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

const modal = document.getElementById('contactModal');
if (modal) {
  modal.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// ── Contact form validation ──
// Client-side validation only. This site has no backend wired up yet -
// connect the form's "action" to your processing endpoint and re-validate
// everything server-side before storing or emailing data.
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('cf-name'), msg: 'Please enter your name (min 2 characters).' },
    email: { el: document.getElementById('cf-email'), msg: 'Please enter a valid email address.' },
    phone: { el: document.getElementById('cf-phone'), msg: 'Please enter a valid phone number.' },
    message: { el: document.getElementById('cf-message'), msg: 'Please enter a short message (min 10 characters).' }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]{7,15}$/;

  function showError(group, show) {
    const wrapper = group.el.closest('.form-group');
    if (wrapper) wrapper.classList.toggle('has-error', show);
  }

  function validateField(key) {
    const f = fields[key];
    if (!f || !f.el) return true;
    const val = f.el.value.trim();
    let valid = true;

    if (key === 'name') valid = val.length >= 2;
    if (key === 'email') valid = emailRegex.test(val);
    if (key === 'phone') valid = val === '' || phoneRegex.test(val); // phone optional
    if (key === 'message') valid = val.length >= 10;

    showError(f, !valid);
    return valid;
  }

  Object.keys(fields).forEach((key) => {
    const f = fields[key];
    if (f.el) f.el.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach((key) => {
      if (!validateField(key)) allValid = false;
    });
    if (!allValid) return;

    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // TODO: replace this with a real fetch() call to your backend/CRM endpoint.
    // Never put API keys or credentials directly in this file -
    // submit to your own server endpoint, which then talks to the CRM/email API.
    setTimeout(() => {
      form.style.display = 'none';
      const success = document.getElementById('contactSuccess');
      if (success) success.classList.add('show');
    }, 600);
  });
})();

// Scroll fade-up
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.boxShadow =
      window.scrollY > 10
        ? '0 2px 30px rgba(0,0,0,0.4)'
        : '0 2px 20px rgba(0,0,0,0.3)';
  }
});