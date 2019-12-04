-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: kasihnusantara
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
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paymentType` varchar(255) NOT NULL,
  `paymentSource` varchar(255) NOT NULL,
  `nominal` int(11) NOT NULL,
  `statusPayment` varchar(255) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `scholarshipId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `isRefund` int(11) NOT NULL DEFAULT '0',
  `refundDate` int(11) DEFAULT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `order_id` varchar(255) NOT NULL,
  `komentar` varchar(255) DEFAULT NULL,
  `isAnonim` int(11) NOT NULL DEFAULT '0',
  `noPembayaran` varchar(255) NOT NULL,
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
INSERT INTO `payments` VALUES (1,'gopay ','Donation',500000,'pending',NULL,2,1,0,NULL,0,'dev845','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/b70995a8-cd80-4c89-bc4d-4343f2be0008/qr-code','2019-11-21 15:46:14','2019-11-21 15:59:40'),(2,'gopay','Donation',355555,'settlement',NULL,2,1,0,NULL,0,'dev109','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/deff35fe-5ed4-4d9a-aa4f-aa47e6f3b590/qr-code','2019-11-21 16:01:51','2019-11-21 16:02:20'),(3,'gopay ','Donation',34634,'expire',1,NULL,1,0,NULL,0,'dev601','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/d9e43283-d905-4e86-aba8-4dcd1d2aa4bd/qr-code','2019-11-21 17:19:22','2019-11-21 17:19:22'),(4,'gopay ','Donation',3245345,'expire',1,NULL,1,0,NULL,0,'dev939','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/03f49df3-ba82-44cb-8d39-e741a76724e2/qr-code','2019-11-21 17:22:05','2019-11-21 17:22:05'),(5,'gopay ','Donation',55555,'expire',1,NULL,1,0,NULL,0,'dev475','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/651fc000-6a9c-4616-8ae7-d7a198a5210e/qr-code','2019-11-21 17:34:15','2019-11-21 17:34:15'),(6,'gopay','Donation',250000,'settlement',NULL,3,1,0,NULL,0,'dev457','-',0,'https://api.sandbox.veritrans.co.id/v2/gopay/d2b4af4d-ce9d-4b81-8ecd-00354ad28f9e/qr-code','2019-12-04 10:47:53','2019-12-04 10:47:55');
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
  `beneficiary_name` varchar(255) DEFAULT NULL,
  `beneficiary_account` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL,
  `reference_no` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `beneficiary_email` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
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
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `projectCreated` datetime NOT NULL,
  `projectEnded` datetime NOT NULL,
  `currentValue` int(11) DEFAULT NULL,
  `totalTarget` int(11) NOT NULL,
  `projectImage` varchar(255) NOT NULL,
  `shareDescription` varchar(255) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Project1','<p>qwe</p>','2019-11-21 15:32:09','2020-11-10 07:00:00',NULL,200000,'/post/image/project/PJT1574325129159.jpg','a',1,0,NULL,1,0,'2019-11-21 15:32:09','2019-11-21 15:32:09');
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
  `judul` varchar(255) NOT NULL,
  `studentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `totalPayout` int(11) NOT NULL,
  `currentValue` int(11) DEFAULT NULL,
  `isOngoing` varchar(255) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `userId` (`userId`),
  CONSTRAINT `scholarships_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  CONSTRAINT `scholarships_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scholarships`
--

