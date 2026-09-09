import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.insert(0, r'c:\Users\Lenovo\Documents\aaropro\PREGNANCY-COMPANION\PREGNANCY-COMPANION')

from database import select, insert, update, delete
from datetime import datetime, date, timedelta

print("=" * 60)
print("MomCare - Complete Database Reset & Seed Script")
print("=" * 60)

# List of all database tables in maternal_health_system
ALL_TABLES = [
    'appoinment_dates',
    'asha_worker',
    'baby_growth',
    'chat',
    'complaints',
    'diet_plan',
    'doctor',
    'health_tips',
    'informative_content',
    'kerala_government_posts',
    'login',
    'medical_appointments',
    'partner_support',
    'postpartum_support',
    'pregnancy_timeline',
    'pregnancy_tracker',
    'stress_detection',
    'users',
    'ward'
]

# ── Step 1: Truncate / Clear all tables ──
print("\n[1] Clearing all existing data from tables...")
for table in ALL_TABLES:
    try:
        delete(f"TRUNCATE TABLE `{table}`")
        print(f"  ✓ Truncated `{table}`")
    except Exception as e:
        # Fallback to DELETE if TRUNCATE fails
        try:
            delete(f"DELETE FROM `{table}`")
            print(f"  ✓ Cleared `{table}` via DELETE")
        except Exception as ex:
            print(f"  ✗ Failed to clear `{table}`: {ex}")

# ── Step 2: Seed Wards ──
print("\n[2] Seeding Wards...")
wards = ['Adoor', 'Pathanamthitta', 'Thiruvalla', 'Konni', 'Ranni', 'Pandalam']
ward_ids = {}
for w in wards:
    wid = insert(f"INSERT INTO ward(Ward_name) VALUES('{w}')")
    ward_ids[w] = wid
    print(f"  + Ward: {w} (ID: {wid})")

# ── Step 3: Seed Logins ──
print("\n[3] Seeding Login Accounts...")
logins = [
    ('admin',   'admin',    'admin'),
    ('shel',    'shel',     'asha'),
    ('asha2',   'asha2',    'asha'),
    ('doctor1', 'doctor1',  'doctor'),
    ('doctor2', 'doctor2',  'doctor'),
    ('anu',     'anu123',   'user'),
    ('preethi', 'preethi1', 'user'),
    ('meera',   'meera1',   'user'),
    ('lakshmi', 'lakshmi1', 'user'),
    ('anju',    'anju',     'user'),
]

login_map = {}
for uname, psd, utype in logins:
    lid = insert(f"INSERT INTO login(uname, psd, utype) VALUES('{uname}', '{psd}', '{utype}')")
    login_map[uname] = lid
    print(f"  + Account [{utype.upper()}]: {uname} / {psd} (Login ID: {lid})")

# ── Step 4: Seed ASHA Workers ──
print("\n[4] Seeding ASHA Workers...")
asha_data = [
    (login_map['shel'],  ward_ids['Adoor'],       'Shelji', 'J',    'Female', 'Adoor',       'shel@gmail.com',  '9089877867'),
    (login_map['asha2'], ward_ids['Thiruvalla'],  'Deepa',  'Nair', 'Female', 'Thiruvalla', 'deepa@gmail.com', '9876543211'),
]
asha_map = {}
for lid, wid, fn, ln, gen, place, email, phone in asha_data:
    aid = insert(f"INSERT INTO asha_worker(Login_id, Ward_id, First_Name, Last_Name, Gender, Place, Email, Phone) VALUES('{lid}','{wid}','{fn}','{ln}','{gen}','{place}','{email}','{phone}')")
    asha_map[lid] = aid
    print(f"  + ASHA Worker: {fn} {ln} (Asha ID: {aid})")

# ── Step 5: Seed Doctors ──
print("\n[5] Seeding Doctors...")
doctors_data = [
    (login_map['doctor1'], 'Priya',   'Menon',    'Thiruvananthapuram', '9876543210', 'priya@hospital.com',   'Obstetrics & Gynaecology'),
    (login_map['doctor2'], 'Rahul',   'Sharma',   'Kochi',              '9876501234', 'rahul@hospital.com',   'Neonatology'),
    (None,                 'Anitha',  'Krishnan', 'Pathanamthitta',     '9845612345', 'anitha@hospital.com',  'Maternal-Fetal Medicine'),
]
doc_ids = []
for lid, fn, ln, place, phone, email, spec in doctors_data:
    lid_val = f"'{lid}'" if lid else "null"
    did = insert(f"INSERT INTO doctor(Login_id, First_Name, Last_Name, Place, Phone, Email, Specialization) VALUES({lid_val},'{fn}','{ln}','{place}','{phone}','{email}','{spec}')")
    doc_ids.append(did)
    print(f"  + Doctor: Dr. {fn} {ln} - {spec} (Doc ID: {did})")

