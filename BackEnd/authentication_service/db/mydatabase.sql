-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: May 05, 2020 at 06:31 PM
-- Server version: 5.7.30
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `timestamp` varchar(100) NOT NULL,
  `token` varchar(800) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `name`, `surname`, `email`, `id`, `date_created`, `role`, `timestamp`, `token`) VALUES
('tsakostas7', '1234', 'Kostas', 'Tsakos', 'ktsakos7@gmail.com', 1, '2020-04-14 22:33:10', 'Official', '2020-05-05 18:31:15.799886', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidHNha29zdGFzNyIsImV4cCI6MTU4ODcwMzQ1NH0.bjGGR9L2jraYQRrkIwoUQfgRwQgSvum9AhkHyZTf4tg'),
('tsoukalas7', '7777', 'takis', 'tsoukalas', 'tsoukalas@gmail.com', 2, '2020-04-25 22:33:10', 'Player', '2020-05-05 18:39:15.799886', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidHNha29zdGFzNyIsImV4cCI6MdU4ODcwM6Q1NH0.bjGGR9L2jraYQRrkIwoUQfgRwQgSvum9AhkHyZTf4tg'),
('ktzavara', '12345', 'Katerina', 'Tzavara', 'ktzavara3@gmail.com', 3, '2020-04-20 23:17:59', 'Admin', '2020-05-05 18:45:15.799886', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidHNha29zdGFzNyIsImV4cCI6MTU48DcwMzQggg0.bjGGR9L2jraYQRrkIwoUQfgRwQgSvum9AhkHyZTf4tg'),

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
