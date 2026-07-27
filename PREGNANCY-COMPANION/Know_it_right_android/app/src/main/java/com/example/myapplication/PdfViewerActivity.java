package com.example.myapplication;

import android.content.res.AssetManager;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.github.barteksc.pdfviewer.PDFView;

import java.io.IOException;
import java.io.InputStream;

public class PdfViewerActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pdf_viewer);

        PDFView pdfView = findViewById(R.id.pdfView);

        String pdfPath = getIntent().getStringExtra("pdfPath");
        Toast.makeText(getApplicationContext(), pdfPath, Toast.LENGTH_LONG).show();

        // To open a PDF file from the assets folder
        AssetManager assetManager = getAssets();
        try {
            InputStream inputStream = assetManager.open(pdfPath);
            pdfView.fromStream(inputStream)
                    .defaultPage(0)
                    .enableSwipe(true)
                    .swipeHorizontal(false)
                    .load();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
