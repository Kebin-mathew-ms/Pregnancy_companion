package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

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

public class User_view_companies extends AppCompatActivity implements JsonResponse, AdapterView.OnItemClickListener  {

    ListView l1;
    String[] job_vacancy_id,job_category_id,company_id,job_title,job_description,skills,job_category_name,company_name,place,val;
    public static String job_vacancy_ids,job_category_ids,company_ids;

    SharedPreferences sh;
    TextView t1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_view_companies);
        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        l1=(ListView)findViewById(R.id.lvvacancy);
        l1.setOnItemClickListener(this);
        l1.setVisibility(View.GONE);
        t1=(TextView) findViewById(R.id.tvst);
        t1.setVisibility(View.GONE);


        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse)User_view_companies.this;
        String q="User_view_companies?login_id="+sh.getString("login_id","");
        jr.execute(q);

    }


    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try
        {

            String method=jo.getString("method");

            if(method.equalsIgnoreCase("User_view_companies")){

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
                    place=new String[ja.length()];
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
                        place[i]=ja.getJSONObject(i).getString("place");
                        val[i]="Company Name : "+company_name[i]
                                +"\nPlace : "+place[i];
                    }

                    l1.setVisibility(View.VISIBLE);
                    t1.setVisibility(View.GONE);
//                    l1.setAdapter(new ArrayAdapter<String>(getApplicationContext(), R.layout.cust_complaints,val));

                    Cust_view_companies cc=new Cust_view_companies(this,company_name,place);
                    l1.setAdapter(cc);

                }
                else{
                    l1.setVisibility(View.GONE);
                    t1.setVisibility(View.VISIBLE);
                    Toast.makeText(getApplicationContext(), "No Companies Available", Toast.LENGTH_LONG).show();
                }
            }

        }
        catch(Exception e){
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "haii"+e, Toast.LENGTH_LONG).show();
        }



    }


    @Override
    public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3) {
        // TODO Auto-generated method stub

        job_vacancy_ids=job_vacancy_id[arg2];
        job_category_ids=job_category_id[arg2];
        company_ids=company_id[arg2];

//
        SharedPreferences.Editor ed=sh.edit();
        ed.putString("company_ids", company_ids);
        ed.putString("back", "User_view_companies");
        ed.commit();

        startActivity(new Intent(getApplicationContext(), User_view_company_jobs.class));

//
//        final CharSequence[] items = {"","Add To Cart", "Cancel"};
//
//        AlertDialog.Builder builder = new AlertDialog.Builder(User_view_job_vacancy.this);
//        // builder.setTitle("Add Photo!");
//        builder.setItems(items, new DialogInterface.OnClickListener() {
//            @Override
//            public void onClick(DialogInterface dialog, int item) {
//
//                if (items[item].equals("Shop Details")) {
//
//                    startActivity(new Intent(getApplicationContext(), View_shops.class));
////                        Toast.makeText(getApplicationContext(), "Add To Cart", Toast.LENGTH_LONG).show();
//                }
//                else if (items[item].equals("Add To Cart")) {
//
//                    startActivity(new Intent(getApplicationContext(), Add_to_cart.class));
////                        Toast.makeText(getApplicationContext(), "Add To Cart", Toast.LENGTH_LONG).show();
//                }else if (items[item].equals("Cancel")) {
//                    dialog.dismiss();
//                }
//            }
//
//        });
//
//        builder.show();
//
//	Intent i = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
//        startActivityForResult(i, GALLERY_CODE);

    }
    @Override
    public void onBackPressed() {
        // TODO Auto-generated method stub
        super.onBackPressed();
        startActivity(new Intent(getApplicationContext(), User_home.class));
    }
}