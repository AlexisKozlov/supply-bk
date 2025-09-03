// В начале файла script.js
if (typeof cardDatabase === 'undefined') {
    console.error('cardDatabase не загружен!');
    showError('База данных не загружена. Пожалуйста, обновите страницу.');
    
    // Создаем пустой объект, чтобы избежать ошибок
    window.cardDatabase = {};
}

const AppConfig = {
    version: "1.2.1",
    lastUpdate: "03.09.2025",
    maintenanceMode: true,
    adminPassword: "157"
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Всегда показываем дисклеймер при загрузке страницы
    showDisclaimer();
    
    // Инициализация частиц
    particlesJS('particles-js', {
        particles: {
            number: { 
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: { 
                value: ["#d62300", "#ffcc00", "#12168c"] 
            },
            shape: { 
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#d62300",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
});

function initApplication() {
    // Инициализация даты обновления
    updateVersionInfo();
    
    // Инициализация обработчика для кнопки проверки пароля
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', checkPassword);
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
    }
}

function showDisclaimer() {
    const disclaimerPopup = document.getElementById('disclaimerPopup');
    if (!disclaimerPopup) return;
    
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
    if (AppConfig.maintenanceMode) {
        // Показываем полноэкранную страницу техработ
        const maintenanceElement = document.getElementById('maintenance');
        const normalSiteElement = document.getElementById('normalSite');
        
        if (maintenanceElement) maintenanceElement.style.display = 'block';
        if (normalSiteElement) normalSiteElement.style.display = 'none';
        
        // Инициализация анимации техработ
        initMaintenanceAnimation();
    } else {
        // Показываем основной сайт
        const maintenanceElement = document.getElementById('maintenance');
        const normalSiteElement = document.getElementById('normalSite');
        
        if (maintenanceElement) maintenanceElement.style.display = 'none';
        if (normalSiteElement) normalSiteElement.style.display = 'block';
        
        // Инициализация основного функционала
        initSearchFunctionality();
        initApplication();
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
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', searchCard);
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
    let progress = 42;
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const versionNumber = document.getElementById('versionNumber');
    
    // Устанавливаем версию
    if (versionNumber) {
        versionNumber.textContent = AppConfig.version;
    }
    
    const progressInterval = setInterval(() => {
        progress = (progress + Math.floor(Math.random() * 3) + 1) % 100;
        
        // Обновляем прогресс бар
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressPercent) progressPercent.textContent = progress + '%';
        
    }, 2500);
    
    // Сохраняем ID интервала для возможной очистки
    window.maintenanceInterval = progressInterval;
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

// Проверка пароля (обновленная версия)
function checkPassword() {
    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) {
        showError("Поле для ввода пароля не найдено!");
        return;
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
                
                setTimeout(() => {
                    if (AppConfig.maintenanceMode) {
                        // Показываем сообщение о успешном включении техработ
                        showMaintenanceMessage('Режим техработ включен', 'success');
                    } else {
                        // Показываем сообщение о выключении техработ
                        showMaintenanceMessage('Режим техработ выключен', 'success');
                        // Перезагружаем страницу через 2 секунды
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                    
                    // Скрываем форму ввода пароля
                    const passwordForm = document.getElementById('passwordForm');
                    if (passwordForm) {
                        passwordForm.style.display = 'none';
                    }
                    
                    // Очищаем поле ввода
                    passwordInput.value = '';
                    
                    // Восстанавливаем кнопку
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHtml;
                        submitBtn.disabled = false;
                    }, 1000);
                    
                }, 1000);
                
            } else {
                // Неверный пароль
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

// Обработчик кнопки админа для новой версии
const adminBtn = document.getElementById('adminBtn');
if (adminBtn) {
    adminBtn.addEventListener('click', function() {
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
            checkPassword();
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
    iframe.src = "https://docs.google.com/forms/d/e/1FAIpQLSfick6AUSCsKKQZJ0odbymaM0-pB9c_jX_BbndSqSJypjBxLA/viewform?embedded=true";
    
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
    }
});

// Глобальные функции для HTML
window.searchCard = searchCard;
window.checkPassword = checkPassword;
window.copyToClipboard = copyToClipboard;
window.showGoogleForm = showGoogleForm;
window.closeGoogleForm = closeGoogleForm;
