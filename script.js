// В начале файла script.js
if (typeof cardDatabase === 'undefined') {
    console.error('cardDatabase не загружен!');
    showError('База данных не загружена. Пожалуйста, обновите страницу.');
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
});

function initApplication() {
    // Инициализация элементов
    const adminBtn = document.getElementById('adminBtn');
    const passwordForm = document.getElementById('passwordForm');
    
    // Администрирование
    if (adminBtn && passwordForm) {
        adminBtn.addEventListener('click', function() {
            // Переключаем видимость формы ввода пароля
            passwordForm.style.display = passwordForm.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Инициализация даты обновления
    updateVersionInfo();
    
    // Инициализация обработчика для кнопки проверки пароля
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', checkPassword);
    }
    
    // Инициализация уведомлений для скачивания
    setupDownloadNotifications();
}

function showDisclaimer() {
    const disclaimerPopup = document.getElementById('disclaimerPopup');
    disclaimerPopup.style.display = 'flex';
    
    // Добавляем анимацию появления
    setTimeout(() => {
        disclaimerPopup.style.opacity = '1';
    }, 10);
    
// Обновляем обработчик кнопки админа
document.getElementById('adminBtn').addEventListener('click', function() {
    const passwordForm = document.getElementById('passwordForm');
    const isVisible = passwordForm.style.display === 'block';
    
    passwordForm.style.display = isVisible ? 'none' : 'block';
    
    // Анимация стрелки
    const arrow = this.querySelector('.btn-arrow');
    arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
});

// Добавляем обработчик Enter в поле пароля
document.getElementById('adminPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});



function initMainContent() {
    if (AppConfig.maintenanceMode) {
        document.getElementById('maintenance').style.display = 'block';
        document.getElementById('normalSite').style.display = 'none';
        
        // Инициализация анимации техработ
        initMaintenanceAnimation();
    } else {
        document.getElementById('maintenance').style.display = 'none';
        document.getElementById('normalSite').style.display = 'block';
        
        // Инициализация основного функционала
        initSearchFunctionality(); // ← Эта строка должна быть вызвана
        initApplication();
    }
}

function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.glow-on-hover'); // Добавьте эту строку
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchCard();
            }
        });
    }
    
    // Добавьте этот блок для обработки клика по кнопке
    if (searchButton) {
        searchButton.addEventListener('click', searchCard);
    }
}

function updateVersionInfo() {
    const dateElement = document.getElementById('lastUpdateDate');
    if (dateElement) {
        dateElement.textContent = AppConfig.lastUpdate;
    }
    document.getElementById('updateInfo').style.display = 'flex';
}

// Обновленная функция для техработ
function initMaintenanceAnimation() {
    let progress = 42;
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const versionNumber = document.getElementById('versionNumber');
    
    // Устанавливаем версию
    versionNumber.textContent = AppConfig.version;
    
    const progressInterval = setInterval(() => {
        progress = (progress + Math.floor(Math.random() * 3) + 1) % 100;
        
        // Обновляем прогресс бар
        progressFill.style.width = progress + '%';
        progressPercent.textContent = progress + '%';
        
        // Меняем статус сообщения
        const statusMessages = [
            'Обновление базы данных',
            'Оптимизация поиска',
            'Проверка аналогов',
            'Синхронизация с сервером',
            'Тестирование системы'
        ];
        
        const randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];
        document.querySelector('.status-message span').textContent = randomMessage;
        
    }, 2500);
}

function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchCard();
            }
        });
    }
}

