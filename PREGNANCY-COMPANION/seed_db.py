import mysql.connector
import datetime

# Database credentials
user = 'root'
password = 'root'
host = 'localhost'
database = 'maternal_health_system'

def run_seed():
    print("Connecting to MySQL...")
    try:
        con = mysql.connector.connect(user=user, password=password, host=host)
        cur = con.cursor()
        cur.execute("CREATE DATABASE IF NOT EXISTS maternal_health_system")
        con.commit()
        cur.close()
        con.close()
    except Exception as e:
        print(f"Error creating database: {e}")
        return

    try:
        con = mysql.connector.connect(user=user, password=password, host=host, database=database)
        cur = con.cursor()
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return

    # Drop existing tables
    tables = [
        "asha_worker", "baby_growth", "chat", "complaints", "diet_plan", 
        "doctor", "informative_content", "kerala_government_posts", "login", 
        "medical_appointments", "partner_support", "postpartum_support", 
        "pregnancy_tracker", "stress_detection", "users", "ward",
        "health_tips", "pregnancy_timeline", "appoinment_dates"
    ]
    
    print("Dropping existing tables...")
    cur.execute("SET FOREIGN_KEY_CHECKS = 0")
    for table in tables:
        cur.execute(f"DROP TABLE IF EXISTS `{table}`")
    con.commit()

    # Recreate tables
    print("Recreating tables...")
    
    cur.execute("""
    CREATE TABLE `ward` (
      `Ward_id` int(11) NOT NULL AUTO_INCREMENT,
      `Ward_name` varchar(255) NOT NULL,
      PRIMARY KEY (`Ward_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `login` (
      `login_id` int(11) NOT NULL AUTO_INCREMENT,
      `uname` varchar(200) DEFAULT NULL,
      `psd` varchar(200) DEFAULT NULL,
      `utype` varchar(200) DEFAULT NULL,
      PRIMARY KEY (`login_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
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
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
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
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
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
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `chat` (
      `Chat_id` int(11) NOT NULL AUTO_INCREMENT,
      `Sender_id` int(11) DEFAULT NULL,
      `Receiver_id` int(11) DEFAULT NULL,
      `Chat` text,
      `Date` datetime DEFAULT NULL,
      PRIMARY KEY (`Chat_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `complaints` (
      `Comp_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Complaint_id` text,
      `Reply` text,
      `Date` datetime DEFAULT NULL,
      PRIMARY KEY (`Comp_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `diet_plan` (
      `Diet_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Health_Parameter` enum('Blood Sugar','Blood Pressure','Thyroid') DEFAULT NULL,
      `Diet_Recommendation` text,
      `Date` date DEFAULT NULL,
      PRIMARY KEY (`Diet_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `doctor` (
      `Doc_id` int(11) NOT NULL AUTO_INCREMENT,
      `First_Name` varchar(255) DEFAULT NULL,
      `Last_Name` varchar(255) DEFAULT NULL,
      `Place` varchar(255) DEFAULT NULL,
      `Phone` varchar(15) DEFAULT NULL,
      `Email` varchar(255) DEFAULT NULL,
      `Specialization` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`Doc_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
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
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `kerala_government_posts` (
      `Kg_id` int(11) NOT NULL AUTO_INCREMENT,
      `Post_name` varchar(255) DEFAULT NULL,
      `Description` text,
      `Links` varchar(500) DEFAULT NULL,
      `File` varchar(255) DEFAULT NULL,
      `Datetime` datetime DEFAULT NULL,
      PRIMARY KEY (`Kg_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `medical_appointments` (
      `Appointment_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Previous_appointment_notes` text,
      `Next_appointment_date` date DEFAULT NULL,
      `Notifications` text,
      PRIMARY KEY (`Appointment_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `partner_support` (
      `Support_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Partner_tips` text,
      `Weekly_tasks` text,
      `Educational_resources` text,
      PRIMARY KEY (`Support_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `postpartum_support` (
      `Postpartum_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Page_content` text,
      `Expert_advice` text,
      `Video_links` text,
      PRIMARY KEY (`Postpartum_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `pregnancy_tracker` (
      `Tracker_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Current_week` int(11) DEFAULT NULL,
      `Estimated_due_date` date DEFAULT NULL,
      `Milestones` text,
      `Weekly_tips` text,
      PRIMARY KEY (`Tracker_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `stress_detection` (
      `Stress_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Detected_stress_level` varchar(50) DEFAULT NULL,
      `Date` date DEFAULT NULL,
      PRIMARY KEY (`Stress_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `health_tips` (
      `Tip_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Tip_title` varchar(255) DEFAULT NULL,
      `Tip_description` text DEFAULT NULL,
      `Date` date DEFAULT NULL,
      PRIMARY KEY (`Tip_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `pregnancy_timeline` (
      `Timeline_id` int(11) NOT NULL AUTO_INCREMENT,
      `User_id` int(11) DEFAULT NULL,
      `Week_Number` int(11) DEFAULT NULL,
      `Milestone_Title` varchar(255) DEFAULT NULL,
      `Description` text DEFAULT NULL,
      `Symptoms` text DEFAULT NULL,
      `Date` date DEFAULT NULL,
      PRIMARY KEY (`Timeline_id`),
      KEY `User_id` (`User_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    cur.execute("""
    CREATE TABLE `appoinment_dates` (
      `ap_id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) DEFAULT NULL,
      `last_appointment` date DEFAULT NULL,
      `next_appointment` date DEFAULT NULL,
      PRIMARY KEY (`ap_id`),
      KEY `user_id` (`user_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    """)

    con.commit()
    print("Database tables recreated successfully. Seeding realistic data...")

    # Data to insert
    # 1. Wards
    wards = [
        (1, 'Ward A'),
        (2, 'Ward B'),
        (3, 'Ward C'),
        (4, 'Ward D')
    ]
    cur.executemany("INSERT INTO ward (Ward_id, Ward_name) VALUES (%s, %s)", wards)

    # 2. Login
    logins = [
        (1, 'anju', 'anju', 'user'),
        (2, 'shel', 'shel', 'asha'),
        (3, 'doctor1', 'doctor1', 'doctor'),
        (4, 'user2', 'user2', 'user'),
        (5, 'admin', 'admin', 'admin')
    ]
    cur.executemany("INSERT INTO login (login_id, uname, psd, utype) VALUES (%s, %s, %s, %s)", logins)

    # 3. Users
    # Today is 2026-08-12
    # User 1 (Anju Kumar): LMP 2026-02-25 (Gestational age: ~24 weeks, Due date: ~2026-12-02)
    # User 2 (Mary Joseph): LMP 2026-05-20 (Gestational age: ~12 weeks, Due date: ~2027-02-24)
    users = [
        (1, 1, 3, 'Anju Kumar', 25, '2026-02-25', 'O+', '120/80', 'Normal'),
        (2, 4, 1, 'Mary Joseph', 28, '2026-05-20', 'A+', '110/70', 'Normal')
    ]
    cur.executemany("""
        INSERT INTO users (Users_id, Login_id, Ward_id, Full_Name, Age, LMP_date, Blood_Group, Blood_Pressure, Thyroid_Levels) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, users)

    # 4. Asha Worker
    asha = [
        (1, 2, 3, 'Asha', 'Devi', 'Female', 'Kerala', 'asha@example.com', '9876543210')
    ]
    cur.executemany("""
        INSERT INTO asha_worker (Asha_id, Login_id, Ward_id, First_Name, Last_Name, Gender, Place, Email, Phone) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, asha)

    # 5. Doctor
    doctors = [
        (1, 'Devapriya', 'Nair', 'Thrissur', '8987787878', 'devu@gmail.com', 'Gynaecologist'),
        (2, 'Thomas', 'Kurian', 'Kochi', '9845678901', 'thomas@gmail.com', 'Obstetrician')
    ]
    cur.executemany("""
        INSERT INTO doctor (Doc_id, First_Name, Last_Name, Place, Phone, Email, Specialization) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, [(i+1, d[0], d[1], d[2], d[3], d[4], d[5]) for i, d in enumerate(doctors)])

    # 6. Baby Growth
    growth = [
        (1, 1, 12, '6 cm', 'Mild movements felt', 'Hormone surge', 'Mood swings'),
        (2, 1, 16, '12 cm', 'Fluttering movements (quickening)', 'Stabilizing', 'More energetic'),
        (3, 1, 20, '25 cm', 'Strong kicks felt', 'Normal range', 'Happy and relaxed'),
        (4, 1, 24, '30 cm', 'Regular kicking and rolling', 'Normal range', 'Slightly anxious but excited'),
        (5, 2, 8, '1.6 cm', 'No movement felt yet', 'High progesterone', 'Morning sickness, fatigue'),
        (6, 2, 12, '6 cm', 'Mild movements felt', 'Hormone surge', 'Nausea subsiding')
    ]
    cur.executemany("""
        INSERT INTO baby_growth (Growth_id, User_id, Pregnancy_week, Baby_size, Movement_description, Hormonal_changes, Emotional) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, growth)

    # 7. Diet Plan
    diet = [
        (1, 1, 'Blood Sugar', 'Eat whole grains, leafy greens, lean protein. Restrict processed sugars and refined carbs.', '2026-08-10'),
        (2, 1, 'Blood Pressure', 'Low sodium intake, rich in potassium (bananas, spinach), stay hydrated.', '2026-08-11')
    ]
    cur.executemany("""
        INSERT INTO diet_plan (Diet_id, User_id, Health_Parameter, Diet_Recommendation, Date) 
        VALUES (%s, %s, %s, %s, %s)
    """, diet)

    # 8. Medical Appointments
    appointments = [
        (1, 1, 'Routine growth checkup. Blood pressure and fetal heartbeat normal.', '2026-08-26', 'Upcoming 24-week gestational anomaly checkup.'),
        (2, 2, 'First trimester screening completed. Fetal heartbeat detected.', '2026-09-10', 'Upcoming routine monthly consultation.')
    ]
    cur.executemany("""
        INSERT INTO medical_appointments (Appointment_id, User_id, Previous_appointment_notes, Next_appointment_date, Notifications) 
        VALUES (%s, %s, %s, %s, %s)
    """, appointments)

    # 9. Partner Support
    partner = [
        (1, 1, 'Offer back massages to relieve lower back pain. Accompany her to the anomaly scan.', 'Help set up the nursery. Research stroller and car seat safety.', 'Understanding Second Trimester Changes guide.')
    ]
    cur.executemany("""
        INSERT INTO partner_support (Support_id, User_id, Partner_tips, Weekly_tasks, Educational_resources) 
        VALUES (%s, %s, %s, %s, %s)
    """, partner)

    # 10. Postpartum Support
    postpartum = [
        (1, 1, 'Understanding baby blues vs. postpartum depression.', 'Ensure you sleep when the baby sleeps and delegate household tasks.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    ]
    cur.executemany("""
        INSERT INTO postpartum_support (Postpartum_id, User_id, Page_content, Expert_advice, Video_links) 
        VALUES (%s, %s, %s, %s, %s)
    """, postpartum)

    # 11. Pregnancy Tracker
    tracker = [
        (1, 1, 24, '2026-12-02', 'Fetal hearing is established; baby can hear external sounds.', 'Moisturize your belly to soothe dry, stretching skin. Drink plenty of water.'),
        (2, 2, 12, '2027-02-24', 'Baby has fully formed fingers and toes.', 'Eat calcium-rich foods like yogurt and cheese to support baby\'s bone growth.')
    ]
    cur.executemany("""
        INSERT INTO pregnancy_tracker (Tracker_id, User_id, Current_week, Estimated_due_date, Milestones, Weekly_tips) 
        VALUES (%s, %s, %s, %s, %s, %s)
    """, tracker)

    # 12. Stress Detection
    stress = [
        (1, 1, 'Low', '2026-08-11'),
        (2, 2, 'Moderate', '2026-08-10')
    ]
    cur.executemany("""
        INSERT INTO stress_detection (Stress_id, User_id, Detected_stress_level, Date) 
        VALUES (%s, %s, %s, %s)
    """, stress)

    # 13. Informative Content
    info = [
        (1, 1, 1, 30, 30, 30, '2026-05-15', '2026-06-15', 'Nutritional mix (Amrutham Podi)', '2026-08-10')
    ]
    cur.executemany("""
        INSERT INTO informative_content (Info_id, Asha_id, User_id, Iron_medicine_count, Calcium_tablets_count, Folic_acid_tablets_count, First_tt_vaccine_date, Second_tt_vaccine_date, Food_from_anganwadi, Record_date) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, info)

    # 14. Kerala Government Posts
    gov_posts = [
        (1, 'Pradhana Manthri Mathru Vandana Yojna', 
         'All pregnant women and lactating mothers, excluding those who are in regular employment with the central government, state government or PSUs or those who are in receipt similar benefits.', 
         'https://wcd.kerala.gov.in/article.php?itid=Mzky', 
         'education_reports.docx', 
         '2026-08-12 12:00:00'),
        (2, 'Janani Suraksha Yojana',
         'A safe motherhood intervention under the National Health Mission being implemented with the objective of reducing maternal and neonatal mortality.',
         'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=839&lid=209',
         'jsy_guidelines.pdf',
         '2026-08-12 12:30:00')
    ]
    cur.executemany("""
        INSERT INTO kerala_government_posts (Kg_id, Post_name, Description, Links, File, Datetime) 
        VALUES (%s, %s, %s, %s, %s, %s)
    """, gov_posts)

    # 15. Health Tips
    tips = [
        (1, 1, 'Stay Hydrated', 'Drink at least 8-10 glasses of water daily to maintain amniotic fluid levels and prevent dehydration.', '2026-08-11'),
        (2, 1, 'Daily Gentle Exercise', 'Engage in 30 minutes of gentle walking or prenatal yoga to improve circulation and reduce swelling.', '2026-08-12')
    ]
    cur.executemany("""
        INSERT INTO health_tips (Tip_id, User_id, Tip_title, Tip_description, Date) 
        VALUES (%s, %s, %s, %s, %s)
    """, tips)

    # 16. Pregnancy Timeline
    timeline = [
        (1, 1, 12, 'First Trimester Completed!', 'The baby is fully formed and has begun swallowing and kicking.', 'Morning sickness starts to fade; fatigue remains.', '2026-05-20'),
        (2, 1, 20, 'Halfway Mark!', "You can feel baby's movements and kicks regularly now.", 'Increased appetite, occasional backaches.', '2026-07-15')
    ]
    cur.executemany("""
        INSERT INTO pregnancy_timeline (Timeline_id, User_id, Week_Number, Milestone_Title, Description, Symptoms, Date) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, timeline)

    # 17. Appointment Dates
    ap_dates = [
        (1, 1, '2026-08-01', '2026-08-26'),
        (2, 2, '2026-08-05', '2026-09-10')
    ]
    cur.executemany("""
        INSERT INTO appoinment_dates (ap_id, user_id, last_appointment, next_appointment) 
        VALUES (%s, %s, %s, %s)
    """, ap_dates)

    con.commit()
    print("Database seeding completed successfully!")
    cur.close()
    con.close()

if __name__ == '__main__':
    run_seed()
