-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: kasihnusantara
-- ------------------------------------------------------
-- Server version	8.0.17

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
-- Table structure for table `dokumen_siswas`
--

DROP TABLE IF EXISTS `dokumen_siswas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dokumen_siswas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` int(11) DEFAULT NULL,
  `dokumenPath` varchar(255) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumen_siswas`
--

LOCK TABLES `dokumen_siswas` WRITE;
/*!40000 ALTER TABLE `dokumen_siswas` DISABLE KEYS */;
/*!40000 ALTER TABLE `dokumen_siswas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paymentType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `paymentSource` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nominal` int(11) NOT NULL,
  `statusPayment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `scholarshipId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `isRefund` int(11) NOT NULL DEFAULT '0',
  `refundDate` int(11) DEFAULT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `order_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `komentar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isAnonim` int(11) NOT NULL DEFAULT '0',
  `noPembayaran` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `scholarshipId` (`scholarshipId`),
  KEY `userId` (`userId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`scholarshipId`) REFERENCES `scholarships` (`id`),
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `beneficiary_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `beneficiary_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bank` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reference_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `beneficiary_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `projectCreated` datetime NOT NULL,
  `projectEnded` datetime NOT NULL,
  `currentValue` int(11) DEFAULT NULL,
  `totalTarget` int(11) NOT NULL,
  `projectImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shareDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Bantu Guru di Sumatera Utara untuk Memfasilitasi Murid Muridnya Dengan 30 Laptop ','<p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>','2019-11-21 15:32:09','2020-11-10 07:00:00',NULL,20000000,'/post/image/project/PJT1573024662376.jpg','a',1,0,NULL,1,0,'2019-11-21 15:32:09','2019-11-21 15:32:09'),(2,'Bantu Guru di Aceh untuk Memfasilitasi Muridnya dengan 100 Tas Sekolah','<p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>','2019-11-21 15:32:09','2020-11-10 07:00:00',NULL,1000000,'/post/image/project/PJT1573024649971.jpg','a',1,0,NULL,1,0,'2019-11-21 15:32:09','2019-11-21 15:32:09');
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
  `judul` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `studentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `totalPayout` int(11) NOT NULL,
  `currentValue` int(11) DEFAULT NULL,
  `isOngoing` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `userId` (`userId`),
  CONSTRAINT `scholarships_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  CONSTRAINT `scholarships_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scholarships`
--

LOCK TABLES `scholarships` WRITE;
/*!40000 ALTER TABLE `scholarships` DISABLE KEYS */;
INSERT INTO `scholarships` VALUES (1,'Bantu Biaya Sekolah Alma',45,8,360000,0,0,'1','2019-11-21 15:13:13','2019-11-21 15:13:13'),(2,'Bantu Biaya Sekolah Satria',46,8,360000,0,15000,'1','2019-11-21 15:13:16','2019-11-21 15:13:16'),(3,'Bantu Biaya Sekolah Risky Seran',39,8,480000,0,25000,'1','2019-11-21 15:14:12','2019-12-04 10:47:53'),(4,'Bantu Biaya Sekolah Angel Mnune',40,8,480000,0,0,'1','2019-11-21 15:19:22','2019-11-21 15:19:22'),(5,'Bantu Biaya Sekolah Robert Mamarimbing',43,8,720000,0,0,'1','2019-11-21 15:13:13','2019-11-21 15:13:13'),(6,'Bantu Biaya Sekolah Kris Dwiyulinda',44,8,720000,0,0,'1','2019-11-21 15:13:16','2019-11-21 15:13:16'),(7,'Bantu Biaya Sekolah Gina Fina',41,8,1800000,0,25000,'1','2019-11-21 15:14:12','2019-12-04 10:47:53'),(8,'Bantu Biaya Sekolah Yesni Yurike Fina',42,8,1440000,0,0,'1','2019-11-21 15:19:22','2019-11-21 15:19:22');
/*!40000 ALTER TABLE `scholarships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_pictures`
--

DROP TABLE IF EXISTS `school_pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_pictures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schoolId` int(11) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_pictures`
--

LOCK TABLES `school_pictures` WRITE;
/*!40000 ALTER TABLE `school_pictures` DISABLE KEYS */;
INSERT INTO `school_pictures` VALUES (1,4,'/school/SCHOOL1581583005052.jpg','2020-02-13 15:36:45','2020-02-13 15:36:45'),(2,4,'/school/SCHOOL1581583005089.jpg','2020-02-13 15:36:45','2020-02-13 15:36:45'),(3,4,'/school/SCHOOL1581583005105.jpg','2020-02-13 15:36:45','2020-02-13 15:36:45'),(4,4,'/school/SCHOOL1581583005151.jpg','2020-02-13 15:36:45','2020-02-13 15:36:45');
/*!40000 ALTER TABLE `school_pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) DEFAULT NULL,
  `alamat` text,
  `telepon` varchar(255) DEFAULT NULL,
  `namaPemilikRekening` varchar(255) DEFAULT NULL,
  `nomorRekening` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isDeleted` int(11) DEFAULT '0',
  `isVerified` int(11) DEFAULT '0',
  `cabangBank` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES (1,'','','','','','','','2020-02-12 10:18:15','2020-02-12 10:26:05',1,0,NULL),(2,'SD 1 Tangerang','Tangerang','081291316834','Mandiri Simulator A','1380011819286','mandiri','sd1tangerang@gmail.com','2020-02-12 10:58:05','2020-02-12 11:01:20',1,1,NULL),(3,'SD 2 Tangerang','Tangerang','081291316834','Mandiri Simulator A','1380011819286 ','mandiri','sd1tangerang@gmail.com','2020-02-12 11:01:14','2020-02-12 11:01:14',0,1,NULL),(4,'SD 3 Tangerang','Jalan Tangerang','081291316834','Mandiri Simulator A','1380011819286','mandiri','sd1tangerang@gmail.com','2020-02-13 15:36:45','2020-02-13 15:36:45',0,1,NULL);
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20191023083309-create-user.js'),('20191023083325-create-student.js'),('20191023083801-create-project.js'),('20191023083824-create-scholarship.js'),('20191023083836-create-student-revision.js'),('20191024082443-create-payment.js'),('20191029021507-create-subscription.js'),('20191107064611-create-payout.js'),('20200211064020-create-dokumen-siswa.js'),('20200211105055-create-school.js'),('20200211105237-create-school-pictures.js'),('20200212030255-isDeleted_school.js'),('20200212032226-isVerified_school.js'),('20200213085041-cabangBank_school.js'),('20200213085942-update_studentColumn.js'),('20200213090921-schoolId_student.js');
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
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pendidikanTerakhir` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alamat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tanggalLahir` datetime NOT NULL,
  `studentImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `provinsi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  `story` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shareDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nomorRekening` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pemilikRekening` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alamatSekolah` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `bank` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cabangBank` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `teleponSekolah` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `namaSekolah` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kartuSiswa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `raportTerakhir` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kartuKeluarga` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `jumlahSaudara` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `kelas` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dataPenghasilan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `studentrevisions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `studentrevisions_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pendidikanTerakhir` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alamat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tanggalLahir` datetime NOT NULL,
  `studentImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `provinsi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  `story` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `shareDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `teleponSekolah` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kartuSiswa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `raportTerakhir` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kartuKeluarga` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `jumlahSaudara` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `kelas` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dataPenghasilan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dataStatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `statusNote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `schoolId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `Students_schoolId_foreign_idx` (`schoolId`),
  CONSTRAINT `Students_schoolId_foreign_idx` FOREIGN KEY (`schoolId`) REFERENCES `schools` (`id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (39,'Risky Seran','SD','Pria','Normal','Jalan Hasanudin 5 no. 10','2000-10-11 00:00:00','/student/SD-ADVENT-GETSEMANI-SOE-NTT/Risky.jpg','NUSA TENGGARA TIMUR',0,8,'Angka putus sekolah di Indonesia cukup tinggi. Penyebab anak putus sekolah salah satunya faktor ekonomi. Kami ingin melihat lebih banyak anak-anak Indonesia memperoleh pendidikan. Yuk jangan biarkan anak-anak Indonesia putus sekolah!','Ayu bantu mutia agar bisa melanjutkan pendidikannya.','081122223333','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',3,40000,'2','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:08:05','2019-11-21 06:08:05',NULL),(40,'Angel Mnune','SD','Wanita','Normal','Jalan Senopati 5 no. 8','2007-10-11 00:00:00','/student/SD-ADVENT-GETSEMANI-SOE-NTT/Angel.jpg','NUSA TENGGARA TIMUR',0,8,'Angka putus sekolah di Indonesia cukup tinggi. Penyebab anak putus sekolah salah satunya faktor ekonomi. Kami ingin melihat lebih banyak anak-anak Indonesia memperoleh pendidikan. Yuk jangan biarkan anak-anak Indonesia putus sekolah!','Ayo semua para donatur agar bisa membantu Siti sehingga kita semua bisa meringankan biaya hidup Ibunya.','081122223333','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',0,40000,'5','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:17:11','2019-11-21 06:17:11',NULL),(41,'Gina Fina','SMA','Wanita','Normal','Jalan Hasanudin 5 no. 10','2000-10-11 00:00:00','/student/SMP-SMA-ADVENT-PONAIN-AMARASI/Gina-Fina.jpg','NUSA TENGGARA TIMUR',0,8,'Angka putus sekolah di Indonesia cukup tinggi. Penyebab anak putus sekolah salah satunya faktor ekonomi. Kami ingin melihat lebih banyak anak-anak Indonesia memperoleh pendidikan. Yuk jangan biarkan anak-anak Indonesia putus sekolah!','Ayu bantu mutia agar bisa melanjutkan pendidikannya.','081122223333','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',3,150000,'10','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:08:05','2019-11-21 06:08:05',NULL),(42,'Yesni Yurike Fina','SMP','Wanita','Normal','Jalan Senopati 5 no. 8','2007-10-11 00:00:00','/student/SMP-SMA-ADVENT-PONAIN-AMARASI/Yesni.jpg','NUSA TENGGARA TIMUR',0,8,'Angka putus sekolah di Indonesia cukup tinggi. Penyebab anak putus sekolah salah satunya faktor ekonomi. Kami ingin melihat lebih banyak anak-anak Indonesia memperoleh pendidikan. Yuk jangan biarkan anak-anak Indonesia putus sekolah!','Ayo semua para donatur agar bisa membantu Siti sehingga kita semua bisa meringankan biaya hidup Ibunya.','081122223333','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',0,120000,'9','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:17:11','2019-11-21 06:17:11',NULL),(43,'Robert Mamarimbing','SD','Pria','Normal','Tangerang','1997-10-07 00:00:00','/student/SD-SMP-ADVENT-MENTENG/Robert-Mamarimbing-1.jpg','DKI JAKARTA',0,8,'Angka putus sekolah di Indonesia cukup tinggi. Penyebab anak putus sekolah salah satunya faktor ekonomi. Kami ingin melihat lebih banyak anak-anak Indonesia memperoleh pendidikan. Yuk jangan biarkan anak-anak Indonesia putus sekolah!','Harap bantu siswa ini supaya bisa sekolah dengan tenang','081122223333','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',4,60000,'5','/student/images/STD1574255963962.jpg','Verified','','2019-11-20 20:39:24','2019-11-20 20:39:24',NULL),(44,'Kris Dwiyulinda','SMP','Wanita','Normal','Jalan Kamboja 5 no. 10','1996-11-11 00:00:00','/student/SD-SMP-ADVENT-MENTENG/kris-dwiyulinda.jpg','DKI JAKARTA',0,8,'Angka putus sekolah di Indonesia cukup tinggi. Penyebab anak putus sekolah salah satunya faktor ekonomi. Kami ingin melihat lebih banyak anak-anak Indonesia memperoleh pendidikan. Yuk jangan biarkan anak-anak Indonesia putus sekolah!','Ayo Bantu Selena untuk bisa lulus tanpa ada masalah.','081122223333','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',2,60000,'8','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:01:25','2019-11-21 06:01:25',NULL),(45,'Alma','SD','Wanita','Normal','Tangerang','1997-10-07 00:00:00','/student/SD-ADVENT-DENPASAR/Alma.jpg','DENPASAR',0,8,'Angka putus sekolah di Indonesia cukup tinggi. Penyebab anak putus sekolah salah satunya faktor ekonomi. Kami ingin melihat lebih banyak anak-anak Indonesia memperoleh pendidikan. Yuk jangan biarkan anak-anak Indonesia putus sekolah!','Harap bantu siswa ini supaya bisa sekolah dengan tenang','081122223333','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',4,30000,'4','/student/images/STD1574255963962.jpg','Verified','','2019-11-20 20:39:24','2019-11-20 20:39:24',NULL),(46,'Satria','SD','Pria','Normal','Jalan Kamboja 5 no. 10','1996-11-11 00:00:00','/student/SD-ADVENT-DENPASAR/Satria.jpg','DENPASAR',0,8,'Angka putus sekolah di Indonesia cukup tinggi. Penyebab anak putus sekolah salah satunya faktor ekonomi. Kami ingin melihat lebih banyak anak-anak Indonesia memperoleh pendidikan. Yuk jangan biarkan anak-anak Indonesia putus sekolah!','Ayo Bantu Selena untuk bisa lulus tanpa ada masalah.','081122223333','/student/images/STD1574255993566.png','/student/images/STD1574255963954.png','/student/images/STD1574255963959.jpg',2,30000,'5','/student/images/STD1574255963962.jpg','Verified','','2019-11-21 06:01:25','2019-11-21 06:01:25',NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phoneNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '-',
  `isGoogle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isFacebook` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `userImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lastLogin` datetime NOT NULL,
  `verified` int(11) NOT NULL DEFAULT '0',
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'yuvens liem',NULL,'yuvensenverd@gmail.com','0','ae2c7a32b3bd66bc6b6e5c9568d92fa660491bea58b4dd274b5f120b5da446bb',NULL,'/defaultPhoto/defaultUser.png','2019-11-21 14:25:24',1,'User','2019-11-21 14:25:24','2019-11-21 14:25:24'),(2,'tedongtedong','8321faeb1c41e8a30b887039f183284fe026c39994057d1358eeed9527cb71e2','hhhhhh@gmail.com','0',NULL,NULL,'/defaultPhoto/defaultUser.png','2019-12-13 14:27:40',0,'User','2019-12-13 14:27:40','2019-12-13 14:27:40'),(3,'BOJASJA','16a2a478131d675f651ae06a112a4984e6ca34ae4cb7064b8868121e3d6f1e06','qiwejqwij@gmail.com','0',NULL,NULL,'/defaultPhoto/defaultUser.png','2019-12-13 14:31:35',0,'User','2019-12-13 14:31:35','2019-12-13 14:31:35'),(4,'asdasdasdasdasdasd','16a2a478131d675f651ae06a112a4984e6ca34ae4cb7064b8868121e3d6f1e06','qwekqwkk@gmail.com','0',NULL,NULL,'/defaultPhoto/defaultUser.png','2019-12-13 14:32:24',0,'User','2019-12-13 14:32:24','2019-12-13 14:32:24'),(5,'qiwejqiwjeqiwj','16a2a478131d675f651ae06a112a4984e6ca34ae4cb7064b8868121e3d6f1e06','ekqowek@gmail.com','0',NULL,NULL,'/defaultPhoto/defaultUser.png','2019-12-13 14:35:43',0,'User','2019-12-13 14:35:43','2019-12-13 14:35:43'),(6,'Yubi Kitta',NULL,'yubikitta@gmail.com','0','f0adf2ad8a08ecb17029e155b66c0413c891b3212ff85dca1f7a773c5841e80a',NULL,'/defaultPhoto/defaultUser.png','2019-12-16 10:00:50',1,'Admin','2019-12-16 10:00:50','2019-12-16 10:00:50'),(7,'Reza Ardiansyah',NULL,'rezardiansyah1997@gmail.com','0','651ebf8098f121b6c458ddcc29ac7e839e1f3e292e35b4e990aabdc8ce5ae9ae',NULL,'/defaultPhoto/defaultUser.png','2019-12-23 11:16:07',1,'Donatur','2019-12-23 11:16:07','2019-12-23 14:01:31'),(8,'Reza Iansyah',NULL,'rezamusashi@gmail.com','0','7371cba8eb5f16656a977ebd3da7ecbafa753a654162daa34a73917a9563e595',NULL,'/defaultPhoto/defaultUser.png','2020-02-11 11:44:25',1,'Penerima Donasi','2020-02-11 11:44:25','2020-02-11 11:44:26');
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

-- Dump completed on 2020-02-14  9:27:54
