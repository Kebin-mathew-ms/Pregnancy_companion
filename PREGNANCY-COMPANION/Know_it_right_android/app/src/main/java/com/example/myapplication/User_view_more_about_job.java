package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

public class User_view_more_about_job extends AppCompatActivity implements JsonResponse {

    TextView t1,t2,t3,t4,t5,t6,t7,t8;
    Button b1;
    SharedPreferences sh;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_view_more_about_job);

        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        t1=(TextView) findViewById(R.id.tvcname);
        t2=(TextView) findViewById(R.id.tvtitle);
        t3=(TextView) findViewById(R.id.tvcat);
        t4=(TextView) findViewById(R.id.tvplace);
        t5=(TextView) findViewById(R.id.tvphone);
        t6=(TextView) findViewById(R.id.tvemail);
        t7=(TextView) findViewById(R.id.tvdes);
        t8=(TextView) findViewById(R.id.tvskill);

        b1=(Button) findViewById(R.id.btapply);

        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse)User_view_more_about_job.this;
        String q="User_view_more_about_job?job_vacancy_ids="+sh.getString("job_vacancy_ids","");
        jr.execute(q);

        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                JsonReq jr= new JsonReq();
                jr.json_response=(JsonResponse)User_view_more_about_job.this;
                String q="User_apply_job?job_vacancy_ids="+sh.getString("job_vacancy_ids","")+"&login_id="+sh.getString("login_id","");
                jr.execute(q);

            }
        });

    }


    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try {
            String method=jo.getString("method");
            if(method.equalsIgnoreCase("User_view_more_about_job")) {

                String status = jo.getString("status");
                Log.d("result", status);

//			Toast.makeText(getApplicationContext(),status, Toast.LENGTH_LONG).show();
                if (status.equalsIgnoreCase("success")) {
                    JSONArray ja1 = (JSONArray) jo.getJSONArray("data");
                    t1.setText("Company Name : "+ja1.getJSONObject(0).getString("company_name"));
                    t2.setText("Job Title : "+ja1.getJSONObject(0).getString("job_title"));
                    t3.setText("Category : "+ja1.getJSONObject(0).getString("job_category_name"));
                    t4.setText("Place : "+ja1.getJSONObject(0).getString("place"));
                    t5.setText("Contact Number : "+ja1.getJSONObject(0).getString("phone"));
                    t6.setText("Email-ID : "+ja1.getJSONObject(0).getString("email"));
                    t7.setText("Description : "+ja1.getJSONObject(0).getString("job_description"));
                    t8.setText("Skills : "+ja1.getJSONObject(0).getString("skills"));


                } else {
                    Toast.makeText(getApplicationContext(), "Sorry No Data", Toast.LENGTH_LONG).show();
                }
            }

            if(method.equalsIgnoreCase("User_apply_job")) {

                String status = jo.getString("status");
                Log.d("result", status);

//			Toast.makeText(getApplicationContext(),status, Toast.LENGTH_LONG).show();
                if (status.equalsIgnoreCase("success")) {
                   Toast.makeText(getApplicationContext(),"Success",Toast.LENGTH_LONG).show();
                   startActivity(new Intent(getApplicationContext(),User_home.class));
                } else {
                    Toast.makeText(getApplicationContext(), "Sorry", Toast.LENGTH_LONG).show();
                }
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
        if(sh.getString("back","").equalsIgnoreCase("User_view_company_jobs")){

            Intent b=new Intent(getApplicationContext(),User_view_company_jobs.class);
            startActivity(b);
        }
        else if(sh.getString("back","").equalsIgnoreCase("User_view_job_vacancy")){

            Intent b=new Intent(getApplicationContext(),User_view_job_vacancy.class);
            startActivity(b);
        }

    }
}