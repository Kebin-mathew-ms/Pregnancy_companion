package com.example.myapplication;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

public class Login extends Activity implements JsonResponse {

    EditText ed_uname,ed_pass;
    Button bt_login,bt_cancel,bt_register,bt_rregister;
    String uname="",pass="";
    TextView t1,t2,t3;
    SharedPreferences sh;
    public static String login_id,type;


    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        setContentView(R.layout.activity_login);

        sh=PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        ed_uname=(EditText) findViewById(R.id.editText1);
        ed_pass=(EditText) findViewById(R.id.editText2);

        t1=(TextView)findViewById(R.id.tvuser);

        bt_login=(Button) findViewById(R.id.button1);



        bt_login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View arg0) {

//				Toast.makeText(getApplicationContext(), "hii", Toast.LENGTH_LONG).show();
                uname=ed_uname.getText().toString();
                pass=ed_pass.getText().toString();
                JsonReq JR=new JsonReq();
                JR.json_response=(JsonResponse)Login.this;
                String q = "login?uname="+uname+"&password="+pass;
                JR.execute(q);
                Log.d("pearl",q);
            }
        });

        t1.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View arg0) {
                // TODO Auto-generated method stub

                startActivity(new Intent(getApplicationContext(),User_registration.class));

            }
        });





    }


    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try {
            String status=jo.getString("status");
            Log.d("result", status);

//			Toast.makeText(getApplicationContext(),status, Toast.LENGTH_LONG).show();
            if(status.equalsIgnoreCase("success"))
            {
                JSONArray ja1=(JSONArray)jo.getJSONArray("data");
                login_id=ja1.getJSONObject(0).getString("login_id");
                type=ja1.getJSONObject(0).getString("usertype");
//                Toast.makeText(getApplicationContext(), login_id, Toast.LENGTH_LONG).show();
                Editor ed=sh.edit();
                ed.putString("login_id", login_id);
                ed.putString("type", type);

                ed.commit();

                if(type.equalsIgnoreCase("User"))
                {
//					Toast.makeText(getApplicationContext()," Login Success"+login_id, Toast.LENGTH_LONG).show();
                    startActivity(new Intent(getApplicationContext(),Loading_page1.class));
                }

                else
                {
                    Toast.makeText(getApplicationContext(), "Invalid Username Or Password",Toast.LENGTH_LONG ).show();
                }
            }
            else
            {
                Toast.makeText(getApplicationContext(), "login Failed - Invalid Username Or Password",Toast.LENGTH_LONG ).show();
            }
        } catch (Exception e){
            // TODO: handle exception
            Toast.makeText(getApplicationContext(), "Exception : " + e,Toast.LENGTH_LONG ).show();

        }
    }

    public void onBackPressed()
    {
        // TODO Auto-generated method stub
        super.onBackPressed();
        Intent b=new Intent(getApplicationContext(),IPSetting.class);
        startActivity(b);
    }

}
