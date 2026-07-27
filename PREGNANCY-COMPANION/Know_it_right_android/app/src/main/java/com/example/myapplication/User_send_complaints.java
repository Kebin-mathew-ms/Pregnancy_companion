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

public class User_send_complaints extends AppCompatActivity  implements JsonResponse {
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
        setContentView(R.layout.activity_user_send_complaints);
        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());


        log_id = sh.getString("login_id","");
        l1=(ListView)findViewById(R.id.cview);


        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse)User_send_complaints.this;
        String q="viewcomplaint?login_id="+log_id;
        jr.execute(q);
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
                jr.json_response=(JsonResponse) User_send_complaints.this;
                String q="sendcomplaint?complaint="+complaint+"&log_id="+log_id+"&c_title="+c_title;

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

            if(method.equalsIgnoreCase("viewcomplaint")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    JSONArray ja=(JSONArray)jo.getJSONArray("data");


                    date=new String[ja.length()];
                    c_titles= new String[ja.length()];
                    complaints= new String[ja.length()];
                    solution=new String[ja.length()];

                    val= new String[ja.length()];


                    for(int i=0;i<ja.length();i++)
                    {

                        date[i]=ja.getJSONObject(i).getString("date");
                        c_titles[i]=ja.getJSONObject(i).getString("complaint_title");
                        complaints[i]=ja.getJSONObject(i).getString("complaint_des");

                        solution[i]=ja.getJSONObject(i).getString("reply");
                        val[i]="Title : "+c_titles[i]+"\nComplaint : "+complaints[i]+"\nSolution : "+solution[i]+"\nDate : "+date[i];
                    }

                    l1.setAdapter(new ArrayAdapter<String>(getApplicationContext(), R.layout.cust_complaints,val));


                }
            }
            if(method.equalsIgnoreCase("sendcomplaint")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    Toast.makeText(getApplicationContext(), "Successfully Send", Toast.LENGTH_LONG).show();
//
                    startActivity(new Intent(getApplicationContext(), User_send_complaints.class));
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
        startActivity(new Intent(getApplicationContext(), User_home.class));
    }

}
