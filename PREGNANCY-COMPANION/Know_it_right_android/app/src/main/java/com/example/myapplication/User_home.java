package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager.widget.ViewPager;

import java.util.ArrayList;
import java.util.List;

public class User_home extends AppCompatActivity {
    private ViewPager viewPager;
    private ImagePagerAdapter adapter;
    private List<Integer> imageList;
    private int currentPage = 0;
    private Handler handler;
    private final long delay = 2000; // Delay between slides in milliseconds

    ImageView l1,l2,l3,imgvlogout;
    ImageButton img1,img2,img3,img4;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_home);

//        Toast.makeText(getApplicationContext(),"gdvfsdfvgsdh",Toast.LENGTH_LONG).show();

        l1=(ImageView) findViewById(R.id.imcom);
        l2=(ImageView) findViewById(R.id.imfeed);
        l3=(ImageView) findViewById(R.id.imdes);
        imgvlogout=(ImageView) findViewById(R.id.imgvlogout);

        img1=(ImageButton) findViewById(R.id.upload_pdf);
        img2=(ImageButton) findViewById(R.id.upload_pdf2);
        img3=(ImageButton) findViewById(R.id.upload_pdf3);
        img4=(ImageButton) findViewById(R.id.imapp);

        l1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(getApplicationContext(),User_send_complaints.class));
            }
        });

        l2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(getApplicationContext(),User_post_copy.class));
            }
        });
//
        l3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(getApplicationContext(),User_view_internship.class));
            }
        });
//
        img1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(getApplicationContext(),Pdf_upload.class));
            }
        });

        img2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(getApplicationContext(),User_view_job_vacancy.class));
            }
        });

        img3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(getApplicationContext(),User_view_companies.class));
            }
        });


        img4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(getApplicationContext(),User_view_my_applications.class));
            }
        });


        imgvlogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                Toast.makeText(getApplicationContext(),"gdvfsdfvgsdh",Toast.LENGTH_LONG).show();
                startActivity(new Intent(getApplicationContext(),Login.class));
            }
        });

        viewPager = findViewById(R.id.imageViewPager);

        imageList = new ArrayList<>();
        imageList.add(R.drawable.k1);
        imageList.add(R.drawable.k2);
        imageList.add(R.drawable.k6);

        adapter = new ImagePagerAdapter(this, imageList);
        viewPager.setAdapter(adapter);

        handler = new Handler();
        // Start automatic sliding
        startAutoSlider();
    }

    private void startAutoSlider() {
        // Define a runnable to switch to the next page
        Runnable runnable = new Runnable() {
            public void run() {
                if (currentPage == imageList.size()) {
                    currentPage = 0;
                }
                viewPager.setCurrentItem(currentPage++, true);
                handler.postDelayed(this, delay);
            }
        };

        // Start the initial auto sliding
        handler.postDelayed(runnable, delay);
    }

    @Override
    public void onBackPressed() {
        // TODO Auto-generated method stub
        super.onBackPressed();
        startActivity(new Intent(getApplicationContext(), User_home.class));
    }
}
