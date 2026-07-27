package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

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

import org.json.JSONArray;
import org.json.JSONObject;

public class User_add_comments extends AppCompatActivity implements JsonResponse{

    ListView l1;
    EditText e1;
    Button b1;
    String comments;
    String[] commentss,date,val;
    SharedPreferences sh;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_add_comments);

        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
        l1=findViewById(R.id.listView);
        e1=findViewById(R.id.editTextTextMultiLine);
        b1=findViewById(R.id.button3);


        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse) User_add_comments.this;
        String q="User_view_comments?user_post_ids="+sh.getString("user_post_ids","");
        q.replace("", "%20");
        jr.execute(q);

        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                comments=e1.getText().toString();

                JsonReq jr= new JsonReq();
                jr.json_response=(JsonResponse) User_add_comments.this;
                String q="User_add_comments?comments="+comments+"&log_id="+sh.getString("login_id","")+"&user_post_ids="+sh.getString("user_post_ids","");
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

            if(method.equalsIgnoreCase("User_view_comments")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    JSONArray ja=(JSONArray)jo.getJSONArray("data");


                    date=new String[ja.length()];
                    commentss= new String[ja.length()];
                    val= new String[ja.length()];


                    for(int i=0;i<ja.length();i++)
                    {

                        date[i]=ja.getJSONObject(i).getString("date");
                        commentss[i]=ja.getJSONObject(i).getString("comments");
                        val[i]="Comments : "+commentss[i]+"\nDate : "+date[i];
                    }

                    l1.setAdapter(new ArrayAdapter<String>(getApplicationContext(), R.layout.cust_complaints,val));


                }
            }

            if(method.equalsIgnoreCase("User_add_comments")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    Toast.makeText(getApplicationContext(), "Successfully Add", Toast.LENGTH_LONG).show();
//
                    startActivity(new Intent(getApplicationContext(), User_add_comments.class));
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
        startActivity(new Intent(getApplicationContext(), User_post_copy.class));
    }
}