const tg = window.Telegram.WebApp;
tg.expand();

// Тестовый инвентарь с рабочими ссылками на картинки Steam
const MOCK_INVENTORY = [
    {
        asset_id: "101",
        name: "AK-47 | Redline (Field-Tested)",
        price_rub: 1850,
        image_url: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4a53NMhzpdefsCg44_414wHMr80M41gLv27g38Th28UG4E59f23SgE0R1kLAcL3PfnKA1e3PzYdXMTu4zkxdnfxaO1MrPThT8Ju5Bz3-zA9Iqi0QXh-Us6ZmzyddKSJ1A8YQrT_1PvyOnn0MXpv5vPy2wj5HcozSGFXw",
        stickers: [
            "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4a53NMhzpdefsCg44_414wHMr80M41gLv27g38Th28UG4E59f23SgE0R1kLAcA0PfvKhB41_S5UaU24vKwkNq_xKekG-OClzkGvsJwz-mX9IuginKw_0E6YmClc4SScgA3NFiD_AS4xrPuhAnQx9T42yA/64fx64f",
            "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4a53NMhzpdefsCg44_414wHMr80M41gLv27g38Th28UG4E59f23SgE0R1kLAcL3PfnKA1e3PzYdXMTu4zkxdnfxaO1MrPThT8Ju5Bz3-zA9Iqi0QXh-Us6ZmzyddKSJ1A8YQrT_1PvyOnn0MXpv5vPy2wj5HcozSGFXw/64fx64f"
        ]
    },
    {
        asset_id: "102",
        name: "AWP | Asiimov (Field-Tested)",
        price_rub: 9400,
        image_url: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4a53NMhzpdefsCg44_414wHMr80M41gLv27g38Th28UG4E59f23SgE0R1kLAcL3PfnKA1e3PzYdXMTu4zkxdnfxaO1MrPThT8Ju5Bz3-zA9Iqi0QXh-Us6ZmzyddKSJ1A8YQrT_1PvyOnn0MXpv5vPy2wj5HcozSGFXw",
        stickers: []
    },
    {
        asset_id: "103",
        name: "Revolution Case",
        price_rub: 75.5,
        image_url: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLVb4a53NMhzpdefsCg44_414wHMr80M41gLv27g38Th28UG4E59f23SgE0R1kLAcL3PfnKA1e3PzYdXMTu4zkxdnfxaO1MrPThT8Ju5Bz3-zA9Iqi0QXh-Us6ZmzyddKSJ1A8YQrT_1PvyOnn0MXpv5vPy2wj5HcozSGFXw",
        stickers: []
    }
];

let selectedIds = new Set();

function renderInventory() {
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";

    MOCK_INVENTORY.forEach(item => {
        const card = document.createElement("div");
        card.className = `item-card ${selectedIds.has(item.asset_id) ? 'selected' : ''}`;
        
        let stickersHtml = "";
        if (item.stickers && item.stickers.length > 0) {
            stickersHtml = `<div class="stickers-row">` + 
                item.stickers.map(s => `<img src="${s}" alt="sticker">`).join("") + 
                `</div>`;
        }

        card.innerHTML = `
            <div class="item-price">${item.price_rub.toLocaleString('ru-RU')} ₽</div>
            <img src="${item.image_url}" alt="${item.name}" loading="lazy">
            <div class="item-name">${item.name}</div>
            ${stickersHtml}
        `;

        card.onclick = () => toggleSelect(item.asset_id);
        grid.appendChild(card);
    });

    updateSummary();
}

function toggleSelect(id) {
    if (selectedIds.has(id)) {
        selectedIds.delete(id);
    } else {
        selectedIds.add(id);
    }
    renderInventory();
}

function updateSummary() {
    const selectedItems = MOCK_INVENTORY.filter(i => selectedIds.has(i.asset_id));
    const totalSum = selectedItems.reduce((acc, curr) => acc + curr.price_rub, 0);
    
    document.getElementById("selected-count").innerText = `Выбрано: ${selectedItems.length} (${totalSum.toLocaleString('ru-RU')} ₽)`;
    
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = selectedItems.length === 0;
}

document.getElementById("reset-btn").onclick = () => {
    selectedIds.clear();
    renderInventory();
};

document.getElementById("submit-btn").onclick = () => {
    const selectedItems = MOCK_INVENTORY.filter(i => selectedIds.has(i.asset_id));
    tg.sendData(JSON.stringify({
        action: "create_trade",
        items: selectedItems
    }));
    tg.close();
};

renderInventory();