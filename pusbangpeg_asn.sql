-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 04, 2025 at 06:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pusbangpeg_asn`
--

-- --------------------------------------------------------

--
-- Table structure for table `item_requests`
--

CREATE TABLE `item_requests` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `itemType` enum('atk','chemical','printer','scanner','computer','laptop') NOT NULL,
  `description` text NOT NULL,
  `status` enum('pending','approved','rejected','fulfilled') DEFAULT 'pending',
  `tanggal` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_requests`
--

INSERT INTO `item_requests` (`id`, `nama`, `department`, `itemType`, `description`, `status`, `tanggal`, `createdAt`, `updatedAt`) VALUES
(3, 'aga', 'umum', 'atk', 'Kertas A4', 'pending', '2024-12-31', '2024-12-31 07:57:33', '2024-12-31 07:57:33'),
(4, 'aga', 'umum', 'atk', 'Tinta printer epson', 'approved', '2025-01-03', '2025-01-03 05:02:37', '2025-01-03 05:03:18');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `status` enum('pending','in_progress','resolved') DEFAULT 'pending',
  `tanggal` date NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `lokasiSpesifik` varchar(255) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `token` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `nama`, `status`, `tanggal`, `lokasi`, `lokasiSpesifik`, `keterangan`, `gambar`, `createdAt`, `updatedAt`, `token`) VALUES
(7, 'aga', '', '2025-01-02', 'ruangan-kelas', 'Lantai 2 Ruangan 204', 'Ac bocor', 'c0a653635e974808805ed7600.png', '2025-01-02 04:58:11', '2025-01-02 06:19:13', '0001'),
(8, 'dani', 'resolved', '2025-01-02', 'asrama', 'Asrama 1 kamar 1103', 'Kamar mandi mampet', '3828274ff27de085726d46900', '2025-01-02 06:30:28', '2025-01-02 06:31:35', '0002'),
(9, 'Fauziah', 'resolved', '2025-01-02', 'gedung-kantor', 'ruangan bagian umum', 'acnya bocor dan tidak dingin', '04bedbe71c8aa2b9633912300', '2025-01-02 07:08:30', '2025-01-02 07:26:04', '0003'),
(10, 'dani', 'in_progress', '2025-01-02', 'gedung-kantor', 'lantai 1', 'tes tes', NULL, '2025-01-02 07:25:28', '2025-01-02 07:28:36', '0004'),
(11, 'Senja', 'pending', '2025-02-03', 'studio', 'Studio lantai 2', 'Lampu ada beberapa yang mati', NULL, '2025-01-03 04:45:01', '2025-01-03 04:45:01', '0005'),
(12, 'Senja', 'in_progress', '2025-02-05', 'musik', 'ada di dekat aula', 'Senar gitar putus', NULL, '2025-01-03 04:48:13', '2025-01-04 16:28:34', '0006'),
(13, 'Kholid', 'resolved', '2025-02-12', 'gedung-kantor', 'Lt 1 umum', 'toilet kotor', NULL, '2025-01-03 08:25:41', '2025-01-03 08:27:50', '0007'),
(15, 'Aulia', 'in_progress', '2025-01-04', 'gedung-kantor', 'Ruangan umum', 'ac tidak dingin', NULL, '2025-01-04 16:17:06', '2025-01-04 16:23:49', '0008');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','participant') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@pusbang.com', 'admin2024', 'admin', '2024-12-27 16:26:18', '2024-12-27 16:26:18');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_rentals`
--

CREATE TABLE `vehicle_rentals` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `handphone` varchar(20) DEFAULT NULL,
  `vehicleType` enum('car','motorcycle','pickup','ambulance') NOT NULL,
  `driver` varchar(255) DEFAULT NULL,
  `startDate` date NOT NULL,
  `startTime` time NOT NULL,
  `endDate` date NOT NULL,
  `endTime` time NOT NULL,
  `purpose` text NOT NULL,
  `status` enum('pending','approved','rejected','in_use','completed') DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle_rentals`
--

INSERT INTO `vehicle_rentals` (`id`, `nama`, `handphone`, `vehicleType`, `driver`, `startDate`, `startTime`, `endDate`, `endTime`, `purpose`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'aga', '08989898989', 'car', 'akhid', '2024-12-31', '15:05:00', '2024-12-31', '16:05:00', 'Ke bogor', 'pending', '2024-12-31 08:05:31', '2024-12-31 08:05:31'),
(2, 'Diki', '08989898989', 'car', 'sendiri', '2025-02-05', '11:16:00', '2025-01-06', '15:16:00', 'Dinas luar kota', 'approved', '2025-01-03 04:16:30', '2025-01-03 04:43:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `item_requests`
--
ALTER TABLE `item_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vehicle_rentals`
--
ALTER TABLE `vehicle_rentals`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `item_requests`
--
ALTER TABLE `item_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `vehicle_rentals`
--
ALTER TABLE `vehicle_rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
