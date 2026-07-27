package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

public class User_view_internship_details extends AppCompatActivity implements JsonResponse {


    SharedPreferences sh;
    TextView t1,t2,t3,t4;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_view_internship_details);
        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        t1=(TextView) findViewById(R.id.tvtitle);
        t2=(TextView) findViewById(R.id.tvduration);
        t3=(TextView) findViewById(R.id.tvfees);
        t4=(TextView) findViewById(R.id.tvsyllabus);


        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse)User_view_internship_details.this;
        String q="User_view_internship_details?internship_ids="+sh.getString("internship_ids","");
        jr.execute(q);

    }


    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try
        {

            String method=jo.getString("method");

            if(method.equalsIgnoreCase("User_view_internship_details")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    JSONArray ja1 = (JSONArray) jo.getJSONArray("data");
                    t1.setText("Title    : "+ja1.getJSONObject(0).getString("title"));
                    t2.setText("Duration : "+ja1.getJSONObject(0).getString("duration"));
                    t3.setText("Fees     : "+ja1.getJSONObject(0).getString("fees"));
                    t4.setText("Syllabus : "+ja1.getJSONObject(0).getString("syllabus"));


                }
                else{

                    Toast.makeText(getApplicationContext(), "No Data Available", Toast.LENGTH_LONG).show();
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
        startActivity(new Intent(getApplicationContext(), User_view_internship.class));
    }
}