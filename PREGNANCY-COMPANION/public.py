from flask import *
from database import*


public=Blueprint('public',__name__)

@public.route('/')
def index():
    
   
    asha=select("SELECT COUNT(*)as c FROM asha_worker")
   
    c=asha[0]['c']
    print(c,'asha')
    do=select("SELECT COUNT(*)AS doc FROM `doctor`")
    doc=do[0]['doc']
    abc=select("SELECT COUNT(*)AS us FROM `users`")
    u=abc[0]['us']
    print(u,'//////////////')
    return render_template('index.html',asha=c,doc=doc,u=u)

@public.route('/login',methods=['GET','POST'])
def login():
    if 'submit' in request.form:
        username=request.form['username']
        password=request.form['password']
        a="select * from login where uname='%s' and psd='%s'"%(username,password)
        a1=select(a)
        
        if a1:
            session['login_id']=a1[0]['login_id']
            if a1[0]['utype']=='admin':
                return redirect(url_for('admin.admin_home'))
            
            elif a1[0]['utype']=='asha':
                return redirect(url_for('asha.asha_home'))
            
    return render_template('login.html')


@public.route('/asha_worker_registration',methods=['GET','POST'])
def asha_worker_registration():
    data={}
    data['wards']=select("SELECT * FROM ward")
    if 'submit' in request.form:
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        gender = request.form['gender']
        place = request.form['place']
        email = request.form['email']
        phone = request.form['phone']
        ward_id = request.form['ward_id']
        username = request.form['username']
        password = request.form['password']

        # First insert into login table
        q = "INSERT INTO login(uname, psd, utype) VALUES('%s','%s','asha')" % (username, password)
        login_id = insert(q)

        # Then insert into asha_worker table
        q = "INSERT INTO asha_worker(login_id, ward_id, first_name, last_name, gender, place, email, phone) VALUES('%s','%s','%s','%s','%s','%s','%s','%s')" % (
            login_id, ward_id, firstname, lastname, gender, place, email, phone)
        insert(q)
        return redirect(url_for('public.login'))
    return render_template('asha_registration.html',data=data)

