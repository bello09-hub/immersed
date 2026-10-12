# Immersed

I'm hoping to create a game like bitlife and verdant life sim... A text based life sim game I want to do it better than ever. I already started with chat gpt but I hit the limit...we wrote a code though:

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#08090d">
<title>IMMERSED</title>
<style>
  :root {
    --bg: #08090d;
    --panel: #11131b;
    --panel-2: #171a24;
    --text: #f4f0e8;
    --muted: #aaa8b4;
    --gold: #d9c18a;
    --gold-soft: rgba(217,193,138,.16);
    --line: rgba(217,193,138,.28);
    --danger: #d8a3a3;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: var(--bg); color: var(--text); }
  body {
    font-family: "DM Sans", "Segoe UI", Arial, sans-serif;
    min-height: 100svh;
    overflow-x: hidden;
    background:
      radial-gradient(ellipse at 50% 38%, rgba(70,57,91,.17), transparent 43%),
      radial-gradient(ellipse at 50% 100%, rgba(103,78,47,.08), transparent 48%),
      #08090d;
  }
  button, input, select { font: inherit; }
  button { cursor: pointer; }
  .screen {
    min-height: 100svh;
    width: 100%;
    display: none;
    position: relative;
    padding: max(24px, env(safe-area-inset-top)) 22px max(24px, env(safe-area-inset-bottom));
  }
  .screen.active { display: flex; }
  #intro { align-items: center; justify-content: center; text-align: center; flex-direction: column; cursor: pointer; user-select: none; }
  .intro-inner { width: min(100%, 520px); }
  .wordmark {
    font-family: "DM Serif Display", Georgia, "Times New Roman", serif;
    font-size: clamp(3rem, 13vw, 5.8rem);
    letter-spacing: .13em;
    padding-left: .13em;
    margin: 0;
    font-weight: 400;
    color: #f6f0df;
    text-shadow: 0 0 4px rgba(244,230,190,.5), 0 0 24px rgba(217,193,138,.28), 0 0 65px rgba(160,126,205,.12);
    animation: awaken 3.2s ease-out both, breathe 5s ease-in-out 3.2s infinite;
  }
  @keyframes awaken {
    0% { opacity: 0; filter: brightness(0); text-shadow: none; transform: translateY(7px); }
    45% { opacity: .65; filter: brightness(.8); }
    100% { opacity: 1; filter: brightness(1); transform: translateY(0); }
  }
  @keyframes breathe {
    0%,100% { text-shadow: 0 0 4px rgba(244,230,190,.42), 0 0 22px rgba(217,193,138,.23), 0 0 58px rgba(160,126,205,.1); }
    50% { text-shadow: 0 0 7px rgba(244,230,190,.75), 0 0 31px rgba(217,193,138,.36), 0 0 75px rgba(160,126,205,.16); }
  }
  .tap-hint { margin-top: 38px; color: #a8a4b0; letter-spacing: .22em; font-size: .72rem; text-transform: uppercase; animation: hint 2.2s ease-in-out infinite; }
  .intro-tagline { margin: 25px auto 0; max-width: 340px; animation: taglineReveal 1.1s ease both; }
  .intro-tagline[hidden] { display: none; }
  @keyframes taglineReveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes hint { 0%,100% { opacity: .42; } 50% { opacity: .9; } }
  .screen-two { flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .menu-wrap { width: min(100%, 420px); }
  .small-mark {
    font-family: "DM Serif Display", Georgia, serif; font-size: clamp(2.2rem, 9vw, 3.4rem);
    letter-spacing: .11em; padding-left: .11em; margin: 0 0 14px; font-weight: 400;
    color: var(--text); text-shadow: 0 0 22px rgba(217,193,138,.16);
  }
  .tagline { color: #c8c2d0; font-family: Georgia, serif; font-style: italic; font-size: clamp(.95rem, 3.5vw, 1.1rem); line-height: 1.7; margin: 0 auto 46px; }
  h2 { font-family: "DM Serif Display", Georgia, serif; font-weight: 400; letter-spacing: .015em; font-size: clamp(1.7rem, 6vw, 2.35rem); line-height: 1.25; margin: 0 0 30px; }
  .menu-buttons { display: grid; gap: 13px; }
  .menu-btn {
    border: 1px solid var(--line); border-radius: 5px; min-height: 54px; padding: 15px 18px;
    background: linear-gradient(110deg, rgba(217,193,138,.09), rgba(255,255,255,.015));
    color: var(--text); letter-spacing: .17em; font-size: .8rem; font-weight: 600;
    transition: background .2s ease, border-color .2s ease, transform .2s ease;
  }
  .menu-btn:hover, .menu-btn:focus-visible { background: var(--gold-soft); border-color: rgba(217,193,138,.65); outline: none; }
  .menu-btn:active { transform: scale(.985); }
  .menu-btn.primary { background: var(--gold); color: #14120e; border-color: var(--gold); }
  .menu-btn.primary:hover { background: #ead7a9; }
  .menu-btn:disabled { opacity: .35; cursor: not-allowed; }
  .footer-note { margin-top: 32px; color: #6e6d79; font-size: .72rem; letter-spacing: .06em; }
  .page { width: min(100%, 560px); margin: 0 auto; flex-direction: column; }
  .page-header { display: flex; align-items: center; gap: 14px; margin: 3px 0 28px; }
  .back-btn { background: transparent; border: 1px solid rgba(255,255,255,.16); color: var(--text); border-radius: 50px; padding: 10px 14px; font-size: .82rem; }
  .back-btn:hover { border-color: var(--gold); }
  .page-title { font-family: "DM Serif Display", Georgia, serif; font-size: 1.8rem; margin: 0; font-weight: 400; }
  .subheading { color: var(--muted); line-height: 1.6; margin: -14px 0 24px; font-size: .92rem; }
  .field { display: grid; gap: 8px; margin-bottom: 18px; text-align: left; }
  .field label { color: #d7d2dc; font-size: .82rem; letter-spacing: .04em; }
  .field input, .field select {
    width: 100%; min-height: 48px; border-radius: 5px; padding: 12px 13px;
    border: 1px solid rgba(255,255,255,.15); background: #11131a; color: var(--text); outline: none;
  }
  .field input:focus, .field select:focus { border-color: var(--gold); }
  .button-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .button-row .menu-btn { flex: 1; min-width: 130px; }
  .card { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.09); border-radius: 8px; padding: 18px; margin: 0 0 15px; text-align: left; }
  .card-label { color: var(--muted); text-transform: uppercase; font-size: .68rem; letter-spacing: .15em; margin-bottom: 7px; }
  .card-value { font-family: Georgia, serif; font-size: 1.2rem; }
  .body-copy { color: #c3bfca; line-height: 1.65; font-size: .93rem; }
  .message { color: var(--muted); font-size: .86rem; line-height: 1.5; margin-top: 15px; min-height: 1.2em; }
  .setting-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 17px 0; border-bottom: 1px solid rgba(255,255,255,.08); }
  .setting-row label { color: #e3dfeb; }
  .setting-row input { accent-color: var(--gold); width: 20px; height: 20px; }
  .life-head { text-align: left; margin-bottom: 24px; }
  .life-head .small-mark { font-size: 1.65rem; margin-bottom: 6px; }
  .life-head .tagline { text-align: left; margin: 0; font-size: .86rem; }
  .stats-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
  .stats-grid .card { margin: 0; }
  .soft-divider { height: 1px; background: rgba(217,193,138,.18); margin: 22px 0; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; } }
</style>
</head>
<body>
  <section id="intro" class="screen active" aria-label="IMMERSED opening screen">
    <div class="intro-inner">
      <h1 class="wordmark">IMMERSED</h1>
      <p class="tagline intro-tagline" id="introTagline" hidden>An endless possibility. Your choice. Your story...</p>
      <div class="tap-hint" id="tapHint">TAP THE SCREEN</div>
    </div>
  </section>

  <section id="mainMenu" class="screen screen-two">
    <div class="menu-wrap">
      <h2>ARE YOU READY<br>TO BE IMMERSED?</h2>
      <div class="menu-buttons">
        <button class="menu-btn" id="loadButton" onclick="loadLife()">LOAD LIFE</button>
        <button class="menu-btn primary" onclick="showScreen('creator')">START LIFE</button>
        <button class="menu-btn" onclick="showScreen('settings')">SETTINGS</button>
      </div>
      <p class="footer-note">YOUR LIFE. YOUR CHOICES. YOUR STORY.</p>
    </div>
  </section>

  <section id="creator" class="screen">
    <div class="page">
      <div class="page-header">
        <button class="back-btn" onclick="showScreen('mainMenu')">← Back</button>
        <h2 class="page-title">A new life</h2>
      </div>
      <p class="subheading">You don't choose the life you're born into. You discover it.</p>
      <div class="field">
        <label for="characterName">Character name (optional)</label>
        <input id="characterName" type="text" maxlength="32" placeholder="Leave blank for a generated name">
      </div>
      <div class="field">
        <label for="country">Birth country</label>
        <select id="country">
          <option value="Nigeria">Nigeria</option>
          <option value="France">France</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="Ghana">Ghana</option>
          <option value="Japan">Japan</option>
          <option value="Brazil">Brazil</option>
        </select>
      </div>
      <div class="field">
        <label for="sex">Sex</label>
        <select id="sex">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div class="button-row">
        <button class="menu-btn" onclick="randomizeName()">RANDOM NAME</button>
        <button class="menu-btn primary" onclick="beginLife()">BE BORN</button>
      </div>
      <p id="creatorMessage" class="message" role="status"></p>
    </div>
  </section>

  <section id="settings" class="screen">
    <div class="page">
      <div class="page-header">
        <button class="back-btn" onclick="showScreen('mainMenu')">← Back</button>
        <h2 class="page-title">Settings</h2>
      </div>
      <p class="subheading">Make the experience feel right for you.</p>
      <div class="setting-row">
        <label for="motionToggle">Atmospheric glow animation</label>
        <input id="motionToggle" type="checkbox" checked onchange="toggleMotion(this.checked)">
      </div>
      <div class="setting-row">
        <label for="contrastToggle">Higher text contrast</label>
        <input id="contrastToggle" type="checkbox" onchange="toggleContrast(this.checked)">
      </div>
      <div class="soft-divider"></div>
      <button class="menu-btn" onclick="showScreen('mainMenu')">DONE</button>
    </div>
  </section>

  <section id="life" class="screen">
    <div class="page">
      <div class="page-header">
        <button class="back-btn" onclick="showScreen('mainMenu')">← Main menu</button>
        <h2 class="page-title">Your life</h2>
      </div>
      <div class="life-head">
        <h1 class="small-mark">IMMERSED</h1>
        <p class="tagline">Your story begins here.</p>
      </div>
      <div class="stats-grid">
        <div class="card"><div class="card-label">Name</div><div class="card-value" id="lifeName">—</div></div>
        <div class="card"><div class="card-label">Age</div><div class="card-value" id="lifeAge">Newborn</div></div>
        <div class="card"><div class="card-label">Birthplace</div><div class="card-value" id="lifeCountry">—</div></div>
        <div class="card"><div class="card-label">Family</div><div class="card-value" id="lifeFamily">Being discovered</div></div>
      </div>
      <div class="soft-divider"></div>
      <div class="card">
        <div class="card-label">Your beginning</div>
        <div class="body-copy" id="birthStory">A new life is beginning.</div>
      </div>
      <button class="menu-btn primary" onclick="nextEvent()">CONTINUE</button>
      <button class="menu-btn" style="margin-top:10px" onclick="saveLife()">SAVE LIFE</button>
      <p id="lifeMessage" class="message" role="status"></p>
    </div>
  </section>

<script>
  const screens = ['intro', 'mainMenu', 'creator', 'settings', 'life'];
  let tapCount = 0;
  let currentLife = null;
  let eventIndex = 0;

  function showScreen(id) {
    screens.forEach(screenId => {
      const element = document.getElementById(screenId);
      if (element) element.classList.toggle('active', screenId === id);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 'mainMenu') refreshLoadButton();
  }

  // Tap 1 reveals the tagline beneath IMMERSED. Tap 2 opens a clean menu screen.
  document.getElementById('intro').addEventListener('click', () => {
    tapCount += 1;
    const hint = document.getElementById('tapHint');
    const tagline = document.getElementById('introTagline');
    if (tapCount === 1) {
      tagline.hidden = false;
      hint.textContent = 'TAP AGAIN TO ENTER';
      document.querySelector('.wordmark').style.animation = 'breathe 5s ease-in-out infinite';
    } else {
      showScreen('mainMenu');
    }
  });

  const nameSets = {
    'Nigeria': ['Chidi Nwosu', 'Adaeze Okafor', 'Tunde Adebayo', 'Zainab Musa', 'Amara Eze', 'Ibrahim Bello', 'Temi Balogun'],
    'France': ['Camille Moreau', 'Gabriel Laurent', 'Amélie Bernard', 'Lucas Petit', 'Inès Robert'],
    'United Kingdom': ['Oliver Bennett', 'Amelia Clarke', 'Noah Williams', 'Isla Thompson'],
    'United States': ['Jordan Brooks', 'Avery Johnson', 'Ethan Carter', 'Maya Robinson'],
    'Canada': ['Noah Martin', 'Sophie Tremblay', 'Liam Wilson', 'Chloe Brown'],
    'Ghana': ['Ama Mensah', 'Kofi Owusu', 'Akosua Boateng', 'Kwame Asare'],
    'Japan': ['Haru Sato', 'Yui Tanaka', 'Ren Suzuki', 'Aoi Nakamura'],
    'Brazil': ['Lucas Silva', 'Mariana Costa', 'Gabriel Santos', 'Isabela Oliveira']
  };

  function randomizeName() {
    const country = document.getElementById('country').value;
    const list = nameSets[country] || nameSets['Nigeria'];
    document.getElementById('characterName').value = list[Math.floor(Math.random() * list.length)];
    document.getElementById('creatorMessage').textContent = 'A name has been chosen. You can still change it.';
  }

  function beginLife() {
    const country = document.getElementById('country').value;
    const sex = document.getElementById('sex').value;
    let name = document.getElementById('characterName').value.trim();
    if (!name) {
      const list = nameSets[country] || nameSets['Nigeria'];
      name = list[Math.floor(Math.random() * list.length)];
    }
    const familyTypes = [
      { label: 'A close-knit family', story: 'You are welcomed into a family where affection is present, even when life gets complicated.' },
      { label: 'A modest household', story: 'Your family has to think carefully about money. There is love here, but not every day is easy.' },
      { label: 'A family under pressure', story: 'There are tensions in your family that you are too young to understand. Their choices will shape the world around you.' },
      { label: 'A comfortable household', story: 'Your family has more financial security than many, but money alone cannot decide what kind of home this will be.' }
    ];
    const family = familyTypes[Math.floor(Math.random() * familyTypes.length)];
    currentLife = { name, country, sex, age: 0, family: family.label, story: family.story, createdAt: Date.now() };
    eventIndex = 0;
    renderLife();
    try { localStorage.setItem('immersedLife', JSON.stringify(currentLife)); } catch (e) {}
    showScreen('life');
  }

  function renderLife() {
    if (!currentLife) return;
    document.getElementById('lifeName').textContent = currentLife.name;
    document.getElementById('lifeAge').textContent = currentLife.age === 0 ? 'Newborn' : currentLife.age + (currentLife.age === 1 ? ' year' : ' years');
    document.getElementById('lifeCountry').textContent = currentLife.country;
    document.getElementById('lifeFamily').textContent = currentLife.family;
    document.getElementById('birthStory').textContent = currentLife.story;
  }

  function nextEvent() {
    if (!currentLife) return;
    eventIndex += 1;
    if (currentLife.age < 3) {
      currentLife.age += 1;
      const events = [
        'Your first year passes in a world of familiar voices, new sensations, and people learning how to care for you.',
        'You are beginning to notice more of the world around you. Small routines and the people who show up for you start to matter.',
        'Your personality is beginning to emerge, though nobody can yet know who you will become.'
      ];
      currentLife.story = events[Math.min(currentLife.age - 1, events.length - 1)];
    } else {
      currentLife.age += 1;
      currentLife.story = currentLife.age < 5
        ? 'You are growing into early childhood. New places, familiar people, and small choices will begin to shape your days.'
        : currentLife.age < 6
          ? 'School is getting closer. Soon, you will meet children outside your family and begin discovering how you fit into the world.'
          : 'Your life continues to unfold. More choices and experiences will become available as the game grows.';
    }
    renderLife();
    document.getElementById('lifeMessage').textContent = 'Your story has moved forward.';
    try { localStorage.setItem('immersedLife', JSON.stringify(currentLife)); } catch (e) {}
  }

  function saveLife() {
    if (!currentLife) return;
    try {
      localStorage.setItem('immersedLife', JSON.stringify(currentLife));
      document.getElementById('lifeMessage').textContent = 'Life saved on this browser.';
    } catch (e) {
      document.getElementById('lifeMessage').textContent = 'This browser could not save the life. Keep this page open for now.';
    }
    refreshLoadButton();
  }

  function loadLife() {
    try {
      const saved = localStorage.getItem('immersedLife');
      if (!saved) {
        alert('There is no saved life yet. Choose START LIFE to begin your first life.');
        return;
      }
      currentLife = JSON.parse(saved);
      renderLife();
      document.getElementById('lifeMessage').textContent = 'Your saved life has been loaded.';
      showScreen('life');
    } catch (e) {
      alert('The saved life could not be loaded in this browser. You can start a new life instead.');
    }
  }

  function refreshLoadButton() {
    const button = document.getElementById('loadButton');
    let hasSave = false;
    try { hasSave = !!localStorage.getItem('immersedLife'); } catch (e) {}
    button.disabled = !hasSave;
    button.title = hasSave ? 'Load your saved life' : 'Start a life first, then save it to enable loading';
  }

  function toggleMotion(enabled) {
    document.documentElement.style.setProperty('--motion-state', enabled ? 'running' : 'paused');
    document.querySelectorAll('.wordmark').forEach(el => {
      el.style.animationPlayState = enabled ? 'running' : 'paused';
    });
    document.querySelectorAll('.tap-hint').forEach(el => {
      el.style.animationPlayState = enabled ? 'running' : 'paused';
    });
  }

  function toggleContrast(enabled) {
    if (enabled) {
      document.documentElement.style.setProperty('--muted', '#d4d1dc');
      document.documentElement.style.setProperty('--line', 'rgba(244,240,232,.48)');
    } else {
      document.documentElement.style.setProperty('--muted', '#aaa8b4');
      document.documentElement.style.setProperty('--line', 'rgba(217,193,138,.28)');
    }
  }

  refreshLoadButton();
</script>
</body>
</html>

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://immersed.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3d8e70de-b6a8-4613-bf1a-5cabc71e0ad1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
