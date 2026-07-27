package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class Loading_page extends AppCompatActivity {

    private static final int LOGO_DISPLAY_DURATION = 3000; // 3 seconds
    private ProgressBar progressBarCircle;
    private TextView percentageTextView;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loading_page);
        progressBarCircle = findViewById(R.id.pg);
        percentageTextView = findViewById(R.id.percentageTextView);


//        ImageView imageView = findViewById(R.id.imageView3);
//
//        Glide.with(this)
//                .load(R.drawable.lod1)
//                .transform(new CircleCrop())
//                .into(imageView);


        // Simulate loading with a delay
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                // Navigate to the main activity when loading is done
                startActivity(new Intent(Loading_page.this, Login.class));
                finish(); // Close the loading activity
            }
        }, LOGO_DISPLAY_DURATION);

        // Simulate loading progress updates
        simulateLoading();
    }

    private void simulateLoading() {
        final int totalProgress = 100;
        final int progressIncrement = 5;
        final long delayMillis = LOGO_DISPLAY_DURATION / (totalProgress / progressIncrement);

        for (int progress = 0; progress <= totalProgress; progress += progressIncrement) {
            final int finalProgress = progress;
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    progressBarCircle.setProgress(finalProgress);
                    percentageTextView.setText(finalProgress + "%");
                }
            }, delayMillis * (progress / progressIncrement));
        }
    }
}
