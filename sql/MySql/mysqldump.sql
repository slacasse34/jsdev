-- MySQL dump 10.14  Distrib 5.5.50-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: FileInv
-- ------------------------------------------------------
-- Server version	5.5.50-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DirEntry`
--

DROP TABLE IF EXISTS `DirEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DirEntry` (
  `DirId` int(11) NOT NULL AUTO_INCREMENT,
  `VolId` int(11) DEFAULT NULL,
  `Path` varchar(255) DEFAULT NULL,
  `KbSize` int(11) DEFAULT NULL,
  PRIMARY KEY (`DirId`),
  KEY `VolId` (`VolId`),
  CONSTRAINT `DirEntry_ibfk_1` FOREIGN KEY (`VolId`) REFERENCES `Volume` (`VolId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DirEntry`
--

LOCK TABLES `DirEntry` WRITE;
/*!40000 ALTER TABLE `DirEntry` DISABLE KEYS */;
/*!40000 ALTER TABLE `DirEntry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FileEntry`
--

DROP TABLE IF EXISTS `FileEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FileEntry` (
  `VolId` int(11) DEFAULT NULL,
  `DirId` int(11) DEFAULT NULL,
  `Id` int(11) DEFAULT NULL,
  `FileName` varchar(64) DEFAULT NULL,
  `Size` bigint(20) DEFAULT NULL,
  `Blocks` int(11) DEFAULT NULL,
  `IOBlock` int(11) DEFAULT NULL,
  `Inode` int(11) DEFAULT NULL,
  `Links` int(11) DEFAULT NULL,
  `Access` int(11) DEFAULT NULL,
  `Uid` int(11) DEFAULT NULL,
  `Gid` int(11) DEFAULT NULL,
  `TAccess` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `TModify` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `TChange` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `TBirth` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `FileInfo` int(11) DEFAULT NULL,
  KEY `ByFileSize` (`Size`),
  KEY `ByFileMod` (`TModify`),
  KEY `ByFileInfo` (`FileInfo`),
  KEY `DirId` (`DirId`),
  KEY `VolId` (`VolId`),
  CONSTRAINT `FileEntry_ibfk_3` FOREIGN KEY (`FileInfo`) REFERENCES `FileInfo` (`Cksum`),
  CONSTRAINT `FileEntry_ibfk_1` FOREIGN KEY (`DirId`) REFERENCES `DirEntry` (`DirId`),
  CONSTRAINT `FileEntry_ibfk_2` FOREIGN KEY (`VolId`) REFERENCES `Volume` (`VolId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FileEntry`
--

LOCK TABLES `FileEntry` WRITE;
/*!40000 ALTER TABLE `FileEntry` DISABLE KEYS */;
/*!40000 ALTER TABLE `FileEntry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FileInfo`
--

DROP TABLE IF EXISTS `FileInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FileInfo` (
  `Cksum` int(11) NOT NULL,
  `Keyword` varchar(32) DEFAULT NULL,
  `Info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Cksum`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FileInfo`
--

LOCK TABLES `FileInfo` WRITE;
/*!40000 ALTER TABLE `FileInfo` DISABLE KEYS */;
INSERT INTO `FileInfo` VALUES (230775901,'Data','Data');
/*!40000 ALTER TABLE `FileInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Volume`
--

DROP TABLE IF EXISTS `Volume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Volume` (
  `VolId` int(11) NOT NULL AUTO_INCREMENT,
  `KbSize` int(11) DEFAULT NULL,
  `KbFree` int(11) DEFAULT NULL,
  `Label` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`VolId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Volume`
--

LOCK TABLES `Volume` WRITE;
/*!40000 ALTER TABLE `Volume` DISABLE KEYS */;
/*!40000 ALTER TABLE `Volume` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-06 14:38:45
