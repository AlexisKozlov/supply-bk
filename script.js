// В самом начале script.js (ПЕРЕД объявлением cardDatabase)
const scriptVersion = "1.2.0"; // Увеличивайте это число при обновлениях
const lastUpdateDate = "26.05.2025"; // Меняйте эту дату вручную

// При загрузке
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('lastUpdateDate').textContent = lastUpdateDate;
    document.getElementById('updateInfo').style.display = 'flex';
});

// Переменная для контроля технических работ
let isMaintenance = false; //


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
// Функция для показа красивого попапа с ошибкой


const cardDatabase = { 
    "1054445": {
        name: "Стрипсы замороженные 1кг * 12шт",
        analogs: ["69097", "1054444", "1010023409", "69101"]
    },
    "566666": {
        name: "Дольки картофельные 12,5 кг",
        analogs: ["1010026090", "58553", "TRW01"]
    },
    "155555": {
        name: "Картофель \"фри\" 12,5 кг",
        analogs: ["FMS9", "58542", "68544", "555555"]
    },
        "58537": {
        name: "Картофель фри 10мм Farm Frites зам. 2,5 кг*5",
        analogs: ["FMS9", "58542", "68544", "555555"]
    },
    "69889": {
        name: "Лук красный марин. закус заморож. 6 уп * 500 г",
        analogs: ["69890"]
    },
    "511511": {
        name: "Минтай филе порции в панир. обжар. 5000 г",
        analogs: ["51174"]
    },
    "20048": {
        name: "Креветка Ваннамей в панировке 5 кг",
        analogs: ["51180", "51185"]
    },
    "67501": {
        name: "Луковый конфитюр 6 уп*500 гр.",
        analogs: ["67500"]
    },
    "69089": {
        name: "Гамбургеры \"Нежные\" замор. 5.5 кг",
        analogs: ["69086"]
    },
    "48662": {
        name: "Булочки для гамбургеров 3,75, 48 шт",
        analogs: ["69205", "69204"]
    },
    "48663": {
        name: "Булочки Воппер, 24 шт",
        analogs: ["55137", "34683"]
    },
    "55045": {
        name: "Булочка с кунжутом \"4\" ТРОЙНАЯ 78 г*24 шт",
        analogs: ["55045в"]
    },
    "68605": {
        name: "Тортильи 9Д, 120 шт в кор",
        analogs: ["68607", "68604"]
    },
    "58689": {
        name: "Луковые кольца 3 кг",
        analogs: ["1010026378", "58666", "58686"]
    },
    "67418": {
        name: "Пирожок с вишневой начинкой, 73г*36 шт.",
        analogs: ["67445"]
    },
    "69891": {
        name: "Лук жареный. Изделие замороженное. 3уп * 1кг",
        analogs: ["69870"]
    },
    "1054422": {
        name: "Наггетсы темпурные гот.зам. 2 кг*6 шт.",
        analogs: ["1010023051"]
    },
    "51098": {
        name: "Сыр \"Hochland\" плавл., 6*160 шт (960 ломтиков)",
        analogs: ["51089", "51090", "51097", "051099"]
    },
    "51305": {
        name: "Сыр твердый \"PALERMO\", 10 упак*0,18кг",
        analogs: ["51304"]
    },
    "76018473": {
        name: "Соус Цезарь Хайнц Пакет 2 кг*6 шт",
        analogs: ["76008070", "51224"]
    },
    "76022215": {
        name: "Соус ТарТар Премиум, 2 КГ х 6 ШТ",
        analogs: ["51267", "76018892"]
    },
    "61124": {
        name: "Соус \"Сырный Оригинальный\" 1 кг * 6 шт",
        analogs: ["76017308", "61000"]
    },
    "51019": {
        name: "Майонез \"Провансаль Н Оригинальный\" 65% 2 кг * 3 шт",
        analogs: ["61416"]
    },
    "76022472": {
        name: "Соус Сырный Хайнц, ДИП, 125 шт",
        analogs: ["60004"]
    },
    "79000316": {
        name: "Соус Чесночный Хайнц ДИП,125шт",
        analogs: ["51210", "51223"]
    },
    "76022473": {
        name: "Соус Parmegiano Heinz дип-пот 125* 25мл",
        analogs: ["51290", "76019797", "51212"]
    },
    "75980018": {
        name: "Соус Горчичный ДИП,125 шт",
        analogs: ["51225"]
    },
    "76020815": {
        name: "Соус Цезарь Хайнц, дип-пот 25 мл*125 шт",
        analogs: ["76006275"]
    },
    "51206": {
        name: "Соус Карри ориг. 25г*125шт",
        analogs: ["75980017"]
    },
    "76015928": {
        name: "Соус 1000 островов Хайнц, ДИП, 125шт",
        analogs: ["51230"]
    },
"300065": {
    name: "Салат Айсберг круп. Нарез., 0,5 кг ШТУКА",
    analogs: ["4444"]
   },
"51058": {
    name: "Кетчуп \"Хайнц\" томатный 25 мл 125 шт. в уп.",
    analogs: ["51059"]
},
"574761": {  
    name: "Кламшелл универсальный, 260 шт (ДЛЯ РОЯЛ ФРИ)",
    analogs: ["57527", "57476", "57421", "57528"]
},
"57295": {
    name: "Коробка Кламшелл Мистери Бургер, 260 шт (ДЛЯ ИСПАНСКОЙ)",
    analogs: ["57527", "57476", "57421", "57528"]
},
    "676401": { 
    name: "Мультипэк универсальная, 280 шт",
    analogs: ["57422", "67640", "67600", "67601"]
   },
    "57546": {
        name: "Пакет \"Шэйкер 1\", 120*80*250, 1000 шт.",
        analogs: ["57545"]
    },
    "56225": {
        name: "Ведро большое 2.574 л крыш 200 шт",
        analogs: ["57025"]
    },
    "15809": {
        name: "Бумажный пакет 120х85х255, 1000 шт",
        analogs: ["57434", "771093", "574341", "5809", "574364"]
    },
    "15810": {
        name: "Пакет из бумаги 180х120х290 1000 шт.",
        analogs: ["57436", "574362", "771023", "5810"]
    },
    "5811": {
        name: "Пакет из бумаги 215х120х305 1000 шт.",
        analogs: ["57435", "5811", "574363", "771033"]
    },
    "57568": {
        name: "Пакет с пр.дн. \"Бургер кинг большой\", 300*220*390, 500 шт",
        analogs: ["57161"]
   },
    "600106": {
        name: "Бумага XL АНГУС, 1000 шт",
        analogs: ["80045_1"]
    },
    "600105": {
        name: "Бумага оберт. Гамбургер/Чизбургер, 3024 шт",
        analogs: ["55002", "55009"]
    },
    "600107": {
        name: "Бумага Воппер/Воппер Чиз, 3000 шт",
        analogs: ["57324", "55001", "80050"]
    },
    "600102": {
        name: "ОБЕРТКА 406,6x305 Burger King XXL",
        analogs: ["55006"]
    },
    "600104": {
        name: "Бумага оберточная Гранд Чиз, 1000 шт",
        analogs: ["55010", "55011", "55011_1"]
    },
    "600103": {
        name: "Бум. об. Фиш Бургер Чикен Тар Тар, 1000 шт",
        analogs: ["57338", "57337", "57339"]
    },
    "57003": {
        name: "Крышка круглая 80мм коричневая, 1000шт",
        analogs: ["56052", "57617"]
    },
    "57005": {
        name: "Крышка круглая 90мм коричневая Burger King",
        analogs: ["57018", "600560", "57629"]
 },
    "57102": {
        name: "Пакет \"БУРГЕР КИНГ фри малый\", 5000 шт.",
        analogs: ["57090", "57132", "57131", "57091"]
    },
    "57098": {
        name: "Упаковка СРЕДНЯЯ 105х110мм, 5000шт",
        analogs: ["57099", "57540", "57541", "57113"]
    },
    "555333": {
        name: "Пакет 110*20*105, размер L, 3000 шт",
        analogs: ["57220"]
    },
    "55757": {
        name: "Пакет \"БК Большой 2\", 110*20*115, 2000 шт",
        analogs: ["55755", "555222", "55760", "55756", "57542"]
    },
    "699381": {
        name: "Упаковка для пирожков, 1020 шт",
        analogs: ["69954", "69938", "69953"]
    },
    "575092": {
        name: "Упаковка для сэндвича (ролл), 560 шт",
        analogs: ["57509", "57508", "57507", "57307"]
    },
    "575161": {
        name: "Разделитель в ведро, 300 шт",
        analogs: ["57219", "57515", "57516"]
    },
    "СС2": {
        name: "ДЕРЖАТЕЛИ ДЛЯ СТАКАНОВ CC2, 428 ШТ",
        analogs: ["56009"]
    },
    "СС4": {
        name: "ДЕРЖАТЕЛИ ДЛЯ СТАКАНОВ CC4, 210 ШТ",
        analogs: ["56034"]
    },
    "51080": {
        name: "Лист Фильтровальный 703х498 мм 100 шт в уп",
        analogs: ["51078"]
    },
 "76022216": {
        name: "Крафт сироп со вкусом клубники ШТУКА",
        analogs: ["51146", "76011374", "51146_1"]
    },
    "76021486": {
        name: "Крафт сироп со вкусом шоколада ШТУКА",
        analogs: ["51147", "51147_1", "76011395"]
    },
    "76021981": {
        name: "Сироп на ароматизаторах со вкусом Ванили ШТУКА (ПЛОМБИР)",
        analogs: ["51145", "51141", "51145_1", "51149", "76011396"]
    },
    "51159": {
        name: "Джем (Топпинг) Клубничный 2 кг 6 шт в уп",
        analogs: ["4680059131113"]
    },
    "76022035": {
        name: "Кетчуп томатный спец. Pikador 6 шт * 2 кг",
        analogs: ["76008855", "51071", "51065", "51070"]
    },
    "76021356": {
        name: "Соус Горчичн.оригин. Хайнц 2кг х 6",
        analogs: ["76018520", "76016063", "51052"]
    },
    "75980059": {
        name: "Соус кисло-сладкий Хайнц 25 мл 125 шт",
        analogs: ["51203"]
        },
    "75980057": {
        name: "Соус томатный барбекю классический 25 мл",
        analogs: ["51205"]
    },
    "1001": {
        name: "САХАР БЕЛЫЙ порционный, 3 кг/кор",
        analogs: ["51030-9", "51030-1", "186838", "1009"]
    },
    "68202": {
        name: "Соль Мозырьсоль, 12 кг",
        analogs: ["4697", "68201", "99989"]
    },
    "76019557": {
        name: "Cоус томатный Барбекью Класический Heinz 6 шт.* 1кг.",
        analogs: ["51258"] 
   },
    "600604": {
        name: "СТАКАН БУМАЖНЫЙ 800 МЛ BURGER KING 500 шт",
        analogs: ["340015147", "161032"] 
    },
     "51400": {
        name: "Сухарики-гренки, 2 КГ",
        analogs: ["51102"] 
    },
     "600603": {
        name: "СТАКАН БУМАЖНЫЙ 500 МЛ BURGER KING 1000 шт.",
        analogs: ["600502", "771022"] 
   },
     "106001": {
        name: "Концентрат «МИРИНДА» БИБ, 10л",
        analogs: ["10600", "106002"] 
      },
     "107231": {
        name: "Концентрат «СЕВЕН АП ЗЕРО» БИБ, 10 л.",
        analogs: ["10723"] 
 },
     "67124": {
        name: "Сироп Classic со вкусом ванили, 6 * 1 л",
        analogs: ["67123"] 
 },
     "8160908": {
        name: "Вода питьевая «АУРА» газ. 0,5л.",
        analogs: ["0000004585", "5437"] 
 },
     "8160608": {
        name: "Вода питьевая «АУРА» негаз. 0,5л.",
        analogs: ["0000004584", "5438"] 
  },
     "Данная": {
        name: "карточка больше неактуальна, аналогов нет",
        analogs: ["57577", "67155", "67485", "76019557", "51258"] 
    }
};


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

