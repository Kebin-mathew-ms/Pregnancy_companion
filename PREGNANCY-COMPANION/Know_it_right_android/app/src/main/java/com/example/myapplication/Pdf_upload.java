package com.example.myapplication;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class Pdf_upload extends AppCompatActivity implements JsonResponse {

    private static final int PICK_PDF_REQUEST = 1;

    private ImageButton uploadButton;
    private TextView pdfTextView;
    private ImageView uploadImageView;

    private String loginId;
    private SharedPreferences sharedPreferences;
    private int flag = 0;
    private byte[] pdfByteArray;
    private static String viewPdf;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pdf_upload);

        sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        uploadImageView = findViewById(R.id.imgupload);
        uploadButton = findViewById(R.id.btupload);
        pdfTextView = findViewById(R.id.tv_pdf);

        pdfTextView.setOnClickListener(view -> openPdfFile());

        JsonReq jsonReq = new JsonReq();
        jsonReq.json_response = Pdf_upload.this;
        String query = "view_pdf?login_id=" + sharedPreferences.getString("login_id", "");
        jsonReq.execute(query);

        uploadButton.setOnClickListener(arg0 -> uploadPdf());

        uploadImageView.setOnClickListener(arg0 -> {
            flag = 1;
            selectPdfOption();
        });
    }

    private void openPdfFile() {
        if (viewPdf != null && !viewPdf.isEmpty()) {
            File file = new File(IPSetting.ip+"/" + viewPdf);
//            File file = new File(getFilesDir(), viewPdf); // Assuming 'viewPdf' is the file name
            Toast.makeText(getApplicationContext(), "PDF Path is empty"+file, Toast.LENGTH_SHORT).show();
            openFile(file);
        } else {
            Toast.makeText(getApplicationContext(), "PDF Path is empty", Toast.LENGTH_SHORT).show();
        }
    }

    private void uploadPdf() {
        loginId = sharedPreferences.getString("login_id", "");
        try {
            String uploadUrl = "http://" + IPSetting.ip + "/api/upload_pdf";
            Map<String, byte[]> params = new HashMap<>();
            params.put("pdf", pdfByteArray); // Change "pdf" to the appropriate key
            params.put("log_id", loginId.getBytes());

//            FileUploadAsync fileUploadAsync = new FileUploadAsync(uploadUrl);
            FileUploadAsync fileUploadAsync = new FileUploadAsync(uploadUrl, this);

            fileUploadAsync.json_response = Pdf_upload.this;
            fileUploadAsync.execute(params);
        } catch (Exception e) {
            Toast.makeText(getApplicationContext(), "Exception upload : " + e, Toast.LENGTH_SHORT).show();
        }
    }

    private void selectPdfOption() {
        final CharSequence[] items = {"Upload PDF", "Cancel"};

        AlertDialog.Builder builder = new AlertDialog.Builder(Pdf_upload.this);
        builder.setTitle("Select PDF");
        builder.setItems(items, (dialog, item) -> {
            if (items[item].equals("Upload PDF")) {
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.setType("application/pdf");
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                startActivityForResult(Intent.createChooser(intent, "Select PDF"), PICK_PDF_REQUEST);
            } else if (items[item].equals("Cancel")) {
                dialog.dismiss();
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
                    pdfByteArray = bos.toByteArray();
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
                handleUploadPdfResponse(jo);
            } else if (method.equalsIgnoreCase("view_pdf")) {
                handleViewPdfResponse(jo);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "Error in response: " + e, Toast.LENGTH_LONG).show();
        }
    }

    private void handleUploadPdfResponse(JSONObject jo) {
        try {
            String status = jo.getString("status");
            if (status.equalsIgnoreCase("success")) {
                Toast.makeText(getApplicationContext(), "PDF Uploaded Successfully", Toast.LENGTH_LONG).show();
                startActivity(new Intent(getApplicationContext(), User_home.class));
            } else {
                Toast.makeText(getApplicationContext(), "Failed to upload PDF", Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "Error handling upload response: " + e, Toast.LENGTH_LONG).show();
        }
    }

    private void handleViewPdfResponse(JSONObject jo) {
        try {
            String status = jo.getString("status");
            if (status.equalsIgnoreCase("success")) {
                viewPdf = jo.getString("data");
                pdfTextView.setText(viewPdf);
                Toast.makeText(getApplicationContext(), "PDF Loaded Successfully", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(getApplicationContext(), "Failed to Load PDF", Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "Error handling view PDF response: " + e, Toast.LENGTH_LONG).show();
        }
    }

    public void openFile(File file) {

        Uri uri = Uri.fromFile(file);

//        Intent intent = new Intent(Intent.ACTION_VIEW);
//        setIntentDataTypeBasedOnFileExtension(intent, uri);
//        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//
//        try {
//            getApplicationContext().startActivity(intent);
//        } catch (ActivityNotFoundException e) {
//            Toast.makeText(getApplicationContext(), "No PDF viewer installed", Toast.LENGTH_SHORT).show();
//        }

//        Intent intent = new Intent(Intent.ACTION_VIEW);
        Uri urii= Uri.parse("192.168.29.105:5044/static/resume/78fee65f-e55b-4db6-8db1-0f843bb6b37eabc.pdf");
        Log.d("urii--", String.valueOf(urii));

        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(urii);
        intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        try {
            startActivity(intent);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(getApplicationContext(), "No PDF viewer available", Toast.LENGTH_SHORT).show();
        }

//
//
//        Toast.makeText(getApplicationContext(), "PDF Loaded Successfully :: "+file, Toast.LENGTH_LONG).show();
//
//        Uri uri = FileProvider.getUriForFile(
//                this,
//                getApplicationContext().getPackageName() + ".provider",
//                file
//        );
//        Toast.makeText(getApplicationContext(), "PDF Loaded Successfully -----  "+uri, Toast.LENGTH_LONG).show();


//        Intent intent = new Intent(Intent.ACTION_VIEW);
//        setIntentDataTypeBasedOnFileExtension(intent, uri);
//        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        // Grant read permissions for the content URI
//        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

//        try {
//            getApplicationContext().startActivity(intent);
//        } catch (ActivityNotFoundException e) {
//            Toast.makeText(getApplicationContext(), "No PDF viewer installed", Toast.LENGTH_SHORT).show();
//        }
    }

    private void setIntentDataTypeBasedOnFileExtension(Intent intent, Uri uri) {
        String fileExtension = getFileExtension(uri.getPath());
        Log.d("fileExtension",fileExtension);
        Log.d("uriii", String.valueOf(uri));
        Uri urii= Uri.parse("192.168.29.105:5044/static/resume/78fee65f-e55b-4db6-8db1-0f843bb6b37eabc.pdf");
        Log.d("urii--", String.valueOf(urii));
        switch (fileExtension) {
            case "doc":
            case "docx":
                intent.setDataAndType(uri, "application/msword");
                break;
            case "pdf":
//                intent.setDataAndType(uri, "application/pdf");
                intent.setDataAndType(urii, "application/pdf");
                break;
            case "ppt":
            case "pptx":
                intent.setDataAndType(uri, "application/vnd.ms-powerpoint");
                break;
            case "xls":
            case "xlsx":
                intent.setDataAndType(uri, "application/vnd.ms-excel");
                break;
            case "zip":
            case "rar":
                intent.setDataAndType(uri, "application/x-wav");
                break;
            case "rtf":
                intent.setDataAndType(uri, "application/rtf");
                break;
            case "wav":
            case "mp3":
                intent.setDataAndType(uri, "audio/x-wav");
                break;
            case "gif":
                intent.setDataAndType(uri, "image/gif");
                break;
            case "jpg":
            case "jpeg":
            case "png":
                intent.setDataAndType(uri, "image/jpeg");
                break;
            case "txt":
                intent.setDataAndType(uri, "text/plain");
                break;
            case "3gp":
            case "mpg":
            case "mpeg":
            case "mpe":
            case "mp4":
            case "avi":
                intent.setDataAndType(uri, "video/*");
                break;
            default:
                intent.setDataAndType(uri, "*/*");
                break;
        }
    }

    private String getFileExtension(String path) {
        return path.substring(path.lastIndexOf(".") + 1);
    }
}