# ── Step 6: Seed Users (Pregnant Women) ──
print("\n[6] Seeding Users...")
today = date.today()
users_data = [
    ('anu',     ward_ids['Adoor'],          'Anu George',    26, (today - timedelta(weeks=28)).strftime('%Y-%m-%d'), 'B+',  '120/80', 'Normal'),
    ('preethi', ward_ids['Adoor'],          'Preethi Raj',   29, (today - timedelta(weeks=16)).strftime('%Y-%m-%d'), 'O+',  '118/76', 'Normal'),
    ('meera',   ward_ids['Thiruvalla'],     'Meera Vijayan', 32, (today - timedelta(weeks=34)).strftime('%Y-%m-%d'), 'A+',  '130/85', 'Elevated'),
    ('lakshmi', ward_ids['Pathanamthitta'], 'Lakshmi Devi',  27, (today - timedelta(weeks=8)).strftime('%Y-%m-%d'),  'AB-', '115/75', 'Normal'),
    ('anju',    ward_ids['Adoor'],          'Anju Kumar',    25, (today - timedelta(weeks=12)).strftime('%Y-%m-%d'), 'O+',  '120/80', 'Normal'),
]
user_ids = {}
for uname, wid, fullname, age, lmp, bg, bp, thyroid in users_data:
    lid = login_map[uname]
    uid = insert(f"INSERT INTO users(Login_id, Ward_id, Full_Name, Age, LMP_date, Blood_Group, Blood_Pressure, Thyroid_Levels) VALUES('{lid}','{wid}','{fullname}','{age}','{lmp}','{bg}','{bp}','{thyroid}')")
    user_ids[uname] = uid
    print(f"  + User: {fullname} (User ID: {uid})")

# ── Step 7: Seed Baby Growth Records ──
print("\n[7] Seeding Baby Growth Records...")
anu_uid = user_ids['anu']
growth_records = [
    (anu_uid, 10, 'Lime size',     'Mild movements felt',           'Hormone surge',                'Happy and excited'),
    (anu_uid, 14, 'Lemon size',    'Fetal movements detected',       'Progesterone stabilization',    'Calm'),
    (anu_uid, 18, 'Bell pepper',   'Active kicks during night',      'Estrogen level rise',          'Energetic'),
    (anu_uid, 22, 'Papaya size',   'Responds to loud noises',       'Normal hormonal fluctuations', 'Emotional at times'),
    (anu_uid, 26, 'Eggplant size', 'Strong rhythmic movements',     'Prolactin levels rising',      'Relaxed'),
    (anu_uid, 28, 'Eggplant size', 'Frequent kicks, blinking eyes', 'High estrogen/progesterone',   'Joyful & expectant'),
]
for uid, week, bsize, mdesc, hchanges, emo in growth_records:
    insert(f"INSERT INTO baby_growth(User_id, Pregnancy_week, Baby_size, Movement_description, Hormonal_changes, Emotional) VALUES('{uid}','{week}','{bsize}','{mdesc}','{hchanges}','{emo}')")
print("  ✓ Seeded 6 baby growth milestone records")

# ── Step 8: Seed Diet Plans ──
print("\n[8] Seeding Diet Plans...")
diet_plans = [
    (anu_uid,            'Blood Pressure', 'Low-sodium diet: avoid pickles, processed food, canned soups. Include bananas, leafy greens, oats, garlic. Limit salt to 5g/day.', (today - timedelta(days=5)).strftime('%Y-%m-%d')),
    (anu_uid,            'Blood Sugar',    'Complex carbs: brown rice, whole wheat. Avoid sweets, white bread. Include fenugreek, bitter gourd. Small meals every 2-3 hours.', (today - timedelta(days=3)).strftime('%Y-%m-%d')),
    (anu_uid,            'Thyroid',        'Include iodine-rich foods: seafood, dairy, eggs. Avoid raw cabbage and soy. Take thyroid medicine 30 min before food.', today.strftime('%Y-%m-%d')),
    (user_ids['preethi'], 'Blood Pressure', 'Maintain low salt intake. Eat fresh fruits, cucumber, and coconut water daily.', today.strftime('%Y-%m-%d')),
    (user_ids['meera'],   'Blood Sugar',    'Low glycemic index food: oats, green leafy vegetables, millet. Monitor blood sugar weekly.', today.strftime('%Y-%m-%d')),
]
for uid, param, rec, d in diet_plans:
    insert(f"INSERT INTO diet_plan(User_id, Health_Parameter, Diet_Recommendation, Date) VALUES('{uid}','{param}','{rec}','{d}')")
