# from flask import *
# from database import *
# import uuid
# import os
# import re
# # import fitz
# from datetime import datetime

# api = Blueprint("api",__name__)



# @api.route('/api/loginn',methods=['get','post'])
# def loginn():
# 	data = {}
# 	username = request.args['username']
# 	password = request.args['password']
	
# 	# First check login credentials
# 	q = "select * from login where uname='%s' and psd='%s'" % (username,password)
# 	login_result = select(q)
	
# 	if login_result:
# 		# If login successful, get user details
# 		login_id = login_result[0]['login_id'] 
# 		q2 = "select * from users where Login_id='%s'" % (login_id)
# 		user_result = select(q2)
		
# 		data['status'] = "success"
# 		data['login_data'] = login_result
# 		if user_result:
# 			data['user_data'] = user_result
# 			data['user_id'] = user_result[0]['Users_id']
# 	else:
# 		data['status'] = 'failed'
		
# 	return str(data)




# @api.route('/register')
# def register():
# 	data = {}
# 	bname = request.args['bname']
# 	bnum = request.args['bnum']
# 	place = request.args['place']
# 	phone = request.args['phone']
# 	email = request.args['email']
# 	username = request.args['username']
# 	password = request.args['password']
# 	q = "select * from login where username='%s'" % (username)
# 	result = select(q)
# 	if result:
# 		data['status'] = "duplicate"
# 	else:
# 		q="INSERT INTO `login`(`login_id`, `username`, `password`, `usertype`) VALUES (null,'%s','%s','User')"%(username,password)
# 		ids=insert(q)
# 		q1="""INSERT INTO `user`(`user_id`, `login_id`, `fname`, `lname`, `place`, `phone`, `email`)
# 		  VALUES (null,'%s','%s','%s','%s','%s','%s')"""%(ids,bname,bnum,place,phone,email)
# 		insert(q1)
# 		data['status'] = 'success'
# 	data['method']="register"
# 	return str(data)




# @api.route('/api/view_profile', methods=['GET'])
# def view_profile():
#     user_id = request.args.get('user_id')
#     if not user_id:
#         return jsonify({"status": "error", "message": "User ID required"}), 400
#     user_s = "select * from users where Users_id='%s'" % (user_id)
#     user = select(user_s)
#     if user:
#         return jsonify({"status": "success", "data": user})
#     return jsonify({"status": "error", "message": "User not found"}), 404




# @api.route('/api/view_appoinments',methods=['GET'])
# def view_appointments():
#     user_id = request.args.get('user_id')
#     app="SELECT * FROM medical_appointments WHERE User_id = %s" %(user_id)
#     appointments=select(app)
#     if appointments:
#         return jsonify({
# 			"status": "success",
# 			"data": appointments
# 		})
#     else:
#         return jsonify({
# 			"status": "no_data"
# 		})



# @api.route('/api/add_diet_plan', methods=['GET'])
# def add_diet_plan():
#     user_id = request.args.get('user_id')
#     health_parameter = request.args.get('health_parameter')
#     diet_recommendation = request.args.get('diet_recommendation')
#     current_date = datetime.now().strftime('%Y-%m-%d')
#     query = """INSERT INTO diet_plan  
#                VALUES (null,'%s', '%s', '%s', '%s')""" % (user_id, health_parameter, diet_recommendation, current_date)
#     diet_id = insert(query)
#     return jsonify({
# 		"status": "success",
# 		"data": "successfully added",
# 	})



# @api.route('/api/get_diet_plan', methods=['GET'])
# def get_diet_plan():
#     user_id = request.args.get('user_id')
#     if not user_id:
#         return jsonify({
#             "status": "error",
#             "message": "User ID required"
#         }), 400

#     query = "SELECT * FROM diet_plan WHERE User_id = '%s' ORDER BY Date DESC" % (user_id)
#     diet_plans = select(query)
    
#     if diet_plans:
#         return jsonify({
#             "status": "success",
#             "data": diet_plans
#         })
#     return jsonify({
#         "status": "no_data"
#     })


# @api.route('/api/delete_diet_plan', methods=['GET'])
# def delete_diet_plan():
#     diet_id = request.args.get('diet_id')
#     if not diet_id:
#         return jsonify({
#             "status": "error",
#             "message": "Diet ID required"
#         }), 400

#     query = "DELETE FROM diet_plan WHERE Diet_id = '%s'" % (diet_id)
#     result = delete(query)
#     return jsonify({
# 		"status": "success",
# 		"message": "Diet plan deleted successfully"
# 	})


# @api.route('/api/add_health_tip', methods=['GET'])
# def add_health_tip():
#     user_id = request.args.get('user_id')
#     tip_title = request.args.get('tip_title')
#     tip_description = request.args.get('tip_description')
    
#     if not all([user_id, tip_title, tip_description]):
#         return jsonify({
#             "status": "error",
#             "message": "Missing required parameters"
#         }), 400

#     current_date = datetime.now().strftime('%Y-%m-%d')
#     query = """INSERT INTO health_tips (User_id, Tip_title, Tip_description, Date)
#                VALUES ('%s', '%s', '%s', '%s')""" % (user_id, tip_title, tip_description, current_date)
    
#     try:
#         tip_id = insert(query)
#         return jsonify({
#             "status": "success",
#             "message": "Health tip added successfully"
#         })
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "message": str(e)
#         }), 500


# @api.route('/api/get_health_tips', methods=['GET'])
# def get_health_tips():
#     user_id = request.args.get('user_id')
#     if not user_id:
#         return jsonify({
#             "status": "error",
#             "message": "User ID required"
#         }), 400

#     query = "SELECT * FROM health_tips WHERE User_id = '%s' ORDER BY Date DESC" % (user_id)
#     tips = select(query)
    
    
#     return jsonify({
#             "status": "success",
#             "data": tips
#         })


# @api.route('/api/delete_health_tip', methods=['GET'])
# def delete_health_tip():
#     tip_id = request.args.get('tip_id')
#     if not tip_id:
#         return jsonify({
#             "status": "error",
#             "message": "Tip ID required"
#         }), 400

#     query = "DELETE FROM health_tips WHERE Tip_id = '%s'" % (tip_id)
#     result = delete(query)
#     return jsonify({
#         "status": "success",
#         "message": "Health tip deleted successfully"
#     })


# @api.route('/api/view_ashaworkers', methods=['GET'])
# def view_ashaworkers():
#     query = "select * from asha_worker"
#     workers = select(query)
    
#     if workers:
#         return jsonify({
#             "status": "success",
#             "data": workers
#         })
#     return jsonify({
#         "status": "no_data"
#     })


# @api.route('/api/view_doctors', methods=['GET'])
# def view_doctors():
#     query = "SELECT * FROM doctor"
#     doctors = select(query)
    
#     if doctors:
#         return jsonify({
#             "status": "success",
#             "data": doctors
#         })
#     return jsonify({
#         "status": "no_data"
#     })


# @api.route('/api/view_complaints', methods=['GET'])
# def view_complaints():
#     user_id = request.args.get('user_id')
#     if not user_id:
#         return jsonify({
#             "status": "error",
#             "message": "User ID required"
#         }), 400

#     query = "SELECT * FROM complaints WHERE User_id = '%s' ORDER BY Date DESC" % (user_id)
#     complaints = select(query)
    
#     return jsonify({
# 		"status": "success",
# 		"method": "view_complaints",
# 		"data": complaints
# 	})


# @api.route('/api/submit_complaint', methods=['GET'])
# def submit_complaint():
#     user_id = request.args.get('user_id')
#     complaint = request.args.get('complaint')

#     if not user_id or not complaint:
#         return jsonify({
#             "status": "error",
#             "method": "submit_complaint",
#             "message": "Missing user_id or complaint"
#         })


