-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: kasihnusantara
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.19.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paymentType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentSource` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nominal` int(11) NOT NULL,
  `statusPayment` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `scholarshipId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `isRefund` int(11) NOT NULL DEFAULT '0',
  `refundDate` int(11) DEFAULT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `order_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `komentar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAnonim` int(11) NOT NULL DEFAULT '0',
  `noPembayaran` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `scholarshipId` (`scholarshipId`),
  KEY `userId` (`userId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`scholarshipId`) REFERENCES `scholarships` (`id`),
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'gopay ','Donation',15000,'pending',NULL,2,1,0,NULL,0,'dev845','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/b70995a8-cd80-4c89-bc4d-4343f2be0008/qr-code','2019-11-21 15:46:14','2019-11-21 15:59:40'),(2,'gopay','Donation',10000,'expire',NULL,0,1,0,NULL,0,'dev109','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/deff35fe-5ed4-4d9a-aa4f-aa47e6f3b590/qr-code','2019-11-21 16:01:51','2019-11-21 16:02:20'),(3,'gopay ','Donation',10000000,'expire',1,NULL,1,0,NULL,0,'dev601','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/d9e43283-d905-4e86-aba8-4dcd1d2aa4bd/qr-code','2019-11-21 17:19:22','2019-11-21 17:19:22'),(4,'gopay ','Donation',3245345,'expire',0,NULL,1,0,NULL,0,'dev939','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/03f49df3-ba82-44cb-8d39-e741a76724e2/qr-code','2019-11-21 17:22:05','2019-11-21 17:22:05'),(5,'gopay ','Donation',20000,'expire',1,NULL,1,0,NULL,0,'dev475','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/651fc000-6a9c-4616-8ae7-d7a198a5210e/qr-code','2019-11-21 17:34:15','2019-11-21 17:34:15'),(6,'gopay','Donation',25000,'settlement',NULL,3,1,0,NULL,0,'dev457','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/d2b4af4d-ce9d-4b81-8ecd-00354ad28f9e/qr-code','2019-12-04 10:47:53','2019-12-04 10:47:55');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payouts`
--

DROP TABLE IF EXISTS `payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) DEFAULT NULL,
  `scholarshipId` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `beneficiary_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beneficiary_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beneficiary_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payouts`
--

LOCK TABLES `payouts` WRITE;
/*!40000 ALTER TABLE `payouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `payouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projectCreated` datetime NOT NULL,
  `projectEnded` datetime NOT NULL,
  `currentValue` int(11) DEFAULT NULL,
  `totalTarget` int(11) NOT NULL,
  `projectImage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shareDescription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `isCancelled` int(11) NOT NULL DEFAULT '0',
  `cancelledDate` datetime DEFAULT NULL,
  `isGoing` int(11) NOT NULL DEFAULT '1',
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Bantu guru di Sumatera Utara untuk memfasilitasi murid muridnya dengan 30 laptop ','<p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>','2019-11-21 15:32:09','2020-11-10 07:00:00',NULL,20000000,'/post/image/project/PJT1573024662376.jpg','a',1,0,NULL,1,0,'2019-11-21 15:32:09','2019-11-21 15:32:09'),(2,'Bantu guru di Aceh untuk memfasilitasi murid muridnya dengan 100 tas sekolah','<p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>','2019-11-21 15:32:09','2020-11-10 07:00:00',NULL,1000000,'/post/image/project/PJT1573024649971.jpg','a',1,0,NULL,1,0,'2019-11-21 15:32:09','2019-11-21 15:32:09');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scholarships`
--

DROP TABLE IF EXISTS `scholarships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scholarships` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `totalPayout` int(11) NOT NULL,
  `currentValue` int(11) DEFAULT NULL,
  `isOngoing` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `userId` (`userId`),
  CONSTRAINT `scholarships_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  CONSTRAINT `scholarships_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scholarships`
--

LOCK TABLES `scholarships` WRITE;
/*!40000 ALTER TABLE `scholarships` DISABLE KEYS */;
INSERT INTO `scholarships` VALUES (1,'Bantu Biaya Sekolah Alma',23,1,360000,0,0,'1','2019-11-21 15:13:13','2019-11-21 15:13:13'),(2,'Bantu Biaya Sekolah Satria',24,1,360000,0,15000,'1','2019-11-21 15:13:16','2019-11-21 15:13:16'),(3,'Bantu Biaya Sekolah Risky Seran',25,1,480000,0,25000,'1','2019-11-21 15:14:12','2019-12-04 10:47:53'),(4,'Bantu Biaya Sekolah Angel Mnune',26,1,480000,0,0,'1','2019-11-21 15:19:22','2019-11-21 15:19:22'),(5,'Bantu Biaya Sekolah Robert Mamarimbing',27,1,720000,0,0,'1','2019-11-21 15:13:13','2019-11-21 15:13:13'),(6,'Bantu Biaya Sekolah Kris Dwiyulinda',28,1,720000,0,0,'1','2019-11-21 15:13:16','2019-11-21 15:13:16'),(7,'Bantu Biaya Sekolah Gina Fina',29,1,1800000,0,25000,'1','2019-11-21 15:14:12','2019-12-04 10:47:53'),(8,'Bantu Biaya Sekolah Yesni Yurike Fina',30,1,1440000,0,0,'1','2019-11-21 15:19:22','2019-11-21 15:19:22');
/*!40000 ALTER TABLE `scholarships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20191023083309-create-user.js'),('20191023083325-create-student.js'),('20191023083801-create-project.js'),('20191023083824-create-scholarship.js'),('20191023083836-create-student-revision.js'),('20191024082443-create-payment.js'),('20191029021507-create-subscription.js'),('20191107064611-create-payout.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentrevisions`
--

DROP TABLE IF EXISTS `studentrevisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentrevisions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pendidikanTerakhir` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggalLahir` datetime NOT NULL,
  `studentImage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provinsi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  `story` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shareDescription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomorRekening` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pemilikRekening` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamatSekolah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cabangBank` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teleponSekolah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `namaSekolah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kartuSiswa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raportTerakhir` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kartuKeluarga` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlahSaudara` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `kelas` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataPenghasilan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `studentrevisions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `studentrevisions_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentrevisions`
--

LOCK TABLES `studentrevisions` WRITE;
/*!40000 ALTER TABLE `studentrevisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentrevisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pendidikanTerakhir` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggalLahir` datetime NOT NULL,
  `studentImage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provinsi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  `story` text COLLATE utf8mb4_unicode_ci,
  `shareDescription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomorRekening` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pemilikRekening` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamatSekolah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cabangBank` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teleponSekolah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `namaSekolah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kartuSiswa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raportTerakhir` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kartuKeluarga` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlahSaudara` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `kelas` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataPenghasilan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataStatus` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statusNote` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (23,'Alma','SD','Wanita','Normal','Tangerang','1997-10-07 00:00:00','/student/SD-ADVENT-DENPASAR/Alma.jpg','BANTEN',0,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, mollitia neque enim placeat aliquam ipsa culpa qui expedita veniam amet perferendis porro voluptatem asperiores, et consectetur magni praesentium repellat pariatur.','Harap bantu siswa ini supaya bisa sekolah dengan tenang','0611101146','BCA Simulator A','Jalan Tangerang','PT. BANK CENTRAL ASIA TBK.','Cibodas','081122223333','SD Advent Denpasar - Bali','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',4,30000,'4','/student/images/STD1574255963962.jpg','Verified','','2019-11-20 20:39:24','2019-11-20 20:39:24'),(24,'Satria','SD','Pria','Normal','Jalan Kamboja 5 no. 10','1996-11-11 00:00:00','/student/SD-ADVENT-DENPASAR/Satria.jpg','SUMATERA UTARA',0,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, mollitia neque enim placeat aliquam ipsa culpa qui expedita veniam amet perferendis porro voluptatem asperiores, et consectetur magni praesentium repellat pariatur.','Ayo Bantu Selena untuk bisa lulus tanpa ada masalah.','1380011819286','Mandiri Simulator A','Jalan Flores 3 no. 11','PT. BANK MANDIRI (PERSERO) TBK.','Medan','081122223333','SD Advent Denpasar - Bali','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',2,30000,'5','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:01:25','2019-11-21 06:01:25'),(25,'Risky Seran','SD','Pria','Normal','Jalan Hasanudin 5 no. 10','2000-10-11 00:00:00','/student/SD-ADVENT-GETSEMANI-SOE-NTT/Angel.jpg','ACEH',0,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, mollitia neque enim placeat aliquam ipsa culpa qui expedita veniam amet perferendis porro voluptatem asperiores, et consectetur magni praesentium repellat pariatur.','Ayu bantu mutia agar bisa melanjutkan pendidikannya.','4111911431','Permata Simulator A','Jalan Kenangan 5 no. 10','PT. BANK PERMATA TBK.','Bireuen','081122223333','SD ADVENT GETSEMANI SOE, TTS','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',3,40000,'2','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:08:05','2019-11-21 06:08:05'),(26,'Angel Mnune','SD','Wanita','Normal','Jalan Senopati 5 no. 8','2007-10-11 00:00:00','/student/SD-ADVENT-GETSEMANI-SOE-NTT/Risky.jpg','JAWA BARAT',0,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, mollitia neque enim placeat aliquam ipsa culpa qui expedita veniam amet perferendis porro voluptatem asperiores, et consectetur magni praesentium repellat pariatur.','Ayo semua para donatur agar bisa membantu Siti sehingga kita semua bisa meringankan biaya hidup Ibunya.','1380011819286','Mandiri Simulator A','Jalan Baja 7 no. 10','PT. BANK MANDIRI (PERSERO) TBK.','Bandung','081122223333','SD ADVENT GETSEMANI SOE, TTS','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',0,40000,'5','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:17:11','2019-11-21 06:17:11'),(27,'Robert Mamarimbing','SD','Pria','Normal','Tangerang','1997-10-07 00:00:00','/student/SD-SMP-ADVENT-MENTENG/Robert-Mamarimbing-1.jpg','BANTEN',0,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, mollitia neque enim placeat aliquam ipsa culpa qui expedita veniam amet perferendis porro voluptatem asperiores, et consectetur magni praesentium repellat pariatur.','Harap bantu siswa ini supaya bisa sekolah dengan tenang','0611101146','BCA Simulator A','Jalan Tangerang','PT. BANK CENTRAL ASIA TBK.','Cibodas','081122223333','SD Advent Menteng - DKI Jakarta','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',4,60000,'5','/student/images/STD1574255963962.jpg','Verified','','2019-11-20 20:39:24','2019-11-20 20:39:24'),(28,'Kris Dwiyulinda','SMP','Wanita','Normal','Jalan Kamboja 5 no. 10','1996-11-11 00:00:00','/student/SD-SMP-ADVENT-MENTENG/kris-dwiyulinda.jpg','SUMATERA UTARA',0,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, mollitia neque enim placeat aliquam ipsa culpa qui expedita veniam amet perferendis porro voluptatem asperiores, et consectetur magni praesentium repellat pariatur.','Ayo Bantu Selena untuk bisa lulus tanpa ada masalah.','1380011819286','Mandiri Simulator A','Jalan Flores 3 no. 11','PT. BANK MANDIRI (PERSERO) TBK.','Medan','081122223333','SMP Advent Menteng - DKI Jakarta','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',2,60000,'8','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:01:25','2019-11-21 06:01:25'),(29,'Gina Fina','SMA','Wanita','Normal','Jalan Hasanudin 5 no. 10','2000-10-11 00:00:00','/student/SMP-SMA-ADVENT-PONAIN-AMARASI/Gina-Fina.jpg','ACEH',0,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, mollitia neque enim placeat aliquam ipsa culpa qui expedita veniam amet perferendis porro voluptatem asperiores, et consectetur magni praesentium repellat pariatur.','Ayu bantu mutia agar bisa melanjutkan pendidikannya.','4111911431','Permata Simulator A','Jalan Kenangan 5 no. 10','PT. BANK PERMATA TBK.','Bireuen','081122223333','SMA Advent Ponain, Amarasi -NTT','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',3,150000,'10','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:08:05','2019-11-21 06:08:05'),(30,'Yesni Yurike Fina','SMP','Wanita','Normal','Jalan Senopati 5 no. 8','2007-10-11 00:00:00','/student/SMP-SMA-ADVENT-PONAIN-AMARASI/Yesni.jpg','JAWA BARAT',0,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, mollitia neque enim placeat aliquam ipsa culpa qui expedita veniam amet perferendis porro voluptatem asperiores, et consectetur magni praesentium repellat pariatur.','Ayo semua para donatur agar bisa membantu Siti sehingga kita semua bisa meringankan biaya hidup Ibunya.','1380011819286','Mandiri Simulator A','Jalan Baja 7 no. 10','PT. BANK MANDIRI (PERSERO) TBK.','Bandung','081122223333','SMP Advent Ponain, Amarasi - NTT','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',0,120000,'9','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:17:11','2019-11-21 06:17:11');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scholarshipId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `nominalSubscription` int(11) DEFAULT NULL,
  `reminderDate` datetime DEFAULT NULL,
  `isCancelled` int(11) DEFAULT '0',
  `cancelledDate` datetime DEFAULT NULL,
  `monthLeft` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '-',
  `isGoogle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isFacebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userImage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastLogin` datetime NOT NULL,
  `verified` int(11) NOT NULL DEFAULT '0',
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'yuvens liem',NULL,'yuvensenverd@gmail.com','0','ae2c7a32b3bd66bc6b6e5c9568d92fa660491bea58b4dd274b5f120b5da446bb',NULL,'/defaultPhoto/defaultUser.png','2019-11-21 14:25:24',1,'User','2019-11-21 14:25:24','2019-11-21 14:25:24'),(2,'tedongtedong','8321faeb1c41e8a30b887039f183284fe026c39994057d1358eeed9527cb71e2','hhhhhh@gmail.com','0',NULL,NULL,'/defaultPhoto/defaultUser.png','2019-12-13 14:27:40',0,'User','2019-12-13 14:27:40','2019-12-13 14:27:40'),(3,'BOJASJA','16a2a478131d675f651ae06a112a4984e6ca34ae4cb7064b8868121e3d6f1e06','qiwejqwij@gmail.com','0',NULL,NULL,'/defaultPhoto/defaultUser.png','2019-12-13 14:31:35',0,'User','2019-12-13 14:31:35','2019-12-13 14:31:35'),(4,'asdasdasdasdasdasd','16a2a478131d675f651ae06a112a4984e6ca34ae4cb7064b8868121e3d6f1e06','qwekqwkk@gmail.com','0',NULL,NULL,'/defaultPhoto/defaultUser.png','2019-12-13 14:32:24',0,'User','2019-12-13 14:32:24','2019-12-13 14:32:24'),(5,'qiwejqiwjeqiwj','16a2a478131d675f651ae06a112a4984e6ca34ae4cb7064b8868121e3d6f1e06','ekqowek@gmail.com','0',NULL,NULL,'/defaultPhoto/defaultUser.png','2019-12-13 14:35:43',0,'User','2019-12-13 14:35:43','2019-12-13 14:35:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-16  9:32:30
