<?php
// api/register_member.php
require_once '../config.php';

// Ambil data yang dikirim
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['phone']) || !isset($data['name']) || !isset($data['email']) || !isset($data['address'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

try {
    // Cek apakah nomor telepon sudah terdaftar
    $stmt = $db->prepare("SELECT COUNT(*) FROM members WHERE phone = :phone");
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->execute();
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        echo json_encode(['success' => false, 'message' => 'Nomor telepon sudah terdaftar']);
        exit;
    }

    // Simpan member baru
    $stmt = $db->prepare("INSERT INTO members (name, phone, email, address, joined_date, points, discount) 
                         VALUES (:name, :phone, :email, :address, NOW(), 0, 5)");
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':address', $data['address']);
    $stmt->execute();

    $memberId = $db->lastInsertId();

    // Ambil data member yang baru didaftarkan
    $stmt = $db->prepare("SELECT * FROM members WHERE id = :id");
    $stmt->bindParam(':id', $memberId);
    $stmt->execute();
    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'member' => $member]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
