package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private static final int LOGO_DISPLAY_DURATION = 4000; // 4 seconds
    private ProgressBar progressBar;
    private TextView percentageTextView;
    LinearLayout ll1;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        progressBar = findViewById(R.id.progressBar);
        percentageTextView = findViewById(R.id.percentageTextView);



        // Simulate loading with a delay
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                // Navigate to the main activity when loading is done
                startActivity(new Intent(MainActivity.this, IPSetting.class));
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
                    progressBar.setProgress(finalProgress);
                    percentageTextView.setText(finalProgress + "%");
                }
            }, delayMillis * (progress / progressIncrement));
        }
    }
}