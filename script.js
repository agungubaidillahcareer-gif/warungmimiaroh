// Data pesanan dan pelanggan
let cart = [];
let customerData = null;
const deliveryFee = 2000;
const whatsappNumber = "6283148584061";

// DOM Elements
const loadingScreen = document.getElementById("loadingScreen");
const cartToggle = document.getElementById("cartToggle");
const mobileCart = document.getElementById("mobileCart");
const closeCart = document.getElementById("closeCart");
const saveCustomerBtn = document.getElementById("saveCustomerBtn");
const loadCustomerDataBtn = document.getElementById("loadCustomerData");
const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
const cartCount = document.getElementById("cartCount");
const cartItemsMobile = document.getElementById("cartItemsMobile");
const receiptItemsBody = document.getElementById("receiptItemsBody");
const subtotalMobile = document.getElementById("subtotalMobile");
const totalMobile = document.getElementById("totalMobile");
const clearCartBtn = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutMobile = document.getElementById("checkoutMobile");
const previewStrukBtn = document.getElementById("previewStruk");
const previewStrukMobile = document.getElementById("previewStrukMobile");
const printStrukBtn = document.getElementById("printStruk");
const saveDataBtn = document.getElementById("saveDataBtn");
const orderForm = document.getElementById("orderForm");
const scrollTopBtn = document.getElementById("scrollTop");
const strukModal = document.getElementById("strukModal");
const closeStrukModal = document.getElementById("closeStrukModal");
const printModalStruk = document.getElementById("printModalStruk");
const sendModalStruk = document.getElementById("sendModalStruk");
const modalStrukContent = document.getElementById("modalStrukContent");

// Elemen form
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const notesInput = document.getElementById("notes");

// Elemen struk
const receiptName = document.getElementById("receiptName");
const receiptPhone = document.getElementById("receiptPhone");
const receiptAddress = document.getElementById("receiptAddress");
const receiptDate = document.getElementById("receiptDate");
const receiptSubtotal = document.getElementById("receiptSubtotal");
const receiptTotal = document.getElementById("receiptTotal");

// Inisialisasi
document.addEventListener("DOMContentLoaded", function () {
  // Sembunyikan loading screen
  setTimeout(() => {
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  }, 800);

  // Load data dari localStorage
  loadAllData();

  // Setup event listeners
  setupEventListeners();

  // Update struk awal
  updateReceipt();

  // Tampilkan notifikasi selamat datang
  setTimeout(() => {
    showNotification("Selamat datang di Warung Mimi! 🍢🔥", "success");

    // Jika ada data pelanggan yang disimpan, tampilkan notifikasi
    if (customerData) {
      showNotification(
        'Data pelanggan ditemukan. Klik "Isi Data Otomatis" untuk mengisi form.',
        "info",
      );
    }
  }, 1000);
});

// Load semua data dari localStorage
function loadAllData() {
  // Load cart
  const savedCart = localStorage.getItem("warungMimiCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  // Load customer data
  const savedCustomer = localStorage.getItem("warungMimiCustomer");
  if (savedCustomer) {
    customerData = JSON.parse(savedCustomer);
  }

  // Update cart count
  updateCartCount();
}

// Setup semua event listeners
function setupEventListeners() {
  // Toggle mobile cart
  cartToggle.addEventListener("click", toggleMobileCart);
  closeCart.addEventListener("click", () =>
    mobileCart.classList.remove("active"),
  );

  // Tombol tambah ke keranjang
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const name = this.getAttribute("data-name");
      const price = parseInt(this.getAttribute("data-price"));
      const img = this.getAttribute("data-img");

      addToCart(name, price, img);

      // Animasi tombol
      animateAddButton(this);
    });
  });

  // Simpan data pelanggan
  saveCustomerBtn.addEventListener("click", saveCustomerData);
  saveDataBtn.addEventListener("click", saveCustomerData);

  // Load data pelanggan
  loadCustomerDataBtn.addEventListener("click", loadCustomerData);

  // Hapus semua item di keranjang
  clearCartBtn.addEventListener("click", clearCart);

  // Preview struk
  previewStrukBtn.addEventListener("click", () => showStrukModal());
  previewStrukMobile.addEventListener("click", () => {
    mobileCart.classList.remove("active");
    showStrukModal();
  });

  // Print struk
  printStrukBtn.addEventListener("click", printReceipt);
  printModalStruk.addEventListener("click", printReceipt);

  // Checkout / kirim ke WhatsApp
  checkoutBtn.addEventListener("click", processCheckout);
  checkoutMobile.addEventListener("click", processCheckout);
  sendModalStruk.addEventListener("click", processCheckout);

  // Modal struk
  closeStrukModal.addEventListener(
    "click",
    () => (strukModal.style.display = "none"),
  );

  // Tutup modal jika klik di luar
  window.addEventListener("click", (event) => {
    if (event.target === strukModal) {
      strukModal.style.display = "none";
    }

    if (
      mobileCart.classList.contains("active") &&
      !mobileCart.contains(event.target) &&
      !cartToggle.contains(event.target)
    ) {
      mobileCart.classList.remove("active");
    }
  });

  // Scroll to top button
  window.addEventListener("scroll", toggleScrollTopButton);
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Update struk saat form berubah
  nameInput.addEventListener("input", updateReceipt);
  phoneInput.addEventListener("input", updateReceipt);
  addressInput.addEventListener("input", updateReceipt);

  // Auto-save data pelanggan saat form berubah (setelah 2 detik tidak ada input)
  let saveTimeout;
  [nameInput, phoneInput, addressInput].forEach((input) => {
    input.addEventListener("input", () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveCustomerData, 2000);
    });
  });
}

