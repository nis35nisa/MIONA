const WHATSAPP_NUMBER = "+90xxxxxxxxxx";

// Ürünler
const products = [
    {
        id: 1,
        name: "Modern Vazo",
        category: "dekorasyon",
        description: "Minimal çizgilerle tasarlanmış dekoratif vazo.",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=700"
    },
    {
        id: 2,
        name: "Minimal Masa Aksesuarı",
        category: "aksesuar",
        description: "Çalışma alanına zarif bir dokunuş.",
        image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=700"
    },
    {
        id: 3,
        name: "Dekoratif Organizer",
        category: "organizasyon",
        description: "Eşyalarını düzenlemek için şık bir çözüm.",
        image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=700"
    }
];

const productGrid = document.getElementById("productGrid");

// Favorileri önce yükle
let favorites = [];

try {
    favorites = JSON.parse(localStorage.getItem("mionaFavorites") || "[]");
    if (!Array.isArray(favorites)) favorites = [];
} catch {
    favorites = [];
}

// WhatsApp numarası kontrolü
function getWhatsAppNumber() {
    return WHATSAPP_NUMBER.replace(/\D/g, "");
}

function whatsappLink(message) {
    const number = getWhatsAppNumber();

    if (!/^90\d{10}$/.test(number)) {
        return null;
    }

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
    const url = whatsappLink(message);

    if (!url) {
        alert("Lütfen script.js içerisindeki WhatsApp numarasını güncelleyin.");
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
}

// WhatsApp bağlantılı butonlar
const contactWhatsapp = document.getElementById("contactWhatsapp");

if (contactWhatsapp) {
    contactWhatsapp.addEventListener("click", event => {
        event.preventDefault();
        openWhatsApp(
            "Merhaba MIONA! Ürünleriniz ve tasarımlarınız hakkında bilgi almak istiyorum."
        );
    });
}

// Ürünleri ekrana yerleştir
function renderProducts(category = "all") {
    if (!productGrid) return;

    const filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">

                <button class="favorite-btn"
                    data-product-id="${product.id}"
                    onclick="toggleFavorite(${product.id})"
                    aria-label="Favorilere ekle">
                    ♡
                </button>
            </div>

            <div class="product-info">
                <span>${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-actions">
                    <button onclick="openProduct(${product.id})">
                        Detayları incele ↗
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    updateFavoriteButtons();
}

// Kategori filtreleme
document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter.active")?.classList.remove("active");
        button.classList.add("active");
        renderProducts(button.dataset.filter);
    });
});

// Kategori kartlarından yönlendirme
document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", event => {
        event.preventDefault();
        const category = card.dataset.category;

        if (category === "ozel") {
            document.getElementById("custom")?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        document.querySelectorAll(".filter").forEach(button => {
            button.classList.toggle("active", button.dataset.filter === category);
        });

        renderProducts(category);
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    });
});

// Mobil menü
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Menüyü aç");
            menuToggle.textContent = "☰";
        });
    });
}

// Favori sistemi
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }

    try {
        localStorage.setItem("mionaFavorites", JSON.stringify(favorites));
    } catch (error) {
        console.warn("Favoriler bu tarayıcıda kaydedilemedi.", error);
    }

    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach(button => {
        const id = Number(button.dataset.productId);
        const active = favorites.includes(id);

        button.textContent = active ? "♥" : "♡";
        button.classList.toggle("selected", active);
        button.setAttribute("aria-label", active ? "Favorilerden çıkar" : "Favorilere ekle");
    });
}

// Ürün detay penceresi
function openProduct(id) {
    const product = products.find(item => item.id === id);
    const modal = document.getElementById("productModal");

    if (!product || !modal) return;

    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalImage").alt = product.name;
    document.getElementById("modalName").textContent = product.name;
    document.getElementById("modalDescription").textContent = product.description;

    document.getElementById("modalOrder").onclick = event => {
        event.preventDefault();
        openWhatsApp(`Merhaba MIONA! ${product.name} ürününü sipariş etmek istiyorum.`);
    };

    modal.classList.add("show");
}

function closeProduct() {
    document.getElementById("productModal")?.classList.remove("show");
}

document.getElementById("closeModal")?.addEventListener("click", closeProduct);

document.getElementById("productModal")?.addEventListener("click", event => {
    if (event.target.id === "productModal") closeProduct();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeProduct();
});

// ÖZEL TASARIM SİPARİŞ FORMU
// Form HTML'e eklendiğinde otomatik olarak çalışır.
const customOrderForm = document.getElementById("customOrderForm");

if (customOrderForm) {
    customOrderForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const type = document.getElementById("designType").value;
        const color = document.getElementById("designColor").value;
        const quantity = Number(document.getElementById("designQuantity").value);
        const description = document.getElementById("designDescription").value.trim();

        if (!name || !type || !description) {
            alert("Lütfen zorunlu alanları doldurun.");
            return;
        }

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
            alert("Adet bilgisi 1 ile 100 arasında olmalıdır.");
            return;
        }

        const message = `
MERHABA MIONA! 🌿
ÖZEL TASARIM TALEBİ

👤 Müşteri: ${name}
🎨 Tasarım kategorisi: ${type}
🌈 Renk tercihi: ${color}
📦 Adet: ${quantity}

📝 TASARIM DETAYLARI:
${description}

Tasarımım hakkında bilgi ve fiyat teklifi almak istiyorum.
Teşekkürler!
        `.trim();

        const url = whatsappLink(message);

        if (!url) {
            alert("WhatsApp numarası henüz ayarlanmamış. Lütfen daha sonra tekrar deneyin.");
            return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
        customOrderForm.reset();
    });
}

// İlk açılış
renderProducts();