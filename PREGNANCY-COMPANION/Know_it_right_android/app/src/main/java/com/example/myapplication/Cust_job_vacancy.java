package com.example.myapplication;

import com.bumptech.glide.Glide;
import com.squareup.picasso.Picasso;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

public class Cust_job_vacancy extends ArrayAdapter<String>  {

    private Activity context;       //for to get current activity context
    SharedPreferences sh;
    private String[] job_title,company_name,job_description;



    public Cust_job_vacancy(Activity context, String[] job_title,String[] company_name,String[] job_description) {
        //constructor of this class to get the values from main_activity_class

        super(context, R.layout.cust_job_vacancy, job_title);
        this.context = context;
        this.job_title = job_title;
        this.company_name = company_name;
        this.job_description=job_description;

    }

    @SuppressLint("MissingInflatedId")
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View listViewItem = inflater.inflate(R.layout.cust_job_vacancy, null, true);

        TextView t2 = (TextView) listViewItem.findViewById(R.id.textView5);
        TextView t4 = (TextView) listViewItem.findViewById(R.id.textView7);
        TextView t5 = (TextView) listViewItem.findViewById(R.id.textView8);


//        ImageView t8 = (ImageView) listViewItem.findViewById(R.id.tvchat);


        // Set the text for other TextViews
        t2.setText("Job Title : "+job_title[position]);
        t4.setText("Company Name : "+company_name[position]);
        t5.setText("Job Description : "+job_description[position]);


        sh=PreferenceManager.getDefaultSharedPreferences(context);



        // Set the building number with a circular background
//        TextView buildingNumberTextView = (TextView) listViewItem.findViewById(R.id.bbnum);
//        buildingNumberTextView.setText(building_number[position]);

//        t8.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                // Get the correct blid for the clicked item
////                String clickedBlid = blid[position];
////
////                // Save the blid in SharedPreferences
////                sh.edit().putString("blid", clickedBlid).apply();
//
//                // Redirect to Hks_chat_with_user.java with the correct blid
//                Intent chatIntent = new Intent(context, Hks_chat_with_user.class);
//                chatIntent.putExtra("ownerId", clickedBlid); // Pass the correct blid as an extra
//                context.startActivity(chatIntent);
//            }
//        });


//        buildingNumberTextView.setBackgroundResource(R.drawable.cir2); // Replace with your circular background drawable

        return listViewItem;
    }


    private TextView setText(String string) {
        // TODO Auto-generated method stub
        return null;
    }
}