LOCK TABLES `scholarships` WRITE;
/*!40000 ALTER TABLE `scholarships` DISABLE KEYS */;
INSERT INTO `scholarships` VALUES (1,'gg',19,1,1333332,0,0,'1','2019-11-21 15:13:13','2019-11-21 15:13:13'),(2,'gg',20,1,1333332,0,0,'1','2019-11-21 15:13:16','2019-11-21 15:13:16'),(3,'gg',21,1,1333332,0,250000,'1','2019-11-21 15:14:12','2019-12-04 10:47:53'),(4,'gg',22,1,1333332,0,0,'1','2019-11-21 15:19:22','2019-11-21 15:19:22');
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
  `name` varchar(255) NOT NULL,
  `pendidikanTerakhir` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `tanggalLahir` datetime NOT NULL,
  `studentImage` varchar(255) NOT NULL,
  `provinsi` varchar(255) NOT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  `story` varchar(255) NOT NULL,
  `shareDescription` varchar(255) NOT NULL,
  `nomorRekening` varchar(255) NOT NULL,
  `pemilikRekening` varchar(255) NOT NULL,
  `alamatSekolah` varchar(255) NOT NULL,
  `bank` varchar(255) NOT NULL,
  `cabangBank` varchar(255) NOT NULL,
  `teleponSekolah` varchar(255) NOT NULL,
  `namaSekolah` varchar(255) NOT NULL,
  `kartuSiswa` varchar(255) NOT NULL,
  `raportTerakhir` varchar(255) NOT NULL,
  `kartuKeluarga` varchar(255) NOT NULL,
  `jumlahSaudara` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `kelas` varchar(255) NOT NULL,
  `dataPenghasilan` varchar(255) NOT NULL,
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
  `name` varchar(255) NOT NULL,
  `pendidikanTerakhir` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `tanggalLahir` datetime NOT NULL,
  `studentImage` varchar(255) NOT NULL,
  `provinsi` varchar(255) NOT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  `story` text,
  `shareDescription` varchar(255) NOT NULL,
  `nomorRekening` varchar(255) NOT NULL,
  `pemilikRekening` varchar(255) NOT NULL,
  `alamatSekolah` varchar(255) NOT NULL,
  `bank` varchar(255) NOT NULL,
  `cabangBank` varchar(255) NOT NULL,
  `teleponSekolah` varchar(255) NOT NULL,
  `namaSekolah` varchar(255) NOT NULL,
  `kartuSiswa` varchar(255) NOT NULL,
  `raportTerakhir` varchar(255) NOT NULL,
  `kartuKeluarga` varchar(255) NOT NULL,
  `jumlahSaudara` int(11) NOT NULL,
  `biayaSekolah` int(11) NOT NULL,
  `kelas` varchar(255) NOT NULL,
  `dataPenghasilan` varchar(255) NOT NULL,
  `dataStatus` varchar(255) NOT NULL,
  `statusNote` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (8,'qweqwe qwe ','SMA','Pria','Normal','Metro Tanjung Bunga, Gunung Agung 226 A','1998-11-20 00:00:00','/student/images/STD1574322861879.png','BALI',0,1,'<p>qweqwe </p>','wet','1380011819286','Mandiri Simulator A','qwqww ','PT. BANK MANDIRI (PERSERO) TBK.','MAKASSAR','8124541313','QRQRQRRQ','/student/images/STD1574322861887.jpg','/student/images/STD1574322861890.jpg','/student/images/STD1574322861893.jpg',2,100000,'5','/student/images/STD1574322861901.PNG','Verified','','2019-11-21 14:54:22','2019-11-21 14:54:22'),(9,'Yuvens Liem','SMA','Wanita','Normal','Metro Tanjung Bunga, Gunung Agung 226 A','1978-02-22 00:00:00','/student/images/STD1574323185390.jpg','SUMATERA BARAT',0,1,'<p>qweqw</p>','qweqweqweqw','1380011819286','Mandiri Simulator A','wet','PT. BANK MANDIRI (PERSERO) TBK.','MAKASSAR','8124541313','wet','/student/images/STD1574323185395.jpg','/student/images/STD1574323185407.jpg','/student/images/STD1574323185416.jpg',56,200000,'5','/student/images/STD1574323185420.PNG','Verified','','2019-11-21 14:59:45','2019-11-21 14:59:45'),(10,'Yuvens Liem','SD','Pria','Piatu','Metro Tanjung Bunga, Gunung Agung 226 A','1444-12-11 23:52:48','/student/images/STD1574323346438.jpg','SUMATERA BARAT',0,1,'<p>2323rf</p>','rfefv','1380011819286','Mandiri Simulator A','32r43','PT. BANK MANDIRI (PERSERO) TBK.','fref','81245413135','QRQRQRRQ','/student/images/STD1574323346443.jpg','/student/images/STD1574323346453.jpg','/student/images/STD1574323346469.jpg',1,300000,'22','/student/images/STD1574323346489.jpg','Verified','','2019-11-21 15:02:26','2019-11-21 15:02:26'),(11,'Yuvens Liem','SD','Wanita','Piatu','Metro Tanjung Bunga, Gunung Agung 226 A','1999-12-12 00:00:00','/student/images/STD1574323551507.png','SUMATERA UTARA',0,1,'<p>qwe</p>','wqeqw','1380011819286','Mandiri Simulator A','weytw','PT. BANK MANDIRI (PERSERO) TBK.','qweq','123123','qewtwe','/student/images/STD1574323551540.jpg','/student/images/STD1574323551555.png','/student/images/STD1574323551560.jpg',2,400000,'5','/student/images/STD1574323551579.jpg','Verified','','2019-11-21 15:05:51','2019-11-21 15:05:51'),(19,'trtrt','SD','Pria','Yatim','2t','1111-11-10 23:52:48','/student/images/STD1574323992435.png','BALI',0,1,'<p>r</p>','gfg','1380011819286','Mandiri Simulator A','tg','PT. BANK MANDIRI (PERSERO) TBK.','MAKASSAR','23','QRQRQRQR','/student/images/STD1574323992449.jpg','/student/images/STD1574323992453.png','/student/images/STD1574323992467.jpg',1,500000,'2','/student/images/STD1574323992473.jpg','Verified','','2019-11-21 15:13:12','2019-11-21 15:13:12'),(20,'trtrt','SD','Pria','Yatim','2t','1111-11-10 23:52:48','/student/images/STD1574323996851.png','BALI',0,1,'<p>r</p>','gfg','1380011819286','Mandiri Simulator A','tg','PT. BANK MANDIRI (PERSERO) TBK.','MAKASSAR','23','QRQRQRQR','/student/images/STD1574323996865.jpg','/student/images/STD1574323996868.png','/student/images/STD1574323996880.jpg',1,150000,'2','/student/images/STD1574323996887.jpg','Verified','','2019-11-21 15:13:16','2019-11-21 15:13:16'),(21,'trtrt','SD','Pria','Yatim','2t','1111-11-10 23:52:48','/student/images/STD1574324052172.png','BALI',0,1,'<p>r</p>','gfg','1380011819286','Mandiri Simulator A','tg','PT. BANK MANDIRI (PERSERO) TBK.','MAKASSAR','23','QRQRQRQR','/student/images/STD1574324052184.jpg','/student/images/STD1574324052187.png','/student/images/STD1574324052196.jpg',1,140000,'2','/student/images/STD1574324052201.jpg','Verified','','2019-11-21 15:14:12','2019-11-21 15:14:12'),(22,'trtrt','SD','Pria','Yatim','2t','1111-11-10 23:52:48','/student/images/STD1574324361861.png','BALI',0,1,'<p>r</p>','gfg','1380011819286','Mandiri Simulator A','tg','PT. BANK MANDIRI (PERSERO) TBK.','MAKASSAR','23','QRQRQRQR','/student/images/STD1574324361868.jpg','/student/images/STD1574324361880.png','/student/images/STD1574324361893.jpg',1,200000,'2','/student/images/STD1574324361897.jpg','Verified','','2019-11-21 15:19:22','2019-11-21 15:19:22');
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
  `nama` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL DEFAULT '-',
  `isGoogle` varchar(255) DEFAULT NULL,
  `isFacebook` varchar(255) DEFAULT NULL,
  `userImage` varchar(255) NOT NULL,
  `lastLogin` datetime NOT NULL,
  `verified` int(11) NOT NULL DEFAULT '0',
  `role` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'yuvens liem',NULL,'yuvensenverd@gmail.com','0','ae2c7a32b3bd66bc6b6e5c9568d92fa660491bea58b4dd274b5f120b5da446bb',NULL,'/defaultPhoto/defaultUser.png','2019-11-21 14:25:24',1,'User','2019-11-21 14:25:24','2019-11-21 14:25:24');
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

-- Dump completed on 2019-12-04 18:04:36
