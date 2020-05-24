-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Φιλοξενητής: 192.168.1.4:3307
-- Χρόνος δημιουργίας: 23 Μάη 2020 στις 20:31:12
-- Έκδοση διακομιστή: 5.7.30
-- Έκδοση PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `gamemaster_db`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `practice_plays`
--

CREATE TABLE `practice_plays` (
  `home` varchar(60) NOT NULL,
  `away` varchar(60) NOT NULL,
  `result` varchar(20) NOT NULL,
  `playID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `practice_scores`
--

CREATE TABLE `practice_scores` (
  `username` varchar(60) NOT NULL,
  `wins` int(11) NOT NULL,
  `ties` int(11) NOT NULL,
  `losses` int(11) NOT NULL,
  `plays` int(11) NOT NULL,
  `total_score` int(11) NOT NULL,
  `available` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `practice_scores`
--

INSERT INTO `practice_scores` (`username`, `wins`, `ties`, `losses`, `plays`, `total_score`, `available`) VALUES
('tsakostas7', 1, 1, 0, 2, 4, 1),
('mpampis', 0, 0, 0, 0, 0, 1),
('akis', 0, 0, 1, 1, 0, 0),
('ktzavara', 0, 1, 0, 1, 1, 0),
('random', 1, 1, 1, 3, 4, 0);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `scores`
--

CREATE TABLE `scores` (
  `username` varchar(50) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `scores`
--

INSERT INTO `scores` (`username`, `score`, `id`) VALUES
('tsakostas7', 0, 1),
('mpampis', 0, 12),
('loulis', 0, 15),
('tytyty', 0, 19),
('randomguy', 0, 21),
('LEX', 0, 22),
('tttt', 0, 23),
('newguy', 0, 24),
('sokratis', 0, 25),
('xalaros15', 0, 26),
('mpaglamas', 0, 27),
('ddffdfd', 0, 28),
('ddffdfd', 0, 29);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `tournaments`
--

CREATE TABLE `tournaments` (
  `gametype` varchar(30) NOT NULL,
  `maxnumofusers` int(11) NOT NULL,
  `joinedusers` int(11) NOT NULL,
  `password` varchar(50) NOT NULL,
  `creator` varchar(50) NOT NULL,
  `tournamentID` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `tournaments`
--

INSERT INTO `tournaments` (`gametype`, `maxnumofusers`, `joinedusers`, `password`, `creator`, `tournamentID`, `name`) VALUES
('chess', 16, 8, 'myfirstchessgame', 'ktzavara', 1, 'First chess tournament '),
('tictactoe', 8, 4, 'trilizaraaaareee', 'tsakostas7', 2, 'The Big Battle'),
('chess', 16, 11, 'safekey', 'tsakostas7', 3, 'supertournament '),
('tictactoe', 32, 0, 'safekey', 'ktzavara', 4, 'tournouaraaaaa');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `tournament_players`
--

CREATE TABLE `tournament_players` (
  `player` varchar(60) NOT NULL,
  `active` int(11) NOT NULL,
  `tournamentID` int(11) NOT NULL,
  `total_score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `tournament_players`
--

INSERT INTO `tournament_players` (`player`, `active`, `tournamentID`, `total_score`) VALUES
('iskis', 0, 2, 0),
('ktzavara', 0, 2, 0),
('emiltzav', 1, 3, 0),
('roussos', 0, 3, 0),
('elli', 1, 3, 2),
('mairoula67', 1, 3, 0),
('marios', 1, 3, 0),
('manos96', 0, 3, 0),
('george26', 1, 3, 0),
('john73', 0, 3, 0),
('player1', 1, 3, 0),
('player2', 1, 3, 0),
('player3', 1, 3, 0),
('player4', 1, 3, 0),
('player5', 1, 3, 0),
('player6', 1, 3, 0),
('player7', 1, 3, 0),
('player8', 1, 3, 0),
('player1', 0, 1, 0),
('player2', 0, 1, 0),
('player3', 1, 1, 23),
('player4', 0, 1, 0),
('player5', 0, 1, 0),
('player6', 0, 1, 0),
('player7', 0, 1, 0),
('player8', 0, 1, 0),
('iskis', 1, 3, 21),
('manolios', 0, 3, 3),
('pantelis', 0, 3, 6),
('random', 1, 3, 2),
('random', 1, 4, 5);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `tournament_plays`
--

CREATE TABLE `tournament_plays` (
  `tournamentID` int(11) NOT NULL,
  `home` varchar(60) NOT NULL,
  `away` varchar(60) NOT NULL,
  `result` varchar(20) NOT NULL,
  `round` int(11) NOT NULL,
  `playID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `tournament_plays`
--

INSERT INTO `tournament_plays` (`tournamentID`, `home`, `away`, `result`, `round`, `playID`) VALUES
(2, 'eva', 'iskis', 'home', 4, 34),
(2, 'tsakostas7', 'ktzavara', 'home', 4, 35),
(3, 'tsoukalas', 'tsakostas7', 'home', 16, 36),
(3, 'tsoukalas', 'tsakostas7', 'home', 16, 41),
(3, 'emiltzav', 'roussos', 'home', 16, 42),
(3, 'elli', 'fontas', 'home', 8, 43),
(3, 'mairoula67', 'petros', '', 8, 44),
(3, 'lol', 'marios', '', 8, 45),
(3, 'petros', 'manos96', 'home', 16, 47),
(3, 'tsoukalas7', 'john73', 'home', 16, 48),
(3, 'emiltzav', 'mitsos', '', 16, 49),
(3, 'fontas', 'teo', 'home', 16, 50),
(3, 'iskis', 'elli', '', 4, 51),
(1, 'player1', 'player2', 'away', 8, 52),
(1, 'player3', 'player4', 'home', 8, 53),
(1, 'player5', 'player6', 'away', 8, 54),
(1, 'player7', 'player8', 'away', 8, 55),
(1, 'player2', 'player3', 'away', 4, 56),
(1, 'player6', 'player8', 'away', 4, 57),
(1, 'player3', 'player8', 'home', 2, 58),
(3, 'manolios', 'pantelis', 'tie', 4, 63),
(3, 'manolios', 'pantelis', 'tie', 4, 64),
(3, 'manolios', 'pantelis', 'tie', 4, 65),
(3, 'manolios', 'pantelis', 'away', 4, 66),
(3, 'pantelis', 'iskis', 'away', 2, 67);

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `practice_plays`
--
ALTER TABLE `practice_plays`
  ADD PRIMARY KEY (`playID`);

--
-- Ευρετήρια για πίνακα `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `tournaments`
--
ALTER TABLE `tournaments`
  ADD PRIMARY KEY (`tournamentID`);

--
-- Ευρετήρια για πίνακα `tournament_players`
--
ALTER TABLE `tournament_players`
  ADD KEY `tournament_players_ibfk_1` (`tournamentID`);

--
-- Ευρετήρια για πίνακα `tournament_plays`
--
ALTER TABLE `tournament_plays`
  ADD PRIMARY KEY (`playID`),
  ADD KEY `tournament_plays_ibfk_1` (`tournamentID`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `practice_plays`
--
ALTER TABLE `practice_plays`
  MODIFY `playID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT για πίνακα `tournaments`
--
ALTER TABLE `tournaments`
  MODIFY `tournamentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT για πίνακα `tournament_plays`
--
ALTER TABLE `tournament_plays`
  MODIFY `playID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `tournament_players`
--
ALTER TABLE `tournament_players`
  ADD CONSTRAINT `tournament_players_ibfk_1` FOREIGN KEY (`tournamentID`) REFERENCES `tournaments` (`tournamentID`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `tournament_plays`
--
ALTER TABLE `tournament_plays`
  ADD CONSTRAINT `tournament_plays_ibfk_1` FOREIGN KEY (`tournamentID`) REFERENCES `tournaments` (`tournamentID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