// Toggle mobile cart
function toggleMobileCart() {
  mobileCart.classList.toggle("active");
  if (mobileCart.classList.contains("active")) {
    updateMobileCart();
  }
}

// Fungsi untuk menambah item ke keranjang
function addToCart(name, price, img) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      img: img,
      quantity: 1,
    });
  }

  updateCart();
  showNotification(`"${name}" ditambahkan ke keranjang 🛒`, "success");
}

// Animasi tombol tambah
function animateAddButton(button) {
  button.innerHTML = '<i class="fas fa-check"></i> Ditambahkan';
  button.style.backgroundColor = "#2a9d8f";
  button.style.transform = "scale(0.95)";

  setTimeout(() => {
    button.innerHTML = '<i class="fas fa-plus"></i> Tambah';
    button.style.backgroundColor = "";
    button.style.transform = "";
  }, 1500);
}

// Update seluruh tampilan keranjang dan struk
function updateCart() {
  // Update count di icon cart
  updateCartCount();

  // Update cart di sidebar mobile
  updateMobileCart();

  // Update struk
  updateReceipt();

  // Update tombol checkout
  updateCheckoutButtons();

  // Simpan ke localStorage
  localStorage.setItem("warungMimiCart", JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Tambah animasi jika ada item baru
  if (totalItems > 0) {
    cartCount.classList.add("item-added");
    setTimeout(() => cartCount.classList.remove("item-added"), 500);
  }
}

// Update cart di sidebar mobile
function updateMobileCart() {
  cartItemsMobile.innerHTML = "";

  if (cart.length === 0) {
    cartItemsMobile.innerHTML =
      '<p class="empty-cart-mobile">Keranjang masih kosong</p>';
    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item-mobile";
    cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="cart-item-qty-mobile">
                    <button class="qty-btn-sm" onclick="decreaseQuantity(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn-sm" onclick="increaseQuantity(${index})">+</button>
                </div>
            </div>
            <button class="remove-item-mobile" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
    cartItemsMobile.appendChild(cartItem);
  });

  // Update totals di mobile
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + deliveryFee;

  subtotalMobile.textContent = formatCurrency(subtotal);
  totalMobile.textContent = formatCurrency(total);
}

// Update struk preview
function updateReceipt() {
  // Update info pelanggan
  receiptName.textContent = nameInput.value || "-";
  receiptPhone.textContent = phoneInput.value || "-";
  receiptAddress.textContent = addressInput.value || "-";
  receiptDate.textContent = getCurrentDateTime();

  // Update items di struk
  receiptItemsBody.innerHTML = "";

  if (cart.length === 0) {
    receiptItemsBody.innerHTML = `
            <div class="empty-receipt">
                <i class="fas fa-shopping-bag"></i>
                <p>Belum ada pesanan</p>
                <p>Silakan pilih menu dari daftar</p>
            </div>
        `;

    receiptSubtotal.textContent = formatCurrency(0);
    receiptTotal.textContent = formatCurrency(deliveryFee);
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemRow = document.createElement("div");
    itemRow.className = "receipt-item-row";
    itemRow.innerHTML = `
            <div class="receipt-item-name">${item.name}</div>
            <div class="receipt-item-qty">${item.quantity}</div>
            <div class="receipt-item-total">${formatCurrency(itemTotal)}</div>
        `;
    receiptItemsBody.appendChild(itemRow);
  });

  const total = subtotal + deliveryFee;

  receiptSubtotal.textContent = formatCurrency(subtotal);
  receiptTotal.textContent = formatCurrency(total);
}