// Запуск поиска по нажатию Enter
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCard();
    }
});

// Проверка пароля
function checkPassword() {
    const password = document.getElementById('adminPassword').value;
    const correctPassword = '157';

    if (password === correctPassword) {
        document.getElementById('maintenance').style.display = 'none';
        document.getElementById('normalSite').style.display = 'block';
        isMaintenance = false;
} else {
    showError('Неверный пароль!');
}
}

// Проверка, должна ли быть показана страница тех работ
function checkMaintenanceMode() {
    // Проверяем, принял ли пользователь дисклеймер
    if (localStorage.getItem('disclaimerAccepted')) {
        if (isMaintenance) {
            document.getElementById('maintenance').style.display = 'block';
            document.getElementById('normalSite').style.display = 'none';
        } else {
            document.getElementById('maintenance').style.display = 'none';
            document.getElementById('normalSite').style.display = 'block';
        }
    } else {
        // Если дисклеймер не принят, скрываем оба блока
        document.getElementById('maintenance').style.display = 'none';
        document.getElementById('normalSite').style.display = 'none';
    }
}
// Показать форму для ввода пароля по клику на кнопку
document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('passwordForm').style.display = 'block';
});

// Проверяем состояние техработ при загрузке
window.onload = checkMaintenanceMode;

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

