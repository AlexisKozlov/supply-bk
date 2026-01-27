// --- Ultra-safe Supabase init (no redeclare) ---
if (!window.__SUPABASE_CONFIG__) {
  window.__SUPABASE_CONFIG__ = {
    url: "https://obywcpilionribalfrbl.supabase.co",
    key: "sb_publishable_BYToHeprZE-e64UjDgjlmQ_bKZBUFJ0"
  };
}

if (!window.supabaseClient) {
  window.supabaseClient = null;
}

function waitForSupabaseAndInit() {
  if (window.supabase && !window.supabaseClient) {
    console.log("Supabase SDK loaded");
    window.supabaseClient = window.supabase.createClient(
      window.__SUPABASE_CONFIG__.url,
      window.__SUPABASE_CONFIG__.key
    );
    loadDatabaseFromSupabase();
    loadAdminPasswordFromSupabase();
    loadAppConfigFromSupabase();
  } else if (!window.supabaseClient) {
    setTimeout(waitForSupabaseAndInit, 50);
  }
}

document.addEventListener("DOMContentLoaded", waitForSupabaseAndInit);

let serverAdminPasswordHash = null;

// --- Загрузка базы из Supabase ---

async function loadAdminPasswordFromSupabase() {
  if (!window.supabaseClient) return;

  const { data, error } = await window.supabaseClient
    .from("settings")
    .select("value")
    .eq("key", "admin_password")
    .single();

  if (error) {
    console.error("Ошибка загрузки пароля из Supabase:", error);
    return;
  }

  serverAdminPasswordHash = data.value;
  console.log("Пароль админки загружен из Supabase");
}
// --- Загрузка AppConfig из Supabase ---
async function loadAppConfigFromSupabase() {
  if (!window.supabaseClient) return;

  const { data, error } = await window.supabaseClient
    .from("settings")
    .select("key, value")
    .in("key", ["maintenance_mode", "last_update", "app_version"]);

  if (error) {
    console.error("Ошибка загрузки AppConfig:", error);
    return;
  }

  data.forEach(row => {
    if (row.key === "maintenance_mode") {
      AppConfig.maintenanceMode = row.value === "true";
    }

    if (row.key === "last_update") {
      AppConfig.lastUpdate = row.value;
    }

    if (row.key === "app_version") {
      AppConfig.version = row.value;
    }
  });

  console.log("AppConfig загружен из Supabase:", AppConfig);

  updateContentVisibility();
  updateVersionInfo();
}


async function loadDatabaseFromSupabase() {
  if (!window.supabaseClient) {
    console.warn("Supabase client not ready yet");
    return;
  }

  const { data, error } = await window.supabaseClient
    .from("cards")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

// ОЧИЩАЕМ существующий объект, не создавая новый
for (const key in cardDatabase) {
  delete cardDatabase[key];
}

data.forEach(row => {
  cardDatabase[row.id] = {
    name: row.name,
    analogs: row.analogs || []
  };
});

window.cardDatabase = cardDatabase;

  console.log("База загружена из Supabase:", window.cardDatabase);
}

// --- Обновление даты последнего изменения карточек ---
async function updateLastUpdateDate() {
  const today = new Date().toLocaleDateString("ru-RU");

  AppConfig.lastUpdate = today;
  updateVersionInfo();

  if (!window.supabaseClient) return;

  const { error } = await window.supabaseClient
    .from("settings")
    .upsert([
      { key: "last_update", value: today }
    ]);

  if (error) {
    console.error("Ошибка обновления last_update:", error);
  }
}

async function logSearchToSupabase(query, found, matchType, matchedCardId) {
  if (!window.supabaseClient) return;

  const { error } = await window.supabaseClient
    .from("search_logs")
    .insert([{
      query: query,
      found: found,
      match_type: matchType,
      matched_card_id: matchedCardId || null
    }]);

  if (error) {
    console.error("Ошибка логирования поиска:", error);
  }
}
// === ЕДИНЫЙ ГЛОБАЛЬНЫЙ ОБЪЕКТ БАЗЫ ===
let cardDatabase = window.cardDatabase || {};
window.cardDatabase = cardDatabase;


