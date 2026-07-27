package com.example.myapplication;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Multi_file_upload extends AppCompatActivity implements JsonResponse {

    private static final int PICK_FILE_REQUEST = 1;

    private ImageButton uploadButton;
    private TextView fileTextView;

    private String loginId;
    private SharedPreferences sharedPreferences;
    private byte[] fileByteArray;
    EditText e1;
    String title;

    @SuppressLint("WrongViewCast")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_multi_file_upload);

        sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        uploadButton = findViewById(R.id.btUpload);
        fileTextView = findViewById(R.id.tvFile);
        e1 = findViewById(R.id.complaint_tt);

        fileTextView.setOnClickListener(view -> selectFileOption());

//        uploadButton.setOnClickListener(arg0 -> uploadFile());

        uploadButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                title=e1.getText().toString();
                if (title.trim().isEmpty()) {
                    e1.setFocusable(true);
                    e1.setError("Enter Title");
                }
                else{
                    e1.setBackgroundColor(Color.TRANSPARENT);
                    uploadFile();
                }

            }
        });
    }

    private void uploadFile() {
        loginId = sharedPreferences.getString("login_id", "");
        try {
            String uploadUrl = "http://" + IPSetting.ip + "/api/Multi_file_upload";
            String fileType = sharedPreferences.getString("file_type", "");

            Map<String, byte[]> params = new HashMap<>();
            params.put("file", fileByteArray);
            params.put("fileType", fileType.getBytes());
            params.put("log_id", loginId.getBytes());
            params.put("title", title.getBytes());

//            FileUploadAsync fileUploadAsync = new FileUploadAsync(uploadUrl);
            FileUploadAsync fileUploadAsync = new FileUploadAsync(uploadUrl, Multi_file_upload.this);

            fileUploadAsync.json_response = Multi_file_upload.this;
            fileUploadAsync.execute(params);
        } catch (Exception e) {
            Toast.makeText(getApplicationContext(), "Exception upload: " + e, Toast.LENGTH_SHORT).show();
        }
    }

    private void startFilePicker(String mimeType) {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType(mimeType);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        startActivityForResult(Intent.createChooser(intent, "Select File"), PICK_FILE_REQUEST);
    }

    private void selectFileOption() {
        final CharSequence[] items = {"Upload Image", "Upload Video", "Upload Audio", "Cancel"};
        AlertDialog.Builder builder = new AlertDialog.Builder(Multi_file_upload.this);
        builder.setTitle("Select File");
        builder.setItems(items, (dialog, item) -> {
            if (items[item].equals("Upload Image")) {
                setFileTypeAndStartPicker("jpg");
            } else if (items[item].equals("Upload Video")) {
                setFileTypeAndStartPicker("mp4");
            } else if (items[item].equals("Upload Audio")) {
                setFileTypeAndStartPicker("mp3");
            } else if (items[item].equals("Cancel")) {
                dialog.dismiss();
            }
        });
        builder.show();
    }

    private void setFileTypeAndStartPicker(String fileType) {
        SharedPreferences.Editor ed = sharedPreferences.edit();
        ed.putString("file_type", fileType);
        ed.apply();
        startFilePicker(getMimeType(fileType));
    }

    private String getMimeType(String fileType) {
        // Provide appropriate MIME types based on file extensions
        switch (fileType) {
            case "jpg":
                return "image/*";
            case "mp4":
                return "video/*";
            case "mp3":
                return "audio/*";
            default:
                return "*/*";
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_FILE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            Uri fileUri = data.getData();
            try {
                InputStream inputStream = getContentResolver().openInputStream(fileUri);
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int bytesRead;
                try {
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        bos.write(buffer, 0, bytesRead);
                    }
                } finally {
                    inputStream.close(); // Ensure the input stream is closed
                }

                if (bos.size() > 0) {
                    fileByteArray = bos.toByteArray();
                    Log.d("fileByteArray", String.valueOf(fileByteArray));
                    Toast.makeText(getApplicationContext(), "File Selected", Toast.LENGTH_SHORT).show();
                }
            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(getApplicationContext(), "Error selecting file", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    public void response(JSONObject jo) {
        try {
            String method = jo.getString("method");

            if (method.equalsIgnoreCase("Multi_file_upload")) {
                String status = jo.getString("status");

                if (status.equalsIgnoreCase("Success")) {
                    Toast.makeText(getApplicationContext(), "File uploaded successfully", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(getApplicationContext(), "Upload failed", Toast.LENGTH_LONG).show();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "Error: " + e, Toast.LENGTH_LONG).show();
        }
    }
}
