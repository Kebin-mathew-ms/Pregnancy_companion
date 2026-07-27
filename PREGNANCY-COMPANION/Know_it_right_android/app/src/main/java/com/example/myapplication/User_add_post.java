package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

public class User_add_post extends AppCompatActivity  implements JsonResponse {
    EditText e0,e1;
    Button b1;
    ListView l1;
    String c_title,complaint,log_id;
    String[] date,c_titles,complaints,statuss,val,solution;
    SharedPreferences sh;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_add_post);
        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());


        log_id = sh.getString("login_id","");


        e0=(EditText)findViewById(R.id.complaint_tt);
        e1=(EditText)findViewById(R.id.complaint);
        b1=(Button)findViewById(R.id.scomplaint);




        b1.setOnClickListener(new View.OnClickListener() {


            @Override
            public void onClick(View arg0) {
                // TODO Auto-generated method stub

                c_title=e0.getText().toString();
                complaint=e1.getText().toString();
                JsonReq jr= new JsonReq();
                jr.json_response=(JsonResponse) User_add_post.this;
                String q="User_add_post?complaint="+complaint+"&log_id="+log_id+"&c_title="+c_title;
                q.replace("", "%20");
                jr.execute(q);

            }
        });


    }

    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try
        {

            String method=jo.getString("method");


            if(method.equalsIgnoreCase("User_add_post")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    Toast.makeText(getApplicationContext(), "Successfully Added", Toast.LENGTH_LONG).show();
//
                    startActivity(new Intent(getApplicationContext(), User_post.class));
                }
                else
                {
                    Toast.makeText(getApplicationContext(), "Failed....", Toast.LENGTH_LONG).show();
                }
            }

        }
        catch(Exception e){
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "haii"+e, Toast.LENGTH_LONG).show();
        }



    }
    @Override
    public void onBackPressed() {
        // TODO Auto-generated method stub
        super.onBackPressed();
        startActivity(new Intent(getApplicationContext(), User_post.class));
    }

}
