from flask import *
from database import*
from datetime import datetime
from werkzeug.utils import secure_filename
import os

admin=Blueprint('admin',__name__)

@admin.route('/admin_home')
def admin_home():
    return render_template('admin_home.html')


@admin.route('/admin_manage_ward', methods=['GET', 'POST'])
def admin_manage_ward():
    data={}
    if request.method == 'POST':
        wardname = request.form['ward_name']
        # Insert new ward
        q = "INSERT INTO ward(Ward_name) VALUES('%s')"%(wardname)
        insert(q)
        return redirect('admin_manage_ward')
    
    # Fetch all wards for display
    q = "SELECT * FROM ward"
    res = select(q)
    data['wards'] = res
    return render_template('admin_manage_ward.html', data=data)

@admin.route('/delete_ward/<int:id>')
def delete_ward(id):
    q = "DELETE FROM ward WHERE Ward_id='%s'"%(id)
    delete(q)
    return redirect('/admin_manage_ward')


@admin.route('/admin_view_asha_workers', methods=['GET', 'POST'])
def admin_view_asha_workers():
    data={}
    
    q = "SELECT * FROM asha_worker inner join ward on asha_worker.Ward_id=ward.Ward_id"
    res = select(q)
    data['asha_workers'] = res
    
    return render_template('admin_view_asha_workers.html', data=data)

@admin.route('/admin_manage_kerala_gn_post', methods=['GET', 'POST'])
def admin_manage_kerala_gn_post():
    data = {}
    if request.method == 'POST':
        postname = request.form['post_name']
        description = request.form['description']
        links = request.form['links']
        
        # Handle file upload
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '':
                # Ensure the upload folder exists
                upload_folder = 'static/uploads/gn_posts'
                if not os.path.exists(upload_folder):
                    os.makedirs(upload_folder)
                
                # Save the file
                filename = secure_filename(file.filename)
                file.save(os.path.join(upload_folder, filename))
            else:
                filename = None
        else:
            filename = None
        
        current_time = datetime.now()
        
        q = """INSERT INTO kerala_government_posts(Post_name, Description, Links, File, Datetime) 
               VALUES('%s','%s','%s','%s','%s')""" % (
            postname, description, links, filename, current_time
        )
        insert(q)
        return redirect('admin_manage_kerala_gn_post')
    
    # Fetch all posts for display
    q = "SELECT * FROM kerala_government_posts ORDER BY Datetime DESC"
    res = select(q)
    data['posts'] = res
    return render_template('admin_manage_kerala_gn_post.html', data=data)

@admin.route('/delete_gn_post/<int:id>')
def delete_gn_post(id):
    
    q = "DELETE FROM kerala_government_posts WHERE Kg_id='%s'" % (id)
    delete(q)
    
    return redirect('/admin_manage_kerala_gn_post')


@admin.route('/admin_view_users', methods=['GET', 'POST'])
def admin_view_users():
    data={}
    
    q = "SELECT * FROM users INNER JOIN ward USING(Ward_id)"
    res = select(q)
    data['users'] = res
    
    return render_template('admin_view_users.html', data=data)

@admin.route('/admin_manage_doctor', methods=['GET', 'POST'])
def admin_manage_doctor():
    data = {}
    if request.method == 'POST':
        fname = request.form['first_name']
        lname = request.form['last_name']
        place = request.form['place']
        phone = request.form['phone']
        email = request.form['email']
        specialization = request.form['specialization']
        
        q = """INSERT INTO doctor(First_Name, Last_Name, Place, Phone, Email, Specialization) 
               VALUES('%s','%s','%s','%s','%s','%s')""" % (
            fname, lname, place, phone, email, specialization
        )
        insert(q)
        return redirect('admin_manage_doctor')
    
    q = "SELECT * FROM doctor"
    res = select(q)
    data['doctors'] = res
    return render_template('admin_manage_doctor.html', data=data)

@admin.route('/delete_doctor/<int:id>')
def delete_doctor(id):
    q = "DELETE FROM doctor WHERE Doc_id='%s'" % (id)
    delete(q)
    return redirect('/admin_manage_doctor')

@admin.route('/admin_manage_complaints', methods=['GET', 'POST'])
def admin_manage_complaints():
    data = {}
    
    if request.method == 'POST':
        complaint_id = request.form['complaint_id']
        reply = request.form['reply']
        
        q = "UPDATE complaints SET Reply='%s' WHERE Comp_id='%s'" % (reply, complaint_id)
        update(q)
        return redirect('/admin_manage_complaints')
    
    q = """SELECT complaints.*, users.Full_Name 
           FROM complaints 
           INNER JOIN users ON complaints.User_id=users.Users_id 
           ORDER BY Date DESC"""
    res = select(q)
    data['complaints'] = res
    return render_template('admin_manage_complaints.html', data=data)