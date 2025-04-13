// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Variabel global
    let products = [];
    let cart = [];
    let currentMember = null;
    
    // Fungsi untuk memuat data produk dari server
    function loadProducts() {
        fetch('api/products.php')
            .then(response => response.json())
            .then(data => {
                products = data;
                displayProducts(products);
            })
            .catch(error => console.error('Error fetching products:', error));
    }
    
    // Fungsi untuk menampilkan produk
    function displayProducts(productsList) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        
        productsList.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4 col-sm-6';
            productCard.innerHTML = `
                <div class="card product-card">
                    ${product.discount > 0 ? `<div class="discount-badge">Diskon ${product.discount}%</div>` : ''}
                    <span class="badge category-badge bg-secondary">${product.category}</span>
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text product-price">Rp ${formatNumber(product.price)}</p>
                        <p class="card-text">Stok: ${product.stock}</p>
                        <button class="btn btn-sm btn-primary add-to-cart" data-id="${product.id}">
                            Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });
        
        // Tambahkan event listener untuk tombol "Tambah ke Keranjang"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
    
    // Fungsi untuk menambahkan produk ke keranjang
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        if (product.stock <= 0) {
            alert('Stok produk habis!');
            return;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                alert('Stok tidak mencukupi!');
                return;
            }
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                discount: product.discount,
                quantity: 1,
                bulkDiscount: product.bulkDiscount || []
            });
        }
        
        updateCartDisplay();
    }
    
    // Fungsi untuk memperbarui tampilan keranjang
    function updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Keranjang kosong</p>';
            document.getElementById('cart-total').textContent = '0';
            document.getElementById('discount-amount').textContent = '0';
            document.getElementById('final-total').textContent = '0';
            return;
        }
        
        let total = 0;
        let discountTotal = 0;
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            let itemPrice = item.price;
            let itemDiscount = 0;
            
            // Hitung diskon berdasarkan jumlah
            if (item.bulkDiscount && item.bulkDiscount.length > 0) {
                const applicableDiscount = item.bulkDiscount
                    .filter(discount => item.quantity >= discount.minQuantity)
                    .sort((a, b) => b.minQuantity - a.minQuantity)[0];
                
                if (applicableDiscount) {
                    itemDiscount = (itemPrice * applicableDiscount.discountPercent / 100) * item.quantity;
                }
            }
            
            // Tambahkan diskon produk
            if (item.discount > 0) {
                itemDiscount += (itemPrice * item.discount / 100) * item.quantity;
            }
            
            const subtotal = itemPrice * item.quantity - itemDiscount;
            total += itemPrice * item.quantity;
            discountTotal += itemDiscount;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <p class="mb-0">${item.name}</p>
                    <small>Rp ${formatNumber(itemPrice)} x ${item.quantity}</small>
                    ${itemDiscount > 0 ? `<br><small class="text-danger">Diskon: Rp ${formatNumber(itemDiscount)}</small>` : ''}
                </div>
                <div class="cart-controls">
                    <button class="btn btn-sm btn-outline-danger decrease-qty" data-id="${item.id}">-</button>
                    <input type="text" class="cart-quantity" value="${item.quantity}" readonly>
                    <button class="btn btn-sm btn-outline-success increase-qty" data-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">×</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Hitung diskon member
        let memberDiscount = 0;
        if (currentMember && currentMember.discount > 0) {
            memberDiscount = (total - discountTotal) * (currentMember.discount / 100);
            discountTotal += memberDiscount;
        }
        
        const finalTotal = total - discountTotal;
        
        document.getElementById('cart-total').textContent = formatNumber(total);
        document.getElementById('discount-amount').textContent = formatNumber(discountTotal);
        document.getElementById('final-total').textContent = formatNumber(finalTotal);
        
        // Event listeners untuk kontrol keranjang
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                increaseQuantity(itemId);
            });
        });
        
        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                decreaseQuantity(itemId);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                removeFromCart(itemId);
            });
        });
    }
    
    // Fungsi untuk menambah kuantitas produk di keranjang
    function increaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);
        
        if (item && product && item.quantity < product.stock) {
            item.quantity++;
            updateCartDisplay();
        } else {
            alert('Stok tidak mencukupi!');
        }
    }
    
    // Fungsi untuk mengurangi kuantitas produk di keranjang
    function decreaseQuantity(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            } else {
                cart.splice(itemIndex, 1);
            }
            updateCartDisplay();
        }
    }
    
    // Fungsi untuk menghapus produk dari keranjang
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
    }
    
    // Fungsi format angka dengan pemisah ribuan
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Cek member
    document.getElementById('checkMember').addEventListener('click', function() {
        const phone = document.getElementById('phone').value;
        
        if (!phone) {
            alert('Masukkan nomor HP member');
            return;
        }
        
        fetch(`api/member.php?phone=${phone}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentMember = data.member;
                    document.getElementById('member-name').textContent = currentMember.name;
                    document.getElementById('member-points').textContent = currentMember.points;
                    document.getElementById('member-info').classList.remove('d-none');
                    document.getElementById('non-member-info').classList.add('d-none');
                    updateCartDisplay(); // Perbarui tampilan karena diskon member
                } else {
                    document.getElementById('member-info').classList.add('d-none');
                    document.getElementById('non-member-info').classList.remove('d-none');
                    document.getElementById('reg-phone').value = phone;
                    currentMember = null;
                    updateCartDisplay();
                }
            })
            .catch(error => console.error('Error checking member:', error));
    });
    
    // Modal daftar member
    document.getElementById('registerMember').addEventListener('click', function() {
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();
    });
    
    // Simpan member baru
    document.getElementById('saveMember').addEventListener('click', function() {
        const memberData = {
            phone: document.getElementById('reg-phone').value,
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            address: document.getElementById('reg-address').value
        };
        
        if (!memberData.name || !memberData.email || !memberData.address) {
            alert('Semua field harus diisi');
            return;
        }
        
        fetch('api/register_member.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memberData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentMember = data.member;
                document.getElementById('member-name').textContent = currentMember.name;
                document.getElementById('member-points').textContent = currentMember.points;
                document.getElementById('member-info').classList.remove('d-none');
                document.getElementById('non-member-info').classList.add('d-none');
                
                const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                registerModal.hide();
                
                updateCartDisplay(); // Perbarui tampilan karena diskon member
                alert('Member berhasil didaftarkan!');
            } else {
                alert('Gagal mendaftarkan member: ' + data.message);
            }
        })
        .catch(error => console.error('Error registering member:', error));
    });
    
    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Keranjang belanja masih kosong');
            return;
        }
        
        const checkoutItems = document.getElementById('checkout-items');
        checkoutItems.innerHTML = '';
        
        let total = 0;
        let discountTotal = 0;
        let memberDiscount = 0;
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            let itemPrice = item.price;
            let itemDiscount = 0;
            
            // Hitung diskon berdasarkan jumlah
            if (item.bulkDiscount && item.bulkDiscount.length > 0) {
                const applicableDiscount = item.bulkDiscount
                    .filter(discount => item.quantity >= discount.minQuantity)
                    .sort((a, b) => b.minQuantity - a.minQuantity)[0];
                
                if (applicableDiscount) {
                    itemDiscount = (itemPrice * applicableDiscount.discountPercent / 100) * item.quantity;
                }
            }
            
            // Tambahkan diskon produk
            if (item.discount > 0) {
                itemDiscount += (itemPrice * item.discount / 100) * item.quantity;
            }
            
            const subtotal = itemPrice * item.quantity;
            total += subtotal;
            discountTotal += itemDiscount;
            
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'cart-item';
            checkoutItem.innerHTML = `
                <div>
                    <p class="mb-0">${item.name}</p>
                    <small>Rp ${formatNumber(itemPrice)} x ${item.quantity} = Rp ${formatNumber(subtotal)}</small>
                    ${itemDiscount > 0 ? `<br><small class="text-danger">Diskon: Rp ${formatNumber(itemDiscount)}</small>` : ''}
                </div>
            `;
            checkoutItems.appendChild(checkoutItem);
        });
        
        // Hitung diskon member
        if (currentMember && currentMember.discount > 0) {
            memberDiscount = (total - discountTotal) * (currentMember.discount / 100);
        }
        
        const finalTotal = total - discountTotal - memberDiscount;
        
        document.getElementById('checkout-total').textContent = formatNumber(total);
        document.getElementById('checkout-discount').textContent = formatNumber(discountTotal);
        document.getElementById('checkout-member-discount').textContent = formatNumber(memberDiscount);
        document.getElementById('checkout-final').textContent = formatNumber(finalTotal);
        
        // Reset form pembayaran
        document.getElementById('payment-amount').value = finalTotal;
        document.getElementById('payment-change').value = '0';
        
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    });
    
    // Hitung kembalian
    document.getElementById('payment-amount').addEventListener('input', function() {
        const paymentAmount = parseFloat(this.value) || 0;
        const finalTotal = parseFloat(document.getElementById('checkout-final').textContent.replace(/\./g, ''));
        const change = paymentAmount - finalTotal;
        
        document.getElementById('payment-change').value = change >= 0 ? formatNumber(change) : 'Pembayaran kurang';
    });
    
    // Konfirmasi pembayaran
    document.getElementById('confirm-payment').addEventListener('click', function() {
        const paymentAmount = parseFloat(document.getElementById('payment-amount').value) || 0;
        const finalTotal = parseFloat(document.getElementById('checkout-final').textContent.replace(/\./g, ''));
        const change = paymentAmount - finalTotal;
        
        if (change < 0) {
            alert('Pembayaran kurang!');
            return;
        }
        
        const paymentMethod = document.getElementById('payment-method').value;
        
        // Data transaksi
        const transactionData = {
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount
            })),
            member_id: currentMember ? currentMember.id : null,
            total: finalTotal,
            payment_method: paymentMethod,
            payment_amount: paymentAmount
        };
        
        fetch('api/transaction.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Tutup modal checkout
                const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
                checkoutModal.hide();
                
                // Tampilkan modal sukses
                document.getElementById('transaction-id').textContent = data.transaction_id;
                document.getElementById('transaction-total').textContent = formatNumber(finalTotal);
                document.getElementById('transaction-change').textContent = formatNumber(change);
                document.getElementById('transaction-points').textContent = data.points_earned || 0;
                
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
                
                // Reset keranjang
                cart = [];
                updateCartDisplay();
            } else {
                alert('Gagal memproses transaksi: ' + data.message);
            }
        })
        .catch(error => console.error('Error processing transaction:', error));
    });
    
    // Cetak struk
    document.getElementById('print-receipt').addEventListener('click', function() {
        const receiptWindow = window.open('', '_blank', 'width=400,height=600');
        
        const receiptContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Struk Belanja</title>
                <style>
                    body {
                        font-family: monospace;
                        font-size: 12px;
                        margin: 0;
                        padding: 10px;
                    }
                    .receipt {
                        width: 80mm;
                        margin: 0 auto;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 10px;
                    }
                    .divider {
                        border-top: 1px dashed #000;
                        margin: 5px 0;
                    }
                    .item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                        .summary {
                        margin-top: 10px;
                        border-top: 1px dashed #000;
                        padding-top: 10px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="header">
                        <h3>MiniMarket Sejahtera</h3>
                        <p>Jl. Pembelanjaan No. 123<br>Telp: 021-123456</p>
                        <p>No. Transaksi: ${document.getElementById('transaction-id').textContent}</p>
                        <p>Tanggal: ${new Date().toLocaleString('id-ID')}</p>
                    </div>
                    <div class="divider"></div>
                    <div class="items">
                        ${cart.map(item => `
                            <div class="item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>Rp ${formatNumber(item.price * item.quantity)}</span>
                            </div>
                            ${(item.discount > 0 || (item.bulkDiscount && item.bulkDiscount.length > 0)) ? 
                                `<div class="item"><span>Diskon</span><span>-Rp ${formatNumber(calculateItemDiscount(item))}</span></div>` : ''}
                        `).join('')}
                    </div>
                    <div class="summary">
                        <div class="item">
                            <span>Subtotal</span>
                            <span>Rp ${document.getElementById('checkout-total').textContent}</span>
                        </div>
                        <div class="item">
                            <span>Diskon Produk</span>
                            <span>-Rp ${document.getElementById('checkout-discount').textContent}</span>
                        </div>
                        <div class="item">
                            <span>Diskon Member</span>
                            <span>-Rp ${document.getElementById('checkout-member-discount').textContent}</span>
                        </div>
                        <div class="item">
                            <strong>Total</strong>
                            <strong>Rp ${document.getElementById('checkout-final').textContent}</strong>
                        </div>
                        <div class="item">
                            <span>Tunai</span>
                            <span>Rp ${formatNumber(parseFloat(document.getElementById('payment-amount').value))}</span>
                        </div>
                        <div class="item">
                            <span>Kembalian</span>
                            <span>Rp ${document.getElementById('transaction-change').textContent}</span>
                        </div>
                    </div>
                    ${currentMember ? `
                        <div class="divider"></div>
                        <div class="member-info">
                            <p>Member: ${currentMember.name}</p>
                            <p>Poin yang diperoleh: ${document.getElementById('transaction-points').textContent}</p>
                            <p>Total Poin: ${(currentMember.points + parseInt(document.getElementById('transaction-points').textContent))}</p>
                        </div>
                    ` : ''}
                    <div class="divider"></div>
                    <div class="footer">
                        <p>Terima Kasih Atas Kunjungan Anda</p>
                        <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;
        
        receiptWindow.document.write(receiptContent);
        receiptWindow.document.close();
    });
    
    // Fungsi untuk menghitung diskon item
    function calculateItemDiscount(item) {
        let itemDiscount = 0;
        
        // Hitung diskon berdasarkan jumlah
        if (item.bulkDiscount && item.bulkDiscount.length > 0) {
            const applicableDiscount = item.bulkDiscount
                .filter(discount => item.quantity >= discount.minQuantity)
                .sort((a, b) => b.minQuantity - a.minQuantity)[0];
            
            if (applicableDiscount) {
                itemDiscount = (item.price * applicableDiscount.discountPercent / 100) * item.quantity;
            }
        }
        
        // Tambahkan diskon produk
        if (item.discount > 0) {
            itemDiscount += (item.price * item.discount / 100) * item.quantity;
        }
        
        return itemDiscount;
    }
    
    // Transaksi baru
    document.getElementById('new-transaction').addEventListener('click', function() {
        location.reload();
    });
    
    // Load data produk saat halaman dimuat
    loadProducts();
});