// Проверка загрузки базы данных
if (typeof cardDatabase === 'undefined') {
    console.error('cardDatabase не загружен!');
    
    // Создаем пустой объект, чтобы избежать ошибок
    window.cardDatabase = {};
}

const AppConfig = {
    version: "1.2.1",
    lastUpdate: "17.01.2026",
    maintenanceMode: false
};


function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

// Глобальные переменные

let isAdminLoggedIn = false;

// Функции
function showDisclaimer() {
    const disclaimerPopup = document.getElementById('disclaimerPopup');
    if (!disclaimerPopup) {
        // Если дисклеймера нет, сразу инициализируем контент
        initMainContent();
        return;
    }
    
    disclaimerPopup.style.display = 'flex';
    
    // Добавляем анимацию появления
    setTimeout(() => {
        disclaimerPopup.style.opacity = '1';
    }, 10);
    
    // Обработчик кнопки принятия
    const acceptButton = document.getElementById('acceptDisclaimer');
    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            disclaimerPopup.style.opacity = '0';
            
            // После завершения анимации исчезновения скрываем попап
            setTimeout(() => {
                disclaimerPopup.style.display = 'none';
                // Показываем основной контент в зависимости от режима
                initMainContent();
            }, 300);
        });
    }
    
    // Обработчик кнопки отказа
    const declineButton = document.getElementById('declineDisclaimer');
    if (declineButton) {
        declineButton.addEventListener('click', function() {
            disclaimerPopup.style.opacity = '0';
            
            // После завершения анимации исчезновения скрываем попап
            setTimeout(() => {
                disclaimerPopup.style.display = 'none';
                // Показываем страницу "приложение недоступно"
                showAppUnavailable();
            }, 300);
        });
    }
}

// Функция для показа страницы "Приложение недоступно"
function showAppUnavailable() {
    const unavailablePage = document.getElementById('appUnavailable');
    const refreshButton = document.getElementById('refreshPage');
    
    if (unavailablePage) {
        unavailablePage.style.display = 'flex';
        
        // Добавляем анимацию появления
        setTimeout(() => {
            unavailablePage.style.opacity = '1';
        }, 10);
    }
    
    // Обработчик кнопки обновления страницы
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            location.reload();
        });
    }
}

function initMainContent() {
    updateContentVisibility();
    
    if (!AppConfig.maintenanceMode) {
        // Инициализация основного функционала только если не режим техработ
        initApplication();
    }
}

// Функция для обновления видимости контента
function updateContentVisibility() {
    const maintenanceElement = document.getElementById('maintenance');
    const normalSiteElement = document.getElementById('normalSite');
    
    if (AppConfig.maintenanceMode) {
        // Показываем полноэкранную страницу техработ
        if (maintenanceElement) maintenanceElement.style.display = 'block';
        if (normalSiteElement) normalSiteElement.style.display = 'none';
        
        // Инициализация анимации техработ
        initMaintenanceAnimation();
    } else {
        // Показываем основной сайт
        if (maintenanceElement) maintenanceElement.style.display = 'none';
        if (normalSiteElement) normalSiteElement.style.display = 'block';
    }
}

function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.glow-on-hover');
    
    if (searchInput) {
      
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchCard();
            }
        });
        searchInput.addEventListener("input", function () {
  showAutocomplete(this.value);
});
        // Для мобильных - скрываем клавиатуру после поиска
        searchInput.addEventListener('search', function() {
            if (window.innerWidth <= 768) {
                this.blur();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', searchCard);
        
        // Вибрация на мобильных при клике
        searchButton.addEventListener('touchstart', function() {
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }, { passive: true });
    }
}

function updateVersionInfo() {
    const dateElement = document.getElementById('lastUpdateDate');
    if (dateElement) {
        dateElement.textContent = AppConfig.lastUpdate;
    }
    
    const updateInfoElement = document.getElementById('updateInfo');
    if (updateInfoElement) {
        updateInfoElement.style.display = 'flex';
    }
}

function initMaintenanceAnimation() {
    // Очищаем предыдущий интервал если есть
    if (window.maintenanceInterval) {
        clearInterval(window.maintenanceInterval);
    }
    
    let progress = 42;
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const versionNumber = document.getElementById('versionNumber');
    
    // Устанавливаем версию
    if (versionNumber) {
        versionNumber.textContent = AppConfig.version;
    }
    
    // Устанавливаем начальное значение прогресса
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressPercent) progressPercent.textContent = progress + '%';
    
    window.maintenanceInterval = setInterval(() => {
        progress = (progress + Math.floor(Math.random() * 3) + 1) % 100;
        
        // Обновляем прогресс бар
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressPercent) progressPercent.textContent = progress + '%';
        
    }, 2500);
}

