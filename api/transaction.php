<?php
// api/transaction.php
require_once '../config.php';

// Ambil data yang dikirim
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['items']) || empty($data['items'])) {
    echo json_encode(['success' => false, 'message' => 'Tidak ada item yang dibeli']);
    exit;
}

try {
    // Mulai transaksi database
    $db->beginTransaction();

    // Buat transaksi baru
    $stmt = $db->prepare("INSERT INTO transactions (member_id, total_amount, payment_method, payment_amount, transaction_date) 
                         VALUES (:member_id, :total_amount, :payment_method, :payment_amount, NOW())");
    $stmt->bindParam(':member_id', $data['member_id'], PDO::PARAM_INT);
    $stmt->bindParam(':total_amount', $data['total']);
    $stmt->bindParam(':payment_method', $data['payment_method']);
    $stmt->bindParam(':payment_amount', $data['payment_amount']);
    $stmt->execute();

    $transactionId = $db->lastInsertId();

    // Simpan detail transaksi
    $pointsEarned = 0;
    foreach ($data['items'] as $item) {
        $stmt = $db->prepare("INSERT INTO transaction_details (transaction_id, product_id, quantity, price, discount) 
                             VALUES (:transaction_id, :product_id, :quantity, :price, :discount)");
        $stmt->bindParam(':transaction_id', $transactionId);
        $stmt->bindParam(':product_id', $item['product_id']);
        $stmt->bindParam(':quantity', $item['quantity']);
        $stmt->bindParam(':price', $item['price']);
        $stmt->bindParam(':discount', $item['discount']);
        $stmt->execute();

        // Kurangi stok produk
        $stmt = $db->prepare("UPDATE products SET stock = stock - :quantity WHERE id = :product_id");
        $stmt->bindParam(':quantity', $item['quantity']);
        $stmt->bindParam(':product_id', $item['product_id']);
        $stmt->execute();

        // Akumulasi poin (1 poin untuk setiap Rp 10.000)
        $itemTotal = ($item['price'] * $item['quantity']) * (1 - ($item['discount'] / 100));
        $pointsEarned += floor($itemTotal / 10000);
    }

    // Update poin member jika ada
    if ($data['member_id']) {
        $stmt = $db->prepare("UPDATE members SET points = points + :points WHERE id = :member_id");
        $stmt->bindParam(':points', $pointsEarned);
        $stmt->bindParam(':member_id', $data['member_id']);
        $stmt->execute();
    }

    // Commit transaksi
    $db->commit();

    echo json_encode([
        'success' => true,
        'transaction_id' => $transactionId,
        'points_earned' => $pointsEarned
    ]);
} catch (PDOException $e) {
    // Rollback jika ada error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
