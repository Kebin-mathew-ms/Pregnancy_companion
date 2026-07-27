/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 5.7.9 : Database - maternal_health_system
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`maternal_health_system` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `maternal_health_system`;

/*Table structure for table `asha_worker` */

DROP TABLE IF EXISTS `asha_worker`;

CREATE TABLE `asha_worker` (
  `Asha_id` int(11) NOT NULL AUTO_INCREMENT,
  `Login_id` int(11) DEFAULT NULL,
  `Ward_id` int(11) DEFAULT NULL,
  `First_Name` varchar(255) DEFAULT NULL,
  `Last_Name` varchar(255) DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Place` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`Asha_id`),
  KEY `Login_id` (`Login_id`),
  KEY `Ward_id` (`Ward_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `asha_worker` */

insert  into `asha_worker`(`Asha_id`,`Login_id`,`Ward_id`,`First_Name`,`Last_Name`,`Gender`,`Place`,`Email`,`Phone`) values 
(2,2,3,'shelji','j','Female','adoor','shel@gmail.com','9089877867');

/*Table structure for table `baby_growth` */

DROP TABLE IF EXISTS `baby_growth`;

CREATE TABLE `baby_growth` (
  `Growth_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) DEFAULT NULL,
  `Pregnancy_week` int(11) DEFAULT NULL,
  `Baby_size` varchar(50) DEFAULT NULL,
  `Movement_description` text,
  `Hormonal_changes` text,
  `Emotional` text,
  PRIMARY KEY (`Growth_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `baby_growth` */

insert  into `baby_growth`(`Growth_id`,`User_id`,`Pregnancy_week`,`Baby_size`,`Movement_description`,`Hormonal_changes`,`Emotional`) values 
(1,1,12,'6 cm','Mild movements felt','Hormone surge','Emotional mood swings');

/*Table structure for table `chat` */

DROP TABLE IF EXISTS `chat`;

CREATE TABLE `chat` (
  `Chat_id` int(11) NOT NULL AUTO_INCREMENT,
  `Sender_id` int(11) DEFAULT NULL,
  `Receiver_id` int(11) DEFAULT NULL,
  `Chat` text,
  `Date` datetime DEFAULT NULL,
  PRIMARY KEY (`Chat_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `chat` */

/*Table structure for table `complaints` */

DROP TABLE IF EXISTS `complaints`;

CREATE TABLE `complaints` (
  `Comp_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) DEFAULT NULL,
  `Complaint_id` text,
  `Reply` text,
  `Date` datetime DEFAULT NULL,
  PRIMARY KEY (`Comp_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `complaints` */

insert  into `complaints`(`Comp_id`,`User_id`,`Complaint_id`,`Reply`,`Date`) values 
(1,1,'i have a complaint','ok da','2025-03-16 12:50:09');

/*Table structure for table `diet_plan` */

DROP TABLE IF EXISTS `diet_plan`;

CREATE TABLE `diet_plan` (
  `Diet_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) DEFAULT NULL,
  `Health_Parameter` enum('Blood Sugar','Blood Pressure','Thyroid') DEFAULT NULL,
  `Diet_Recommendation` text,
  `Date` date DEFAULT NULL,
  PRIMARY KEY (`Diet_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `diet_plan` */

insert  into `diet_plan`(`Diet_id`,`User_id`,`Health_Parameter`,`Diet_Recommendation`,`Date`) values 
(1,1,'Blood Sugar','Avoid sweets, eat whole grains','2024-08-10');

/*Table structure for table `doctor` */

DROP TABLE IF EXISTS `doctor`;

CREATE TABLE `doctor` (
  `Doc_id` int(11) NOT NULL AUTO_INCREMENT,
  `First_Name` varchar(255) DEFAULT NULL,
  `Last_Name` varchar(255) DEFAULT NULL,
  `Place` varchar(255) DEFAULT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Doc_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `doctor` */

insert  into `doctor`(`Doc_id`,`First_Name`,`Last_Name`,`Place`,`Phone`,`Email`,`Specialization`) values 
(1,'devapriya','nair','thrissur','8987787878','devu@gmail.com','gynaecologist');

/*Table structure for table `informative_content` */

DROP TABLE IF EXISTS `informative_content`;

CREATE TABLE `informative_content` (
  `Info_id` int(11) NOT NULL AUTO_INCREMENT,
  `Asha_id` int(11) DEFAULT NULL,
  `User_id` int(11) DEFAULT NULL,
  `Iron_medicine_count` int(11) DEFAULT NULL,
  `Calcium_tablets_count` int(11) DEFAULT NULL,
  `Folic_acid_tablets_count` int(11) DEFAULT NULL,
  `First_tt_vaccine_date` date DEFAULT NULL,
  `Second_tt_vaccine_date` date DEFAULT NULL,
  `Food_from_anganwadi` varchar(255) DEFAULT NULL,
  `Record_date` date DEFAULT NULL,
  PRIMARY KEY (`Info_id`),
  KEY `Asha_id` (`Asha_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `informative_content` */

/*Table structure for table `kerala_government_posts` */

DROP TABLE IF EXISTS `kerala_government_posts`;

CREATE TABLE `kerala_government_posts` (
  `Kg_id` int(11) NOT NULL AUTO_INCREMENT,
  `Post_name` varchar(255) DEFAULT NULL,
  `Description` text,
  `Links` varchar(500) DEFAULT NULL,
  `File` varchar(255) DEFAULT NULL,
  `Datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`Kg_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `kerala_government_posts` */

insert  into `kerala_government_posts`(`Kg_id`,`Post_name`,`Description`,`Links`,`File`,`Datetime`) values 
(1,'Pradhana Manthri Mathru Vandana Yojna','All pregnant women and lactating mothers, excluding those who are in regular employment with the central government, state government or PSUs or those who are in receipt of similar benefits under any law for the time being in force','https://wcd.kerala.gov.in/article.php?itid=Mzky','education_reports.docx','2025-03-16 12:28:26');

/*Table structure for table `login` */

DROP TABLE IF EXISTS `login`;

CREATE TABLE `login` (
  `login_id` int(11) NOT NULL AUTO_INCREMENT,
  `uname` varchar(200) DEFAULT NULL,
  `psd` varchar(200) DEFAULT NULL,
  `utype` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`login_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `login` */

insert  into `login`(`login_id`,`uname`,`psd`,`utype`) values 
(1,'admin','admin','admin'),
(2,'shel','shel','asha');

/*Table structure for table `medical_appointments` */

DROP TABLE IF EXISTS `medical_appointments`;

CREATE TABLE `medical_appointments` (
  `Appointment_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) DEFAULT NULL,
  `Previous_appointment_notes` text,
  `Next_appointment_date` date DEFAULT NULL,
  `Notifications` text,
  PRIMARY KEY (`Appointment_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `medical_appointments` */

insert  into `medical_appointments`(`Appointment_id`,`User_id`,`Previous_appointment_notes`,`Next_appointment_date`,`Notifications`) values 
(1,1,'Routine checkup','2024-09-01','Upcoming appointment');

/*Table structure for table `partner_support` */

DROP TABLE IF EXISTS `partner_support`;

CREATE TABLE `partner_support` (
  `Support_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) DEFAULT NULL,
  `Partner_tips` text,
  `Weekly_tasks` text,
  `Educational_resources` text,
  PRIMARY KEY (`Support_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `partner_support` */

insert  into `partner_support`(`Support_id`,`User_id`,`Partner_tips`,`Weekly_tasks`,`Educational_resources`) values 
(1,1,'Support during mood swings','Help with household chores','Parenting books');

/*Table structure for table `postpartum_support` */

DROP TABLE IF EXISTS `postpartum_support`;

CREATE TABLE `postpartum_support` (
  `Postpartum_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) DEFAULT NULL,
  `Awareness_articles` text,
  `Expert_advice` text,
  `Video_links` text,
  PRIMARY KEY (`Postpartum_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `postpartum_support` */

insert  into `postpartum_support`(`Postpartum_id`,`User_id`,`Awareness_articles`,`Expert_advice`,`Video_links`) values 
(1,1,'Postpartum depression awareness','Take proper rest','https://video.com/postpartum');

/*Table structure for table `pregnancy_tracker` */

DROP TABLE IF EXISTS `pregnancy_tracker`;

CREATE TABLE `pregnancy_tracker` (
  `Tracker_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) DEFAULT NULL,
  `Current_week` int(11) DEFAULT NULL,
  `Estimated_due_date` date DEFAULT NULL,
  `Milestones` text,
  `Weekly_tips` text,
  PRIMARY KEY (`Tracker_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `pregnancy_tracker` */

insert  into `pregnancy_tracker`(`Tracker_id`,`User_id`,`Current_week`,`Estimated_due_date`,`Milestones`,`Weekly_tips`) values 
(1,1,12,'2024-10-15','Fetal movement detected','Eat iron-rich foods');

/*Table structure for table `stress_detection` */

DROP TABLE IF EXISTS `stress_detection`;

CREATE TABLE `stress_detection` (
  `Stress_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) DEFAULT NULL,
  `Detected_stress_level` varchar(50) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  PRIMARY KEY (`Stress_id`),
  KEY `User_id` (`User_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `stress_detection` */

insert  into `stress_detection`(`Stress_id`,`User_id`,`Detected_stress_level`,`Date`) values 
(1,1,'Moderate','2024-08-15');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `Users_id` int(11) NOT NULL AUTO_INCREMENT,
  `Login_id` int(11) DEFAULT NULL,
  `Ward_id` int(11) DEFAULT NULL,
  `Full_Name` varchar(255) DEFAULT NULL,
  `Age` int(11) DEFAULT NULL,
  `LMP_date` date DEFAULT NULL,
  `Blood_Group` varchar(10) DEFAULT NULL,
  `Blood_Pressure` varchar(50) DEFAULT NULL,
  `Thyroid_Levels` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Users_id`),
  KEY `Login_id` (`Login_id`),
  KEY `Ward_id` (`Ward_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `users` */

insert  into `users`(`Users_id`,`Login_id`,`Ward_id`,`Full_Name`,`Age`,`LMP_date`,`Blood_Group`,`Blood_Pressure`,`Thyroid_Levels`) values 
(1,1,3,'Anju Kumar',25,'2024-01-15','O+','180/120','Normal');

/*Table structure for table `ward` */

DROP TABLE IF EXISTS `ward`;

CREATE TABLE `ward` (
  `Ward_id` int(11) NOT NULL AUTO_INCREMENT,
  `Ward_name` varchar(255) NOT NULL,
  PRIMARY KEY (`Ward_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `ward` */

insert  into `ward`(`Ward_id`,`Ward_name`) values 
(3,'Ward a'),
(4,'ward b');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