print("  ✓ Seeded 5 diet plan recommendations")

# ── Step 9: Seed Health Tips ──
print("\n[9] Seeding Health Tips...")
tips = [
    (anu_uid, 'Iron & Folic Acid', 'Take iron and folic acid supplements daily. Folic acid prevents neural tube defects and supports brain development.', today.strftime('%Y-%m-%d')),
    (anu_uid, 'Sleep on Left Side', 'After 20 weeks, sleeping on your left side improves blood flow to the baby and reduces back pressure.', today.strftime('%Y-%m-%d')),
    (anu_uid, 'Stay Hydrated', 'Drink 8-10 glasses of water daily. Dehydration can trigger premature contractions in third trimester.', today.strftime('%Y-%m-%d')),
    (anu_uid, 'Warning Signs', 'Seek immediate care for severe headache, blurred vision, sudden hand or face swelling, or reduced fetal movement.', today.strftime('%Y-%m-%d')),
    (anu_uid, 'Prenatal Yoga', 'Gentle yoga and 30-minute daily walks improve circulation, reduce back pain, and prepare your body for labour.', today.strftime('%Y-%m-%d')),
]
for uid, title, desc, d in tips:
    insert(f"INSERT INTO health_tips(User_id, Tip_title, Tip_description, Date) VALUES('{uid}','{title}','{desc}','{d}')")
print("  ✓ Seeded 5 health tips")

# ── Step 10: Seed Pregnancy Timeline ──
print("\n[10] Seeding Pregnancy Timeline...")
timeline = [
    (anu_uid, 8,  'First Heartbeat Heard',    'Heard baby heartbeat during first ultrasound.',  'Nausea, fatigue',   (today - timedelta(weeks=20)).strftime('%Y-%m-%d')),
    (anu_uid, 12, 'NT Scan Completed',         'Nuchal translucency scan done. All normal.',     'Nausea reducing',   (today - timedelta(weeks=16)).strftime('%Y-%m-%d')),
    (anu_uid, 16, 'Gender Reveal - Baby Girl', 'Sonologist confirmed it is a girl!',             'Feeling energetic', (today - timedelta(weeks=12)).strftime('%Y-%m-%d')),
    (anu_uid, 20, 'Anomaly Scan Clear',        'All organs forming normally per detailed scan.', 'Mild backache',     (today - timedelta(weeks=8)).strftime('%Y-%m-%d')),
    (anu_uid, 24, 'First Strong Kicks Felt',   'Baby kicked very clearly for first time today!', 'Excited, tired',    (today - timedelta(weeks=4)).strftime('%Y-%m-%d')),
]
for uid, week, title, desc, symp, edate in timeline:
    insert(f"INSERT INTO pregnancy_timeline(User_id, Week_Number, Milestone_Title, Description, Symptoms, Date) VALUES('{uid}','{week}','{title}','{desc}','{symp}','{edate}')")
print("  ✓ Seeded 5 pregnancy timeline milestones")

# ── Step 11: Seed Medical Appointments ──
print("\n[11] Seeding Medical Appointments...")
appts = [
    (anu_uid, 'Routine Week 26 checkup. BP 120/80, weight gain 8kg, fundal height 26cm, all normal.', (today + timedelta(days=14)).strftime('%Y-%m-%d'), 'Growth scan scheduled at week 32'),
    (anu_uid, 'Iron levels at 10.2 g/dL. Prescribed ferrous sulfate 200mg twice daily.',               (today + timedelta(days=28)).strftime('%Y-%m-%d'), 'Repeat blood Hb test in 2 weeks'),
]
for uid, notes, ndate, notif in appts:
    insert(f"INSERT INTO medical_appointments(User_id, Previous_appointment_notes, Next_appointment_date, Notifications) VALUES('{uid}','{notes}','{ndate}','{notif}')")
