-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 16, 2021 at 03:25 PM
-- Server version: 5.7.31
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `secu_fb_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `user_id` smallint(5) UNSIGNED DEFAULT NULL,
  `post_id` mediumint(8) UNSIGNED NOT NULL,
  `comment_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_Comments_Users_id` (`user_id`),
  KEY `fk_Comments_Posts_id` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `content`, `user_id`, `post_id`, `comment_date`) VALUES
(8, 'Cest ou exactement à Okinawa ?', 16, 1, '2020-09-23 12:20:26'),
(9, 'Ishigaki, au sud !', 17, 2, '2020-09-23 12:21:11'),
(12, 'Pas mal pour travailler au calme...', 13, 1, '2020-09-24 11:20:53'),
(13, 'Omitto iuris dictionem in libera civitate contra leges senatusque consulta; caedes relinquo; libidines praetereo, quarum acerbissimum extat indicium et ad insignem memoriam turpitudinis et paene ad iustum odium imperii nostri, quod constat nobilissimas virgines se in puteos abiecisse et morte voluntaria necessariam turpitudinem depulisse. Nec haec idcirco omitto, quod non gravissima sint, sed quia nunc sine teste dico.', 13, 1, '2020-09-24 11:36:12'),
(26, 'Très joli bleu!..', 13, 1, '2020-09-28 14:40:31'),
(28, 'test', 16, 2, '2020-10-03 20:17:37');

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
CREATE TABLE IF NOT EXISTS `friends` (
  `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_user1` smallint(6) DEFAULT NULL,
  `id_user2` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `id_user1`, `id_user2`) VALUES
(1, 21, 13),
(2, 14, 21),
(3, 13, 16),
(4, 15, 16),
(7, 21, 17),
(8, 22, 15),
(9, 22, 19);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` smallint(5) UNSIGNED NOT NULL,
  `post_id` mediumint(8) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Likes_Users_id` (`user_id`),
  KEY `fk_Likes_Posts_id` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `post_id`) VALUES
(1, 16, 1),
(2, 16, 2),
(3, 13, 1),
(4, 13, 2);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` smallint(5) UNSIGNED DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `description` text,
  `post_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `privacy_id` int(11) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_Posts_Users_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `picture`, `description`, `post_date`, `privacy_id`) VALUES
(1, 11, 'http://localhost:3000/images/Walters_Work_1600805964762.png', 'I have spent my whole life scared, frightened of things that could happen, might happen, might not happen, 50 years I spent like that. Finding myself awake at three in the morning. But you know what? Ever since my diagnosis, I sleep just fine. What I came to realize is that fear, that’s the worst of it. That’s the real enemy. So, get up, get out in the real world and you kick that bastard as hard you can right in the teeth.', '2021-10-12 21:12:12', 1),
(2, 13, 'http://localhost:3000/images/Walters_Work_1600853648683.png', 'I have spent my whole life scared, frightened of things that could happen, might happen, might not happen, 50 years I spent like that. Finding myself awake at three in the morning. But you know what? Ever since my diagnosis, I sleep just fine. What I came to realize is that fear, that’s the worst of it. That’s the real enemy. So, get up, get out in the real world and you kick that bastard as hard you can right in the teeth.', '2021-10-12 21:12:12', 1);

-- --------------------------------------------------------

--
-- Table structure for table `privacy`
--

DROP TABLE IF EXISTS `privacy`;
CREATE TABLE IF NOT EXISTS `privacy` (
  `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT,
  `label` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `privacy`
--