#     query = "INSERT INTO complaints  VALUES (null,'%s','%s', curdate(), 'pending')"%(user_id, complaint)
#     result = insert(query)

#     if result > 0:
#         return jsonify({
#             "status": "success",
#             "method": "submit_complaint"
#         })
#     else:
#         return jsonify({
#             "status": "error",
#             "method": "submit_complaint"
#         })



# @api.route('/api/delete_complaint', methods=['GET'])
# def delete_complaint():
#     complaint_id = request.args.get('complaint_id')

#     if not complaint_id:
#         return jsonify({
#             "status": "error",
#             "method": "delete_complaint",
#             "message": "Complaint ID is required"
#         })

#     query = "DELETE FROM complaints WHERE Comp_id = %s"%(complaint_id)
#     delete(query)
#     return jsonify({
#             "status": "success",
#             "method": "delete_complaint"
#         })


# @api.route('/api/chatdetail', methods=['GET'])
# def chatdetail():
#     sender_id = request.args.get('sender_id')
#     receiver_id = request.args.get('receiver_id')
    
#     if not all([sender_id, receiver_id]):
#         return jsonify({
#             "status": "error",
#             "method": "chatdetail",
#             "message": "Both sender_id and receiver_id are required"
#         }), 400

#     query = """SELECT 
#                 Sender_id as sender_id,
#                 Receiver_id as receiver_id, 
#                 Chat as message,
#                 Date as date
#                FROM chat 
#                WHERE (Sender_id = '%s' AND Receiver_id = '%s')
#                OR (Sender_id = '%s' AND Receiver_id = '%s')
#                ORDER BY Date DESC""" % (sender_id, receiver_id, receiver_id, sender_id)
               
#     chats = select(query)
    
#     return jsonify({
#         "status": "success",
#         "method": "chatdetail",
#         "data": chats if chats else []
#     })

# @api.route('/api/chat', methods=['GET'])
# def chat():
#     sender_id = request.args.get('sender_id')
#     receiver_id = request.args.get('receiver_id')
#     details = request.args.get('details')
    
#     if not all([sender_id, receiver_id, details]):
#         return jsonify({
#             "status": "error",
#             "method": "chat",
#             "message": "sender_id, receiver_id and details are required"
#         }), 400

#     current_date = datetime.now().strftime('%Y-%m-%d')
#     query = """INSERT INTO chat (Chat_id, Sender_id, Receiver_id, Chat, Date)
#                VALUES (null, '%s', '%s', '%s', '%s')""" % (sender_id, receiver_id, details, current_date)
               
#     try:
#         chat_id = insert(query)
#         return jsonify({
#             "status": "success",
#             "method": "chat",
#             "message": "Message sent successfully"
#         })
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "method": "chat", 
#             "message": str(e)
#         }), 500


# @api.route('/api/baby_growth', methods=['GET'])
# def baby_growth():
#     user_id = request.args.get('user_id')
#     pregnancy_week = request.args.get('pregnancy_week')
#     baby_week = request.args.get('baby_week')  # This will be stored in Baby_size
#     movement_description = request.args.get('movement_description')
#     hormonal_changes = request.args.get('hormonal_changes')
#     emotional_state = request.args.get('emotional_state')

#     if not all([user_id, pregnancy_week, baby_week, movement_description, hormonal_changes, emotional_state]):
#         return jsonify({
#             "status": "error",
#             "method": "baby_growth",
#             "message": "Missing required parameters"
#         }), 400

#     query = """INSERT INTO baby_growth 
#                (Growth_id, User_id, Pregnancy_week, Baby_size, Movement_description, Hormonal_changes, Emotional)
#                VALUES (null, '%s', '%s', '%s cm', '%s', '%s', '%s')""" % (
#                 user_id, pregnancy_week, baby_week, movement_description, hormonal_changes, emotional_state
#                )
    
#     try:
#         growth_id = insert(query)
#         return jsonify({
#             "status": "success",
#             "method": "baby_growth",
#             "message": "Baby growth data added successfully"
#         })
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "method": "baby_growth",
#             "message": str(e)
#         }), 500


# @api.route('/api/get_growth_records', methods=['GET'])
# def get_growth_records():
#     user_id = request.args.get('user_id')
    
#     if not user_id:
#         return jsonify({
#             "status": "error",
#             "message": "User ID required"
#         }), 400

#     query = """SELECT 
#                Pregnancy_week as pregnancy_week,
#                Baby_size as baby_week,
#                Movement_description as movement_description
#                FROM baby_growth 
#                WHERE User_id = '%s'
#                ORDER BY Pregnancy_week DESC""" % (user_id)
               
#     records = select(query)
    
#     if records:
#         return jsonify({
#             "status": "success",
#             "records": records
#         })
#     return jsonify({
#         "status": "success",
#         "records": []
#     })

# @api.route('/api/add_timeline', methods=['GET'])
# def add_timeline():
#     user_id = request.args.get('user_id')
#     week_number = request.args.get('week_number')
#     milestone_title = request.args.get('milestone_title')
#     description = request.args.get('description')
#     symptoms = request.args.get('symptoms')
    
#     if not all([user_id, week_number, milestone_title, description, symptoms]):
#         return jsonify({
#             "status": "error",
#             "method": "add_timeline",
#             "message": "Missing required parameters"
#         }), 400

#     current_date = datetime.now().strftime('%Y-%m-%d')
#     query = """INSERT INTO pregnancy_timeline 
#                (Timeline_id, User_id, Week_Number, Milestone_Title, Description, Symptoms, Date)
#                VALUES (null, '%s', '%s', '%s', '%s', '%s', '%s')""" % (
#                 user_id, week_number, milestone_title, description, symptoms, current_date
#                )
    
#     try:
#         timeline_id = insert(query)
#         return jsonify({
#             "status": "success",
#             "method": "add_timeline",
#             "message": "Timeline entry added successfully"
#         })
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "method": "add_timeline",
#             "message": str(e)
#         }), 500


# @api.route('/api/get_timeline', methods=['GET'])
# def get_timeline():
#     user_id = request.args.get('user_id')
    
#     if not user_id:
#         return jsonify({
#             "status": "success",
#             "timeline_data": []
#         })

#     query = """SELECT Timeline_id, Week_Number, Milestone_Title, Description, Symptoms, Date
#                FROM pregnancy_timeline 
#                WHERE User_id = '%s'
#                ORDER BY Week_Number DESC""" % (user_id)
               
#     timeline = select(query)
    
#     return jsonify({
#         "status": "success",
#         "timeline_data": timeline if timeline else []
#     })


# from flask import Flask, request, jsonify
# import textwrap

# import json


# # Initialize the Flask application

# # Google Gemini API Key
# GOOGLE_API_KEY = 'AIzaSyAdbPNd0d037Wad2-DZ8PKPzidNJ4H6anE'

# # Configure Google Gemini API

# # Initialize the model
# model = None

    

# # Function to convert text to markdown
# def to_markdown(text):
#     text = text.replace('*', ' ')
#     return textwrap.indent(text, '> ', predicate=lambda _: True)

# # Function to generate response from Google Gemini


# # Function to provide financial advice
# def get_financial_advice(message):
#     return f"Great question! When it comes to {message}, it's important to plan wisely. Consider diversifying your investments."

# # Function to handle small talk
# def handle_small_talk(message):
#     casual_responses = {
#         "hello": "Hi there! How can I assist you today?",
#         "how are you": "I'm just a chatbot, but I'm always here to help!",
#         "what's up": "Not much, just helping people with their finances!",
#         "thank you": "You're welcome! Let me know if you need more help.",
#         "bye": "Goodbye! Take care and manage your finances well!",
#         "goodbye": "Goodbye! Take care and manage your finances well!"
#     }
#     return casual_responses.get(message.lower(), "That's interesting! Tell me more.")

