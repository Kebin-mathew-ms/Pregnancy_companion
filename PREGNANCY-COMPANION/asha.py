from flask import *
from database import*

asha=Blueprint('asha',__name__)

@asha.route('/asha_home')
def asha_home():
    return render_template('asha_home.html')
@asha.route('/view_profile')
def view_profile():
    data={}
    lid=session['login_id']
    
   
    q="""
    SELECT * FROM `asha_worker` 
INNER JOIN `ward` USING(Ward_id) WHERE Login_id='%s'"""%(lid)
    data['profile']=select(q)
    return render_template('asha_profile.html',data=data)


@asha.route('/asha_view_users',methods=['GET','POST'])
def asha_view_users():
    data={}
    obj="""
    SELECT u.Users_id, u.Login_id, u.Ward_id, u.Full_Name, u.Age, u.LMP_date, 
       u.Blood_Group, u.Blood_Pressure, u.Thyroid_Levels, w.Ward_name
FROM Users u
INNER JOIN Ward w ON u.Ward_id = w.Ward_id
INNER JOIN `asha_worker` a ON w.Ward_id = a.Ward_id
WHERE a.Login_id = '%s';"""%(session['login_id'])
    data['users']=select(obj)
    return render_template('asha_view_users.html',data=data)


