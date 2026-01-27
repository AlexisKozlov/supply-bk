const SUPABASE_URL = "https://obywcpilionribalfrbl.supabase.co";
const SUPABASE_KEY = "sb_publishable_BYToHeprZE-e64UjDgjlmQ_bKZBUFJ0";
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let products = [];
let orderItems = [];
let selectedProduct = null;

// 🔒 Проверка админ-доступа
const isAdminLoggedIn = sessionStorage.getItem("adminBypass") === "true";

document.addEventListener("DOMContentLoaded", async () => {
  if (!isAdminLoggedIn) {
    document.getElementById("orderAccessDenied").style.display = "block";
    return;
  }

  document.getElementById("orderApp").style.display = "block";

  document.getElementById("todayDate").value =
    new Date().toISOString().split("T")[0];

const { data, error } = await supabaseClient
  .from("products")
  .select("*");

  if (error) {
    alert("Ошибка загрузки товаров");
    console.error(error);
    return;
  }

  products = data;

  setupProductAutocomplete();
});

// 🔍 Автопоиск товара
function setupProductAutocomplete() {
  const input = document.getElementById("productInput");
  const suggestions = document.getElementById("productSuggestions");

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    if (!query) {
      suggestions.style.display = "none";
      return;
    }

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.article.toLowerCase().includes(query)
    );

    suggestions.innerHTML = matches
      .slice(0, 8)
      .map(p => `
        <div onclick="selectProduct('${p.id}')">
          ${p.article} — ${p.name}
        </div>
      `)
      .join("");

    suggestions.style.display = "block";
  });
}

function selectProduct(id) {
  selectedProduct = products.find(p => p.id == id);
  document.getElementById("productInput").value =
    `${selectedProduct.article} — ${selectedProduct.name}`;
  document.getElementById("productSuggestions").style.display = "none";
}

// ➕ Добавление строки заказа
function addOrderItem() {
  if (!selectedProduct) {
    alert("Выберите товар");
    return;
  }

  const monthlyUsage = parseFloat(
    document.getElementById("monthlyUsage").value
  );
  const currentStock = parseFloat(
    document.getElementById("currentStock").value
  );
  const arrivalDate = document.getElementById("arrivalDate").value;
  const todayDate = document.getElementById("todayDate").value;
  const bufferPercent = parseFloat(
    document.getElementById("bufferPercent").value || 0
  );
  const postArrivalDays = parseFloat(
    document.getElementById("postArrivalDays").value || 0
  );

  if (
    !monthlyUsage ||
    currentStock < 0 ||
    !arrivalDate ||
    !todayDate
  ) {
    alert("Заполните все поля");
    return;
  }

  const dailyUsage = monthlyUsage / 30;

  const daysUntilArrival =
    (new Date(arrivalDate) - new Date(todayDate)) /
    (1000 * 60 * 60 * 24);

  if (daysUntilArrival < 0) {
    alert("Дата прихода не может быть раньше сегодняшней");
    return;
  }

  const neededUntilArrival = dailyUsage * daysUntilArrival;

  // ❌ ТОВАР НЕ ДОЖИВАЕТ ДО ПРИХОДА — НЕ ЗАКАЗЫВАЕМ
  if (currentStock < neededUntilArrival) {
    const item = {
      product: selectedProduct,
      currentStock,
      dailyUsage: dailyUsage.toFixed(2),
      daysUntilArrival: Math.ceil(daysUntilArrival),
      needed: Math.ceil(neededUntilArrival),
      orderQty: 0,
      status: "out_before_arrival"
    };

    orderItems.push(item);
    renderTable();

    selectedProduct = null;
    document.getElementById("productInput").value = "";
    return;
  }

  // ✅ СЧИТАЕМ ПЕРИОД: ДО ПРИХОДА + ПОСЛЕ ПРИХОДА
  const totalDays = daysUntilArrival + postArrivalDays;
  const totalNeeded = dailyUsage * totalDays;

  let shortage = totalNeeded - currentStock;
  if (shortage < 0) shortage = 0;

  let orderQty = 0;
  if (shortage > 0) {
    const withBuffer = shortage * (1 + bufferPercent / 100);
    const packSize = selectedProduct.box_qty || 1;

    orderQty =
      Math.ceil(withBuffer / packSize) * packSize;
  }

  const item = {
    product: selectedProduct,
    currentStock,
    dailyUsage: dailyUsage.toFixed(2),
    daysUntilArrival: Math.ceil(daysUntilArrival),
    needed: Math.ceil(totalNeeded),
    orderQty,
    status: "ok"
  };

  orderItems.push(item);
  renderTable();

  selectedProduct = null;
  document.getElementById("productInput").value = "";
}

// 🧾 Таблица
function renderTable() {
  const tbody = document.getElementById("orderTableBody");
  tbody.innerHTML = "";

  orderItems.forEach(item => {
    const tr = document.createElement("tr");

    let statusText = "";
    let rowStyle = "";

    if (item.status === "out_before_arrival") {
      statusText = "❌ Закончится до прихода";
      rowStyle = "background:#ffe5e5;";
    }

    tr.innerHTML = `
      <td>${item.product.name}</td>
      <td>${item.currentStock}</td>
      <td>${item.dailyUsage}</td>
      <td>${item.daysUntilArrival}</td>
      <td>${item.needed}</td>
      <td><strong>${item.orderQty}</strong></td>
      <td>${statusText}</td>
    `;

    tr.style = rowStyle;
    tbody.appendChild(tr);
  });

  renderSummary();
}

// 📦 Итог
function renderSummary() {
  const result = document.getElementById("orderResult");

  if (orderItems.length === 0) {
    result.innerHTML = "Пока ничего не добавлено";
    return;
  }

  result.innerHTML = orderItems
    .filter(i => i.orderQty > 0)
    .map(i => `• ${i.product.name} — ${i.orderQty} шт`)
    .join("<br>");
}

// 📋 Копирование заказа
function copyOrder() {
  const text = orderItems
    .filter(i => i.orderQty > 0)
    .map(i => `${i.product.article} ${i.product.name} — ${i.orderQty}`)
    .join("\n");

  navigator.clipboard.writeText(text);
  alert("Заказ скопирован");
}