# # Route for the chatbot to handle requests
# @api.route('/api/chatbot', methods=['GET'])
# def chatbot():
#     user_message = request.args.get('chat', '').strip()  # Get message from GET request
#     gemini_response = "I'm here to help!"  # Default response

#     if not user_message:
#         return jsonify({'status': 'error', 'response': 'Please provide a valid message.'})

#     finance_keywords = ['finance', 'investment', 'budget', 'savings', 'loan', 'money', 'financial']

#     if any(keyword in user_message.lower() for keyword in finance_keywords):
#         # Handle finance-related queries
#         response_message = get_financial_advice(user_message)
#     else:
#         # Handle casual conversation
#         response_message = handle_small_talk(user_message)

#     # Generate a response (replace this with actual chatbot logic)
    

#     return jsonify({"status": "success", "message": user_message, "response": gemini_response})




# @api.route('/api/view_posts', methods=['GET'])
# def view_posts():
#     user_id = request.args.get('user_id')
    
#     if not user_id:
#         return jsonify({
#             "status": "error",
#             "message": "User ID required"
#         }), 400

#     query = "SELECT * from kerala_government_posts"
               
#     post = select(query)
    
#     if post:
#         return jsonify({
#             "status": "success",
#             "post": post
#         })
#     return jsonify({
#         "status": "success",
#         "records": []
#     })

# @api.route('/api/get_informative_content', methods=['GET'])
# def get_informative_content():
#     user_id = request.args.get('user_id')
    
#     if not user_id:
#         return jsonify({
#             "status": "error",
#             "message": "User ID required"
#         }), 400

#     query = """SELECT Info_id, Asha_id, User_id, 
#                Iron_medicine_count, Calcium_tablets_count, 
#                Folic_acid_tablets_count,
#                First_tt_vaccine_date,
#                Second_tt_vaccine_date,
#                Food_from_anganwadi,
#                Record_date
#                FROM informative_content 
#                WHERE User_id = '%s'
#                ORDER BY Record_date DESC""" % (user_id)
               
#     content = select(query)
    
#     # Format dates after fetching from database
#     for item in content:
#         for date_field in ['First_tt_vaccine_date', 'Second_tt_vaccine_date', 'Record_date']:
#             if item.get(date_field):
#                 item[date_field] = item[date_field].strftime('%Y-%m-%d') if isinstance(item[date_field], datetime) else str(item[date_field])
    
#     return jsonify({
#         "status": "success",
#         "data": content if content else []
#     })
    
# @api.route('/api/submit_appointment', methods=['GET'])
# def submit_appointment():
#     user_id = request.args.get('user_id')
#     prev_notes = request.args.get('prev_notes')
#     next_date = request.args.get('next_date')
#     notification = request.args.get('notification')

#     if not all([user_id, prev_notes, next_date, notification]):
#         return jsonify({
#             "status": "error",
#             "message": "Missing required parameters"
#         }), 400

#     query = """INSERT INTO medical_appointments 
#                (Appointment_id, User_id, Previous_appointment_notes, Next_appointment_date, Notifications)
#                VALUES (null, '%s', '%s', '%s', '%s')""" % (
#                 user_id, prev_notes, next_date, notification
#                )
    
#     try:
#         appointment_id = insert(query)
#         return jsonify({
#             "status": "success",
#             "message": "Appointment added successfully"
#         })
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "message": str(e)
#         }), 500


# @api.route('/api/app_appointments',methods=['GET'])
# def app_appointments():
#     user_id = request.args.get('user_id')
#     if not user_id:
#         return jsonify({
#             "status": "failed",
#             "message": "User ID required"
#         })

#     query = """SELECT Previous_appointment_notes, Next_appointment_date, Notifications 
#                FROM medical_appointments 
#                WHERE User_id = '%s'
#                ORDER BY Appointment_id DESC""" % (user_id)
    
#     appointments = select(query)
    
#     if appointments:
#         return jsonify({
#             "status": "success",
#             "data": appointments
#         })
#     return jsonify({
#         "status": "failed",
#         "message": "No appointments found"
#     })

# @api.route('/api/getward', methods=['GET'])
# def get_ward():
#     query = "SELECT Ward_id, Ward_name FROM ward ORDER BY Ward_name"
#     wards = select(query)
    
#     if wards:
#         return jsonify({
#             "status": "success",
#             "method": "getward",
#             "data": wards
#         })
#     return jsonify({
#         "status": "no_data",
#         "method": "getward"
#     })


from flask import *
from database import *
import uuid
import os
import re
# import fitz
from datetime import datetime

api = Blueprint("api",__name__)

@api.route('/api/add_health_data', methods=['GET'])
def add_health_data():
    # Get login parameters
    username = request.args.get('username')
    password = request.args.get('password')
    
    # Get health data parameters
    full_name = request.args.get('full_name')
    age = request.args.get('age')
    lmp_date = request.args.get('lmp_date')
    blood_group = request.args.get('blood_group') 
    blood_pressure = request.args.get('blood_pressure')
    thyroid_levels = request.args.get('thyroid_levels')
    ward_id = request.args.get('ward_id')

    if not all([username, password, full_name, age, ward_id]):
        return jsonify({
            "status": "error",
            "method": "add_health_data", 
            "message": "Missing required parameters"
        }), 400

    # First check if login exists
    login_query = "SELECT * FROM login WHERE uname='%s' AND psd='%s'" % (username, password)
    login_result = select(login_query)

    if not login_result:
        # Create new login
        login_insert = "INSERT INTO login (uname, psd, utype) VALUES ('%s', '%s', 'user')" % (username, password)
        login_id = insert(login_insert)
        
        # Create new user
        user_insert = """INSERT INTO users 
                        (Login_id, Ward_id, Full_Name, Age, LMP_date, Blood_Group, Blood_Pressure, Thyroid_Levels)
                        VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')""" % (
                        login_id, ward_id, full_name, age, lmp_date, blood_group, blood_pressure, thyroid_levels)
        user_id = insert(user_insert)
    else:
        # Update existing user
        login_id = login_result[0]['login_id']
        user_query = "SELECT Users_id FROM users WHERE Login_id='%s'" % (login_id)
        user_result = select(user_query)
        
        if user_result:
            user_id = user_result[0]['Users_id']
            update_query = """UPDATE users SET 
                            Ward_id='%s', Full_Name='%s', Age='%s',
                            LMP_date='%s', Blood_Group='%s',
                            Blood_Pressure='%s', Thyroid_Levels='%s'
                            WHERE Users_id='%s'""" % (
                            ward_id, full_name, age, lmp_date,
                            blood_group, blood_pressure, thyroid_levels, user_id)
            update(update_query)
        else:
            # Create new user record for existing login
            user_insert = """INSERT INTO users 
                        (Login_id, Ward_id, Full_Name, Age, LMP_date, Blood_Group, Blood_Pressure, Thyroid_Levels)
                        VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')""" % (
                        login_id, ward_id, full_name, age, lmp_date, blood_group, blood_pressure, thyroid_levels)
            user_id = insert(user_insert)

    return jsonify({
        "status": "success",
        "method": "add_health_data",
        "message": "Health data updated successfully"
    })


@api.route('/api/loginn',methods=['get','post'])
def loginn():
	data = {}
	username = request.args['username']
	password = request.args['password']
	
	# First check login credentials
	q = "select * from login where uname='%s' and psd='%s'" % (username,password)
	login_result = select(q)
	
	if login_result:
		# If login successful, get user details
		login_id = login_result[0]['login_id'] 
		q2 = "select * from users where Login_id='%s'" % (login_id)
		user_result = select(q2)
		
		data['status'] = "success"
		data['login_data'] = login_result
		if user_result:
			data['user_data'] = user_result
			data['user_id'] = user_result[0]['Users_id']
	else:
		data['status'] = 'failed'
		
	return jsonify(data)




