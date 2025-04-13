<?php
// api/member.php
require_once '../config.php';

if (!isset($_GET['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Nomor telepon tidak ditemukan']);
    exit;
}

$phone = $_GET['phone'];

try {
    $stmt = $db->prepare("SELECT * FROM members WHERE phone = :phone");
    $stmt->bindParam(':phone', $phone);
    $stmt->execute();
    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($member) {
        echo json_encode(['success' => true, 'member' => $member]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Member tidak ditemukan']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
