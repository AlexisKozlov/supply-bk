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
    "300065": {
        name: "Салат Айсберг круп. Нарез., 0,5 кг ШТУКА",
        analogs: ["4444"]
    },
    "574761": {
        name: "Кламшелл универсальный, 260 шт (ДЛЯ РОЯЛ ФРИ)",
        analogs: ["57527", "57476", "57421", "57528"]
    },
    "57295": {
        name: "Коробка Кламшелл Мистери Бургер, 260 шт (ДЛЯ ИСПАНСКОЙ)",
        analogs: ["57527", "57476", "57421", "57528"]
    }
};

function searchCard() {
    let inputElement = document.getElementById("searchInput");
    if (!inputElement) {
        console.error("Поле ввода не найдено!");
        return;
    }
    
    let article = inputElement.value.trim().toLowerCase();
    if (!article) {
        alert("Введите артикул или название!");
        return;
    }

    let resultElement = document.getElementById("result");
    resultElement.innerHTML = "";

    let foundCards = [];

    // Ищем по точному совпадению артикула
    if (cardDatabase[article]) {
        foundCards.push({ article, ...cardDatabase[article] });
    }

    // Ищем по аналогам
    for (let key in cardDatabase) {
        if (cardDatabase[key].analogs.includes(article)) {
            foundCards.push({ article: key, ...cardDatabase[key] });
        }
    }

    // Ищем по частичному совпадению в названии (без учёта регистра)
    for (let key in cardDatabase) {
        if (cardDatabase[key].name.toLowerCase().includes(article)) {
            foundCards.push({ article: key, ...cardDatabase[key] });
        }
    }

    if (foundCards.length > 0) {
        let output = foundCards.map(card => `<h3>${card.article} ${card.name}</h3>`).join("<br>");
        resultElement.innerHTML = output;
    } else {
        resultElement.innerHTML = "<p>Артикул не найден, возможно у карточки нет аналогов</p>";
    }
}

// Запуск поиска по нажатию Enter
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCard();
    }
});