@api.route('/register')
def register():
	data = {}
	bname = request.args['bname']
	bnum = request.args['bnum']
	place = request.args['place']
	phone = request.args['phone']
	email = request.args['email']
	username = request.args['username']
	password = request.args['password']
	q = "select * from login where username='%s'" % (username)
	result = select(q)
	if result:
		data['status'] = "duplicate"
	else:
		q="INSERT INTO `login`(`login_id`, `username`, `password`, `usertype`) VALUES (null,'%s','%s','User')"%(username,password)
		ids=insert(q)
		q1="""INSERT INTO `user`(`user_id`, `login_id`, `fname`, `lname`, `place`, `phone`, `email`)
		  VALUES (null,'%s','%s','%s','%s','%s','%s')"""%(ids,bname,bnum,place,phone,email)
		insert(q1)
		data['status'] = 'success'
	data['method']="register"
	return jsonify(data)




@api.route('/api/view_profile', methods=['GET'])
def view_profile():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"status": "error", "message": "User ID required"}), 400
    user_s = "select * from users where Users_id='%s'" % (user_id)
    user = select(user_s)
    if user:
        return jsonify({"status": "success", "data": user})
    return jsonify({"status": "error", "message": "User not found"}), 404




@api.route('/api/view_appoinments',methods=['GET'])
def view_appointments():
    user_id = request.args.get('user_id')
    app="SELECT * FROM medical_appointments WHERE User_id = %s" %(user_id)
    appointments=select(app)
    if appointments:
        return jsonify({
			"status": "success",
			"data": appointments
		})
    else:
        return jsonify({
			"status": "no_data"
		})



@api.route('/api/add_diet_plan', methods=['GET'])
def add_diet_plan():
    user_id = request.args.get('user_id')
    health_parameter = request.args.get('health_parameter')
    diet_recommendation = request.args.get('diet_recommendation')
    current_date = datetime.now().strftime('%Y-%m-%d')
    query = """INSERT INTO diet_plan  
               VALUES (null,'%s', '%s', '%s', '%s')""" % (user_id, health_parameter, diet_recommendation, current_date)
    diet_id = insert(query)
    return jsonify({
		"status": "success",
		"data": "successfully added",
	})



@api.route('/api/get_diet_plan', methods=['GET'])
def get_diet_plan():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "User ID required"
        }), 400

    query = "SELECT * FROM diet_plan WHERE User_id = '%s' ORDER BY Date DESC" % (user_id)
    diet_plans = select(query)
    
    if diet_plans:
        return jsonify({
            "status": "success",
            "data": diet_plans
        })
    return jsonify({
        "status": "no_data"
    })


@api.route('/api/delete_diet_plan', methods=['GET'])
def delete_diet_plan():
    diet_id = request.args.get('diet_id')
    if not diet_id:
        return jsonify({
            "status": "error",
            "message": "Diet ID required"
        }), 400

    query = "DELETE FROM diet_plan WHERE Diet_id = '%s'" % (diet_id)
    result = delete(query)
    return jsonify({
		"status": "success",
		"message": "Diet plan deleted successfully"
	})


@api.route('/api/add_health_tip', methods=['GET'])
def add_health_tip():
    user_id = request.args.get('user_id')
    tip_title = request.args.get('tip_title')
    tip_description = request.args.get('tip_description')
    
    if not all([user_id, tip_title, tip_description]):
        return jsonify({
            "status": "error",
            "message": "Missing required parameters"
        }), 400

    current_date = datetime.now().strftime('%Y-%m-%d')
    query = """INSERT INTO health_tips (User_id, Tip_title, Tip_description, Date)
               VALUES ('%s', '%s', '%s', '%s')""" % (user_id, tip_title, tip_description, current_date)
    
    try:
        tip_id = insert(query)
        return jsonify({
            "status": "success",
            "message": "Health tip added successfully"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@api.route('/api/get_health_tips', methods=['GET'])
def get_health_tips():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "User ID required"
        }), 400

    query = "SELECT * FROM health_tips WHERE User_id = '%s' ORDER BY Date DESC" % (user_id)
    tips = select(query)
    
    
    return jsonify({
            "status": "success",
            "data": tips
        })


@api.route('/api/delete_health_tip', methods=['GET'])
def delete_health_tip():
    tip_id = request.args.get('tip_id')
    if not tip_id:
        return jsonify({
            "status": "error",
            "message": "Tip ID required"
        }), 400

    query = "DELETE FROM health_tips WHERE Tip_id = '%s'" % (tip_id)
    result = delete(query)
    return jsonify({
        "status": "success",
        "message": "Health tip deleted successfully"
    })


@api.route('/api/view_ashaworkers', methods=['GET'])
def view_ashaworkers():
    query = "select * from asha_worker"
    workers = select(query)
    
    if workers:
        return jsonify({
            "status": "success",
            "data": workers
        })
    return jsonify({
        "status": "no_data"
    })


@api.route('/api/view_doctors', methods=['GET'])
def view_doctors():
    query = "SELECT * FROM doctor"
    doctors = select(query)
    
    if doctors:
        return jsonify({
            "status": "success",
            "data": doctors
        })
    return jsonify({
        "status": "no_data"
    })


@api.route('/api/view_complaints', methods=['GET'])
def view_complaints():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "User ID required"
        }), 400

    query = "SELECT * FROM complaints WHERE User_id = '%s' ORDER BY Date DESC" % (user_id)
    complaints = select(query)
    
    return jsonify({
		"status": "success",
		"method": "view_complaints",
		"data": complaints
	})


@api.route('/api/submit_complaint', methods=['GET'])
def submit_complaint():
    user_id = request.args.get('user_id')
    complaint = request.args.get('complaint')

    if not user_id or not complaint:
        return jsonify({
            "status": "error",
            "method": "submit_complaint",
            "message": "Missing user_id or complaint"
        })


    query = "INSERT INTO complaints  VALUES (null,'%s','%s',  'pending',curdate())"%(user_id, complaint)
    result = insert(query)

    if result > 0:
        return jsonify({
            "status": "success",
            "method": "submit_complaint"
        })
    else:
        return jsonify({
            "status": "error",
            "method": "submit_complaint"
        })



@api.route('/api/delete_complaint', methods=['GET'])
def delete_complaint():
    complaint_id = request.args.get('complaint_id')

    if not complaint_id:
        return jsonify({
            "status": "error",
            "method": "delete_complaint",
            "message": "Complaint ID is required"
        })

    query = "DELETE FROM complaints WHERE Comp_id = %s"%(complaint_id)
    delete(query)
    return jsonify({
            "status": "success",
            "method": "delete_complaint"
        })


@api.route('/api/chatdetail', methods=['GET'])
def chatdetail():
    sender_id = request.args.get('sender_id')
    receiver_id = request.args.get('receiver_id')
    
    if not all([sender_id, receiver_id]):
        return jsonify({
            "status": "error",
            "method": "chatdetail",
            "message": "Both sender_id and receiver_id are required"
        }), 400

    query = """SELECT 
                Sender_id as sender_id,
                Receiver_id as receiver_id, 
                Chat as message,
                Date as date
               FROM chat 
               WHERE (Sender_id = '%s' AND Receiver_id = '%s')
               OR (Sender_id = '%s' AND Receiver_id = '%s')
               ORDER BY Date DESC""" % (sender_id, receiver_id, receiver_id, sender_id)
               
    chats = select(query)
    
    return jsonify({
        "status": "success",
        "method": "chatdetail",
        "data": chats if chats else []
    })

