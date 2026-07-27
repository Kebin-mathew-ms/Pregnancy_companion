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
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

public class User_post extends AppCompatActivity implements JsonResponse , AdapterView.OnItemClickListener {

    Button b1,b2;
    ListView l1;
    String[] user_post_id,user_id,user_name,title,post,post_type,date,val;
    public static String user_post_ids;
    SharedPreferences sh;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_post);

        sh= PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        b1=findViewById(R.id.button);
        b2=findViewById(R.id.button2);
        l1=findViewById(R.id.lvpost);
        l1.setOnItemClickListener(this);

        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                JsonReq jr= new JsonReq();
                jr.json_response=(JsonResponse)User_post.this;
                String q="User_view_my_post?login_id="+sh.getString("login_id","");
                jr.execute(q);

            }
        });

        b2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                startActivity(new Intent(getApplicationContext(),User_add_post.class));


        final CharSequence[] items = {"Text","Multimedia Files", "Cancel"};

        AlertDialog.Builder builder = new AlertDialog.Builder(User_post.this);
         builder.setTitle("Choose Post Type");
        builder.setItems(items, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int item) {

                if (items[item].equals("Text")) {

//                    startActivity(new Intent(getApplicationContext(), View_shops.class));
                    startActivity(new Intent(getApplicationContext(),User_add_post.class));
//                        Toast.makeText(getApplicationContext(), "Text", Toast.LENGTH_LONG).show();
                }
                else if (items[item].equals("Multimedia Files")) {

                    startActivity(new Intent(getApplicationContext(), Multi_file_upload.class));
//                        Toast.makeText(getApplicationContext(), "Image", Toast.LENGTH_LONG).show();
                }

                else if (items[item].equals("Cancel")) {
                    dialog.dismiss();
                }
            }

        });

        builder.show();

            }
        });


        JsonReq jr= new JsonReq();
        jr.json_response=(JsonResponse)User_post.this;
        String q="User_post";
        jr.execute(q);


    }


    @Override
    public void response(JSONObject jo) {
        // TODO Auto-generated method stub

        try
        {

            String method=jo.getString("method");

            if(method.equalsIgnoreCase("User_post")){

                String status=jo.getString("status");
                if(status.equalsIgnoreCase("success"))
                {
                    JSONArray ja=(JSONArray)jo.getJSONArray("data");


                    date=new String[ja.length()];
                    user_post_id= new String[ja.length()];
                    user_id= new String[ja.length()];
                    title=new String[ja.length()];
                    post=new String[ja.length()];
                    post_type=new String[ja.length()];
                    user_name=new String[ja.length()];
                    val= new String[ja.length()];

                    for(int i=0;i<ja.length();i++)
                    {

                        date[i]=ja.getJSONObject(i).getString("date");
                        user_post_id[i]=ja.getJSONObject(i).getString("user_post_id");
                        user_id[i]=ja.getJSONObject(i).getString("user_id");

                        title[i]=ja.getJSONObject(i).getString("title");
                        post[i]=ja.getJSONObject(i).getString("post");
                        post_type[i]=ja.getJSONObject(i).getString("post_type");
                        user_name[i]=ja.getJSONObject(i).getString("user_name");

                        val[i]="Title : "+title[i]+"\nPost : "+post[i]+"\nDate : "+date[i]+"\nUser Name : "+user_name[i];
                    }

                    l1.setAdapter(new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1,val));
//                    l1.setAdapter(new ArrayAdapter<String>(getApplicationContext(), R.layout.cust_complaints,val));


                }
            }
//            if(method.equalsIgnoreCase("sendcomplaint")){
//
//                String status=jo.getString("status");
//                if(status.equalsIgnoreCase("success"))
//                {
//                    Toast.makeText(getApplicationContext(), "Successfully Send", Toast.LENGTH_LONG).show();
////
//                    startActivity(new Intent(getApplicationContext(), User_send_complaints.class));
//                }
//                else
//                {
//                    Toast.makeText(getApplicationContext(), "Failed....", Toast.LENGTH_LONG).show();
//                }
//            }

        }
        catch(Exception e){
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "haii"+e, Toast.LENGTH_LONG).show();
        }



    }


    @Override
    public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3) {
        // TODO Auto-generated method stub

        user_post_ids=user_post_id[arg2];

//
        SharedPreferences.Editor ed=sh.edit();
        ed.putString("user_post_ids", user_post_ids);
//        ed.putString("back", "User_view_companies");
        ed.commit();

        startActivity(new Intent(getApplicationContext(), User_add_comments.class));

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