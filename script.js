const AppConfig = {
    version: "1.2.1",
    lastUpdate: "27.08.2025",
    maintenanceMode: false,
    adminPassword: "157"
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Всегда показываем дисклеймер при загрузке страницы
    showDisclaimer();
    
    // Инициализация обработчиков, которые нужны сразу
    initEventListeners();
});

function initEventListeners() {
    // Обработчик для кнопки принятия дисклеймера
    const acceptBtn = document.getElementById('acceptDisclaimer');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            const disclaimerPopup = document.getElementById('disclaimerPopup');
            disclaimerPopup.style.opacity = '0';
            
            setTimeout(() => {
                disclaimerPopup.style.display = 'none';
                initMainContent();
            }, 300);
        });
    }
}

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
    
    // Инициализация поиска
    initSearchFunctionality();
}

function showDisclaimer() {
    const disclaimerPopup = document.getElementById('disclaimerPopup');
    if (disclaimerPopup) {
        disclaimerPopup.style.display = 'flex';
        
        // Добавляем анимацию появления
        setTimeout(() => {
            disclaimerPopup.style.opacity = '1';
        }, 10);
    }
}

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
        initApplication();
    }
}

function updateVersionInfo() {
    const dateElement = document.getElementById('lastUpdateDate');
    if (dateElement) {
        dateElement.textContent = AppConfig.lastUpdate;
    }
    document.getElementById('updateInfo').style.display = 'flex';
}

function initMaintenanceAnimation() {
    // Ваш код анимации для режима техработ
    let progress = 42;
    const progressInterval = setInterval(() => {
        progress = (progress + 1) % 100;
        const progressElement = document.getElementById('progressValue');
        if (progressElement) {
            progressElement.textContent = progress;
        }
    }, 3000);
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
        hideLoader();
        return;
    }
    
    let article = inputElement.value.trim();
    if (article.length < 3) {
        showError("Введите минимум 3 символа!");
        hideLoader();
        return;
    }
    
    // Показываем loader
    document.getElementById("loader").style.display = "flex";

    // Через 1 секунду выполняем поиск и скрываем loader
    setTimeout(() => {
        try {
            let firstWord = article.split(" ")[0];
            let resultElement = document.getElementById("result");
            resultElement.innerHTML = "";
            let foundCards = [];
            
            // Проверяем, существует ли база данных карточек
            if (typeof cardDatabase === 'undefined') {
                showError("База данных карточек не загружена!");
                hideLoader();
                return;
            }
            
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
                    // Проверяем, нет ли уже этой карточки в результатах
                    if (!foundCards.some(card => card.article === key)) {
                        foundCards.push({ article: key, ...cardDatabase[key] });
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
        } catch (error) {
            console.error("Ошибка при поиске:", error);
            showError("Произошла ошибка при поиске карточки");
        } finally {
            // Всегда скрываем loader
            hideLoader();
        }
    }, 700);
}

// Добавляем глобальную функцию для скрытия loader
function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }
}

// Добавляем обработчик ошибок
window.addEventListener('error', function(e) {
    console.error("Global error:", e.error);
    hideLoader();
});
