/**
 * Dropdown Component & Live Telemetry Inspector Logic
 * OpenAI Style - Custom Select Widget, Contained Inside Canvas, Live Telemetry
 */
import { fetchDropdownInspect, fetchDropdownOptions } from '../api/client.js';

export async function initDropdown() {
  const customWidget = document.getElementById('custom-select-widget');
  const triggerBtn = document.getElementById('select-trigger');
  const selectedLabel = document.getElementById('selected-text');
  const menuElem = document.getElementById('select-menu');
  const hiddenInput = document.getElementById('live-dropdown');

  const latencyBadge = document.getElementById('latency-badge');
  const previewBox = document.getElementById('live-preview-box');
  
  const outRequest = document.getElementById('out-request');
  const outPydantic = document.getElementById('out-pydantic');
  const outSql = document.getElementById('out-sql');
  const outJson = document.getElementById('out-json');

  let currentSelectedValue = 'button';
  let optionsList = [
    { label: 'Tugmalar (Buttons)', value: 'button' },
    { label: 'Kiritish maydonlari (Inputs)', value: 'input' },
    { label: 'Barcha komponentlar', value: 'all' }
  ];

  // 1. Variantlarni FastAPI bazasidan dinamik yuklash
  try {
    const fetched = await fetchDropdownOptions();
    if (fetched && fetched.length > 0) {
      optionsList = fetched;
    }
  } catch (err) {
    console.warn('FastAPI options yuklanmadi, standart variantlar qoldi:', err);
  }

  // 2. Vizual UI Previewni yangilovchi funksiya
  function renderLiveUIPreview(value) {
    if (!previewBox) return;

    if (value === 'button') {
      previewBox.innerHTML = `
        <button class="preview-btn preview-btn-primary">Primary Action</button>
        <button class="preview-btn preview-btn-secondary">Secondary Action</button>
      `;
    } else if (value === 'input') {
      previewBox.innerHTML = `
        <input type="text" class="preview-input-sample" placeholder="Foydalanuvchi ma'lumotini kiriting..." autofocus>
      `;
    } else {
      previewBox.innerHTML = `
        <button class="preview-btn preview-btn-primary">Primary Action</button>
        <input type="text" class="preview-input-sample" placeholder="Kiritish maydoni...">
      `;
    }
  }

  // 3. Telemetriya oynalarini yangilovchi funksiya
  async function runInspect(selectedValue) {
    renderLiveUIPreview(selectedValue);

    try {
      const result = await fetchDropdownInspect(selectedValue);

      // Latency badge
      if (latencyBadge) {
        latencyBadge.textContent = `${result.duration} ms`;
      }

      // 1. HTTP So'rovi
      if (outRequest) {
        outRequest.textContent = `Method: GET\nURL: ${result.url}\nStatus: ${result.status} OK\nContent-Type: application/json`;
      }

      // 2. Pydantic tekshiruvi
      if (outPydantic) {
        const val = result.telemetry.pydantic_validation;
        outPydantic.textContent = `Param: "${val.param_name}"\nValue: "${val.received_value}"\nType: ${val.expected_type}\nValidation: ${val.validation_status.toUpperCase()}\n\nSchema:\nselected_option: str = Query(default="button")`;
      }

      // 3. PostgreSQL SQL
      if (outSql) {
        outSql.textContent = result.telemetry.executed_sql;
      }

      // 4. FastAPI JSON javobi
      if (outJson) {
        outJson.textContent = JSON.stringify(result.responseData, null, 2);
      }

      // Live Ping Animation (Sleek hairline border flash)
      const inspectorBox = document.querySelector('.inspector-console');
      if (inspectorBox) {
        inspectorBox.classList.add('active-ping');
        setTimeout(() => inspectorBox.classList.remove('active-ping'), 200);
      }

    } catch (err) {
      if (outRequest) {
        outRequest.textContent = `Error: Cannot connect to FastAPI server.\nEnsure backend is running on port 8000.`;
      }
    }
  }

  function selectOption(val, label) {
    currentSelectedValue = val;
    if (selectedLabel) selectedLabel.textContent = label;
    if (hiddenInput) hiddenInput.value = val;

    // Active klassni yangilash
    menuElem?.querySelectorAll('.select-option').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-value') === val);
    });

    closeMenu();
    runInspect(val);
  }

  function toggleMenu() {
    if (!customWidget) return;
    const isOpen = customWidget.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    customWidget?.classList.add('open');
    triggerBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    customWidget?.classList.remove('open');
    triggerBtn?.setAttribute('aria-expanded', 'false');
  }

  // Menyu elementlarini render qilish
  function renderCustomSelect() {
    if (!menuElem) return;
    menuElem.innerHTML = '';

    optionsList.forEach(opt => {
      const item = document.createElement('div');
      item.className = `select-option ${opt.value === currentSelectedValue ? 'active' : ''}`;
      item.setAttribute('role', 'option');
      item.setAttribute('data-value', opt.value);
      item.innerHTML = `
        <span>${opt.label}</span>
        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOption(opt.value, opt.label);
      });
      menuElem.appendChild(item);
    });

    const activeOpt = optionsList.find(o => o.value === currentSelectedValue) || optionsList[0];
    if (selectedLabel && activeOpt) {
      selectedLabel.textContent = activeOpt.label;
    }
    if (hiddenInput && activeOpt) {
      hiddenInput.value = activeOpt.value;
    }
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Tashqariga bosilganda yopish
  document.addEventListener('click', (e) => {
    if (customWidget && !customWidget.contains(e.target)) {
      closeMenu();
    }
  });

  // Escape bosilganda yopish
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && customWidget?.classList.contains('open')) {
      closeMenu();
      triggerBtn?.focus();
    }
  });

  // Boshlang'ich render va inspect
  renderCustomSelect();
  runInspect(currentSelectedValue);
}
