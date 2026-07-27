package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

public class User_registration extends AppCompatActivity implements JsonResponse{

    EditText e1,e2,e3,e4,e5,e6,e7;
    Spinner s1;
    Button b1;
    String bname,bnum,place,phone,email,username,password;
    String[] area_name,area_id;
    String areaid;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_registration);
        e1=(EditText)findViewById(R.id.etbuilding);
        e2=(EditText)findViewById(R.id.etbnum);
        e3=(EditText)findViewById(R.id.etplace);
        e4=(EditText)findViewById(R.id.etcontact);
        e5=(EditText)findViewById(R.id.etemail);
        e6=(EditText)findViewById(R.id.editText1);
        e7=(EditText)findViewById(R.id.editText2);



        b1=(Button)findViewById(R.id.button1);
        b1.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View arg0) {
                // TODO Auto-generated method stub
                bname=e1.getText().toString();
                bnum=e2.getText().toString();
                place=e3.getText().toString();
                phone=e4.getText().toString();
                email=e5.getText().toString();
                username=e6.getText().toString();
                password=e7.getText().toString();





                if(bname.equalsIgnoreCase("")){
                    Toast.makeText(getApplicationContext(), "Enter First Name", Toast.LENGTH_LONG).show();
                    e1.setError("Enter First Name");
                    e1.setFocusable(true);

                }
                else if(bnum.equalsIgnoreCase("")){
                    Toast.makeText(getApplicationContext(), "Enter Last Name", Toast.LENGTH_LONG).show();
                    e2.setError("Enter Last Name");
                    e2.setFocusable(true);

                }
                else if(place.equalsIgnoreCase("")){
                    Toast.makeText(getApplicationContext(), "Enter Place", Toast.LENGTH_LONG).show();
                    e3.setError("Enter Plac");
                    e3.setFocusable(true);

                }
                else if(phone.equalsIgnoreCase("")){
                    Toast.makeText(getApplicationContext(), "Enter Contact Number", Toast.LENGTH_LONG).show();
                    e4.setError("Enter Contact Number");
                    e4.setFocusable(true);

                }
                else if(email.equalsIgnoreCase("")){
                    Toast.makeText(getApplicationContext(), "Enter Email ID", Toast.LENGTH_LONG).show();
                    e5.setError("Enter Email ID");
                    e5.setFocusable(true);
                }



                else if(username.equalsIgnoreCase("")){
                    Toast.makeText(getApplicationContext(), "Enter Username", Toast.LENGTH_LONG).show();
                    e6.setError("Enter Username");
                    e6.setFocusable(true);

                }

                else if(password.equalsIgnoreCase("")){
                    Toast.makeText(getApplicationContext(), "Enter Password", Toast.LENGTH_LONG).show();
                    e7.setError("Enter Password");
                    e7.setFocusable(true);
                }
                else {
                    JsonReq jr= new JsonReq();
                    jr.json_response=(JsonResponse) User_registration.this;
                    String q="register?bname="+bname+"&bnum="+bnum+"&place="+place+"&username="+username+"&password="+password+"&phone="+phone+"&email="+email;
                    q.replace("", "%20");
                    jr.execute(q);
                }
            }
        });

    }





    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub
        try
        {

            String method=jo.getString("method");

            if (method.equalsIgnoreCase("register")) {

                String status = jo.getString("status");

                if (status.equalsIgnoreCase("Success")) {

//                    Toast.makeText(getApplicationContext(), "Please Wait", Toast.LENGTH_LONG).show();
//
//                    new Handler().postDelayed(new Runnable() {
//                        @Override
//                        public void run() {
//                            // Start the Login activity after a 2-second delay
//
                            startActivity(new Intent(getApplicationContext(), Login.class));
//                            Toast.makeText(getApplicationContext(), "Registration Successfully Completed", Toast.LENGTH_LONG).show();
//
//                        }
//                    }, 5000); // Delay in milliseconds (2000ms = 2 seconds)
                } else {
                    Toast.makeText(getApplicationContext(), "Username Already Exists....", Toast.LENGTH_LONG).show();
                }
            }

//            if(method.equalsIgnoreCase("register")){
//
//                String status=jo.getString("status");
//                if(status.equalsIgnoreCase("Success"))
//                {
//                    Toast.makeText(getApplicationContext(), "Registered Successfully", Toast.LENGTH_LONG).show();
////
//                    startActivity(new Intent(getApplicationContext(), Login.class));
//                }
//
//                else
//                {
//                    Toast.makeText(getApplicationContext(), "Username Already Exist....", Toast.LENGTH_LONG).show();
//                }
//            }

        }
        catch(Exception e){
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "haii"+e, Toast.LENGTH_LONG).show();
        }



    }






}
