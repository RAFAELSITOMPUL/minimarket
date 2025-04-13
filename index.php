<!-- index.php -->
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MiniMarket - Sistem Pembelian</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container mt-4">
        <header class="mb-4">
            <h1 class="text-center">MiniMarket Sejahtera</h1>
            <p class="text-center">Sistem Pembelian Barang</p>
        </header>

        <div class="row">
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Daftar Produk</h5>
                    </div>
                    <div class="card-body">
                        <div class="row" id="product-list">
                            <!-- Produk akan dimuat di sini menggunakan JavaScript -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">Keranjang Belanja</h5>
                    </div>
                    <div class="card-body">
                        <div id="cart-items">
                            <!-- Item keranjang akan ditampilkan di sini -->
                        </div>
                        <hr>
                        <div id="cart-summary">
                            <p>Total: Rp <span id="cart-total">0</span></p>
                            <p>Diskon: Rp <span id="discount-amount">0</span></p>
                            <p><strong>Total Bayar: Rp <span id="final-total">0</span></strong></p>
                        </div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">Informasi Member</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="phone" class="form-label">Nomor HP Member</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="phone" placeholder="Contoh: 08123456789">
                                <button class="btn btn-outline-primary" type="button" id="checkMember">Cek</button>
                            </div>
                        </div>
                        <div id="member-info" class="d-none">
                            <div class="alert alert-success">
                                <p class="mb-0">Member: <span id="member-name">-</span></p>
                                <p class="mb-0">Poin: <span id="member-points">0</span></p>
                            </div>
                        </div>
                        <div id="non-member-info" class="d-none">
                            <div class="alert alert-warning">
                                <p class="mb-0">Nomor HP belum terdaftar sebagai member.</p>
                                <button class="btn btn-sm btn-primary mt-2" id="registerMember">Daftar Member Baru</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <button class="btn btn-primary w-100" id="checkout-btn">Proses Pembayaran</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Daftar Member -->
    <div class="modal fade" id="registerModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Daftar Member Baru</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="memberForm">
                        <div class="mb-3">
                            <label for="reg-phone" class="form-label">Nomor HP</label>
                            <input type="text" class="form-control" id="reg-phone" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="reg-name" class="form-label">Nama Lengkap</label>
                            <input type="text" class="form-control" id="reg-name" required>
                        </div>
                        <div class="mb-3">
                            <label for="reg-email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="reg-email" required>
                        </div>
                        <div class="mb-3">
                            <label for="reg-address" class="form-label">Alamat</label>
                            <textarea class="form-control" id="reg-address" rows="3" required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-primary" id="saveMember">Simpan</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Checkout -->
    <div class="modal fade" id="checkoutModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detail Pembayaran</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h6>Daftar Belanja</h6>
                            <div id="checkout-items" class="mb-3">
                                <!-- Item checkout akan ditampilkan di sini -->
                            </div>
                            <hr>
                            <div id="checkout-summary">
                                <p>Total: Rp <span id="checkout-total">0</span></p>
                                <p>Diskon: Rp <span id="checkout-discount">0</span></p>
                                <p>Diskon Member: Rp <span id="checkout-member-discount">0</span></p>
                                <p><strong>Total Bayar: Rp <span id="checkout-final">0</span></strong></p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h6>Pembayaran</h6>
                            <div class="mb-3">
                                <label for="payment-method" class="form-label">Metode Pembayaran</label>
                                <select class="form-select" id="payment-method">
                                    <option value="cash">Tunai</option>
                                    <option value="debit">Kartu Debit</option>
                                    <option value="credit">Kartu Kredit</option>
                                    <option value="ewallet">E-Wallet</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="payment-amount" class="form-label">Jumlah Dibayar</label>
                                <input type="number" class="form-control" id="payment-amount">
                            </div>
                            <div class="mb-3">
                                <label for="payment-change" class="form-label">Kembalian</label>
                                <input type="text" class="form-control" id="payment-change" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-primary" id="confirm-payment">Konfirmasi Pembayaran</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Sukses -->
    <div class="modal fade" id="successModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">Pembayaran Berhasil</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-4">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                        <h4 class="mt-2">Transaksi Selesai</h4>
                    </div>
                    <p>Nomor Transaksi: <span id="transaction-id"></span></p>
                    <p>Total Pembayaran: Rp <span id="transaction-total"></span></p>
                    <p>Kembalian: Rp <span id="transaction-change"></span></p>
                    <p>Poin yang didapat: <span id="transaction-points"></span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="print-receipt">Cetak Struk</button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" id="new-transaction">Transaksi Baru</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>

</html>