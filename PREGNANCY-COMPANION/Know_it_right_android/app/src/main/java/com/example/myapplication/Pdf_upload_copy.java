package com.example.myapplication;

import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class Pdf_upload_copy extends AppCompatActivity implements JsonResponse {

    private int PICK_PDF_REQUEST = 1;
    ImageButton imgb;
    ImageView imgv;

    String log_id, description, fdate;

    SharedPreferences sh;

    int flag = 0;

    byte[] by1 = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pdf_upload);

        imgv = findViewById(R.id.imgupload);
        imgb = findViewById(R.id.btupload);

        imgb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View arg0) {
                sh = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
                log_id = sh.getString("login_id", "");

                try {
                    String q = "http://" + IPSetting.ip + "/api/upload_pdf";

                    Map<String, byte[]> aa = new HashMap<>();
                    aa.put("pdf", by1); // Change "pdf" to the appropriate key

                    aa.put("log_id", log_id.getBytes());

//                    FileUploadAsync fua = new FileUploadAsync(q);
//                    fua.json_response = (JsonResponse) Pdf_upload_copy.this;
//                    fua.execute(aa);

                } catch (Exception e) {
                    Toast.makeText(getApplicationContext(), "Exception upload : " + e, Toast.LENGTH_SHORT).show();
                }
            }
        });

        imgv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View arg0) {
                flag = 1;
                selectPdfOption();
            }
        });
    }

    private void selectPdfOption() {
        final CharSequence[] items = {"Upload PDF", "Cancel"};

        AlertDialog.Builder builder = new AlertDialog.Builder(Pdf_upload_copy.this);
        builder.setTitle("Select PDF");
        builder.setItems(items, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int item) {
                if (items[item].equals("Upload PDF")) {
                    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.setType("application/pdf");
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    startActivityForResult(Intent.createChooser(intent, "Select PDF"), PICK_PDF_REQUEST);
                } else if (items[item].equals("Cancel")) {
                    dialog.dismiss();
                }
            }
        });
        builder.show();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_PDF_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            Uri pdfUri = data.getData();

            try {
                InputStream inputStream = getContentResolver().openInputStream(pdfUri);
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    bos.write(buffer, 0, bytesRead);
                }
                inputStream.close();

                if (flag == 1) {
                    by1 = bos.toByteArray();
                    // Display PDF details or thumbnail if needed
                    // Update your UI accordingly
                    Toast.makeText(getApplicationContext(), "PDF Selected", Toast.LENGTH_SHORT).show();
                }
            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(getApplicationContext(), "Error selecting PDF", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    public void response(JSONObject jo) {
        try {
            String method = jo.getString("method");

            if (method.equalsIgnoreCase("upload_pdf")) {
                String status = jo.getString("status");
                if (status.equalsIgnoreCase("success")) {
                    Toast.makeText(getApplicationContext(), "PDF Uploaded Successfully", Toast.LENGTH_LONG).show();
                    startActivity(new Intent(getApplicationContext(), User_home.class));
                } else {
                    Toast.makeText(getApplicationContext(), "Failed to upload PDF", Toast.LENGTH_LONG).show();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "Error in response: " + e, Toast.LENGTH_LONG).show();
        }
    }
}
