package com.example.myapplication;

import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONObject;
import com.squareup.picasso.Picasso;

import java.io.IOException;

public class User_post_copy extends AppCompatActivity implements JsonResponse, AdapterView.OnItemClickListener {

    Button b1, b2;
    ListView l1;
    String[] user_post_id, user_id, user_name, title, post, post_type, date, val;
    public static String user_post_ids;
    SharedPreferences sh;
    VideoView videoView;
    TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_post_copy);

        sh = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        b1 = findViewById(R.id.button);
        b2 = findViewById(R.id.button2);
        l1 = findViewById(R.id.lvpost);
        l1.setOnItemClickListener(this);

        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                JsonReq jr = new JsonReq();
                jr.json_response = (JsonResponse) User_post_copy.this;
                String q = "User_view_my_post?login_id=" + sh.getString("login_id", "");
                jr.execute(q);
            }
        });

        b2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final CharSequence[] items = {"Text", "Multimedia Files", "Cancel"};

                AlertDialog.Builder builder = new AlertDialog.Builder(User_post_copy.this);
                builder.setTitle("Choose Post Type");
                builder.setItems(items, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int item) {
                        if (items[item].equals("Text")) {
                            startActivity(new Intent(getApplicationContext(), User_add_post.class));
                        } else if (items[item].equals("Multimedia Files")) {
                            startActivity(new Intent(getApplicationContext(), Multi_file_upload.class));
                        } else if (items[item].equals("Cancel")) {
                            dialog.dismiss();
                        }
                    }
                });

                builder.show();
            }
        });

        videoView = findViewById(R.id.videoView);
        textView = findViewById(R.id.textView);

        JsonReq jr = new JsonReq();
        jr.json_response = (JsonResponse) User_post_copy.this;
        String q = "User_post";
        jr.execute(q);
    }

    @Override
    public void response(JSONObject jo) {
        try {
            String method = jo.getString("method");

            if (method.equalsIgnoreCase("User_post")) {
                String status = jo.getString("status");
                if (status.equalsIgnoreCase("success")) {
                    JSONArray ja = (JSONArray) jo.getJSONArray("data");

                    date = new String[ja.length()];
                    user_post_id = new String[ja.length()];
                    user_id = new String[ja.length()];
                    title = new String[ja.length()];
                    post = new String[ja.length()];
                    post_type = new String[ja.length()];
                    user_name = new String[ja.length()];
//                    val = new String[ja.length()];

                    for (int i = 0; i < ja.length(); i++) {
                        date[i] = ja.getJSONObject(i).getString("date");
                        user_post_id[i] = ja.getJSONObject(i).getString("user_post_id");
                        user_id[i] = ja.getJSONObject(i).getString("user_id");
                        title[i] = ja.getJSONObject(i).getString("title");
                        post[i] = ja.getJSONObject(i).getString("post");
                        post_type[i] = ja.getJSONObject(i).getString("post_type");
                        user_name[i] = ja.getJSONObject(i).getString("user_name");

//                        // Check post_type and handle accordingly
//                        if (post_type[i].equalsIgnoreCase("jpg")) {
//                            // Handle image display
//                            // Assuming you have an ImageView with the id 'imageView'
//                            ImageView imageView = findViewById(R.id.imageView);
//                            // Load image using your preferred method (e.g., Picasso, Glide)
//                            Picasso.with(getApplicationContext()).load(post[i]).into(imageView);
//                        } else if (post_type[i].equalsIgnoreCase("mp4")) {
//                            // Handle video playback
//                            videoView.setVisibility(View.VISIBLE);
//                            videoView.setVideoURI(Uri.parse(post[i]));
//                            videoView.start();
//                        } else if (post_type[i].equalsIgnoreCase("mp3")) {
//                            // Handle audio playback
//                            // Assuming you have an AudioPlayer class to handle audio playback
//                            MediaPlayer mediaPlayer = new MediaPlayer();
//                            try {
//                                mediaPlayer.setDataSource(post[i]);
//                                mediaPlayer.prepare();
//                                mediaPlayer.start();
//                            } catch (IOException e) {
//                                e.printStackTrace();
//                            }
//                        } else if (post_type[i].equalsIgnoreCase("text")) {
//                            // Handle text display
//                            textView.setVisibility(View.VISIBLE);
//                            textView.setText(post[i]);
//                        }

//                        val[i] = "Title : " + title[i] + "\nPost : " + post[i] + "\nDate : " + date[i] + "\nUser Name : " + user_name[i];
                    }

                    Cust_post cc=new Cust_post(this, user_name, title, post, post_type, date);
                    l1.setAdapter(cc);

//                    l1.setAdapter(new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, val));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "haii" + e, Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3) {
        user_post_ids = user_post_id[arg2];
        SharedPreferences.Editor ed = sh.edit();
        ed.putString("user_post_ids", user_post_ids);
        ed.commit();
        startActivity(new Intent(getApplicationContext(), User_add_comments.class));
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        startActivity(new Intent(getApplicationContext(), User_home.class));
    }
}
