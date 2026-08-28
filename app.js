// Тестовые данные с поддержкой реальных картинок, цен и наклеек
const ITEMS = [
  { 
    id: "1001", 
    name: "AK-47 | Redline", 
    wear: "Field-Tested", 
    rarity: "classified", 
    price_rub: 1850.00,
    icon_url: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4cfB4l5045Wrf87v53pG8C2442OVs51dROx4E0s4lYJ7M0k_D2h-lX1y1S1ABQvu33fwB00v33f-R1z8O00d6-192lYJ8s41VRe_p_w-N508X80dW50d2l",
    stickers: [
      { name: "Natus Vincere | Katowice 2019", icon_url: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4cfB4l5045Wrf87v53pG8C2442OVs51dROx4E0s4lYJ7M0k_D2h-lX1y1S1ABQvu33fwB00v33f-R1z8O00d6-192lYJ8s41VRe_p_w-N508X80dW50d2l" },
      { name: "FaZe Clan | Stockholm 2021", icon_url: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4cfB4l5045Wrf87v53pG8C2442OVs51dROx4E0s4lYJ7M0k_D2h-lX1y1S1ABQvu33fwB00v33f-R1z8O00d6-192lYJ8s41VRe_p_w-N508X80dW50d2l" }
    ]
  },
  { 
    id: "1002", 
    name: "AWP | Asiimov", 
    wear: "Field-Tested", 
    rarity: "covert", 
    price_rub: 9400.00,
    icon_url: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4cfB4l5045Wrf87v53pG8C2442OVs51dROx4E0s4lYJ7M0k_D2h-lX1y1S1ABQvu33fwB00v33f-R1z8O00d6-192lYJ8s41VRe_p_w-N508X80dW50d2l",
    stickers: []
  },
  { 
    id: "1003", 
    name: "Revolution Case", 
    wear: "Base", 
    rarity: "common", 
    price_rub: 75.50,
    icon_url: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4cfB4l5045Wrf87v53pG8C2442OVs51dROx4E0s4lYJ7M0k_D2h-lX1y1S1ABQvu33fwB00v33f-R1z8O00d6-192lYJ8s41VRe_p_w-N508X80dW50d2l",
    stickers: []
  }
];

const selectedIds = new Set();

const grid = document.getElementById("grid");
const countEl = document.getElementById("selected-count");
const tradeBtn = document.getElementById("trade-btn");
const clearBtn = document.getElementById("clear-btn");
const tg = window.Telegram?.WebApp;

function renderGrid() {
  grid.replaceChildren(
    ...ITEMS.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `item rarity-${item.rarity}`;
      button.dataset.id = item.id;

      // Генерируем верстку для ряда наклеек, если они есть
      const stickersHtml = item.stickers && item.stickers.length > 0
        ? `<div class="stickers-list">
            ${item.stickers.map(s => `<img src="${s.icon_url}" title="${s.name}" class="sticker-img" />`).join('')}
           </div>`
        : '';

      button.innerHTML = `
        <div class="price-badge">${item.price_rub.toLocaleString('ru-RU')} ₽</div>
        <div class="preview">
          <img src="${item.icon_url}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="name">${item.name}</div>
        <div class="wear">${item.wear}</div>
        ${stickersHtml}
      `;
      button.addEventListener("click", () => toggleItem(item.id));
      return button;
    })
  );
}

function toggleItem(id) {
  if (selectedIds.has(id)) {
    selectedIds.delete(id);
  } else {
    selectedIds.add(id);
  }
  syncUi();
}

function clearSelection() {
  selectedIds.clear();
  syncUi();
}

function selectedItems() {
  return ITEMS.filter((item) => selectedIds.has(item.id));
}

function syncUi() {
  const selected = selectedItems();
  const count = selected.length;
  const totalPrice = selected.reduce((sum, item) => sum + item.price_rub, 0);

  countEl.textContent = `Выбрано: ${count} (${totalPrice.toLocaleString('ru-RU')} ₽)`;
  tradeBtn.disabled = count === 0;
  clearBtn.hidden = count === 0;

  for (const card of grid.querySelectorAll(".item")) {
    card.classList.toggle("selected", selectedIds.has(card.dataset.id));
  }
}

function sendTrade() {
  const items = selectedItems();
  if (!items.length) {
    return;
  }

  const payload = JSON.stringify({
    action: "trade",
    items: items.map(({ id, name, wear, rarity, price_rub }) => ({ id, name, wear, rarity, price_rub })),
  });

  if (tg?.sendData) {
    tg.sendData(payload);
    return;
  }

  tradeBtn.textContent = `Выбрано ${items.length}`;
}

if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.("#0d0f15");
  tg.setBackgroundColor?.("#0d0f15");
}

renderGrid();
syncUi();
clearBtn.addEventListener("click", clearSelection);
tradeBtn.addEventListener("click", sendTrade);
