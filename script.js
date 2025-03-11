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
};

function searchCard() {
    let input = document.getElementById("searchInput").value.trim().toLowerCase();
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (input === "") {
        resultDiv.textContent = "Введите артикул!";
        return;
    }

    let foundExact = Object.entries(cardDatabase).find(([actual]) => actual.toLowerCase() === input);

    if (foundExact) {
        resultDiv.textContent = "Введённая карточка актуальна!";
        return;
    }

    let foundPartial = Object.entries(cardDatabase).find(([actual, data]) =>
        actual.toLowerCase().includes(input) ||
        data.analogs.some(analog => analog.toLowerCase().includes(input))
    );

    if (foundPartial) {
        let [actual, data] = foundPartial;
        resultDiv.innerHTML = `<strong>Актуальная карточка:</strong><br>${actual} - ${data.name}`;
    } else {
        resultDiv.textContent = "Артикул не найден, возможно, у карточки нет актуальных аналогов.";
    }
}
function addOrUpdateCard() {
    let actual = document.getElementById("newActual").value.trim();
    let name = document.getElementById("newName").value.trim();
    let analogs = document.getElementById("newAnalogs").value.trim().split(",").map(a => a.trim()).filter(a => a);

    if (!actual || !name) {
        alert("Введите артикул и название!");
        return;
    }

    if (cardDatabase[actual]) {
        // Если карточка уже есть – обновляем её
        cardDatabase[actual].name = name;
        cardDatabase[actual].analogs = analogs;
        alert("Карточка обновлена!");
    } else {
        // Если карточки нет – добавляем новую
        cardDatabase[actual] = { name: name, analogs: analogs };
        alert("Карточка добавлена!");
    }

    console.log("Обновленная база данных:", cardDatabase);
}

