// ── SPA navigation (with bottom nav sync) ──
function showPage(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  const bnavEl = document.getElementById('bnav-' + page);
  if (bnavEl) bnavEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Sub-tabs ──
function showSubTab(id, btn) {
  document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

// ── Knowledge base accordion ──
function toggleKb(header) {
  const body = header.nextElementSibling;
  const chevron = header.querySelector('.kb-chevron');
  const isOpen = body.classList.contains('open');
  document.querySelectorAll('.kb-body.open').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.kb-chevron.open').forEach(c => c.classList.remove('open'));
  if (!isOpen) {
    body.classList.add('open');
    chevron.classList.add('open');
  }
}

// ── Chat ──
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');
const chatInput = document.getElementById('chat-input');

function scrollBottom() { chatMessages.scrollTop = chatMessages.scrollHeight; }

function showTyping() {
  typingIndicator.style.display = 'flex';
  chatMessages.appendChild(typingIndicator);
  scrollBottom();
}
function hideTyping() { typingIndicator.style.display = 'none'; }

function addMessage(text, isUser) {
  hideTyping();
  const div = document.createElement('div');
  if (isUser) {
    div.className = 'chat-user-row';
    div.innerHTML = `<div class="chat-bubble-user">${text}</div>`;
  } else {
    div.className = 'chat-lawyer-row';
    div.innerHTML = `<div class="chat-bubble-lawyer">${text}</div>`;
  }
  chatMessages.appendChild(div);
  scrollBottom();
}

function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, true);
  chatInput.value = '';
  showTyping();
  setTimeout(() => {
    addMessage('Прийнято. Ваш запит обробляється. Зачекайте, аналізуємо ситуацію...', false);
  }, 1500);
}
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendChatMessage(); });

// ── Wizard ──
const wizardSteps = {
  1: 'З ким ми зараз спілкуємось?',
  2: 'Оберіть вашу військову частину:',
  3: 'Оберіть тему звернення:'
};

function setWizardStep(stepNum, title) {
  document.querySelectorAll('[id^="step-"]').forEach(s => s.style.display = 'none');
  document.getElementById('step-' + stepNum).style.display = 'block';
  document.getElementById('wizard-step-num').textContent = String(stepNum).replace(/[abc]/g, '');
  document.getElementById('wizard-step-title').textContent = title;
}

function wizardBack(toStep) {
  addMessage('← Повернувся назад', true);
  showTyping();
  setTimeout(() => {
    addMessage('Добре, повертаємось до попереднього кроку.', false);
    setWizardStep(toStep, wizardSteps[toStep] || '');
  }, 600);
}

function nextStep(stepNum, userReply) {
  if (userReply) addMessage(userReply, true);
  showTyping();
  setTimeout(() => {
    if (stepNum === 2) {
      addMessage('Зрозумів. Будь ласка, оберіть вашу військову частину.', false);
      setWizardStep(2, 'Оберіть вашу військову частину:');
    } else if (stepNum === 3) {
      addMessage('Дякую. Оберіть тему звернення або напишіть питання в чат нижче.', false);
      setWizardStep(3, 'Оберіть тему звернення:');
    }
  }, 900);
}

function selectUnit(unit) {
  addMessage('Моя частина: ' + unit, true);
  showTyping();
  setTimeout(() => {
    addMessage('Зрозумів. Тепер оберіть тему вашого звернення.', false);
    setWizardStep(3, 'Оберіть тему звернення:');
  }, 900);
}

function selectTopic(topic, type) {
  addMessage('Мене цікавить: ' + topic, true);
  showTyping();
  if (type === 'consult') {
    setTimeout(() => {
      addMessage('Чудово! Заповніть, будь ласка, форму нижче — адвокат зв\'яжеться з вами.', false);
      setWizardStep('4a', 'Залиште ваш контакт:');
    }, 900);
  } else if (type === 'library') {
    setTimeout(() => {
      addMessage('Ось наші матеріали для завантаження:', false);
      setWizardStep('4b', 'Оберіть матеріал:');
    }, 900);
  } else if (type === 'knowledge') {
    setTimeout(() => {
      addMessage('Ось корисна інформація з нашої Бази знань:', false);
      setWizardStep('4c', 'Корисна інформація:');
    }, 900);
  }
}

function submitContact() {
  const name = document.getElementById('contact-name').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  if (!name || !phone) { alert('Будь ласка, заповніть всі поля.'); return; }
  addMessage(`Ім'я: ${name}, Контакт: ${phone}`, true);
  showTyping();
  setTimeout(() => {
    addMessage('Дякуємо! Ваша заявка прийнята. Адвокат зв\'яжеться з вами найближчим часом.', false);
    document.getElementById('step-4a').innerHTML = '<div style="padding:16px 20px;background:rgba(26,58,138,.06);border-radius:12px;text-align:center;border:1px solid rgba(26,58,138,.12);"><p style="font-weight:800;color:var(--navy);font-size:14px;">✅ Заявку прийнято!</p><p style="color:var(--muted);font-size:12.5px;margin-top:4px;font-weight:500;">Адвокат зв\'яжеться з вами найближчим часом.</p></div>';
  }, 1200);
}

// ── Consultant slider ──
(function () {
  const track = document.getElementById('cTrack');
  const btnPrev = document.getElementById('cPrev');
  const btnNext = document.getElementById('cNext');
  if (!track) return;
  const CARD_W = 200 + 16;
  let current = 0;
  function getVisible() { return Math.max(1, Math.floor(track.parentElement.offsetWidth / CARD_W)); }
  function total() { return track.children.length; }
  function clamp(v) { return Math.min(Math.max(0, v), Math.max(0, total() - getVisible())); }
  function go(delta) {
    current = clamp(current + delta);
    track.style.transform = `translateX(-${current * CARD_W}px)`;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= total() - getVisible();
  }
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => { if (Math.abs(e.changedTouches[0].clientX - startX) > 40) go(e.changedTouches[0].clientX < startX ? 1 : -1); }, { passive: true });
  window.addEventListener('resize', () => go(0));
  go(0);
})();

// ── Bottom nav ──
function showPageBottom(page) {
  showPage(page);
  document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('bnav-' + page);
  if (btn) btn.classList.add('active');
}