@api.route('/api/chat', methods=['GET'])
def chat():
    sender_id = request.args.get('sender_id')
    receiver_id = request.args.get('receiver_id')
    details = request.args.get('details')
    
    if not all([sender_id, receiver_id, details]):
        return jsonify({
            "status": "error",
            "method": "chat",
            "message": "sender_id, receiver_id and details are required"
        }), 400

    current_date = datetime.now().strftime('%Y-%m-%d')
    query = """INSERT INTO chat (Chat_id, Sender_id, Receiver_id, Chat, Date)
               VALUES (null, '%s', '%s', '%s', '%s')""" % (sender_id, receiver_id, details, current_date)
               
    try:
        chat_id = insert(query)
        return jsonify({
            "status": "success",
            "method": "chat",
            "message": "Message sent successfully"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "method": "chat", 
            "message": str(e)
        }), 500


@api.route('/api/baby_growth', methods=['GET'])
def baby_growth():
    user_id = request.args.get('user_id')
    pregnancy_week = request.args.get('pregnancy_week')
    baby_week = request.args.get('baby_week')  # This will be stored in Baby_size
    movement_description = request.args.get('movement_description')
    hormonal_changes = request.args.get('hormonal_changes')
    emotional_state = request.args.get('emotional_state')

    if not all([user_id, pregnancy_week, baby_week, movement_description, hormonal_changes, emotional_state]):
        return jsonify({
            "status": "error",
            "method": "baby_growth",
            "message": "Missing required parameters"
        }), 400

    query = """INSERT INTO baby_growth 
               (Growth_id, User_id, Pregnancy_week, Baby_size, Movement_description, Hormonal_changes, Emotional)
               VALUES (null, '%s', '%s', '%s cm', '%s', '%s', '%s')""" % (
                user_id, pregnancy_week, baby_week, movement_description, hormonal_changes, emotional_state
               )
    
    try:
        growth_id = insert(query)
        return jsonify({
            "status": "success",
            "method": "baby_growth",
            "message": "Baby growth data added successfully"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "method": "baby_growth",
            "message": str(e)
        }), 500


@api.route('/api/get_growth_records', methods=['GET'])
def get_growth_records():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "User ID required"
        }), 400

    query = """SELECT 
               Pregnancy_week as pregnancy_week,
               Baby_size as baby_week,
               Movement_description as movement_description
               FROM baby_growth 
               WHERE User_id = '%s'
               ORDER BY Pregnancy_week DESC""" % (user_id)
               
    records = select(query)
    
    if records:
        return jsonify({
            "status": "success",
            "records": records
        })
    return jsonify({
        "status": "success",
        "records": []
    })

@api.route('/api/add_timeline', methods=['GET'])
def add_timeline():
    user_id = request.args.get('user_id')
    week_number = request.args.get('week_number')
    milestone_title = request.args.get('milestone_title')
    description = request.args.get('description')
    symptoms = request.args.get('symptoms')
    
    if not all([user_id, week_number, milestone_title, description, symptoms]):
        return jsonify({
            "status": "error",
            "method": "add_timeline",
            "message": "Missing required parameters"
        }), 400

    current_date = datetime.now().strftime('%Y-%m-%d')
    query = """INSERT INTO pregnancy_timeline 
               (Timeline_id, User_id, Week_Number, Milestone_Title, Description, Symptoms, Date)
               VALUES (null, '%s', '%s', '%s', '%s', '%s', '%s')""" % (
                user_id, week_number, milestone_title, description, symptoms, current_date
               )
    
    try:
        timeline_id = insert(query)
        return jsonify({
            "status": "success",
            "method": "add_timeline",
            "message": "Timeline entry added successfully"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "method": "add_timeline",
            "message": str(e)
        }), 500


@api.route('/api/get_timeline', methods=['GET'])
def get_timeline():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({
            "status": "success",
            "timeline_data": []
        })

    query = """SELECT Timeline_id, Week_Number, Milestone_Title, Description, Symptoms, Date
               FROM pregnancy_timeline 
               WHERE User_id = '%s'
               ORDER BY Week_Number DESC""" % (user_id)
               
    timeline = select(query)
    
    return jsonify({
        "status": "success",
        "timeline_data": timeline if timeline else []
    })


from flask import Flask, request, jsonify
import textwrap
import google.generativeai as genai
import json


# Initialize the Flask application

# Google Gemini API Key - Loaded from environment variables, falls back to local config
GOOGLE_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyCaLAxR8KSLoMpLhqjDxxdBgj72uv6ErKw')

# Configure Google Gemini API & Initialize Model Gracefully
model = None
if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print("Gemini model selected:", m.name)
                model = genai.GenerativeModel('gemini-1.5-flash')
                break
    except Exception as e:
        print("Warning: Could not initialize Google Gemini API:", str(e))

# Function to convert text to markdown
def to_markdown(text):
    text = text.replace('*', ' ')
    return textwrap.indent(text, '> ', predicate=lambda _: True)

# Function to generate response from Google Gemini
def generate_gemini_response(prompt):
    if model is None:
        return "I'm sorry, the AI chatbot is currently offline. Please configure a valid Gemini API key."
    try:
        context_prompt = (
            f"You are a friendly AI assistant. Keep responses brief, clear and simple. "
            f"For greetings like 'hi', 'hello', just respond with a simple greeting. "
            f"For questions, provide short direct answers focused on pregnancy and maternal health. "
            f"User Query: {prompt}"
        )

        response = model.generate_content(context_prompt)
        return response.text
    except Exception as e:
        print("Error during Gemini response generation:", str(e))
        return "Sorry, I am unable to generate a response at the moment."

# Function to provide financial advice
def get_financial_advice(message):
    return f"Great question! When it comes to {message}, it's important to plan wisely. Consider diversifying your investments."

# Function to handle small talk
def handle_small_talk(message):
    casual_responses = {
        "hello": "Hi there! How can I assist you today?",
        "how are you": "I'm just a chatbot, but I'm always here to help!",
        "what's up": "Not much, just helping people with their finances!",
        "thank you": "You're welcome! Let me know if you need more help.",
        "bye": "Goodbye! Take care and manage your finances well!",
        "goodbye": "Goodbye! Take care and manage your finances well!"
    }
    return casual_responses.get(message.lower(), "That's interesting! Tell me more.")

def clean_response(text):
    # Remove apostrophes and standardize contractions
    cleaned = text.replace("'s", "s")
    cleaned = cleaned.replace("'t", "t")
    cleaned = cleaned.replace("'m", "m")
    cleaned = cleaned.replace("'re", "re")
    cleaned = cleaned.replace("'ll", "ll")
    cleaned = cleaned.replace("'ve", "ve")
    cleaned = cleaned.replace("'d", "d")
    return cleaned

# Route for the chatbot to handle requests
@api.route('/api/chatbot', methods=['GET'])
def chatbot():
    user_message = request.args.get('chat', '').strip()  # Get message from GET request
    gemini_response = "Im here to help!"  # Default response

    if not user_message:
        return jsonify({'status': 'error', 'response': 'Please provide a valid message.'})

    finance_keywords = ['finance', 'investment', 'budget', 'savings', 'loan', 'money', 'financial']

    if any(keyword in user_message.lower() for keyword in finance_keywords):
        # Handle finance-related queries
        response_message = get_financial_advice(user_message)
    else:
        # Handle casual conversation
        response_message = handle_small_talk(user_message)

    # Generate a response (replace this with actual chatbot logic)
    gemini_response = generate_gemini_response(user_message)
    cleaned_response = clean_response(gemini_response)
    print("Gemini Response:", cleaned_response)  # Debugging

    return jsonify({"status": "success", "message": user_message, "response": cleaned_response})




@api.route('/api/view_posts', methods=['GET'])
def view_posts():
    query = "SELECT * from kerala_government_posts"
               
    post = select(query)
    
    if post:
        return jsonify({
            "status": "success",
            "post": post,
            "records": post,
            "data": post
        })
    return jsonify({
        "status": "success",
        "post": [],
        "records": [],
        "data": []
    })

