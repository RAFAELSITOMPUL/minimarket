-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2025 at 04:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minimarket`
--

-- --------------------------------------------------------

--
-- Table structure for table `bulk_discounts`
--

CREATE TABLE `bulk_discounts` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `min_quantity` int(11) NOT NULL,
  `discount_percent` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bulk_discounts`
--

INSERT INTO `bulk_discounts` (`id`, `product_id`, `min_quantity`, `discount_percent`) VALUES
(1, 1, 5, 10.00),
(2, 1, 10, 15.00),
(3, 2, 6, 8.00),
(4, 2, 12, 15.00),
(5, 6, 10, 12.00),
(6, 7, 24, 20.00),
(7, 9, 5, 10.00),
(8, 11, 10, 15.00),
(9, 11, 40, 25.00),
(10, 16, 6, 10.00),
(11, 17, 20, 15.00),
(12, 20, 3, 15.00),
(13, 27, 2, 10.00),
(14, 31, 10, 20.00),
(15, 32, 10, 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `joined_date` date NOT NULL,
  `points` int(11) DEFAULT 0,
  `discount` decimal(5,2) DEFAULT 5.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `category` varchar(50) NOT NULL,
  `image` varchar(255) DEFAULT 'images/default.png',
  `discount` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `stock`, `category`, `image`, `discount`) VALUES
