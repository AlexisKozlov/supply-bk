// Переменная для контроля технических работ
let isMaintenance = false; // Для теста поставь true, чтобы увидеть страницу техработ

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
    "69204": {
        name: "Булочка 3,75” гамбург. глазир. 48 шт/КОР",
        analogs: ["69205"]
    },
    "34683": {
        name: "Булочка с кунж. 5” Воппер, 24 шт. КОР",
        analogs: ["55137"]
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
        analogs: ["51089", "51090", "51097"]
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
    "51225": {
        name: "Соус Горчичный ориг. 25г*125шт",
        analogs: ["75980018"]
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
"574761": {  // <-- теперь здесь запятая, ошибок нет
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
    "771093": {
        name: "Пакет бумажный A-bag Зима 2024, 1000шт.",
        analogs: ["57434", "574364", "574341", "5809"]
    },
    "771023": {
        name: "Пакет бумажный B-bag Зима 2024, 1000шт.",
        analogs: ["57436", "5810", "574362"]
    },
    "771033": {
        name: "Пакет бумажный C-bag Зима 2024, 1000шт.",
        analogs: ["57435", "5811", "574363"]
    },
    "57568": {
        name: "Пакет с пр.дн. \"Бургер кинг большой\", 300*220*390, 500 шт",
        analogs: ["57161"]
    }
};


function searchCard() {
    let inputElement = document.getElementById("searchInput");
    if (!inputElement) {
        console.error("Поле ввода не найдено!");
        return;
    }
    
    let article = inputElement.value.trim();
    if (article.length < 3) {
        alert("Введите минимум 3 символа!");
        return;
    }
    
    let firstWord = article.split(" ")[0]; // Извлекаем первое слово (артикул)
    
    let resultElement = document.getElementById("result");
    resultElement.innerHTML = "";
    
    let foundCards = [];
    
    // Поиск по точному совпадению артикула
    if (cardDatabase[firstWord]) {
        foundCards.push({ article: firstWord, ...cardDatabase[firstWord] });
    }
    
    // Поиск по аналогам
    for (let key in cardDatabase) {
        if (cardDatabase[key].analogs.includes(firstWord)) {
            foundCards.push({ article: key, ...cardDatabase[key] });
        }
    }
    
    // Поиск по названию карточки
    for (let key in cardDatabase) {
        if (cardDatabase[key].name.toLowerCase().includes(article.toLowerCase())) {
            foundCards.push({ article: key, ...cardDatabase[key] });
        }
    }
    
    if (foundCards.length > 0) {
        let output = foundCards.map(card => `<h3 style='margin-bottom: 5px;'>${card.article} ${card.name}</h3>`).join("");
        resultElement.innerHTML = output;
    } else {
        resultElement.innerHTML = "<p>Карточка не найдена, возможно она не имеет аналогов!</p>";
    }
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
    const correctPassword = '157'; // Заданный пароль

    if (password === correctPassword) {
        // Скрываем страницу тех работ и показываем обычный сайт
        document.getElementById('maintenance').style.display = 'none';
        document.getElementById('normalSite').style.display = 'block';
        isMaintenance = false;
    } else {
        alert('Неверный пароль!');
    }
}

// Проверка, должна ли быть показана страница тех работ
function checkMaintenanceMode() {
    if (isMaintenance) {
        document.getElementById('maintenance').style.display = 'block';
        document.getElementById('normalSite').style.display = 'none';
    } else {
        document.getElementById('maintenance').style.display = 'none';
        document.getElementById('normalSite').style.display = 'block';
    }
}

// Показать форму для ввода пароля по клику на кнопку
document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('passwordForm').style.display = 'block';
});

// Проверяем состояние техработ при загрузке
window.onload = checkMaintenanceMode;
