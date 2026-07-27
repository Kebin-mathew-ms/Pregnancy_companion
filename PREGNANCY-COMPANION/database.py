import mysql.connector
user='root'
password='root'
database='maternal_health_system'

def select(q):
    con=mysql.connector.connect(user=user,password=password,host='localhost',database=database)
    cur=con.cursor(dictionary=True)
    cur.execute(q)
    result=cur.fetchall()
    cur.close()
    con.close
    return result

def insert(q):
    con=mysql.connector.connect(user=user,password=password,host='localhost',database=database)
    cur=con.cursor(dictionary=True)
    cur.execute(q)
    con.commit
    result=cur.lastrowid
    cur.close
    con.close
    return result

def delete(q):
    con=mysql.connector.connect(user=user,password=password,host='localhost',database=database)
    cur=con.cursor(dictionary=True)
    cur.execute(q)
    con.commit
    result=cur.lastrowid
    cur.close
    con.close

def update(q):
    con=mysql.connector.connect(user=user,password=password,host='localhost',database=database)
    cur=con.cursor(dictionary=True)
    cur.execute(q)
    con.commit
    result=cur.lastrowid
    cur.close
    con.close