INSERT INTO `privacy` (`id`, `label`) VALUES
(1, 'PUBLIC'),
(2, 'FRIENDS'),
(3, 'PRIVATE');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` text,
  `password` varchar(255) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ind_uni_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `tel`, `address`, `description`, `password`, `picture`) VALUES
(11, 'Mr Admin', 'mr.admin@email.com', NULL, NULL, NULL, 'U2FsdGVkX18FJljBPmEkRHS3no1WcAVKKqm/JymU9JBIWJxJ7Lr0/qkctgi1nXv+EhizDSokpiMdJ835Ax5z4M+eSL0/BOfFnO5bDtnaZR0=', NULL),
(13, 'Walter White', 'walter.white@email.com', NULL, NULL, 'If you don’t know who I am, then maybe your best course would be to tread lightly.', 'U2FsdGVkX1/Jf7U04jO2FaQASaFG6kIWzdkfXveDkGlDdqMRXxlM3GnHfMngr00qeV5M1etgae7cVjoonZyETy1Q+slLvgW9W917sOJynuI=', 'http://localhost:3000/images/Walter_White_1601739021689.png'),
(14, 'Daryl Dixon', 'daryl.dixon@email.com', NULL, NULL, '\"Come on, people. What the hell?\" ', 'U2FsdGVkX1/M4WT7PItrnl5Y/cpEJQcDYrXQn7Zn8Y2fOx+bSG2wEFWodDvvdGx5S8RdI3LiRxvWOmNM/ViDNuDPEQNsuamLZ9E6i5xgXcQ=', 'http://localhost:3000/images/Daryl_Dixon_1600853872625.png'),
(15, 'Arya Stark', 'arya.stark@email.com', NULL, NULL, 'A girl has no name', 'U2FsdGVkX1/MV341seNB6ydWnZGvQg5daR2LxNuQsN8lQXp6HmxC4Tvg+O2j/uJ8eDTwJ/vBU92jXXLn+40fzdKxM5/SXQsHDfyZHee+8yQ=', 'http://localhost:3000/images/Arya_Stark_1600854667218.png'),
(16, 'Tyler Durden', 'tyler.durden@email.com', NULL, NULL, NULL, 'U2FsdGVkX1+vDCmGRAToZg543hqnWcnudkWAkZxHyc5ceUkxpJ5NV81MdeDFrKRv47yCbG0XcHYNVvzJFTTSBqnBTt5rUs6r7qPHHqJLtBg=', 'http://localhost:3000/images/Tyler_Durden_1600855300190.png'),
(17, 'Beatrix Kiddo', 'beatrix.kiddo@email.com', NULL, NULL, 'This is what you get for ****ing around with Yakuzas! Go home to your mother!', 'U2FsdGVkX1/KWh1owWWvfpR9iussWAn/wMk/MvuOprVHhMHkrGEglokATDhOsAOuEkjOiUyWFentlcE4lQKzn2LvQqIVnrZmuo66zBRpKgM=', 'http://localhost:3000/images/beatrix_kiddo_1600855914161.png'),
(18, 'Hatim Sadeq', 'hatima@email.com', NULL, NULL, NULL, 'U2FsdGVkX18t2Mvo8Wt0oW1ttG62F+4urstp+PedY62lLnLgXOsRO0wed53F1xYgyC9vEKzDfCpNlduiMgc/zhNnt9A38fjKvV0reiLIuSo=', NULL),
(19, 'Hatim Sadeq', 'hatimas@email.com', NULL, NULL, NULL, 'U2FsdGVkX1+BEfjMI4n429kSOTzgZc4QnyQqPok5Dx+OYOxuYXXndAmEkhvkMH24cyix8vJxnlbmameJsEGjWQOrX2Ro/49SXytBdm35k38=', NULL),
(21, 'user1', 'user1@email.com', NULL, NULL, NULL, 'U2FsdGVkX1/21yJGyVR9btJJP5BzcjxNmmzC0BkDMjfIJ/+X2Zn/flCtOn5U+ESEES94SFik1W56GftlqrEXzc0/vMpqc75ZF5e7fPD95Uk=', NULL),
(22, 'user2', 'user2@email.com', NULL, NULL, NULL, 'U2FsdGVkX19ACBsYUb/uHq7wSwtsvjkEwklZd0eJ6f+gbPqIPn6brjdpa+/JqAvqz8hNo2C2/CXQnP4VMTbl3SXIk33FjOBEvvwR/QnkMGQ=', NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_Comments_Posts_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Comments_Users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_Likes_Posts_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Likes_Users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_Posts_Users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
