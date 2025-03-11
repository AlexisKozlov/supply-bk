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
}

function searchCard() {
    let input = document.getElementById("searchInput").value.trim();
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    let found = false;

    for (let [actual, data] of Object.entries(cardDatabase)) {
        if (input === actual || data.analogs.includes(input)) {
            resultDiv.textContent = `Актуальная карточка: ${actual} - ${data.name}`;
            found = true;
            break;
        }
    }

    if (!found) {
        resultDiv.textContent = "Артикул не найден, возможно, у карточки нет актуальных аналогов.";
    }
}