// Update checkout buttons
function updateCheckoutButtons() {
  const checkoutButtons = [checkoutBtn, checkoutMobile, sendModalStruk];
  const hasItems = cart.length > 0;
  const hasCustomerData =
    nameInput.value && phoneInput.value && addressInput.value;

  checkoutButtons.forEach((button) => {
    button.disabled = !(hasItems && hasCustomerData);
  });

  // Update preview struk button
  previewStrukBtn.disabled = !hasItems;
  previewStrukMobile.disabled = !hasItems;
}

// Fungsi untuk mengurangi quantity
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  updateCart();
  showNotification("Jumlah item diperbarui 🔄", "info");
}

// Fungsi untuk menambah quantity
function increaseQuantity(index) {
  cart[index].quantity += 1;
  updateCart();
  showNotification("Jumlah item diperbarui 🔄", "info");
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(index) {
  const itemName = cart[index].name;
  cart.splice(index, 1);
  updateCart();
  showNotification(`"${itemName}" dihapus dari keranjang 🗑️`, "warning");
}

// Fungsi untuk menghapus semua item di keranjang
function clearCart() {
  if (cart.length === 0) {
    showNotification("Keranjang sudah kosong", "info");
    return;
  }

  if (confirm("Apakah Anda yakin ingin menghapus semua item dari keranjang?")) {
    cart = [];
    updateCart();
    showNotification("Semua item dihapus dari keranjang 🗑️", "warning");
  }
}

// Simpan data pelanggan
function saveCustomerData() {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !phone || !address) {
    showNotification(
      "Harap isi nama, nomor WhatsApp, dan alamat terlebih dahulu",
      "error",
    );
    return;
  }

  customerData = {
    name: name,
    phone: phone,
    address: address,
    notes: notesInput.value.trim(),
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem("warungMimiCustomer", JSON.stringify(customerData));

  // Update struk
  updateReceipt();

  // Tampilkan notifikasi
  showNotification("Data pelanggan berhasil disimpan 💾", "success");

  // Animasi tombol save
  saveDataBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan!';
  setTimeout(() => {
    saveDataBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Data';
  }, 2000);

  // Update tombol checkout
  updateCheckoutButtons();
}

// Load data pelanggan
function loadCustomerData() {
  if (!customerData) {
    showNotification("Tidak ada data pelanggan yang tersimpan", "error");
    return;
  }

  nameInput.value = customerData.name;
  phoneInput.value = customerData.phone;
  addressInput.value = customerData.address;
  notesInput.value = customerData.notes || "";

  // Update struk
  updateReceipt();

  // Tampilkan notifikasi
  showNotification("Data pelanggan berhasil dimuat 👤", "success");

  // Animasi tombol load
  loadCustomerDataBtn.innerHTML = '<i class="fas fa-check"></i> Data Dimuat!';
  setTimeout(() => {
    loadCustomerDataBtn.innerHTML =
      '<i class="fas fa-user-clock"></i> Isi Data Otomatis';
  }, 2000);

  // Update tombol checkout
  updateCheckoutButtons();
}

// Tampilkan modal struk
function showStrukModal() {
  if (cart.length === 0) {
    showNotification(
      "Keranjang masih kosong. Tambahkan menu terlebih dahulu.",
      "error",
    );
    return;
  }

  // Buat struk untuk modal
  const strukHTML = createStrukHTML(true);
  modalStrukContent.innerHTML = strukHTML;

  // Tampilkan modal
  strukModal.style.display = "flex";
}

// Buat HTML struk
function createStrukHTML(forModal = false) {
  const name = nameInput.value.trim() || "Pelanggan";
  const phone = phoneInput.value.trim() || "-";
  const address = addressInput.value.trim() || "-";
  const notes = notesInput.value.trim();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + deliveryFee;

  let itemsHTML = "";
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    itemsHTML += `
            <div class="receipt-item-row">
                <div class="receipt-item-name">${item.name}</div>
                <div class="receipt-item-qty">${item.quantity}</div>
                <div class="receipt-item-total">${formatCurrency(itemTotal)}</div>
            </div>
        `;
  });

  return `
        <div class="receipt-preview ${forModal ? "modal-struk" : ""}">
            <div class="receipt-header">
                <div class="receipt-logo">
                    <i class="fas fa-pepper-hot"></i>
                </div>
                <div class="receipt-title">
                    <h3>WARUNG MIMI</h3>
                    <p>Cimol Setan & Minuman Segar</p>
                </div>
            </div>
            
            <div class="receipt-customer-info">
                <div class="info-row">
                    <span>Pelanggan:</span>
                    <span>${name}</span>
                </div>
                <div class="info-row">
                    <span>Telepon:</span>
                    <span>${phone}</span>
                </div>
                <div class="info-row">
                    <span>Alamat:</span>
                    <span>${address}</span>
                </div>
                <div class="info-row">
                    <span>Tanggal:</span>
                    <span>${getCurrentDateTime()}</span>
                </div>
                ${
                  notes
                    ? `
                <div class="info-row">
                    <span>Catatan:</span>
                    <span>${notes}</span>
                </div>
                `
                    : ""
                }
            </div>
            
            <div class="receipt-items">
                <div class="receipt-items-header">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Total</span>
                </div>
                <div class="receipt-items-body">
                    ${itemsHTML || '<div class="empty-receipt"><p>Belum ada pesanan</p></div>'}
                </div>
            </div>
            
            <div class="receipt-totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div class="total-row">
                    <span>Ongkos Kirim</span>
                    <span>${formatCurrency(deliveryFee)}</span>
                </div>
                <div class="total-row grand-total">
                    <span>TOTAL</span>
                    <span>${formatCurrency(total)}</span>
                </div>
            </div>
            
            <div class="receipt-footer">
                <p><i class="fas fa-info-circle"></i> Pembayaran tunai saat pesanan diterima (COD)</p>
                <p><i class="fas fa-clock"></i> Estimasi pengiriman: 30-45 menit</p>
                <p class="thank-you">Terima kasih atas pesanannya! 😊</p>
            </div>
        </div>
    `;
}