print("  ✓ Seeded 2 medical appointments")

# ── Step 12: Seed Complaints ──
print("\n[12] Seeding Complaints...")
now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
complaints = [
    (anu_uid,            'Unable to find the vaccination schedule for week 28. Please assist.', 'pending', now_str),
    (user_ids['preethi'], 'Diet plan section is not displaying properly on mobile layout.', 'pending', now_str),
]
for uid, comp, reply, d in complaints:
    insert(f"INSERT INTO complaints(User_id, Complaint_id, Reply, Date) VALUES('{uid}','{comp}','{reply}','{d}')")
print("  ✓ Seeded 2 complaints")

# ── Step 13: Seed Kerala Government Posts ──
print("\n[13] Seeding Government Posts...")
posts = [
    ('Janani Suraksha Yojana (JSY)', 'Free cash assistance for pregnant women delivering in government hospitals. Aimed at reducing maternal and neonatal mortality.', 'https://nhm.gov.in', 'jsy_scheme_guidelines.pdf', now_str),
    ('Pradhan Mantri Matru Vandana Yojana (PMMVY)', 'Direct benefit transfer of Rs. 5,000 for pregnant women for first live birth. Compensates for wage loss during pregnancy.', 'https://pmmvy.nic.in', 'pmmvy_form.pdf', now_str),
    ('Mathruamrutham Scheme Kerala', 'Nutritional support scheme providing free milk, eggs, and nutritional mix to pregnant women via Anganwadi centres.', 'https://wcd.kerala.gov.in', 'mathruamrutham.pdf', now_str),
]
for name, desc, links, fname, dt in posts:
    insert(f"INSERT INTO kerala_government_posts(Post_name, Description, Links, File, Datetime) VALUES('{name}','{desc}','{links}','{fname}','{dt}')")
print("  ✓ Seeded 3 Kerala government posts")

# ── Step 14: Seed Chat Messages ──
print("\n[14] Seeding Chat Messages...")
anu_lid  = login_map['anu']
shel_lid = login_map['shel']
chat_msgs = [
    (anu_lid,  shel_lid, 'Hello akka, I have mild back pain since morning. Is this normal at week 28?', now_str),
    (shel_lid, anu_lid,  'Yes Anu, mild back pain is common. Rest on your left side with a pillow. Call me if it worsens!', now_str),
    (anu_lid,  shel_lid, 'Thank you akka. Should I take my iron tablets in the morning or night?', now_str),
    (shel_lid, anu_lid,  'Take iron tablets at night on empty stomach with plain water. Avoid tea or coffee afterwards.', now_str),
    (anu_lid,  shel_lid, 'Ok akka, understood. When is our next home visit scheduled?', now_str),
    (shel_lid, anu_lid,  'I will visit your home this coming Thursday at 10 AM. Keep your health card ready.', now_str),
]
for sender, rcvr, msg, dt in chat_msgs:
    insert(f"INSERT INTO chat(Sender_id, Receiver_id, Chat, Date) VALUES('{sender}','{rcvr}','{msg}','{dt}')")
print("  ✓ Seeded 6 chat messages between User Anu and ASHA Shelji")

# ── Step 15: Seed Informative Content ──
print("\n[15] Seeding Informative Content (Anganwadi / ASHA register)...")
shel_aid = asha_map[shel_lid]
insert(f"INSERT INTO informative_content(Asha_id, User_id, Iron_medicine_count, Calcium_tablets_count, Folic_acid_tablets_count, First_tt_vaccine_date, Second_tt_vaccine_date, Food_from_anganwadi, Record_date) VALUES('{shel_aid}','{anu_uid}', 30, 30, 30, '2024-03-10', '2024-04-10', 'Nutritious Mix & Eggs Provided', '{today.strftime('%Y-%m-%d')}')")
print("  ✓ Seeded 1 informative content record")

# ── FINAL SUMMARY ──
print("\n" + "=" * 60)
print("RESET & SEED COMPLETE! DATABASE ROW SUMMARY:")
print("=" * 60)
for t in ALL_TABLES:
    try:
        r = select(f"SELECT COUNT(*) as c FROM `{t}`")
        print(f"  {t:30s} : {r[0]['c']} rows")
    except Exception as e:
        print(f"  {t:30s} : ERROR ({e})")
print("=" * 60)
