/* ============================================
   DevConf 2026 — Основная логика
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Навигация: скролл-стиль и мобильное меню --- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Закрытие меню при клике по ссылке
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* --- Таймер обратного отсчёта --- */
  const targetDate = new Date('2026-12-15T10:00:00').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      cdDays.textContent = '0';
      cdHours.textContent = '0';
      cdMinutes.textContent = '0';
      cdSeconds.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Обновление с flip-анимацией при смене значения
    updateDigit(cdDays, String(days));
    updateDigit(cdHours, String(hours).padStart(2, '0'));
    updateDigit(cdMinutes, String(minutes).padStart(2, '0'));
    updateDigit(cdSeconds, String(seconds).padStart(2, '0'));
  }

  function updateDigit(el, val) {
    if (el.textContent !== val) {
      el.classList.add('flip');
      el.textContent = val;
      setTimeout(() => el.classList.remove('flip'), 400);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* --- Табы программы --- */
  const tabs = document.querySelectorAll('.schedule-tab');
  const days = document.querySelectorAll('.schedule-day');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      days.forEach(d => d.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`day-${tab.dataset.day}`).classList.add('active');
    });
  });

  /* --- 3D Tilt для карточек спикеров (только на устройствах с hover) --- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  /* --- Тарифы: скролл к регистрации с выбранным планом --- */
  document.querySelectorAll('.pricing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      // Выбираем соответствующий radio
      const radio = document.querySelector(`input[name="plan"][value="${plan}"]`);
      if (radio) radio.checked = true;

      // Переключаем wizard на шаг 2
      goToStep(2);
      validateStep2();

      // Скроллим к форме
      document.getElementById('registration').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* --- Wizard регистрации --- */
  let currentStep = 1;
  const wizardTrack = document.getElementById('wizardTrack');
  const wizardSteps = document.querySelectorAll('.wizard-step');
  const step1Next = document.getElementById('step1Next');
  const step2Next = document.getElementById('step2Next');
  const confirmBtn = document.getElementById('confirmBtn');
  const successScreen = document.getElementById('successScreen');
  const wizardViewport = document.querySelector('.wizard-viewport');

  const regName = document.getElementById('reg-name');
  const regEmail = document.getElementById('reg-email');
  const regPhone = document.getElementById('reg-phone');
  const regPromo = document.getElementById('reg-promo');

  // Навигация по шагам
  function goToStep(step) {
    currentStep = step;
    wizardTrack.style.transform = `translateX(-${(step - 1) * 100}%)`;

    wizardSteps.forEach((ws, i) => {
      ws.classList.remove('active', 'completed');
      if (i + 1 === step) ws.classList.add('active');
      if (i + 1 < step) ws.classList.add('completed');
    });

    // Заполнение сводки на шаге 3
    if (step === 3) {
      fillSummary();
    }
  }

  // Кнопки "Назад"
  document.querySelectorAll('.wizard-prev').forEach(btn => {
    btn.addEventListener('click', () => goToStep(currentStep - 1));
  });

  // Валидация шага 1
  function validateStep1() {
    const nameOk = regName.value.trim().length > 0;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.value.trim());

    regName.classList.toggle('invalid', regName.value.length > 0 && !nameOk);
    regEmail.classList.toggle('invalid', regEmail.value.length > 0 && !emailOk);

    step1Next.disabled = !(nameOk && emailOk);
  }

  regName.addEventListener('input', validateStep1);
  regEmail.addEventListener('input', validateStep1);

  step1Next.addEventListener('click', () => {
    if (!step1Next.disabled) goToStep(2);
  });

  // Валидация шага 2
  function validateStep2() {
    const planSelected = document.querySelector('input[name="plan"]:checked');
    step2Next.disabled = !planSelected;
  }

  document.querySelectorAll('input[name="plan"]').forEach(r => {
    r.addEventListener('change', validateStep2);
  });

  step2Next.addEventListener('click', () => {
    if (!step2Next.disabled) goToStep(3);
  });

  // Заполнение сводки
  function fillSummary() {
    document.getElementById('sum-name').textContent = regName.value.trim();
    document.getElementById('sum-email').textContent = regEmail.value.trim();
    document.getElementById('sum-phone').textContent = regPhone.value.trim() || '—';

    const planRadio = document.querySelector('input[name="plan"]:checked');
    const planNames = { standard: 'Standard', vip: 'VIP', online: 'Online' };
    const planPrices = { standard: '5 000', vip: '15 000', online: '2 000' };

    if (planRadio) {
      document.getElementById('sum-plan').textContent = planNames[planRadio.value];
      document.getElementById('sum-total').textContent = planPrices[planRadio.value] + ' \u20BD';
    }

    document.getElementById('sum-promo').textContent = regPromo.value.trim() || '—';
  }

  // Подтверждение
  confirmBtn.addEventListener('click', () => {
    // Скрываем wizard, показываем success
    wizardViewport.style.display = 'none';
    document.querySelector('.wizard-steps').style.display = 'none';
    successScreen.classList.add('visible');
    createConfetti();
  });

  // Конфетти
  function createConfetti() {
    const confettiEl = document.getElementById('confetti');
    const colors = ['#6c2bd9', '#00ff88', '#ff00ff', '#00c2ff', '#ff6b6b', '#ffdd00'];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (Math.random() * 10 + 5) + 'px';
      piece.style.height = (Math.random() * 10 + 5) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      piece.style.animationDelay = Math.random() * 2 + 's';
      piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confettiEl.appendChild(piece);
    }
  }

  /* --- GSAP анимации --- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth <= 768;

    // Побуквенная анимация заголовков секций
    document.querySelectorAll('[data-animate-title]').forEach(title => {
      if (isMobile) {
        // На мобильных — простой fade-in вместо побуквенной анимации
        gsap.from(title, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      } else {
        // На десктопе — побуквенная анимация
        const text = title.textContent;
        title.innerHTML = '';
        text.split('').forEach(char => {
          const span = document.createElement('span');
          span.classList.add('char');
          span.textContent = char === ' ' ? '\u00A0' : char;
          title.appendChild(span);
        });

        // Сохраняем pseudo-element ::after
        const afterEl = document.createElement('span');
        afterEl.style.display = 'block';
        afterEl.style.width = '60px';
        afterEl.style.height = '3px';
        afterEl.style.background = '#00ff88';
        afterEl.style.margin = '16px auto 0';
        afterEl.style.borderRadius = '2px';
        title.appendChild(afterEl);

        gsap.to(title.querySelectorAll('.char'), {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }
    });

    // Карточки спикеров — stagger fade-in
    gsap.from('.speaker-card', {
      opacity: 0,
      y: 60,
      stagger: isMobile ? 0.08 : 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.speakers-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Программа — scroll reveal (вертикальный список на мобильных)
    if (!isMobile) {
      document.querySelectorAll('[data-scroll-reveal]').forEach(item => {
        gsap.from(item, {
          opacity: 0,
          x: -40,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        });
      });
    } else {
      // На мобильных — простой fade без горизонтального сдвига
      document.querySelectorAll('[data-scroll-reveal]').forEach(item => {
        gsap.from(item, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 92%',
            toggleActions: 'play none none none'
          }
        });
      });
    }

    // Тарифы — slide up (без скрытия через opacity)
    gsap.from('.pricing-card', {
      y: 40,
      stagger: 0.2,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.pricing-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* --- Floating CTA — показывать только после hero --- */
  const floatingCta = document.querySelector('.floating-cta');
  const heroSection = document.querySelector('.hero');
  if (floatingCta && heroSection) {
    floatingCta.style.opacity = '0';
    floatingCta.style.pointerEvents = 'none';
    floatingCta.style.transition = 'opacity 0.3s ease';

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          floatingCta.style.opacity = '0';
          floatingCta.style.pointerEvents = 'none';
        } else {
          floatingCta.style.opacity = '1';
          floatingCta.style.pointerEvents = 'auto';
        }
      });
    }, { threshold: 0.1 });
    heroObserver.observe(heroSection);
  }

  /* --- Плавный скролл для CTA кнопок --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