// Proses checkout / kirim ke WhatsApp
function processCheckout() {
  // Validasi form
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !phone || !address) {
    showNotification(
      "Harap lengkapi nama, nomor WhatsApp, dan alamat",
      "error",
    );
    return;
  }

  if (cart.length === 0) {
    showNotification(
      "Keranjang masih kosong. Tambahkan menu terlebih dahulu.",
      "error",
    );
    return;
  }

  // Buat pesan struk untuk WhatsApp
  const message = createWhatsAppStrukMessage(name, phone, address);

  // Encode message untuk URL
  const encodedMessage = encodeURIComponent(message);

  // Buat URL WhatsApp
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Buka WhatsApp di tab baru
  window.open(whatsappURL, "_blank");

  // Tampilkan konfirmasi
  showNotification("Membuka WhatsApp... 📱", "success");

  // Tutup modal jika terbuka
  strukModal.style.display = "none";
  mobileCart.classList.remove("active");

  // Reset cart setelah 3 detik (memberi waktu untuk buka WhatsApp)
  setTimeout(() => {
    // Simpan pesanan ke history
    saveOrderToHistory();

    // Reset cart
    cart = [];
    updateCart();

    // Reset notes (tapi jangan reset data pelanggan)
    notesInput.value = "";

    // Tampilkan notifikasi sukses
    showNotification("Pesanan berhasil dikirim! Terima kasih 🎉", "success");

    // Scroll ke atas
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 3000);
}

