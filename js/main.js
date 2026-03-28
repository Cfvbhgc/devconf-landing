/* ========== COUNTDOWN TIMER ========== */
(function initCountdown() {
  const target = new Date('2025-12-15T10:00:00').getTime();

  function update() {
    const now = Date.now();
    let diff = target - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

/* ========== SPLIT TEXT ANIMATION ========== */
function splitTextIntoChars(el) {
  const text = el.textContent;
  el.textContent = '';
  text.split('').forEach(function(char) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    el.appendChild(span);
  });
}

document.querySelectorAll('.split-text').forEach(function(el) {
  splitTextIntoChars(el);
});

/* ========== GSAP + SCROLLTRIGGER ========== */
gsap.registerPlugin(ScrollTrigger);

// Hero tagline — letter by letter
document.querySelectorAll('.hero__tagline .char').forEach(function(char, i) {
  gsap.to(char, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    delay: 0.5 + i * 0.03,
    ease: 'power2.out'
  });
});

// Section titles — letter by letter on scroll
document.querySelectorAll('.section-title').forEach(function(title) {
  const chars = title.querySelectorAll('.char');
  gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.3,
    stagger: 0.03,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: title,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });
});

// Speaker cards — fade in staggered
gsap.utils.toArray('.speaker-card').forEach(function(card, i) {
  gsap.from(card, {
    opacity: 0,
    y: 60,
    duration: 0.6,
    delay: i * 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 88%',
      toggleActions: 'play none none none'
    }
  });
});

// Schedule items — animated appearance
function animateScheduleItems() {
  const activeDay = document.querySelector('.schedule__day.active');
  if (!activeDay) return;
  const items = activeDay.querySelectorAll('.schedule__item');
  items.forEach(function(item, i) {
    item.classList.remove('visible');
    setTimeout(function() {
      item.classList.add('visible');
    }, 100 + i * 80);
  });
}

// Initial animation for schedule
ScrollTrigger.create({
  trigger: '.schedule',
  start: 'top 80%',
  onEnter: animateScheduleItems,
  once: true
});

// Registration section fade in
gsap.from('.reg-wizard', {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.registration',
    start: 'top 80%',
    toggleActions: 'play none none none'
  }
});

/* ========== 3D TILT EFFECT ========== */
document.querySelectorAll('[data-tilt]').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
  });

  card.addEventListener('mouseleave', function() {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  });
});

/* ========== SCHEDULE TABS ========== */
document.querySelectorAll('.schedule__tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.schedule__tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.schedule__day').forEach(function(d) { d.classList.remove('active'); });

    tab.classList.add('active');
    var dayNum = tab.getAttribute('data-day');
    document.getElementById('day-' + dayNum).classList.add('active');
    animateScheduleItems();
  });
});

/* ========== REGISTRATION WIZARD ========== */
(function initRegWizard() {
  var currentStep = 1;
  var form = document.getElementById('reg-form');

  var ticketLabels = {
    standard: 'Standard',
    vip: 'VIP',
    online: 'Online'
  };

  var ticketPrices = {
    standard: '5 000 \u20BD',
    vip: '15 000 \u20BD',
    online: '2 000 \u20BD'
  };

  function goToStep(step) {
    // Update step indicators
    document.querySelectorAll('.reg-wizard__step-indicator').forEach(function(ind) {
      var s = parseInt(ind.getAttribute('data-step'));
      ind.classList.remove('active', 'done');
      if (s === step) ind.classList.add('active');
      else if (s < step) ind.classList.add('done');
    });

    // Show correct step panel
    document.querySelectorAll('.reg-wizard__step').forEach(function(panel) {
      panel.classList.remove('active');
    });
    var target = document.querySelector('.reg-wizard__step[data-step="' + step + '"]');
    if (target) target.classList.add('active');

    currentStep = step;

    // Populate summary on step 3
    if (step === 3) {
      document.getElementById('summary-name').textContent = document.getElementById('reg-name').value;
      document.getElementById('summary-email').textContent = document.getElementById('reg-email').value;
      document.getElementById('summary-phone').textContent = document.getElementById('reg-phone').value;
      var selectedTicket = document.querySelector('input[name="ticket"]:checked').value;
      document.getElementById('summary-ticket').textContent = ticketLabels[selectedTicket];
      document.getElementById('summary-price').textContent = ticketPrices[selectedTicket];
    }
  }

  function validateStep1() {
    var valid = true;
    var name = document.getElementById('reg-name');
    var email = document.getElementById('reg-email');
    var phone = document.getElementById('reg-phone');

    // Name
    if (!name.value.trim()) {
      name.classList.add('error');
      name.nextElementSibling.textContent = 'Введите имя';
      valid = false;
    } else {
      name.classList.remove('error');
      name.nextElementSibling.textContent = '';
    }

    // Email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      email.classList.add('error');
      email.nextElementSibling.textContent = 'Введите корректный email';
      valid = false;
    } else {
      email.classList.remove('error');
      email.nextElementSibling.textContent = '';
    }

    // Phone
    if (!phone.value.trim()) {
      phone.classList.add('error');
      phone.nextElementSibling.textContent = 'Введите телефон';
      valid = false;
    } else {
      phone.classList.remove('error');
      phone.nextElementSibling.textContent = '';
    }

    return valid;
  }

  // Next buttons
  document.querySelectorAll('.btn--next').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var nextStep = parseInt(btn.getAttribute('data-next'));
      if (currentStep === 1 && !validateStep1()) return;
      goToStep(nextStep);
    });
  });

  // Prev buttons
  document.querySelectorAll('.btn--prev').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var prevStep = parseInt(btn.getAttribute('data-prev'));
      goToStep(prevStep);
    });
  });

  // Submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    form.style.display = 'none';
    document.querySelector('.reg-wizard__progress').style.display = 'none';
    document.getElementById('reg-success').style.display = 'block';
  });
})();
