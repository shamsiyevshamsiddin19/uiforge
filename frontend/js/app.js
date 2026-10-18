/**
 * UIForge Main App Entry
 * OpenAI Minimalist Controller
 */
import { initDropdown } from './components/dropdown.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Oq va Qora mavzuni almashtirish (Theme Switcher)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('uiforge-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  function syncThemeAttributes(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'light') {
      themeToggleBtn.setAttribute('title', "Yorug' mavzu (Qorong'i rejimga o'tish uchun bosing)");
      themeToggleBtn.setAttribute('aria-label', "Yorug' rejim");
    } else {
      themeToggleBtn.setAttribute('title', "Qorong'i mavzu (Yorug' rejimga o'tish uchun bosing)");
      themeToggleBtn.setAttribute('aria-label', "Qorong'i rejim");
    }
  }

  syncThemeAttributes(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('uiforge-theme', newTheme);
      syncThemeAttributes(newTheme);
    });

    themeToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggleBtn.click();
      }
    });
  }

  // 2. Dinamik Dropdownni ishga tushirish
  initDropdown();

  // 2. Inspector tablarini boshqarish (Response / SQL / Pydantic / Request)
  const inspectorTabs = document.querySelectorAll('.inspector-tab-btn');
  const inspectorPanes = document.querySelectorAll('.inspector-pane');

  inspectorTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      inspectorTabs.forEach(b => b.classList.remove('active'));
      inspectorPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 3. Kodni nusxalash (Copy to Clipboard)
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Faol inspector paneni topish:
      const activePane = document.querySelector('.inspector-pane.active pre code');
      if (!activePane) return;

      const textToCopy = activePane.innerText || activePane.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalSvg = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10a37f" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        setTimeout(() => {
          btn.innerHTML = originalSvg;
        }, 1500);
      });
    });
  });

  // Reference qutilaridagi kodni nusxalash
  document.querySelectorAll('.ref-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.reference-section');
      const codeElem = card?.querySelector('pre code');
      if (!codeElem) return;

      const textToCopy = codeElem.innerText || codeElem.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalSvg = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#10a37f" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        setTimeout(() => {
          btn.innerHTML = originalSvg;
        }, 1500);
      });
    });
  });

  // 4. Mode Switcher (Pill toggle [ Interactive UI | Live Telemetry ])
  const modePillBtns = document.querySelectorAll('.mode-pill-btn');
  modePillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modePillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.textContent.includes('Telemetry')) {
        document.querySelector('.inspector-console')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.querySelector('.stage-bar-wrapper')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 5. Sidebar navigatsiyasi
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