function showSuggestions(query) {
  const container = document.getElementById('suggestions');
  if (!query || query.length < 2) {
    container.style.display = 'none';
    return;
  }

  const results = searchDatabase(query, true);
  container.innerHTML = results.map(item => `
    <div class="suggestion-item" onclick="selectSuggestion('${item.article}')">
      ${highlightMatch(item.article, query)} → 
      ${highlightMatch(item.name, query)}
    </div>
  `).join('');

  container.style.display = results.length ? 'block' : 'none';
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function selectSuggestion(article) {
  document.getElementById('searchInput').value = article;
  document.getElementById('suggestions').style.display = 'none';
  searchCard();
}

// Анимация прогресс-бара (для демонстрации)
let progress = 42;
const progressInterval = setInterval(() => {
    progress = (progress + 1) % 100;
    document.getElementById('progressValue').textContent = progress;
    document.querySelector('.progress-bar::after').style.width = `${progress}%`;
}, 3000);

// Очистка интервала при уходе со страницы техработ
document.getElementById('adminBtn').addEventListener('click', () => {
    clearInterval(progressInterval);
});


// Конфиг частиц (можно менять параметры)
const particlesConfig = {
  "particles": {
    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#d62300" }, // Цвет как в Burger King
    "shape": { "type": "circle" },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": { "enable": true, "speed": 1, "opacity_min": 0.1 }
    },
    "size": { "value": 3, "random": true },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffcc00", // Жёлтые линии
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out"
    }
  }
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', particlesConfig);
  }
});


// Показ дисклеймера при загрузке
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, принимал ли пользователь уже дисклеймер
  if (!localStorage.getItem('disclaimerAccepted')) {
    const disclaimerPopup = document.getElementById('disclaimerPopup');
    const acceptButton = document.getElementById('acceptDisclaimer');
    
    // Показываем попап
    disclaimerPopup.style.display = 'flex';
    
    // Блокируем скролл страницы
    document.body.style.overflow = 'hidden';
    
acceptButton.addEventListener('click', function() {
    localStorage.setItem('disclaimerAccepted', 'true');
    disclaimerPopup.style.opacity = '0';
    setTimeout(() => {
        disclaimerPopup.style.display = 'none';
        document.body.style.overflow = '';
        checkMaintenanceMode(); // Важно вызвать эту функцию
    }, 300);
});
