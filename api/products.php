<?php
// api/products.php

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set header to return JSON
header('Content-Type: application/json');

// Include database configuration
require_once '../config.php';

try {
    // Check if database connection exists
    if (!isset($db) || !($db instanceof PDO)) {
        throw new Exception("Database connection not established");
    }

    // Set PDO to throw exceptions on errors
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Retrieve all in-stock products
    $stmt = $db->prepare("SELECT * FROM products WHERE stock > 0");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($products)) {
        echo json_encode([
            'success' => true,
            'message' => 'No products in stock',
            'data' => []
        ]);
        exit;
    }

    // Check if bulk_discounts table exists before querying
    $checkTable = $db->query("SHOW TABLES LIKE 'bulk_discounts'");
    $tableExists = ($checkTable->rowCount() > 0);

    $bulkDiscounts = [];

    if ($tableExists) {
        // Retrieve bulk discount information
        $stmt = $db->prepare("SELECT * FROM bulk_discounts ORDER BY product_id, min_quantity");
        $stmt->execute();
        $allBulkDiscounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Organize discounts by product ID
        foreach ($allBulkDiscounts as $discount) {
            $productId = $discount['product_id'];
            if (!isset($bulkDiscounts[$productId])) {
                $bulkDiscounts[$productId] = [];
            }
            $bulkDiscounts[$productId][] = [
                'minQuantity' => (int)$discount['min_quantity'],
                'discountPercent' => (float)$discount['discount_percent']
            ];
        }
    }

    // Add discount information to each product
    foreach ($products as &$product) {
        // Ensure numeric values are properly typed
        if (isset($product['id'])) {
            $product['id'] = (int)$product['id'];
        }
        if (isset($product['price'])) {
            $product['price'] = (float)$product['price'];
        }
        if (isset($product['stock'])) {
            $product['stock'] = (int)$product['stock'];
        }

        // Add bulk discount data if available
        $productId = $product['id'];
        $product['bulkDiscounts'] = isset($bulkDiscounts[$productId]) ?
            $bulkDiscounts[$productId] : [];
    }

    // Return success response with product data
    echo json_encode([
        'success' => true,
        'count' => count($products),
        'data' => $products
    ]);
} catch (PDOException $e) {
    // Handle database errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
} catch (Exception $e) {
    // Handle general errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