@api.route('/api/get_informative_content', methods=['GET'])
def get_informative_content():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "User ID required"
        }), 400

    query = """SELECT Info_id, Asha_id, User_id, 
               Iron_medicine_count, Calcium_tablets_count, 
               Folic_acid_tablets_count,
               First_tt_vaccine_date,
               Second_tt_vaccine_date,
               Food_from_anganwadi,
               Record_date
               FROM informative_content 
               WHERE User_id = '%s'
               ORDER BY Record_date DESC""" % (user_id)
               
    content = select(query)
    
    # Format dates after fetching from database
    for item in content:
        for date_field in ['First_tt_vaccine_date', 'Second_tt_vaccine_date', 'Record_date']:
            if item.get(date_field):
                item[date_field] = item[date_field].strftime('%Y-%m-%d') if isinstance(item[date_field], datetime) else str(item[date_field])
    
    return jsonify({
        "status": "success",
        "data": content if content else []
    })
    
@api.route('/api/submit_appointment', methods=['GET'])
def submit_appointment():
    user_id = request.args.get('user_id')
    prev_notes = request.args.get('prev_notes')
    next_date = request.args.get('next_date')
    notification = request.args.get('notification')

    if not all([user_id, prev_notes, next_date, notification]):
        return jsonify({
            "status": "error",
            "message": "Missing required parameters"
        }), 400

    query = """INSERT INTO medical_appointments 
               (Appointment_id, User_id, Previous_appointment_notes, Next_appointment_date, Notifications)
               VALUES (null, '%s', '%s', '%s', '%s')""" % (
                user_id, prev_notes, next_date, notification
               )
    
    try:
        appointment_id = insert(query)
        return jsonify({
            "status": "success",
            "message": "Appointment added successfully"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@api.route('/api/app_appointments',methods=['GET'])
def app_appointments():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({
            "status": "failed",
            "message": "User ID required"
        })

    query = """SELECT Previous_appointment_notes, Next_appointment_date, Notifications 
               FROM medical_appointments 
               WHERE User_id = '%s'
               ORDER BY Appointment_id DESC""" % (user_id)
    
    appointments = select(query)
    
    if appointments:
        return jsonify({
            "status": "success",
            "data": appointments
        })
    return jsonify({
        "status": "failed",
        "message": "No appointments found"
    })



from flask import Flask, request, jsonify
from datetime import datetime, timedelta

@api.route('/api/request_pregnency_prediction', methods=['GET'])
def calculate_pregnancy():
    try:
        lmp_date_str = request.args.get('lmp_date')
        current_date_str = request.args.get('current_date')

        print("Received LMP Date:", lmp_date_str)
        print("Received Current Date:", current_date_str)

        lmp_date = datetime.strptime(lmp_date_str, '%Y-%m-%d')
        current_date = datetime.strptime(current_date_str, '%Y-%m-%d')

        pregnancy_days = (current_date - lmp_date).days
        weeks = pregnancy_days // 7
        days = pregnancy_days % 7
        months = pregnancy_days // 30
        edd = lmp_date + timedelta(days=280)

        print("Pregnancy Days:", pregnancy_days)
        print("Weeks:", weeks, "Days:", days, "Months:", months)
        print("Estimated Due Date:", edd.strftime('%Y-%m-%d'))

        return jsonify({
            'status': 'success',
            'due_date': edd.strftime('%Y-%m-%d'),
            'weeks': weeks,
            'days': days,
            'months': months
        })
    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({
            'status': 'error',
            'message': str(e)
        })


@api.route('/api/baby_growth_daybyday', methods=['GET'])
def baby_growth_daybyday():
    try:
        lmp_date_str = request.args.get('lmp_date')
        if not lmp_date_str:
            return jsonify({'status': 'error', 'message': 'LMP date is required'})

        lmp_date = datetime.strptime(lmp_date_str, '%Y-%m-%d')
        current_date = datetime.now()
        
        # Calculate weeks of pregnancy
        days_pregnant = (current_date - lmp_date).days
        weeks = days_pregnant // 7

        # Define baby growth data by week
        growth_data = {
            1: {"length": "0.1 mm", "weight": "0.001 g", "development": "Fertilization occurs", "comparison": "Smaller than a poppy seed 🌱"},
            4: {"length": "0.4 cm", "weight": "0.007 g", "development": "Neural tube forming", "comparison": "Like a poppy seed 🌱"},
            8: {"length": "1.6 cm", "weight": "1 g", "development": "Major organs developing", "comparison": "Like a raspberry 🫐"},
            12: {"length": "6.5 cm", "weight": "14 g", "development": "Baby features becoming distinct", "comparison": "Like a lime 🍈"},
            16: {"length": "12 cm", "weight": "100 g", "development": "Baby starts making sucking motions", "comparison": "Like an avocado 🥑"},
            20: {"length": "25 cm", "weight": "300 g", "development": "Baby can hear sounds", "comparison": "Like a banana 🍌"},
            24: {"length": "30 cm", "weight": "600 g", "development": "Baby lungs are developing and kicks are stronger", "comparison": "Like an ear of corn 🌽"},
            28: {"length": "37 cm", "weight": "1000 g", "development": "Baby eyes can open and close", "comparison": "Like an eggplant 🍆"},
            32: {"length": "42 cm", "weight": "1700 g", "development": "Baby  bones fully developed", "comparison": "Like a pineapple 🍍"},
            36: {"length": "47 cm", "weight": "2600 g", "development": "Baby is gaining weight rapidly", "comparison": "Like a honeydew melon 🍈"},
            40: {"length": "51 cm", "weight": "3400 g", "development": "Baby is full term", "comparison": "Like a small watermelon 🍉"}
        }

        # Find the closest week in our data
        closest_week = min(growth_data.keys(), key=lambda x: abs(x - weeks))

        return jsonify({
            "status": "success",
            "current_week": weeks,
            "baby_length": growth_data[closest_week]["length"],
            "baby_weight": growth_data[closest_week]["weight"],
            "development": growth_data[closest_week]["development"],
            "size_comparison": growth_data[closest_week]["comparison"]
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@api.route('/api/baby_groth_daybyday', methods=['GET'])
def baby_groth_daybyday():
    # Redirect misspelled URL to correct endpoint
    return baby_growth_daybyday()


kerala_foods = {
    'breakfast': [
        {'name': 'Puttu 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Idiyappam 🍜', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Appam 🥞', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Dosa 🥞', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Upma 🥣', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Pathiri 🥖', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Idli 🥮', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'low'},
        {'name': 'Velayappam 🥞', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Pazhampori 🍌', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'high'},
        {'name': 'Porotta 🫓', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Ragi Puttu 🥘', 'thyroid': 'normal', 'bp': 'high', 'sugar': 'low'},
        {'name': 'Wheat Puttu 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Mutta Curry 🥚', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Kadala Curry 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Sprouted Green Gram 🌱', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Banana Smoothie 🍌', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Ragi Dosa 🥞', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Steamed Banana 🍌', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Rice Ada 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Multigrain Puttu 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Green Gram Dosa 🥞', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'}
    ],
    'lunch': [
        {'name': 'Kerala Red Rice 🍚', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Matta Rice 🍚', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Sambar 🥘', 'thyroid': 'high', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Fish Curry 🐟', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Avial 🥗', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Thoran 🥬', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Kaalan 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Pulissery 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Meen Molee 🐠', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Beef Curry 🥩', 'thyroid': 'normal', 'bp': 'high', 'sugar': 'normal'},
        {'name': 'Chicken Curry 🍗', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Parippu Curry 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Beef Fry 🥩', 'thyroid': 'normal', 'bp': 'high', 'sugar': 'normal'},
        {'name': 'Koottu Curry 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Spinach Thoran 🥬', 'thyroid': 'high', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Drumstick Curry 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Sardine Curry 🐟', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Brown Rice 🍚', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Vendakka Curry 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Carrot Thoran 🥕', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Beetroot Thoran 🥗', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Green Peas Curry 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'}
    ],
    'dinner': [
        {'name': 'Kanji 🥣', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Pathiri 🥖', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Chapathi 🫓', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Porotta 🫓', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Appam 🥞', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Idiyappam 🍜', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Dosa 🥞', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Puttu 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Kappa 🥔', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'high'},
        {'name': 'Egg Curry 🥚', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Vegetable Stew 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Chicken Stew 🍗', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Beef Roast 🥩', 'thyroid': 'normal', 'bp': 'high', 'sugar': 'normal'},
        {'name': 'Rasam 🥣', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Oats Kanji 🥣', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Ragi Porridge 🥣', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Rice Soup 🥣', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Quinoa Upma 🥘', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Millet Dosa 🥞', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Green Gram Soup 🥣', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Sweet Potato Curry 🍠', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'}
    ],
    'snacks': [
        {'name': 'Dates 🍯', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'high'},
        {'name': 'Boiled Peanuts 🥜', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Fresh Orange 🍊', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'normal'},
        {'name': 'Tender Coconut Water 🥥', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Apple Slices 🍎', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Roasted Chana 🥜', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'},
        {'name': 'Pomegranate Seeds 🍎', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Banana 🍌', 'thyroid': 'normal', 'bp': 'low', 'sugar': 'normal'},
        {'name': 'Mixed Nuts 🥜', 'thyroid': 'normal', 'bp': 'normal', 'sugar': 'low'}
    ]
}

@api.route('/api/food_suggestions', methods=['GET'])
def food_suggestions():
    thyroid = request.args.get('thyroid', 'normal')
    bp = request.args.get('bp', 'normal')
    sugar = request.args.get('sugar', 'normal')

    if not thyroid or not bp or not sugar:
        return jsonify({'status': 'failed', 'message': 'Missing parameters'})

    diet_plan = {
        'breakfast': [],
        'lunch': [],
        'dinner': [],
        'snacks': []  # Added snacks category
    }
    
    for meal_type in kerala_foods:
        for food in kerala_foods[meal_type]:
            if (food['thyroid'] == thyroid or food['thyroid'] == 'normal') and \
               (food['bp'] == bp or food['bp'] == 'normal') and \
               (food['sugar'] == sugar or food['sugar'] == 'normal'):
                diet_plan[meal_type].append(food['name'])

    return jsonify({
        "status": "success",
        "suggestions": diet_plan
    })


def get_weekly_guidelines(week):
    guidelines = {
        'exercise_routines': [],
        'diet_plans': [],
        'dos_and_donts': []
    }
    
    # Exercise routines based on trimester
    if 1 <= week <= 12:  # First trimester
        guidelines['exercise_routines'] = [
            "Gentle walking for 15-20 minutes daily",
            "Prenatal yoga - focus on breathing exercises",
            "Light stretching exercises",
            "Kegel exercises - 3 sets daily"
        ]
    elif 13 <= week <= 26:  # Second trimester
        guidelines['exercise_routines'] = [
            "30-minute daily walks",
            "Swimming or water aerobics",
            "Modified yoga poses",
            "Light resistance exercises"
        ]
    else:  # Third trimester
        guidelines['exercise_routines'] = [
            "Short walks with frequent breaks",
            "Gentle stretching",
            "Pelvic floor exercises",
            "Pregnancy-safe balance exercises"
        ]
    
    # Diet plans by trimester
    if 1 <= week <= 12:
        guidelines['diet_plans'] = [
            "Small, frequent meals to combat nausea",
            "Folic acid-rich foods (leafy greens)",
            "Iron-rich foods (lean meats)",
            "Stay hydrated with water and clear fluids"
        ]
    elif 13 <= week <= 26:
        guidelines['diet_plans'] = [
            "Calcium-rich foods (dairy products)",
            "Protein-rich meals",
            "Complex carbohydrates",
            "Omega-3 rich foods (fish, nuts)"
        ]
    else:
        guidelines['diet_plans'] = [
            "High-fiber foods",
            "Small, frequent protein-rich meals",
            "Foods rich in Vitamin D",
            "Adequate water intake"
        ]
    
    # General do's and don'ts
    guidelines['dos_and_donts'] = {
        'dos': [
            "Take prenatal vitamins regularly",
            "Get adequate rest",
            "Stay hydrated",
            "Attend regular check-ups"
        ],
        'donts': [
            "Avoid alcohol and smoking",
            "Limit caffeine intake",
            "Avoid raw or undercooked foods",
            "Dont skip meals"
        ]
    }
    
    return guidelines

@api.route('/api/request_health_assistance', methods=['GET'])
def request_health_assistance():
    try:
        weight = float(request.args.get('weight', 0))
        bp = float(request.args.get('bp', 0))
        sugar = float(request.args.get('sugar', 0))
        symptoms = request.args.get('symptoms', '')
        pregnancy_week = int(request.args.get('pregnancy_week', 0))

        health_report = {
            'status': 'success',
            'weight_analysis': analyze_weight(weight),
            'bp_analysis': analyze_bp(bp),
            'sugar_analysis': analyze_sugar(sugar),
            'risk_level': calculate_risk_level(weight, bp, sugar),
            'recommendations': generate_recommendations(weight, bp, sugar, symptoms),
            'weekly_guidelines': get_weekly_guidelines(pregnancy_week)
        }

        return jsonify(health_report)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

def analyze_weight(weight):
    if weight < 45:
        return "Underweight - Please consult with your doctor about proper nutrition"
    elif weight < 65:
        return "Normal weight range for most pregnancies"
    else:
        return "Higher than average - Monitor weight gain closely"

def analyze_bp(bp):
    if bp < 60:
        return "Low blood pressure - Immediate medical attention recommended"
    elif bp < 80:
        return "Normal blood pressure range"
    elif bp < 90:
        return "Slightly elevated - Monitor closely"
    else:
        return "High blood pressure - Seek medical attention"

def analyze_sugar(sugar):
    if sugar < 70:
        return "Low blood sugar - Consider immediate glucose intake"
    elif sugar < 120:
        return "Normal blood sugar range"
    else:
        return "Elevated blood sugar - Dietary adjustments recommended"

def calculate_risk_level(weight, bp, sugar):
    risk_score = 0
    
    # Weight risk
    if weight < 45 or weight > 65:
        risk_score += 1
    
    # BP risk
    if bp < 60 or bp > 90:
        risk_score += 1
    
    # Sugar risk
    if sugar < 70 or sugar > 120:
        risk_score += 1
    
    if risk_score == 0:
        return "Low Risk"
    elif risk_score == 1:
        return "Moderate Risk"
    else:
        return "High Risk - Medical Consultation Recommended"

def generate_recommendations(weight, bp, sugar, symptoms):
    recommendations = []
    
    if weight < 45:
        recommendations.append("Increase protein and healthy calorie intake")
    elif weight > 65:
        recommendations.append("Monitor calorie intake and maintain regular exercise")
    
    if bp < 60:
        recommendations.append("Stay hydrated and avoid standing up quickly")
    elif bp > 90:
        recommendations.append("Reduce salt intake and rest frequently")
    
    if sugar < 70:
        recommendations.append("Keep quick-acting sugar sources handy")
    elif sugar > 120:
        recommendations.append("Follow a balanced diet and monitor carbohydrate intake")

    if symptoms:
        recommendations.append("Reported symptoms: " + symptoms + 
                            ". Document these for your next medical visit")
    
    return recommendations


@api.route('/api/user_view_doctors', methods=['GET'])
def user_view_doctors():
    
    

    query = """SELECT Doctor_id, Doctor_name, Specialization, Contact_number 
               FROM doctors 
              """
               
    doctors = select(query)
    
    if doctors:
        return jsonify({
            "status": "success",
            "doctors": doctors
        })
    return jsonify({
        "status": "success",
        "doctors": []
    })


@api.route('/api/appointment_tracker', methods=['GET'])
def appointment_tracker():
    try:
        last_appointment = request.args.get('last_appointment')
        next_appointment = request.args.get('next_appointment')
        user_id = request.args.get('user_id')

        if not all([last_appointment, next_appointment, user_id]):
            return jsonify({
                "status": "error",
                "message": "Missing required parameters"
            }), 400

        # Updated SQL query with backticks for table name
        query = """INSERT INTO `appoinment_dates` 
                   (`last_appointment`, `next_appointment`, `user_id`) 
                   VALUES ('%s', '%s', '%s')""" % (
                    last_appointment, next_appointment, user_id)
        
        ap_id = insert(query)
        
        if ap_id:
            return jsonify({
                "status": "success",
                "message": "Appointment tracked successfully",
                "ap_id": ap_id
            })
        else:
            return jsonify({
                "status": "error",
                "message": "Failed to insert appointment"
            }), 500
            
    except Exception as e:
        print("Error in appointment_tracker:", str(e))  # Debug log
        return jsonify({
            "status": "error", 
            "message": "An error occurred while tracking appointment"
        }), 500


@api.route('/api/check_appointment', methods=['GET'])
def check_appointment():
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                "status": "error",
                "message": "User ID is required"
            }), 400

        query = """SELECT last_appointment, next_appointment 
                  FROM appoinment_dates 
                  WHERE user_id = '%s'
                  ORDER BY next_appointment DESC""" % (user_id)
        
        appointments = select(query)
        
        if appointments:
            return jsonify({
                "status": "success",
                "appointments": appointments
            })
        return jsonify({
            "status": "success",
            "appointments": []
        })

    except Exception as e:
        print("Error in check_appointment:", str(e))
        return jsonify({
            "status": "error",
            "message": "An error occurred while checking appointments"
        }), 500



@api.route('/api/view_postpartum', methods=['GET', 'POST'])
def view_postpartum():
    data={}
    query = """SELECT *
                FROM postpartum"""
    results = select(query)
    print("Postpartum Results:", results)  # Debugging
    if results:
        data['status'] = 'success'
        data['postpartum'] = results
        
    else:
        data['status'] = 'failed'
    return jsonify(data)
       

@api.route('/api/getward')
def get_ward():
    try:
        q = "SELECT * FROM ward"
        wards = select(q)
        return jsonify({"status": "success", "data": wards,"method":'getward'})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ─────────────────────────────────────────────
#  ADMIN API ENDPOINTS
# ─────────────────────────────────────────────

@api.route('/api/admin/view_users', methods=['GET'])
def admin_view_users():
    try:
        q = """SELECT u.*, w.Ward_name
               FROM users u
               LEFT JOIN ward w ON u.Ward_id = w.Ward_id
               ORDER BY u.Users_id DESC"""
        users = select(q)
        return jsonify({"status": "success", "data": users})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/admin/add_ward', methods=['GET'])
def admin_add_ward():
    try:
        ward_name = request.args.get('ward_name')
        if not ward_name:
            return jsonify({"status": "error", "message": "Ward name is required"}), 400
        q = "INSERT INTO ward (Ward_name) VALUES ('%s')" % (ward_name)
        insert(q)
        return jsonify({"status": "success", "message": "Ward added successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/admin/delete_ward', methods=['GET'])
def admin_delete_ward():
    try:
        ward_id = request.args.get('ward_id')
        if not ward_id:
            return jsonify({"status": "error", "message": "Ward ID is required"}), 400
        q = "DELETE FROM ward WHERE Ward_id = '%s'" % (ward_id)
        delete(q)
        return jsonify({"status": "success", "message": "Ward deleted successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/admin/add_doctor', methods=['GET'])
def admin_add_doctor():
    try:
        first_name = request.args.get('first_name')
        last_name = request.args.get('last_name')
        place = request.args.get('place')
        phone = request.args.get('phone')
        email = request.args.get('email')
        specialization = request.args.get('specialization')
        if not all([first_name, last_name, place, phone, email, specialization]):
            return jsonify({"status": "error", "message": "All fields are required"}), 400
        q = """INSERT INTO doctor (First_Name, Last_Name, Place, Phone, Email, Specialization)
               VALUES ('%s','%s','%s','%s','%s','%s')""" % (
            first_name, last_name, place, phone, email, specialization)
        insert(q)
        return jsonify({"status": "success", "message": "Doctor added successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/admin/delete_doctor', methods=['GET'])
def admin_delete_doctor():
    try:
        doc_id = request.args.get('doc_id')
        if not doc_id:
            return jsonify({"status": "error", "message": "Doctor ID is required"}), 400
        q = "DELETE FROM doctor WHERE Doc_id = '%s'" % (doc_id)
        delete(q)
        return jsonify({"status": "success", "message": "Doctor deleted successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/admin/add_govt_post', methods=['GET'])
def admin_add_govt_post():
    try:
        post_name = request.args.get('post_name')
        description = request.args.get('description')
        links = request.args.get('links', '')
        if not all([post_name, description]):
            return jsonify({"status": "error", "message": "Post name and description are required"}), 400
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        q = """INSERT INTO kerala_government_posts (Post_name, Description, Links, File, Datetime)
               VALUES ('%s','%s','%s', null, '%s')""" % (post_name, description, links, current_time)
        insert(q)
        return jsonify({"status": "success", "message": "Government post added successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/admin/delete_govt_post', methods=['GET'])
def admin_delete_govt_post():
    try:
        post_id = request.args.get('post_id')
        if not post_id:
            return jsonify({"status": "error", "message": "Post ID is required"}), 400
        q = "DELETE FROM kerala_government_posts WHERE Kg_id = '%s'" % (post_id)
        delete(q)
        return jsonify({"status": "success", "message": "Post deleted successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/admin/all_complaints', methods=['GET'])
def admin_all_complaints():
    try:
        q = """SELECT c.*, c.Complaint_id as Complaint, u.Full_Name
               FROM complaints c
               LEFT JOIN users u ON c.User_id = u.Users_id
               ORDER BY c.Date DESC"""
        complaints = select(q)
        return jsonify({"status": "success", "data": complaints})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/admin/reply_complaint', methods=['GET'])
def admin_reply_complaint():
    try:
        complaint_id = request.args.get('complaint_id')
        reply = request.args.get('reply')
        if not complaint_id or not reply:
            return jsonify({"status": "error", "message": "Complaint ID and reply are required"}), 400
        q = "UPDATE complaints SET Reply = '%s' WHERE Comp_id = '%s'" % (reply, complaint_id)
        update(q)
        return jsonify({"status": "success", "message": "Reply submitted successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ─────────────────────────────────────────────
#  ASHA WORKER API ENDPOINTS
# ─────────────────────────────────────────────

@api.route('/api/asha/profile', methods=['GET'])
def asha_profile():
    try:
        login_id = request.args.get('login_id')
        if not login_id:
            return jsonify({"status": "error", "message": "Login ID is required"}), 400
        q = """SELECT a.*, w.Ward_name
               FROM asha_worker a
               LEFT JOIN ward w ON a.Ward_id = w.Ward_id
               WHERE a.Login_id = '%s'""" % (login_id)
        profile = select(q)
        if profile:
            return jsonify({"status": "success", "data": profile[0]})
        return jsonify({"status": "error", "message": "Profile not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api.route('/api/asha/view_users', methods=['GET'])
def asha_view_users():
    try:
        login_id = request.args.get('login_id')
        if not login_id:
            return jsonify({"status": "error", "message": "Login ID is required"}), 400
        q = """SELECT u.*, w.Ward_name
               FROM users u
               INNER JOIN ward w ON u.Ward_id = w.Ward_id
               INNER JOIN asha_worker a ON w.Ward_id = a.Ward_id
               WHERE a.Login_id = '%s'""" % (login_id)
        users = select(q)
        return jsonify({"status": "success", "data": users})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

