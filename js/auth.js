/* ============================================================
   STACKLY — AUTH JAVASCRIPT
   Handles login, signup, role routing, and logout
   No browser alert() used — all inline UI feedback
   ============================================================ */

(function () {
  'use strict';

  // ── Storage Keys ──
  const STORAGE_ROLE = 'stackly_role';
  const STORAGE_USER = 'stackly_user';
  const STORAGE_AUTH = 'stackly_auth';

  // ── Helpers ──
  function setError(fieldId, msgId, message) {
    const field = document.getElementById(fieldId);
    const msg = document.getElementById(msgId);
    if (field) field.classList.add('error');
    if (msg) { msg.textContent = message; msg.classList.add('visible'); }
  }

  function clearError(fieldId, msgId) {
    const field = document.getElementById(fieldId);
    const msg = document.getElementById(msgId);
    if (field) field.classList.remove('error');
    if (msg) { msg.textContent = ''; msg.classList.remove('visible'); }
  }

  function showSuccess(successId, message) {
    const el = document.getElementById(successId);
    if (el) { el.textContent = message; el.classList.add('visible'); }
  }

  function clearSuccess(successId) {
    const el = document.getElementById(successId);
    if (el) { el.textContent = ''; el.classList.remove('visible'); }
  }

  function validateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email);
  }

  function deriveUserName(email) {
    if (!email) return '';
    var namePart = email.split('@')[0];
    var words = namePart.split(/[\._\-+]/).map(function(w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
    return words.join(' ');
  }

  function getInitials(name) {
    if (!name) return 'EX';
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts[0].length >= 2) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  function updateUserProfileUI() {
    var email = localStorage.getItem(STORAGE_USER);
    var role = localStorage.getItem(STORAGE_ROLE);
    var storedName = localStorage.getItem('stackly_user_name');

    var displayName = storedName || (email ? deriveUserName(email) : (role === 'coach' ? 'Dr. Ava Reyes' : 'James Mercer'));
    var userEmail = email || (role === 'coach' ? 'ava.reyes@gmail.com' : 'james.mercer@gmail.com');
    var initials = getInitials(displayName);

    // Topbar Greeting
    var greetingEl = document.getElementById('topbar-greeting');
    if (greetingEl) {
      var h = new Date().getHours();
      var timeMsg = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
      var subText = role === 'coach' ? ' — your active executive clients await your expertise.' : ' — ready to lead with precision today?';
      greetingEl.textContent = timeMsg + ', ' + displayName + subText;
    }

    // Topbar Avatar & Dropdown Elements
    var topbarAvatar = document.getElementById('topbar-avatar');
    if (topbarAvatar) {
      topbarAvatar.textContent = initials;
      topbarAvatar.title = displayName;
    }

    var topbarName = document.getElementById('topbar-profile-name');
    if (topbarName) {
      topbarName.textContent = displayName;
    }

    var dropdownAvatar = document.getElementById('dropdown-avatar');
    if (dropdownAvatar) dropdownAvatar.textContent = initials;

    var dropdownName = document.getElementById('dropdown-name');
    if (dropdownName) dropdownName.textContent = displayName;

    var dropdownEmail = document.getElementById('dropdown-email');
    if (dropdownEmail) dropdownEmail.textContent = userEmail;

    var dropdownRole = document.getElementById('dropdown-role');
    if (dropdownRole) {
      dropdownRole.textContent = role === 'coach' ? 'Senior Executive Coach' : 'Executive / Client';
    }
  }

  // ── AUTH GUARD (call on dashboard pages) ──
  function requireAuth(requiredRole) {
    const isAuth = localStorage.getItem(STORAGE_AUTH);
    const role = localStorage.getItem(STORAGE_ROLE);
    if (!isAuth || (requiredRole && role !== requiredRole)) {
      window.location.href = 'login.html';
    }
  }

  // ── LOGOUT ──
  function logout() {
    localStorage.removeItem(STORAGE_AUTH);
    localStorage.removeItem(STORAGE_ROLE);
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem('stackly_user_name');
    window.location.href = 'login.html';
  }

  // ── LOGIN FORM ──
  function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    // Clear errors on input
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        clearError('login-email', 'email-error');
        clearSuccess('login-success');
      });
    }
    if (passwordInput) {
      passwordInput.addEventListener('input', function () {
        clearError('login-password', 'password-error');
        clearSuccess('login-success');
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';
      const roleInputs = document.querySelectorAll('input[name="role"]');
      let selectedRole = '';
      roleInputs.forEach(function (r) { if (r.checked) selectedRole = r.value; });

      // Validate email
      if (!email) {
        setError('login-email', 'email-error', 'Please enter your email address.');
        valid = false;
      } else if (!validateEmail(email)) {
        setError('login-email', 'email-error', 'Email address must be in @gmail.com format (e.g., user@gmail.com).');
        valid = false;
      } else {
        clearError('login-email', 'email-error');
      }

      // Validate password
      if (!password) {
        setError('login-password', 'password-error', 'Please enter your password.');
        valid = false;
      } else if (password.length < 6) {
        setError('login-password', 'password-error', 'Password must be at least 6 characters.');
        valid = false;
      } else {
        clearError('login-password', 'password-error');
      }

      // Validate role
      if (!selectedRole) {
        const roleError = document.getElementById('role-error');
        if (roleError) { roleError.textContent = 'Please select your role to continue.'; roleError.classList.add('visible'); }
        valid = false;
      } else {
        const roleError = document.getElementById('role-error');
        if (roleError) { roleError.textContent = ''; roleError.classList.remove('visible'); }
      }

      if (!valid) return;

      // Simulate login success
      const submitBtn = document.getElementById('login-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Signing in…';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        localStorage.setItem(STORAGE_AUTH, '1');
        localStorage.setItem(STORAGE_ROLE, selectedRole);
        localStorage.setItem(STORAGE_USER, email);
        if (!localStorage.getItem('stackly_user_name')) {
          localStorage.setItem('stackly_user_name', deriveUserName(email));
        }

        showSuccess('login-success', 'Login successful. Redirecting to your dashboard…');

        setTimeout(function () {
          if (selectedRole === 'executive') {
            window.location.href = 'dashboard-executive.html';
          } else {
            window.location.href = 'dashboard-coach.html';
          }
        }, 1200);
      }, 800);
    });
  }

  // ── SIGNUP FORM ──
  function initSignup() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    const fields = ['signup-name', 'signup-email', 'signup-password', 'signup-confirm'];
    fields.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () {
          clearError(id, id + '-error');
          clearSuccess('signup-success');
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('signup-name') ? document.getElementById('signup-name').value.trim() : '';
      const email = document.getElementById('signup-email') ? document.getElementById('signup-email').value.trim() : '';
      const password = document.getElementById('signup-password') ? document.getElementById('signup-password').value : '';
      const confirm = document.getElementById('signup-confirm') ? document.getElementById('signup-confirm').value : '';
      const termsChecked = document.getElementById('signup-terms') ? document.getElementById('signup-terms').checked : false;

      if (!name || name.length < 2) {
        setError('signup-name', 'signup-name-error', 'Please enter your full name.');
        valid = false;
      } else { clearError('signup-name', 'signup-name-error'); }

      if (!email) {
        setError('signup-email', 'signup-email-error', 'Please enter your email address.');
        valid = false;
      } else if (!validateEmail(email)) {
        setError('signup-email', 'signup-email-error', 'Email address must be in @gmail.com format (e.g., user@gmail.com).');
        valid = false;
      } else { clearError('signup-email', 'signup-email-error'); }

      if (!password || password.length < 8) {
        setError('signup-password', 'signup-password-error', 'Password must be at least 8 characters.');
        valid = false;
      } else { clearError('signup-password', 'signup-password-error'); }

      if (password !== confirm) {
        setError('signup-confirm', 'signup-confirm-error', 'Passwords do not match.');
        valid = false;
      } else { clearError('signup-confirm', 'signup-confirm-error'); }

      if (!termsChecked) {
        const termsError = document.getElementById('terms-error');
        if (termsError) { termsError.textContent = 'Please accept the terms to continue.'; termsError.classList.add('visible'); }
        valid = false;
      } else {
        const termsError = document.getElementById('terms-error');
        if (termsError) { termsError.textContent = ''; termsError.classList.remove('visible'); }
      }

      if (!valid) return;

      const submitBtn = document.getElementById('signup-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Creating account…';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        showSuccess('signup-success', 'Account created successfully. Redirecting to login…');
        setTimeout(function () {
          window.location.href = 'login.html';
        }, 1500);
      }, 1000);
    });
  }

  // ── LOGOUT BUTTONS ──
  function initLogout() {
    const logoutBtns = document.querySelectorAll('[data-logout]');
    logoutBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        logout();
      });
    });
  }

  // ── NEWSLETTER FORMS ──
  function initNewsletterForms() {
    var forms = document.querySelectorAll('.newsletter-form, .newsletter-form-row, #insights-newsletter-form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');

        if (input && !validateEmail(input.value.trim())) {
          input.style.borderColor = '#e05252';
          return;
        }
        if (input) input.style.borderColor = '';

        window.location.href = '404.html';
      });
    });
  }

  // ── CONTACT FORM ──
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const msgEl = document.getElementById('contact-message');

    function setFieldError(fieldEl, errorElId, message) {
      if (fieldEl) fieldEl.classList.add('error');
      const errEl = document.getElementById(errorElId);
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('visible');
      }
    }

    function clearFieldError(fieldEl, errorElId) {
      if (fieldEl) fieldEl.classList.remove('error');
      const errEl = document.getElementById(errorElId);
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('visible');
      }
    }

    // Auto-clear error state when user types
    if (nameEl) {
      nameEl.addEventListener('input', function () {
        clearFieldError(nameEl, 'contact-name-error');
      });
    }
    if (emailEl) {
      emailEl.addEventListener('input', function () {
        clearFieldError(emailEl, 'contact-email-error');
      });
    }
    if (msgEl) {
      msgEl.addEventListener('input', function () {
        clearFieldError(msgEl, 'contact-message-error');
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const nameVal = nameEl ? nameEl.value.trim() : '';
      const emailVal = emailEl ? emailEl.value.trim() : '';
      const msgVal = msgEl ? msgEl.value.trim() : '';

      // Validate Full Name
      if (!nameVal) {
        setFieldError(nameEl, 'contact-name-error', 'Please enter your full name.');
        valid = false;
      } else {
        clearFieldError(nameEl, 'contact-name-error');
      }

      // Validate Business Email (accept any standard email format)
      const standardEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !standardEmailRegex.test(emailVal)) {
        setFieldError(emailEl, 'contact-email-error', 'Please enter a valid business email address.');
        valid = false;
      } else {
        clearFieldError(emailEl, 'contact-email-error');
      }

      // Validate Leadership Context
      if (!msgVal || msgVal.length < 10) {
        setFieldError(msgEl, 'contact-message-error', 'Please describe your leadership context (at least 10 characters).');
        valid = false;
      } else {
        clearFieldError(msgEl, 'contact-message-error');
      }

      // Stop submission if any required field is invalid
      if (!valid) return;

      const submitBtn = document.getElementById('contact-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Sending Enquiry…';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        window.location.href = '404.html';
      }, 300);
    });
  }

  // ── INIT ──
  document.addEventListener('DOMContentLoaded', function () {
    initLogin();
    initSignup();
    initLogout();
    initNewsletterForms();
    initContactForm();

    // Auth guard & User profile update for dashboard pages
    if (document.body.classList.contains('dashboard-exec')) {
      requireAuth('executive');
      updateUserProfileUI();
    }
    if (document.body.classList.contains('dashboard-coach')) {
      requireAuth('coach');
      updateUserProfileUI();
    }
  });

  // Expose logout globally for inline usage
  window.stacklyLogout = logout;

})();