// Buat pesan struk untuk WhatsApp (format yang lebih rapi)
function createWhatsAppStrukMessage(name, phone, address) {
  const notes = notesInput.value.trim();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + deliveryFee;

  let message = `*STRUK PESANAN - WARUNG MIMI* 🍢\n`;
  message += `_${getCurrentDateTime()}_\n\n`;

  message += `*DATA PELANGGAN:*\n`;
  message += `👤 Nama: ${name}\n`;
  message += `📱 WhatsApp: ${phone}\n`;
  message += `📍 Alamat: ${address}\n`;

  if (notes) {
    message += `📝 Catatan: ${notes}\n`;
  }

  message += `\n*DETAIL PESANAN:*\n`;
  message += `══════════════════\n`;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.name}\n`;
    message += `   ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(itemTotal)}\n`;
  });

  message += `══════════════════\n\n`;

  message += `*RINCIAN PEMBAYARAN:*\n`;
  message += `Subtotal: ${formatCurrency(subtotal)}\n`;
  message += `Ongkos Kirim: ${formatCurrency(deliveryFee)}\n`;
  message += `*TOTAL: ${formatCurrency(total)}*\n\n`;

  message += `*INFORMASI:*\n`;
  message += `💳 Pembayaran: Tunai (COD)\n`;
  message += `⏱️ Estimasi: 30-45 menit\n`;
  message += `🚚 Status: Menunggu konfirmasi\n\n`;

  message += `_Pesanan ini dikirim via website Warung Mimi._\n`;
  message += `_Mohon konfirmasi ketersediaan menu._\n\n`;
  message += `Terima kasih! 😊`;

  return message;
}

// Simpan pesanan ke history
function saveOrderToHistory() {
  const order = {
    id: Date.now(),
    date: new Date().toISOString(),
    customer: {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
    },
    items: [...cart],
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    deliveryFee: deliveryFee,
    total:
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      deliveryFee,
    notes: notesInput.value.trim(),
  };

  // Load existing history
  let history = JSON.parse(
    localStorage.getItem("warungMimiOrderHistory") || "[]",
  );

  // Add new order
  history.unshift(order);

  // Keep only last 50 orders
  if (history.length > 50) {
    history = history.slice(0, 50);
  }

  // Save back to localStorage
  localStorage.setItem("warungMimiOrderHistory", JSON.stringify(history));
}

// Cetak struk
function printReceipt() {
  if (cart.length === 0) {
    showNotification("Tidak ada pesanan untuk dicetak", "error");
    return;
  }

  // Buat window untuk print
  const printWindow = window.open("", "_blank");
  const strukHTML = createStrukHTML();

  printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Struk Warung Mimi</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    max-width: 400px;
                    margin: 0 auto;
                }
                .receipt-preview {
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 8px;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 15px;
                    border-bottom: 2px dashed #ddd;
                    padding-bottom: 10px;
                }
                .receipt-title h3 {
                    margin: 5px 0;
                    font-size: 18px;
                }
                .receipt-title p {
                    margin: 0;
                    font-size: 12px;
                    color: #666;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 12px;
                }
                .receipt-items-header, .receipt-item-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    font-size: 12px;
                    padding: 5px 0;
                    border-bottom: 1px solid #eee;
                }
                .receipt-items-header {
                    font-weight: bold;
                    border-bottom: 2px solid #333;
                }
                .receipt-totals .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                }
                .grand-total {
                    font-weight: bold;
                    font-size: 14px;
                    border-top: 2px solid #333;
                    margin-top: 5px;
                    padding-top: 8px;
                }
                .receipt-footer {
                    font-size: 10px;
                    text-align: center;
                    margin-top: 15px;
                    color: #666;
                }
                @media print {
                    body { padding: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            ${strukHTML}
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #e63946; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Cetak Struk
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                    Tutup
                </button>
            </div>
        </body>
        </html>
    `);

  printWindow.document.close();
}

// Fungsi untuk format mata uang
function formatCurrency(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

// Fungsi untuk mendapatkan tanggal dan waktu saat ini
function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time} WIB`;
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = "info") {
  // Hapus notifikasi sebelumnya jika ada
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Icon berdasarkan type
  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };

  // Warna berdasarkan type
  const colors = {
    success: "#2a9d8f",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db",
  };

  // Buat elemen notifikasi
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icons[type] || "fa-info-circle"}"></i>
            <span>${message}</span>
        </div>
    `;

  // Tambahkan ke body
  document.body.appendChild(notification);

  // Styling notifikasi
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${colors[type] || "#3498db"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

  // Tambahkan style animasi
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
  document.head.appendChild(styleSheet);

  // Hapus notifikasi setelah 4 detik
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";

    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// Fungsi untuk toggle scroll to top button
function toggleScrollTopButton() {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
}

// Buat fungsi-fungsi global agar bisa dipanggil dari onclick di HTML
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.removeFromCart = removeFromCart;