// Функция для показа красивого попапа с ошибкой
function showError(message) {
    const popup = document.getElementById('errorPopup');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем скроллинг
    
    const closePopup = () => {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    };
    
    document.querySelector('.error-close-btn').onclick = closePopup;
    popup.onclick = function(e) {
        if (e.target === popup) closePopup();
    };
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePopup();
    });
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
    
    // Проверяем существование лоадера перед показом
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "flex";
    }
    
    
    // Показываем loader
    document.getElementById("loader").style.display = "flex";

    // Через 1 секунду выполняем поиск и скрываем loader
    setTimeout(() => {
        let firstWord = article.split(" ")[0];
        let resultElement = document.getElementById("result");
        resultElement.innerHTML = "";
        let foundCards = [];
        
        if (cardDatabase[firstWord]) {
            foundCards.push({ article: firstWord, ...cardDatabase[firstWord] });
        }
        
        for (let key in cardDatabase) {
            if (cardDatabase[key].analogs.includes(firstWord)) {
                foundCards.push({ article: key, ...cardDatabase[key] });
            }
        }
        
        for (let key in cardDatabase) {
            if (cardDatabase[key].name.toLowerCase().includes(article.toLowerCase())) {
                foundCards.push({ article: key, ...cardDatabase[key] });
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
        
        document.getElementById("loader").style.display = "none";
    }, 700);
}

// Обновленная функция проверки пароля
function checkPassword() {
    const passwordInput = document.getElementById('adminPassword');
    const adminBtn = document.getElementById('adminBtn');
    
    if (!passwordInput) {
        showError("Поле для ввода пароля не найдено!");
        return;
    }
    
    const password = passwordInput.value;
    
    // Простая анимация загрузки
    const submitBtn = document.querySelector('.password-submit');
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
                document.getElementById('passwordForm').style.display = 'none';
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

function copyToClipboard(text, element) {
    try {
        // Декодируем HTML-сущности обратно в символы
        const decodedText = text.replace(/&quot;/g, '"');
        navigator.clipboard.writeText(decodedText).then(() => {
            element.style.color = "#d62300";
            setTimeout(() => element.style.color = "", 500);
            
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = `Артикул ${decodedText} скопирован!`;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 2000);
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            showError('Не удалось скопировать артикул');
        });
    } catch (err) {
        console.error('Ошибка в copyToClipboard:', err);
        showError('Произошла ошибка при копировании');
    }
}

// Показать форму для ввода пароля по клику на кнопку
document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('passwordForm').style.display = 'block';
});

// Плавная прокрутка для меню на мобильных
document.addEventListener('DOMContentLoaded', function() {
    const topMenu = document.querySelector('.top-menu');
    
    if (topMenu && window.innerWidth <= 768) {
        topMenu.addEventListener('wheel', function(e) {
            e.preventDefault();
            topMenu.scrollLeft += e.deltaY;
        }, { passive: false });
    }
});

// Функция для показа уведомления о скачивании
function setupDownloadNotifications() {
    const downloadLinks = document.querySelectorAll('a[download]');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Показываем loader
            document.getElementById("loader").style.display = "flex";
            
            // Показываем уведомление через 500ms
            setTimeout(() => {
                showDownloadNotification();
            }, 500);
            
            // Скрываем loader через 2 секунды (автоматически)
            setTimeout(() => {
                document.getElementById("loader").style.display = "none";
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}



// Функция для показа Google Form
function showGoogleForm() {
    const modal = document.getElementById('googleFormModal');
    const iframe = document.getElementById('googleFormFrame');
    
    // URL с параметрами для лучшей читаемости
    iframe.src = "https://docs.google.com/forms/d/e/1FAIpQLSfick6AUSCsKKQZJ0odbymaM0-pB9c_jX_BbndSqSJypjBxLA/viewform?embedded=true" +
                 "embedded=true&" +
                 "headers=false&" +
                 "margin=20&" +          // Добавляем немного отступов
                 "padding=20&" +         // Добавляем padding
                 "width=700&" +          // Оптимальная ширина
                 "height=600&" +         // Оптимальная высота
                 "fontSize=14px";        // Размер шрифта
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    
    // Показываем loader
    document.getElementById("loader").style.display = "flex";
    
    iframe.onload = function() {
        document.getElementById("loader").style.display = "none";
        
        // Пытаемся улучшить читаемость внутри iframe
        try {
            // Добавляем стили для лучшей читаемости
            const style = iframe.contentDocument.createElement('style');
            style.textContent = `
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    font-size: 14px !important;
                    line-height: 1.4 !important;
                    color: #333 !important;
                }
                input, textarea, select {
                    font-size: 14px !important;
                }
            `;
            iframe.contentDocument.head.appendChild(style);
        } catch (e) {
            // Ошибка из-за политики безопасности - это нормально
            console.log("Не удалось применить стили к iframe");
        }
    };
    
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 4000);
}
// Функция для закрытия Google Form
function closeGoogleForm() {
    const modal = document.getElementById('googleFormModal');
    const iframe = document.getElementById('googleFormFrame');
    
    modal.style.display = "none";
    iframe.src = ""; // Останавливаем загрузку
    document.body.style.overflow = ""; // Разблокируем скроллинг
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
    }
});


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
    const container = document.querySelector('.maintenance-content');
    container.appendChild(messageDiv);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

