const cardDatabase = {
    "1054445": ["69097", "1054444", "1010023409", "69101"],
    "566666": ["1010026090", "58553", "TRW01"],
    "155555": ["FMS9", "58542", "68544", "555555"]
};

function searchCard() {
    let input = document.getElementById("searchInput").value.trim();
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    let found = false;

    for (let [actual, analogs] of Object.entries(cardDatabase)) {
        if (input === actual || analogs.includes(input)) {
            resultDiv.textContent = `Актуальная карточка: ${actual}`;
            found = true;
            break;
        }
    }

    if (!found) {
        resultDiv.textContent = "Артикул не найден, возможно, у карточки нет актуальных аналогов.";
    }
}
