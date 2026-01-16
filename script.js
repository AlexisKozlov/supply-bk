// Проверка загрузки базы данных
if (typeof cardDatabase === 'undefined') {
    console.error('cardDatabase не загружен!');
    
    // Создаем пустой объект, чтобы избежать ошибок
    window.cardDatabase = {};
}

const AppConfig = {
    version: "1.2.1",
    lastUpdate: "17.01.2026",
    maintenanceMode: false,
    adminPassword: "157"
};

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
}

function initMainContent() {
    updateContentVisibility();
    
    // Инициализация темы
    initTheme();
    
    if (!AppConfig.maintenanceMode) {
        // Инициализация основного функционала только если не режим техработ
        initSearchFunctionality();
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

function searchCard() {
    let inputElement = document.getElementById("searchInput");
    if (!inputElement) {
        showError("Поле ввода не найдено!");
        return;
    }
    
    let article = inputElement.value.trim();
    if (article.length < 3) {
        showError("Введите минимум 3 символа!");
        return;
    }
    
    // Скрываем клавиатуру на мобильных
    if (window.innerWidth <= 768) {
        inputElement.blur();
    }
    
    // Показываем loader
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "flex";
    }
    
    // Через 1 секунду выполняем поиск и скрываем loader
    setTimeout(() => {
        let firstWord = article.split(" ")[0];
        let resultElement = document.getElementById("result");
        if (!resultElement) return;
        
        resultElement.innerHTML = "";
        let foundCards = [];
        
        // Проверяем, что база данных загружена
        if (typeof cardDatabase === 'object' && Object.keys(cardDatabase).length > 0) {
            if (cardDatabase[firstWord]) {
                foundCards.push({ article: firstWord, ...cardDatabase[firstWord] });
            }
            
            for (let key in cardDatabase) {
                if (cardDatabase[key].analogs && cardDatabase[key].analogs.includes(firstWord)) {
                    foundCards.push({ article: key, ...cardDatabase[key] });
                }
            }
            
            for (let key in cardDatabase) {
                if (cardDatabase[key].name && cardDatabase[key].name.toLowerCase().includes(article.toLowerCase())) {
                    // Проверяем дубликаты
                    if (!foundCards.some(card => card.article === key)) {
                        foundCards.push({ article: key, ...cardDatabase[key] });
                    }
                }
            }
        }
        
        if (foundCards.length > 0) {
            let output = foundCards.map(card => {
                const safeText = `${card.article} ${card.name}`.replace(/"/g, '&quot;');
                return `<h3 class="copyable" onclick="copyToClipboard('${safeText}', this)">${card.article} ${card.name}</h3>`;
            }).join("");
            resultElement.innerHTML = output;
        } else {
            resultElement.innerHTML = `
                <div class="not-found-animation">
                    <p>Карточка не найдена, возможно она не имеет аналогов или её пока нет в базе данных</p>
                    <img src="sad.gif" alt="Грустный смайлик" class="sad-gif">
                </div>
            `;
        }
        
        // Скрываем loader
        if (loader) {
            loader.style.display = "none";
        }
    }, 700);
}

// Проверка пароля (исправленная версия)
function checkPassword(event) {
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
            if (password === AppConfig.adminPassword) {
                // Успешный вход
                submitBtn.innerHTML = '<span class="submit-icon">✅</span>';
                
                // Переключаем режим техработ
                AppConfig.maintenanceMode = !AppConfig.maintenanceMode;
                
                // Сохраняем состояние в localStorage
                localStorage.setItem('maintenanceMode', AppConfig.maintenanceMode.toString());
                
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
            
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = `Артикул ${decodedText} скопирован!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 2000);
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            showError('Не удалось скопировать артикул');
        });
    } catch (err) {
        console.error('Ошибка в copyToClipboard:', err);
        showError('Произошла ошибка при копировании');
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
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <span class="notification-icon">✅</span>
        <span class="notification-text">Файл заказа скачивается</span>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
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
    if (password === AppConfig.adminPassword) {
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
        showAdminMessage('Добро пожаловать в админ панель!', 'success');
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
    const msgDiv = document.getElementById('adminMessage');
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.className = type;
        setTimeout(() => {
            msgDiv.textContent = '';
            msgDiv.className = '';
        }, 3000);
    }
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

function exportDatabase() {
    console.log('Exporting database, total cards:', Object.keys(cardDatabase).length);
    
    // Создаем строку с обновленной базой данных
    let dbString = 'var cardDatabase = {\n';
    
    for (const [key, value] of Object.entries(cardDatabase)) {
        dbString += `  ${JSON.stringify(key)}: {\n`;
        dbString += `    name: ${JSON.stringify(value.name)},\n`;
        dbString += `    analogs: ${JSON.stringify(value.analogs)}\n`;
        dbString += '  },\n';
    }
    
    // Убираем последнюю запятую
    dbString = dbString.slice(0, -2) + '\n';
    dbString += '};\n';
    
    console.log('Generated dbString length:', dbString.length);
    
    // Создаем blob и скачиваем
    const blob = new Blob([dbString], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cardDatabase.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAdminMessage('Файл cardDatabase.js скачан!', 'success');
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

function updateCard(event) {
    event.preventDefault();
    console.log('updateCard called');
    
    const oldKey = document.getElementById('editCardKey').value;
    const newKey = document.getElementById('editCardId').value.trim();
    const name = document.getElementById('editCardName').value.trim();
    const analogsStr = document.getElementById('editCardAnalogs').value.trim();
    
    console.log('Old Key:', oldKey, 'New Key:', newKey, 'Name:', name, 'Analogs:', analogsStr);
    
    if (!newKey || !name) {
        showAdminMessage('Заполните обязательные поля!', 'error');
        return;
    }
    
    if (newKey.length < 3) {
        showAdminMessage('Артикул должен содержать минимум 3 символа!', 'error');
        return;
    }
    
    // Если ID изменился, проверяем что новый не занят (кроме текущего)
    if (newKey !== oldKey && cardDatabase[newKey]) {
        showAdminMessage('Карточка с таким ID уже существует!', 'error');
        return;
    }
    
    const analogs = analogsStr ? analogsStr.split(',').map(a => a.trim()).filter(a => a) : [];
    
    // Если ID изменился, удаляем старую запись
    if (newKey !== oldKey) {
        delete cardDatabase[oldKey];
    }
    
    cardDatabase[newKey] = {
        name: name,
        analogs: analogs
    };
    
    console.log('Updated cardDatabase:', cardDatabase[newKey]);
    
    // Обновляем localStorage
    const customCards = JSON.parse(localStorage.getItem('customCards') || '{}');
    if (newKey !== oldKey) {
        delete customCards[oldKey];
    }
    customCards[newKey] = cardDatabase[newKey];
    localStorage.setItem('customCards', JSON.stringify(customCards));
    
    showAdminMessage('Карточка успешно обновлена!', 'success');
    
    // Скрываем форму редактирования
    cancelEdit();
    
    // Обновляем список
    searchCardsForEdit();
}

function clearLocalStorage() {
    const customCards = JSON.parse(localStorage.getItem('customCards') || '{}');
    
    // Удаляем кастомные карточки из cardDatabase
    for (const key of Object.keys(customCards)) {
        if (cardDatabase[key]) {
            delete cardDatabase[key];
        }
    }
    
    // Очищаем localStorage
    localStorage.removeItem('customCards');
    
    showAdminMessage('localStorage очищен! Тестовые карточки удалены.', 'success');
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Не предотвращаем отправку форм - обрабатываем в отдельных функциях
    
    // Загружаем сохраненное состояние техработ
    const savedMaintenanceMode = localStorage.getItem('maintenanceMode');
    if (savedMaintenanceMode) {
        AppConfig.maintenanceMode = savedMaintenanceMode === 'true';
    }
    
    // Показываем дисклеймер только если не режим техработ
    if (!AppConfig.maintenanceMode) {
        showDisclaimer();
    } else {
        // Если режим техработ - сразу инициализируем контент
        initMainContent();
    }
    
    // Инициализация для мобильных устройств
    initMobileFeatures();
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

function addCard(event) {
    event.preventDefault();
    console.log('addCard called');
    
    const id = document.getElementById('cardId').value.trim();
    const name = document.getElementById('cardName').value.trim();
    const analogsStr = document.getElementById('cardAnalogs').value.trim();
    
    console.log('ID:', id, 'Name:', name, 'Analogs:', analogsStr);
    
    if (!id || !name) {
        showAdminMessage('Заполните обязательные поля!', 'error');
        return;
    }
    
    if (id.length < 3) {
        showAdminMessage('Артикул должен содержать минимум 3 символа!', 'error');
        return;
    }
    
    if (cardDatabase[id]) {
        showAdminMessage('Карточка с таким ID уже существует!', 'error');
        return;
    }
    
    const analogs = analogsStr ? analogsStr.split(',').map(a => a.trim()).filter(a => a) : [];
    
    cardDatabase[id] = {
        name: name,
        analogs: analogs
    };
    
    console.log('Added to cardDatabase:', cardDatabase[id]);
    
    // Сохраняем в localStorage для persistence
    const customCards = JSON.parse(localStorage.getItem('customCards') || '{}');
    customCards[id] = cardDatabase[id];
    localStorage.setItem('customCards', JSON.stringify(customCards));
    
    showAdminMessage('Карточка успешно добавлена!', 'success');
    
    // Очищаем форму
    document.getElementById('addCardForm').reset();
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

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('.theme-icon');
            const themeText = themeToggle.querySelector('.theme-text');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Светлая тема';
        }
    } else {
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('.theme-icon');
            const themeText = themeToggle.querySelector('.theme-text');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Тёмная тема';
        }
    }
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Светлая тема';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Тёмная тема';
        localStorage.setItem('theme', 'light');
    }
}

// Экспорт функций для глобального доступа
window.clearSearch = clearSearch;
window.toggleTheme = toggleTheme;
window.checkPassword = checkPassword;
window.copyToClipboard = copyToClipboard;
window.showGoogleForm = showGoogleForm;
window.closeGoogleForm = closeGoogleForm;
window.loginAdmin = loginAdmin;
window.hideAdminLogin = hideAdminLogin;
window.exportDatabase = exportDatabase;
window.clearLocalStorage = clearLocalStorage;
window.loadCustomCards = loadCustomCards;
window.addCard = addCard;
window.showTab = showTab;
window.searchCardsForEdit = searchCardsForEdit;
window.editCard = editCard;
window.cancelEdit = cancelEdit;
window.updateCard = updateCard;
window.closeAdminPanel = closeAdminPanel;
window.clearSearch = clearSearch;


