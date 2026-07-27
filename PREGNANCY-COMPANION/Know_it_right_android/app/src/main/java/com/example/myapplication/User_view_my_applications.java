package com.example.myapplication;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
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

public class User_view_my_applications extends AppCompatActivity implements JsonResponse{

    ListView l1;
    String[] job_vacancy_id,job_category_id,company_id,job_title,job_description,skills,job_category_name,company_name,ap_date,ap_status,val;
    public static String job_vacancy_ids,job_category_ids,company_ids;

    SharedPreferences sh;
    TextView t1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_view_my_applications);

        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        l1=(ListView)findViewById(R.id.lvvacancy);

        l1.setVisibility(View.GONE);
        t1=(TextView) findViewById(R.id.tvst);
        t1.setVisibility(View.GONE);


        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse)User_view_my_applications.this;
        String q="User_view_my_applications?login_id="+sh.getString("login_id","");
        jr.execute(q);

    }


    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try
        {

            String method=jo.getString("method");

            if(method.equalsIgnoreCase("User_view_my_applications")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    JSONArray ja=(JSONArray)jo.getJSONArray("data");

                    job_vacancy_id=new String[ja.length()];
                    job_category_id= new String[ja.length()];
                    company_id= new String[ja.length()];
                    job_title=new String[ja.length()];
                    job_description=new String[ja.length()];
                    skills=new String[ja.length()];
                    job_category_name=new String[ja.length()];
                    company_name=new String[ja.length()];
                    ap_date=new String[ja.length()];
                    ap_status=new String[ja.length()];
                    val= new String[ja.length()];

                    for(int i=0;i<ja.length();i++)
                    {
                        job_vacancy_id[i]=ja.getJSONObject(i).getString("job_vacancy_id");
                        job_category_id[i]=ja.getJSONObject(i).getString("job_category_id");
                        company_id[i]=ja.getJSONObject(i).getString("company_id");
                        job_title[i]=ja.getJSONObject(i).getString("job_title");
                        job_description[i]=ja.getJSONObject(i).getString("job_description");
                        skills[i]=ja.getJSONObject(i).getString("skills");
                        job_category_name[i]=ja.getJSONObject(i).getString("job_category_name");
                        company_name[i]=ja.getJSONObject(i).getString("company_name");
                        ap_date[i]=ja.getJSONObject(i).getString("ap_date");
                        ap_status[i]=ja.getJSONObject(i).getString("ap_status");

                        val[i]="Title : "+job_title[i]+"\nCompany Name : "+company_name[i]
                                +"\nJob Description : "+job_description[i]+"\nskills : "+skills[i]
                        +"\nStatus : "+ap_status[i]+"\nDate : "+ap_date[i];
                    }

                    l1.setVisibility(View.VISIBLE);
                    t1.setVisibility(View.GONE);
                    l1.setAdapter(new ArrayAdapter<String>(getApplicationContext(), R.layout.cust_complaints,val));

                }
                else{
                    l1.setVisibility(View.GONE);
                    t1.setVisibility(View.VISIBLE);
                    Toast.makeText(getApplicationContext(), "No Job Vacancies Available", Toast.LENGTH_LONG).show();

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
        startActivity(new Intent(getApplicationContext(), User_home.class));
    }


}