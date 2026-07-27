package com.example.myapplication;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.annotation.SuppressLint;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.TextUtils;
import android.text.style.ImageSpan;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

public class User_view_company_jobs extends AppCompatActivity implements JsonResponse, AdapterView.OnItemClickListener {

    ListView l1;
    String[] job_vacancy_id,job_category_id,company_id,job_title,job_description,skills,job_category_name,company_name,email,place,phobe,license_num,about_company,val;
    public static String job_vacancy_ids,job_category_ids,company_ids;

    SharedPreferences sh;
    TextView t1,t2,t3,t4,t5,t6,t7;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_view_company_jobs);

        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        l1=(ListView)findViewById(R.id.lvvacancy);
        l1.setOnItemClickListener(this);

        l1.setVisibility(View.GONE);
        t1=(TextView) findViewById(R.id.tvst);
        t1.setVisibility(View.GONE);

        t2=findViewById(R.id.tvemail);
        t3=findViewById(R.id.tvphone);
        t4=findViewById(R.id.tvplace);
        t5=findViewById(R.id.tvlicense);
        t6=findViewById(R.id.tvabout);
        t7=findViewById(R.id.tvcmpname);




        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse)User_view_company_jobs.this;
        String q="User_view_company_jobs?company_ids="+sh.getString("company_ids","")+"&login_id="+sh.getString("login_id","");
        jr.execute(q);

    }


    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try
        {

            String method=jo.getString("method");

            if(method.equalsIgnoreCase("User_view_company_jobs")){

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
                    val= new String[ja.length()];




// Get the Drawable for the image (replace 'email_icon', 'phone_icon', etc. with your actual drawable resource names)
                    Drawable emailIcon = ContextCompat.getDrawable(this, R.drawable.baseline_email_24);
                    Drawable phoneIcon = ContextCompat.getDrawable(this, R.drawable.baseline_phone_24);
                    Drawable locationIcon = ContextCompat.getDrawable(this, R.drawable.baseline_location_on_24);
                    Drawable licenseIcon = ContextCompat.getDrawable(this, R.drawable.baseline_gpp_good_24);
                    Drawable aboutIcon = ContextCompat.getDrawable(this, R.drawable.baseline_info_24);

// Set bounds for the drawable (adjust values as needed)
                    emailIcon.setBounds(0, 0, 50, 50);
                    phoneIcon.setBounds(0, 0, 50, 50);
                    locationIcon.setBounds(0, 0, 50, 50);
                    licenseIcon.setBounds(0, 0, 50, 50);
                    aboutIcon.setBounds(0, 0, 50, 50);

// Create SpannableString with ImageSpan
                    SpannableString emailSpan = new SpannableString("Email ID : ");
                    SpannableString phoneSpan = new SpannableString("\n Contact Number : ");
                    SpannableString locationSpan = new SpannableString("\n Location : ");
                    SpannableString licenseSpan = new SpannableString("\n License No. : ");
                    SpannableString aboutSpan = new SpannableString("\n About : ");



                    emailSpan.setSpan(new ImageSpan(emailIcon, ImageSpan.ALIGN_BOTTOM), 0, emailSpan.length(), Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
                    phoneSpan.setSpan(new ImageSpan(phoneIcon, ImageSpan.ALIGN_BOTTOM), 0, phoneSpan.length(), Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
                    locationSpan.setSpan(new ImageSpan(locationIcon, ImageSpan.ALIGN_BOTTOM), 0, locationSpan.length(), Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
                    licenseSpan.setSpan(new ImageSpan(licenseIcon, ImageSpan.ALIGN_BOTTOM), 0, licenseSpan.length(), Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
                    aboutSpan.setSpan(new ImageSpan(aboutIcon, ImageSpan.ALIGN_BOTTOM), 0, aboutSpan.length(), Spannable.SPAN_INCLUSIVE_EXCLUSIVE);


                    t2.setText(TextUtils.concat(emailSpan, ja.getJSONObject(0).getString("email")));
                    t3.setText(TextUtils.concat(phoneSpan, ja.getJSONObject(0).getString("phone")));
                    t4.setText(TextUtils.concat(locationSpan, ja.getJSONObject(0).getString("place")));
                    t5.setText(TextUtils.concat(licenseSpan, ja.getJSONObject(0).getString("license_num")));
                    t6.setText(TextUtils.concat(aboutSpan, ja.getJSONObject(0).getString("about_company")));
                    t7.setText(ja.getJSONObject(0).getString("company_name"));

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
                        val[i]="Title : "+job_title[i]
                                +"\nJob Description : "+job_description[i];

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
    public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3) {
        // TODO Auto-generated method stub

        job_vacancy_ids=job_vacancy_id[arg2];
        job_category_ids=job_category_id[arg2];
        company_ids=company_id[arg2];

//
        SharedPreferences.Editor ed=sh.edit();
        ed.putString("job_vacancy_ids", job_vacancy_ids);
        ed.putString("back", "User_view_company_jobs");
        ed.commit();

        startActivity(new Intent(getApplicationContext(), User_view_more_about_job.class));

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
        startActivity(new Intent(getApplicationContext(), User_view_companies.class));
    }


}