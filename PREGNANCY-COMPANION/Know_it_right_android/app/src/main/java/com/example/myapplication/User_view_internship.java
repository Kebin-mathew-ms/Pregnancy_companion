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

public class User_view_internship extends AppCompatActivity implements JsonResponse, AdapterView.OnItemClickListener  {

    ListView l1;
    String[] internship_id,title,company_name,company_id,duration,fees,syllabus,val;
    public static String internship_ids,company_ids;


    SharedPreferences sh;
    TextView t1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_view_internship);
        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        l1=(ListView)findViewById(R.id.lvvacancy);
        l1.setOnItemClickListener(this);
        l1.setVisibility(View.GONE);
        t1=(TextView) findViewById(R.id.tvst);
        t1.setVisibility(View.GONE);


        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse)User_view_internship.this;
        String q="User_view_internship";
        jr.execute(q);

    }


    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try
        {

            String method=jo.getString("method");

            if(method.equalsIgnoreCase("User_view_internship")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    JSONArray ja=(JSONArray)jo.getJSONArray("data");


                    internship_id=new String[ja.length()];
                    company_id= new String[ja.length()];
                    company_name= new String[ja.length()];
                    title=new String[ja.length()];
                    duration=new String[ja.length()];
                    fees=new String[ja.length()];
                    syllabus=new String[ja.length()];
                    val= new String[ja.length()];


                    for(int i=0;i<ja.length();i++)
                    {
                        internship_id[i]=ja.getJSONObject(i).getString("internship_id");
                        company_id[i]=ja.getJSONObject(i).getString("company_id");
                        company_name[i]=ja.getJSONObject(i).getString("company_name");
                        title[i]=ja.getJSONObject(i).getString("title");
                        duration[i]=ja.getJSONObject(i).getString("duration");
                        fees[i]=ja.getJSONObject(i).getString("fees");
                        syllabus[i]=ja.getJSONObject(i).getString("syllabus");
                        val[i]="Company Name : "+company_name[i]
                                +"\ntitle : "+title[i]+"\nduration : "+duration[i]+"\nfees : "+fees[i];
                    }

                    l1.setVisibility(View.VISIBLE);
                    t1.setVisibility(View.GONE);
                    l1.setAdapter(new ArrayAdapter<String>(getApplicationContext(), R.layout.cust_complaints,val));

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

        internship_ids=internship_id[arg2];
        company_ids=company_id[arg2];

//
        SharedPreferences.Editor ed=sh.edit();
        ed.putString("internship_ids", internship_ids);
//        ed.putString("back", "User_view_companies");
        ed.commit();

        startActivity(new Intent(getApplicationContext(), User_view_internship_details.class));

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