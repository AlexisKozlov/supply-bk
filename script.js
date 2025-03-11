const isMaintenance = true; // true — включен режим, false — выключен

window.onload = function () {
    if (isMaintenance) {
        document.getElementById("maintenance").style.display = "flex";
        document.querySelector(".container").style.display = "none";
    } else {
        document.getElementById("maintenance").style.display = "none";
        document.querySelector(".container").style.display = "block";
    }
};

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
    }
};

function searchCard() {
    let input = document.getElementById("searchInput").value.trim().toLowerCase();
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!input) {
        resultDiv.textContent = "Введите артикул!";
        return;
    }

    let found = false;

    for (let [actual, data] of Object.entries(cardDatabase)) {
        if (actual.toLowerCase().includes(input) || data.analogs.some(a => a.toLowerCase().includes(input))) {
            if (input === actual.toLowerCase()) {
                resultDiv.innerHTML = `<strong>Введённая карточка актуальна!</strong>`;
            } else {
                resultDiv.innerHTML = `<strong>Актуальная карточка:</strong><br>${actual} ${data.name}`;
            }
            found = true;
            break;
        }
    }

    if (!found) {
        resultDiv.textContent = "Артикул не найден, возможно, у карточки нет актуальных аналогов.";
    }
}

document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCard();
    }
});