// Функция для показа красивого попапа с ошибкой
function showError(message) {
    const popup = document.getElementById('errorPopup');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!popup || !errorMessage) return;
    
    errorMessage.textContent = message;
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    const closePopup = () => {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    };
    
    const closeButton = document.querySelector('.error-close-btn');
    if (closeButton) {
        closeButton.onclick = closePopup;
    }
    
    popup.onclick = function(e) {
        if (e.target === popup) closePopup();
    };
    
    // Закрытие по Escape
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    
    document.addEventListener('keydown', escapeHandler);
}

// Функция для показа toast-уведомлений
function showToast(message, type = 'info', duration = 3000) {
    // Создаем контейнер для toast, если его нет
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Создаем toast элемент
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Определяем иконку в зависимости от типа
    let icon = 'ℹ️';
    switch (type) {
        case 'success':
            icon = '✅';
            break;
        case 'error':
            icon = '❌';
            break;
        case 'warning':
            icon = '⚠️';
            break;
        case 'info':
            icon = 'ℹ️';
            break;
    }
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <span class="toast-close" onclick="this.parentElement.remove()">×</span>
    `;
    
    // Добавляем toast в контейнер
    container.appendChild(toast);
    
    // Показываем toast с анимацией
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// === УТИЛИТЫ ДЛЯ УЛУЧШЕННОГО ПОИСКА ===

// Левенштейн (опечатки)
function levenshtein(a, b) {
  if (!a || !b) return Math.max(a?.length || 0, b?.length || 0);

  const matrix = Array.from({ length: b.length + 1 }, () => []);
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1)
      );
    }
  }
  return matrix[b.length][a.length];
}

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]/gi, "");
}
function showAutocomplete(queryRaw) {
  const list = document.getElementById("autocompleteList");
  if (!list) return;

  const query = normalize(queryRaw);
  list.innerHTML = "";

  if (query.length < 2) {
    list.style.display = "none";
    return;
  }

  let matches = [];

  for (const [key, card] of Object.entries(cardDatabase)) {
    const keyNorm = normalize(key);
    const nameNorm = normalize(card.name || "");
    const analogsNorm = (card.analogs || []).map(a => normalize(a));

    if (
      keyNorm.includes(query) ||
      nameNorm.includes(query) ||
      analogsNorm.some(a => a.includes(query))
    ) {
      matches.push({ key, ...card });
    }

    if (matches.length >= 5) break;
  }

  if (matches.length === 0) {
    list.style.display = "none";
    return;
  }

  list.innerHTML = matches.map(card => `
    <div class="autocomplete-item" data-article="${card.key}">
      <span class="autocomplete-article">${card.key}</span>
      <span class="autocomplete-name">${card.name}</span>
    </div>
  `).join("");

  list.style.display = "block";

  list.querySelectorAll(".autocomplete-item").forEach(item => {
    item.addEventListener("click", () => {
      const article = item.dataset.article;
      document.getElementById("searchInput").value = article;
      list.style.display = "none";
      searchCard();
    });
  });
}




/* === ПОИСК === */
function searchCard() {
  const inputElement = document.getElementById("searchInput");
  if (!inputElement) {
    showError("Поле ввода не найдено!");
    return;
  }

  const queryRaw = inputElement.value.trim();
  if (queryRaw.length < 3) {
    showError("Введите минимум 3 символа!");
    return;
  }

  if (window.innerWidth <= 768) inputElement.blur();

  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";

  setTimeout(() => {
    const query = normalize(queryRaw);
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = "";

    let foundCards = [];
    let matchType = null;
    let matchedCardId = null;

for (const [key, card] of Object.entries(cardDatabase)) {
  const keyNorm = normalize(key);
  const nameNorm = normalize(card.name || "");
  const analogsNorm = (card.analogs || []).map(a => normalize(a));

  // 1️⃣ Точное совпадение артикула
  if (keyNorm === query) {
    foundCards.push({ article: key, ...card, reason: "точное совпадение" });
    matchType = "direct";
    matchedCardId = key;
    continue;
  }

  // 2️⃣ Частичное совпадение артикула ✅
  if (keyNorm.includes(query)) {
    foundCards.push({ article: key, ...card, reason: "часть артикула" });
    if (!matchType) {
      matchType = "partial_id";
      matchedCardId = key;
    }
    continue;
  }

  // 3️⃣ Совпадение по аналогу
  if (analogsNorm.includes(query)) {
    foundCards.push({ article: key, ...card, reason: "найдено по аналогу" });
    if (!matchType) {
      matchType = "analog";
      matchedCardId = key;
    }
    continue;
  }

  // 4️⃣ Частичное совпадение по названию
  if (nameNorm.includes(query)) {
    foundCards.push({ article: key, ...card, reason: "найдено по названию" });
    if (!matchType) {
      matchType = "name";
      matchedCardId = key;
    }
    continue;
  }
}



    if (foundCards.length > 0) {
      const output = foundCards.map(card => {
        const safeText = `${card.article} ${card.name}`.replace(/"/g, '&quot;');
        return `
          <div class="search-result">
            <h3 class="copyable" onclick="copyToClipboard('${safeText}', this)">
              ${card.article} ${card.name}
            </h3>
            <small style="color:#666;">${card.reason}</small>
          </div>
        `;
      }).join("");

      resultElement.innerHTML = output;
      logSearchToSupabase(queryRaw, true, matchType, matchedCardId);
    } else {
      resultElement.innerHTML = `
        <div class="not-found-animation">
          <p>Карточка не найдена. Возможно карточка не имеет аналогов или её еще нет в базе.</p>
          <img src="sad.gif" alt="Грустный смайлик" class="sad-gif">
        </div>
      `;
      logSearchToSupabase(queryRaw, false, null, null);
    }

    if (loader) loader.style.display = "none";
  }, 500);
}

// Проверка пароля (исправленная версия)
async function checkPassword(event) {
    if (event) {
        event.preventDefault();
    }
    
    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) {
        showError("Поле для ввода пароля не найдено!");
        return false;
    }
    
    const password = passwordInput.value;
    
    // Простая анимация загрузки
    const submitBtn = document.querySelector('.password-submit') || document.querySelector('.submit-button');
    if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="submit-icon">⏳</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            if (simpleHash(password) === serverAdminPasswordHash) {
                // Успешный вход
                submitBtn.innerHTML = '<span class="submit-icon">✅</span>';
                
                // Переключаем режим техработ
                AppConfig.maintenanceMode = !AppConfig.maintenanceMode;
                
               // Сохраняем состояние в Supabase
if (window.supabaseClient) {
  window.supabaseClient
    .from("settings")
    .upsert([
      { key: "maintenance_mode", value: AppConfig.maintenanceMode.toString() }
    ])
    .then(({ error }) => {
      if (error) {
        console.error("Ошибка сохранения maintenance_mode:", error);
      }
    });
}
                
                setTimeout(() => {
                    if (AppConfig.maintenanceMode) {
                        showMaintenanceMessage('Режим техработ включен', 'success');
                    } else {
                        showMaintenanceMessage('Режим техработ выключен', 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                    
                    const passwordForm = document.getElementById('passwordForm');
                    if (passwordForm) {
                        passwordForm.style.display = 'none';
                    }
                    
                    passwordInput.value = '';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHtml;
                        submitBtn.disabled = false;
                        updateContentVisibility();
                    }, 1000);
                    
                }, 1000);
                
            } else {
                submitBtn.innerHTML = '<span class="submit-icon">❌</span>';
                
                setTimeout(() => {
                    showError('Неверный пароль!');
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.disabled = false;
                    passwordInput.value = '';
                    passwordInput.focus();
                }, 1000);
            }
        }, 1000);
    }
    
    return false;
}

// Функция для показа сообщений в режиме техработ
function showMaintenanceMessage(message, type = 'info') {
    // Создаем элемент сообщения
    const messageDiv = document.createElement('div');
    messageDiv.className = `maintenance-message maintenance-message-${type}`;
    messageDiv.innerHTML = `
        <span class="message-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="message-text">${message}</span>
    `;
    
    // Добавляем в контейнер
    const container = document.querySelector('.maintenance-content') || document.body;
    container.appendChild(messageDiv);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

function copyToClipboard(text, element) {
    try {
        // Декодируем HTML-сущности обратно в символы
        const decodedText = text.replace(/&quot;/g, '"');
        navigator.clipboard.writeText(decodedText).then(() => {
            if (element) {
                element.style.color = "#d62300";
                setTimeout(() => {
                    if (element) element.style.color = "";
                }, 500);
            }
            
            // Показываем toast-уведомление
            showToast(`Артикул ${decodedText} скопирован!`, 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            showToast('Не удалось скопировать артикул', 'error');
        });
    } catch (err) {
        console.error('Ошибка в copyToClipboard:', err);
        showToast('Произошла ошибка при копировании', 'error');
    }
}

// Обработчик кнопки админа
const adminBtn = document.getElementById('adminBtn');
if (adminBtn) {
    adminBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        const passwordForm = document.getElementById('passwordForm');
        if (!passwordForm) return;
        
        const isVisible = passwordForm.style.display === 'block';
        passwordForm.style.display = isVisible ? 'none' : 'block';
        
        // Анимация стрелки (если есть)
        const arrow = this.querySelector('.btn-arrow');
        if (arrow) {
            arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });
}

// Обработчик Enter в поле пароля
const adminPasswordInput = document.getElementById('adminPassword');
if (adminPasswordInput) {
    adminPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkPassword(e);
        }
    });
}

// Функция для показа уведомления о скачивании
function setupDownloadNotifications() {
    const downloadLinks = document.querySelectorAll('a[download]');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Показываем loader
            const loader = document.getElementById("loader");
            if (loader) {
                loader.style.display = "flex";
            }
            
            // Показываем уведомление через 500ms
            setTimeout(() => {
                showDownloadNotification();
            }, 500);
            
            // Скрываем loader через 2 секунды (автоматически)
            setTimeout(() => {
                if (loader) {
                    loader.style.display = "none";
                }
            }, 2000);
        });
    });
}

// Функция для показа уведомления
function showDownloadNotification() {
    showToast('Файл заказа скачивается', 'info', 3000);
}

// Функция для показа Google Form
function showGoogleForm() {
    const modal = document.getElementById('googleFormModal');
    const iframe = document.getElementById('googleFormFrame');
    
    if (!modal || !iframe) return;
    
    // URL с параметрами для лучшей читаемости
    iframe.src = "https://docs.google.com/forms/d/e/1FAIpQLSeBAriiKfofclBy12DGjWXL223yCoDvYxcp0xF4C79RQ8Psjw/viewform?usp=preview";
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    
    // Показываем loader
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "flex";
    }
    
    iframe.onload = function() {
        if (loader) {
            loader.style.display = "none";
        }
    };
    
    setTimeout(() => {
        if (loader) {
            loader.style.display = "none";
        }
    }, 4000);
}

// Функция для закрытия Google Form
function closeGoogleForm() {
    const modal = document.getElementById('googleFormModal');
    const iframe = document.getElementById('googleFormFrame');
    
    if (!modal || !iframe) return;
    
    modal.style.display = "none";
    iframe.src = "";
    document.body.style.overflow = "";
}

// Закрытие по клику вне области
window.onclick = function(event) {
    const modal = document.getElementById('googleFormModal');
    if (event.target == modal) {
        closeGoogleForm();
    }
}

// Админ функции
function hideAdminLogin() {
    const form = document.getElementById('adminLoginForm');
    if (form) form.style.display = 'none';
}

function loginAdmin() {
    const password = document.getElementById('adminLoginPassword').value;
    if (simpleHash(password) === serverAdminPasswordHash) {
        isAdminLoggedIn = true;
        loadCustomCards(); // Загружаем кастомные карточки для админа
        document.getElementById('adminLoginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('adminOverlay').style.display = 'block';
        document.getElementById('adminAccessBtn').style.display = 'none';
        // Смещаем основной контент влево
        const container = document.querySelector('.container');
        if (container) {
            container.style.position = 'relative';
            container.style.left = '-400px';
        }
        // Смещаем дисклеймер
        const disclaimer = document.querySelector('.disclaimer-content');
        if (disclaimer) {
            disclaimer.style.position = 'relative';
            disclaimer.style.left = '-400px';
        }
        showAdminMessage('Добро пожаловать в базу данных!', 'success');
    } else {
        showAdminMessage('Неверный пароль!', 'error');
    }
    document.getElementById('adminLoginPassword').value = '';
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminOverlay').style.display = 'none';
    document.getElementById('adminAccessBtn').style.display = 'inline-block';
    // Возвращаем основной контент в центр
    const container = document.querySelector('.container');
    if (container) {
        container.style.position = '';
        container.style.left = '';
    }
    // Возвращаем дисклеймер
    const disclaimer = document.querySelector('.disclaimer-content');
    if (disclaimer) {
        disclaimer.style.position = '';
        disclaimer.style.left = '';
    }
    isAdminLoggedIn = false;
}

function showAdminMessage(message, type) {
    // Преобразуем типы админ-сообщений в типы toast
    let toastType = 'info';
    if (type === 'success') {
        toastType = 'success';
    } else if (type === 'error') {
        toastType = 'error';
    }
    
    showToast(message, toastType);
}

// Загружаем кастомные карточки из localStorage (только для сессии админа)
function loadCustomCards() {
    if (isAdminLoggedIn) {
        const customCards = JSON.parse(localStorage.getItem('customCards') || '{}');
        // Добавляем только те, которых нет в основной базе
        for (const [key, value] of Object.entries(customCards)) {
            if (!cardDatabase[key]) {
                cardDatabase[key] = value;
            }
        }
    }
}


function showTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Показываем выбранную вкладку
    document.getElementById(tabName + 'Tab').style.display = 'block';
    event.target.classList.add('active');
}

function searchCardsForEdit() {
    const searchTerm = document.getElementById('editSearch').value.toLowerCase().trim();
    const listDiv = document.getElementById('editCardList');
    
    if (!searchTerm) {
        listDiv.innerHTML = '<p>Введите поисковый запрос</p>';
        return;
    }
    
    let results = [];
    
    for (const [key, card] of Object.entries(cardDatabase)) {
        if (key.toLowerCase().includes(searchTerm) || 
            card.name.toLowerCase().includes(searchTerm) ||
            card.analogs.some(analog => analog.toLowerCase().includes(searchTerm))) {
            results.push({ key, ...card });
        }
    }
    
    if (results.length === 0) {
        listDiv.innerHTML = '<p>Карточки не найдены</p>';
        return;
    }
    
    listDiv.innerHTML = results.map(card => `
        <div class="edit-card-item">
            <div>
                <strong>${card.key}</strong>: ${card.name}
                <br><small>Аналоги: ${card.analogs.join(', ') || 'нет'}</small>
            </div>
            <button onclick="editCard('${card.key}')">Редактировать</button>
        </div>
    `).join('');
}

function editCard(key) {
    const card = cardDatabase[key];
    if (!card) return;
    
    document.getElementById('editCardKey').value = key;
    document.getElementById('editCardId').value = key;
    document.getElementById('editCardName').value = card.name;
    document.getElementById('editCardAnalogs').value = card.analogs.join(', ');
    
    document.getElementById('editForm').style.display = 'block';
    document.getElementById('editCardList').style.display = 'none';
}

function cancelEdit() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('editCardList').style.display = 'block';
    document.getElementById('updateCardForm').reset();
}

async function updateCard(event) {
    event.preventDefault();

    console.log("updateCard called");

    const oldKey = document.getElementById("editCardKey").value;
    const newKey = document.getElementById("editCardId").value.trim();
    const name = document.getElementById("editCardName").value.trim();
    const analogsRaw = document.getElementById("editCardAnalogs").value.trim();

    if (!newKey || !name) {
        showAdminMessage("Заполните артикул и название", "error");
        return;
    }

    const analogs = analogsRaw
        ? analogsRaw.split(",").map(a => a.trim()).filter(a => a.length > 0)
        : [];

    console.log("Old Key:", oldKey, "New Key:", newKey, "Name:", name, "Analogs:", analogs);

    // Если поменяли ID — удаляем старую строку
    if (oldKey !== newKey && window.supabaseClient) {
        await window.supabaseClient
            .from("cards")
            .delete()
            .eq("id", oldKey);
    }

    // Записываем новую
    if (window.supabaseClient) {
        const { error } = await window.supabaseClient
            .from("cards")
            .upsert([{
                id: newKey,
                name: name,
                analogs: analogs
            }]);

        if (error) {
            console.error("Supabase upsert error:", error);
            showAdminMessage("Ошибка обновления в Supabase", "error");
            return;
        }

        console.log("Supabase update success");
    }

    // Локально
    document.getElementById("editForm").style.display = "none";
    showAdminMessage("Карточка обновлена", "success");
  await updateLastUpdateDate();
await loadDatabaseFromSupabase();
    searchCardsForEdit();
  initSearchFunctionality();
initAdminSearchEnter();
}


// === УДАЛЕНИЕ КАРТОЧКИ ИЗ SUPABASE ===
async function deleteCurrentCard() {
    const cardKey = document.getElementById("editCardKey").value;

    if (!cardKey) {
        showAdminMessage("Карточка не выбрана", "error");
        return;
    }

    if (!confirm("Удалить карточку " + cardKey + "?")) return;

    if (!window.supabaseClient) {
        showAdminMessage("Supabase не подключён", "error");
        return;
    }

    const { error } = await window.supabaseClient
        .from("cards")
        .delete()
        .eq("id", cardKey);

    if (error) {
        console.error("Ошибка удаления:", error);
        showAdminMessage("Ошибка удаления карточки", "error");
        return;
    }

    // Удаляем локально

  const searchInput = document.getElementById("searchInput");
if (searchInput) searchInput.focus();
  
    // Скрываем форму
    document.getElementById("editForm").style.display = "none";

    // Очищаем поиск
    const editSearch = document.getElementById("editSearch");
    if (editSearch) editSearch.value = "";

    // Перерисовываем список
    await loadDatabaseFromSupabase();
    searchCardsForEdit();
    showAdminMessage("Карточка удалена", "success");
    await updateLastUpdateDate();
  initSearchFunctionality();
initAdminSearchEnter();
}


// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Не предотвращаем отправку форм - обрабатываем в отдельных функциях
    
    
    // Показываем дисклеймер только если не режим техработ
    if (!AppConfig.maintenanceMode) {
        showDisclaimer();
    } else {
        // Если режим техработ - сразу инициализируем контент
        initMainContent();
    }
    
    // Инициализация для мобильных устройств
    initMobileFeatures();
  initSearchFunctionality();
  initAdminSearchEnter();
});

// Инициализация мобильных функций
function initMobileFeatures() {
    // Предотвращение масштабирования при двойном тапе
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Фикс для 100vh на мобильных
    function setRealViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setRealViewportHeight();
    window.addEventListener('resize', setRealViewportHeight);
    window.addEventListener('orientationchange', setRealViewportHeight);
}

function initApplication() {
    // Инициализация даты обновления
    updateVersionInfo();
    
    // Инициализация обработчика для кнопки проверки пароля
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            checkPassword(e);
        });
    }
    
    // Инициализация уведомлений для скачивания
    setupDownloadNotifications();
    
    // Плавная прокрутка для меню на мобильных
    const topMenu = document.querySelector('.top-menu');
    if (topMenu && window.innerWidth <= 768) {
        topMenu.addEventListener('wheel', function(e) {
            e.preventDefault();
            topMenu.scrollLeft += e.deltaY;
        }, { passive: false });
        
        // Добавляем touch-скролл для мобильных
        let isDragging = false;
        let startX;
        let scrollLeft;
        
        topMenu.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - topMenu.offsetLeft;
            scrollLeft = topMenu.scrollLeft;
        }, { passive: true });
        
        topMenu.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].pageX - topMenu.offsetLeft;
            const walk = (x - startX) * 2;
            topMenu.scrollLeft = scrollLeft - walk;
        }, { passive: false });
        
        topMenu.addEventListener('touchend', () => {
            isDragging = false;
        }, { passive: true });
    }
}

async function addCard(event) {
    event.preventDefault();

    console.log("addCard called");

    const id = document.getElementById("cardId").value.trim();
    const name = document.getElementById("cardName").value.trim();
    const analogsRaw = document.getElementById("cardAnalogs").value.trim();

    if (!id || !name) {
        showAdminMessage("Заполните артикул и название", "error");
        return;
    }

    const analogs = analogsRaw
        ? analogsRaw.split(",").map(a => a.trim()).filter(a => a.length > 0)
        : [];

    // Локально

    console.log("Added to cardDatabase:", cardDatabase[id]);

    // В Supabase
    if (window.supabaseClient) {
        const { error } = await window.supabaseClient
            .from("cards")
            .insert([{
                id: id,
                name: name,
                analogs: analogs
            }]);

        if (error) {
            console.error("Supabase insert error:", error);
            showAdminMessage("Ошибка записи в Supabase", "error");
            return;
        }

        console.log("Supabase insert success");
    }

    document.getElementById("addCardForm").reset();
    showAdminMessage("Карточка добавлена", "success");
await loadDatabaseFromSupabase();
    if (typeof searchCardsForEdit === "function") {
        searchCardsForEdit();
    }
  await updateLastUpdateDate();
  initSearchFunctionality();
initAdminSearchEnter();
}

function initAdminSearchEnter() {
    const editSearchInput = document.getElementById("editSearch");
    if (!editSearchInput) return;

    editSearchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            searchCardsForEdit();
        }
    });
}
// Инициализация админ доступа
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики для админ кнопок
    const adminBtn = document.getElementById('adminAccessBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', function() {
            document.getElementById('adminLoginForm').style.display = 'flex';
        });
    }
    
    // Убираем addEventListener для форм, поскольку onsubmit уже обрабатывает
    // const addForm = document.getElementById('addCardForm');
    // if (addForm) {
    //     addForm.addEventListener('submit', addCard);
    // }
    
    // const updateForm = document.getElementById('updateCardForm');
    // if (updateForm) {
    //     updateForm.addEventListener('submit', updateCard);
    // }
});

// Закрытие по ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeGoogleForm();
        
        // Также закрываем ошибки если они открыты
        const errorPopup = document.getElementById('errorPopup');
        if (errorPopup && errorPopup.style.display === 'block') {
            errorPopup.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        // Закрываем админ логин и панель
        hideAdminLogin();
        closeAdminPanel();
    }
});

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('searchInput').focus();
}

// Экспорт функций для глобального доступа
window.clearSearch = clearSearch;
window.checkPassword = checkPassword;
window.copyToClipboard = copyToClipboard;
window.showGoogleForm = showGoogleForm;
window.closeGoogleForm = closeGoogleForm;
window.loginAdmin = loginAdmin;
window.hideAdminLogin = hideAdminLogin;
window.loadCustomCards = loadCustomCards;
window.addCard = addCard;
window.showTab = showTab;
window.searchCardsForEdit = searchCardsForEdit;
window.editCard = editCard;
window.cancelEdit = cancelEdit;
window.updateCard = updateCard;
window.closeAdminPanel = closeAdminPanel;


// Скрытие автоподсказок при клике вне поля
document.addEventListener("click", function (e) {
  const list = document.getElementById("autocompleteList");
  const input = document.getElementById("searchInput");

  if (!list || !input) return;

  if (!list.contains(e.target) && e.target !== input) {
    list.style.display = "none";
  }
});


