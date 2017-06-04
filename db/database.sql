-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.1.23-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for discordbot
DROP DATABASE IF EXISTS `discordbot`;
CREATE DATABASE IF NOT EXISTS `discordbot` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `discordbot`;

-- Dumping structure for table discordbot.commands
DROP TABLE IF EXISTS `commands`;
CREATE TABLE IF NOT EXISTS `commands` (
  `command` varchar(30) NOT NULL,
  `response` varchar(1000) NOT NULL,
  `user` varchar(50) DEFAULT 'USER MISSING',
  `added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`command`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping structure for table discordbot.messages
DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `ID` varchar(30) NOT NULL,
  `authorID` varchar(30) NOT NULL,
  `authorName` varchar(30) NOT NULL,
  `sent` datetime NOT NULL,
  `guildID` varchar(30) NOT NULL,
  `guildName` varchar(50) NOT NULL,
  `channelID` varchar(30) NOT NULL,
  `channelName` varchar(50) NOT NULL,
  `content` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Data exporting was unselected.
-- Dumping structure for procedure discordbot.messageCountByAuthor
DROP PROCEDURE IF EXISTS `messageCountByAuthor`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `messageCountByAuthor`(
	IN `fromDate` VARCHAR(50),
	IN `toDate` VARCHAR(50)
)
BEGIN
SELECT authorID, authorName, COUNT(*) messageCount from messages
WHERE date(sent) >= fromDate AND date(sent) <= toDate
GROUP BY authorname
ORDER BY messageCount DESC;
END//
DELIMITER ;

-- Dumping structure for procedure discordbot.messageCountByDate
DROP PROCEDURE IF EXISTS `messageCountByDate`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `messageCountByDate`(
	IN `fromDate` VARCHAR(50),
	IN `toDate` VARCHAR(50)
)
BEGIN
	SELECT date(sent) as date, COUNT(*) as messageCount FROM messages
	WHERE date(sent) >= fromDate AND date(sent) <= toDate
	GROUP BY date(sent);
END//
DELIMITER ;

-- Dumping structure for procedure discordbot.messageCountByDay
DROP PROCEDURE IF EXISTS `messageCountByDay`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `messageCountByDay`(
	IN `fromDate` VARCHAR(50),
	IN `toDate` VARCHAR(50)
)
BEGIN
SELECT dayname(sent) as day, COUNT(*) as messageCount FROM messages
WHERE date(sent) >= fromDate AND date(sent) <= toDate
GROUP BY day
ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
END//
DELIMITER ;

-- Dumping structure for procedure discordbot.messageCountByDayHour
DROP PROCEDURE IF EXISTS `messageCountByDayHour`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `messageCountByDayHour`(
	IN `fromDate` VARCHAR(50),
	IN `toDate` VARCHAR(50)
)
BEGIN
SELECT dayname(sent) as day, hour(sent) as hour, COUNT(*) as messageCount FROM messages
WHERE date(sent) >= fromDate AND date(sent) <= toDate
GROUP BY day, hour
ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), hour;
END//
DELIMITER ;

-- Dumping structure for procedure discordbot.messageCountByHour
DROP PROCEDURE IF EXISTS `messageCountByHour`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `messageCountByHour`(
	IN `fromDate` VARCHAR(50),
	IN `toDate` VARCHAR(50)
)
BEGIN
	SELECT HOUR(sent) as hour, COUNT(*) as messageCount FROM messages
	WHERE date(sent) >= fromDate AND date(sent) <= toDate
	GROUP BY HOUR(sent);
END//
DELIMITER ;

-- Dumping structure for procedure discordbot.messageInfo
DROP PROCEDURE IF EXISTS `messageInfo`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `messageInfo`(
	IN `fromDate` VARCHAR(50),
	IN `toDate` VARCHAR(50)
)
SELECT
	COUNT(*) as totalMessages,
	MIN(sent) as firstMessage,
	MAX(sent) as lastMessage
	FROM messages
	WHERE date(sent) >= fromDate AND date(sent) <= toDate//
DELIMITER ;

-- Data exporting was unselected.
-- Dumping structure for procedure discordbot.messagesWithUrl
DROP PROCEDURE IF EXISTS `messagesWithUrl`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `messagesWithUrl`(
	IN `fromDate` VARCHAR(50),
	IN `toDate` VARCHAR(50)
)
BEGIN
SELECT content FROM messages
WHERE
	 (date(sent) >= fromDate AND date(sent) <= toDate)
	 AND
	 (content LIKE "%http://%" OR content LIKE "%https://%");
END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