(1, 'Beras Premium 5kg', 65000.00, 50, 'Sembako', 'images/beras.jpg', 0.00),
(2, 'Minyak Goreng 2L', 28000.00, 75, 'Sembako', 'images/minyak.jpg', 5.00),
(3, 'Gula Pasir 1kg', 16000.00, 100, 'Sembako', 'images/gula.jpg', 0.00),
(4, 'Telur Ayam 1kg', 25000.00, 60, 'Sembako', 'images/telur.jpg', 0.00),
(5, 'Tepung Terigu 1kg', 12000.00, 80, 'Sembako', 'images/tepung.jpg', 0.00),
(6, 'Susu UHT 1L', 15000.00, 90, 'Minuman', 'images/susu.jpg', 0.00),
(7, 'Air Mineral 600ml', 4000.00, 200, 'Minuman', 'images/air.jpg', 0.00),
(8, 'Kopi Sachet', 2500.00, 150, 'Minuman', 'images/kopi.jpg', 0.00),
(9, 'Teh Celup (box)', 8000.00, 70, 'Minuman', 'images/teh.jpg', 0.00),
(10, 'Soda Kaleng', 7000.00, 100, 'Minuman', 'images/soda.jpg', 0.00),
(11, 'Mie Instan', 3500.00, 300, 'Makanan', 'images/mie.jpg', 0.00),
(12, 'Biskuit', 10000.00, 80, 'Makanan', 'images/biskuit.jpg', 0.00),
(13, 'Coklat Batang', 12000.00, 60, 'Makanan', 'images/coklat.jpg', 0.00),
(14, 'Keripik Kentang', 9000.00, 75, 'Makanan', 'images/keripik.jpg', 0.00),
(15, 'Permen (pack)', 5000.00, 100, 'Makanan', 'images/permen.jpg', 0.00),
(16, 'Sabun Mandi', 4500.00, 120, 'Toiletries', 'images/sabun.jpg', 0.00),
(17, 'Shampoo Sachet', 1500.00, 150, 'Toiletries', 'images/shampoo.jpg', 0.00),
(18, 'Pasta Gigi', 9500.00, 80, 'Toiletries', 'images/pasta.jpg', 0.00),
(19, 'Sikat Gigi', 7500.00, 70, 'Toiletries', 'images/sikat.jpg', 0.00),
(20, 'Deterjen 1kg', 18000.00, 60, 'Toiletries', 'images/deterjen.jpg', 10.00),
(21, 'Sabun Cuci Piring', 11000.00, 65, 'Toiletries', 'images/sabuncuci.jpg', 0.00),
(22, 'Tisu Wajah', 15000.00, 70, 'Toiletries', 'images/tisu.jpg', 0.00),
(23, 'Pembalut', 12000.00, 50, 'Toiletries', 'images/pembalut.jpg', 0.00),
(24, 'Cotton Bud', 8000.00, 60, 'Toiletries', 'images/cotton.jpg', 0.00),
(25, 'Hand Sanitizer', 10000.00, 80, 'Toiletries', 'images/sanitizer.jpg', 0.00),
(26, 'Bedak Bayi', 16000.00, 40, 'Bayi', 'images/bedak.jpg', 0.00),
(27, 'Popok Bayi (pack)', 45000.00, 30, 'Bayi', 'images/popok.jpg', 5.00),
(28, 'Susu Formula', 85000.00, 25, 'Bayi', 'images/formula.jpg', 0.00),
(29, 'Makanan Bayi', 22000.00, 35, 'Bayi', 'images/makananbayi.jpg', 0.00),
(30, 'Minyak Telon', 25000.00, 30, 'Bayi', 'images/telon.jpg', 0.00),
(31, 'Pulpen', 3500.00, 100, 'ATK', 'images/pulpen.jpg', 0.00),
(32, 'Buku Tulis', 5000.00, 80, 'ATK', 'images/buku.jpg', 0.00),
(33, 'Penggaris', 4000.00, 60, 'ATK', 'images/penggaris.jpg', 0.00),
(34, 'Spidol', 7500.00, 50, 'ATK', 'images/spidol.jpg', 0.00),
(35, 'Kertas HVS', 35000.00, 40, 'ATK', 'images/kertas.jpg', 0.00),
(36, 'Baterai AA', 12000.00, 70, 'Elektronik', 'images/baterai.jpg', 0.00),
(37, 'Charger HP', 25000.00, 30, 'Elektronik', 'images/charger.jpg', 0.00),
(38, 'Lampu LED 5W', 15000.00, 40, 'Elektronik', 'images/lampu.jpg', 0.00),
(39, 'Kabel USB', 20000.00, 45, 'Elektronik', 'images/kabel.jpg', 0.00),
(40, 'Headset', 35000.00, 25, 'Elektronik', 'images/headset.jpg', 0.00),
(41, 'Masker (pack)', 8000.00, 100, 'Kesehatan', 'images/masker.jpg', 0.00),
(42, 'Obat Flu', 5000.00, 80, 'Kesehatan', 'images/obatflu.jpg', 0.00),
(43, 'Vitamin C', 25000.00, 60, 'Kesehatan', 'images/vitaminc.jpg', 0.00),
(44, 'Plester', 10000.00, 50, 'Kesehatan', 'images/plester.jpg', 0.00),
(45, 'Minyak Angin', 18000.00, 40, 'Kesehatan', 'images/minyakangin.jpg', 0.00),
(46, 'Roti Tawar', 12000.00, 30, 'Bakery', 'images/roti.jpg', 0.00),
(47, 'Donat', 5000.00, 25, 'Bakery', 'images/donat.jpg', 0.00),
(48, 'Kue Basah', 7000.00, 20, 'Bakery', 'images/kue.jpg', 0.00),
(49, 'Brownies', 30000.00, 15, 'Bakery', 'images/brownies.jpg', 0.00),
(50, 'Croissant', 8000.00, 20, 'Bakery', 'images/croissant.jpg', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(20) NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `transaction_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaction_details`
--

CREATE TABLE `transaction_details` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bulk_discounts`
--
ALTER TABLE `bulk_discounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bulk_discounts`
--
ALTER TABLE `bulk_discounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction_details`
--
ALTER TABLE `transaction_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bulk_discounts`
--
ALTER TABLE `bulk_discounts`
  ADD CONSTRAINT `bulk_discounts_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD CONSTRAINT `transaction_details_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaction_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
