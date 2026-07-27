package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class Pdf_upload_copy_1 extends AppCompatActivity implements JsonResponse {

    private int PICK_PDF_REQUEST = 1;
    ImageButton imgb;
    TextView tv_pdf;
    ImageView imgv;

    String log_id;

    SharedPreferences sh;

    int flag = 0;

    byte[] by1 = null;
    public static String view_pdf;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pdf_upload);

        sh = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        imgv = findViewById(R.id.imgupload);
        imgb = findViewById(R.id.btupload);
        tv_pdf = findViewById(R.id.tv_pdf);

        tv_pdf.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Check if the PDF file path is not null or empty
                if (view_pdf != null && !view_pdf.isEmpty()) {
                    Toast.makeText(getApplicationContext(), "PDF view_pdf : "+view_pdf, Toast.LENGTH_SHORT).show();
//
                    File url = new File("http://" + IPSetting.ip +"/" + view_pdf);
                    Log.d("urlss", String.valueOf(url));
//                    File url = new File(view_pdf);
                    Toast.makeText(getApplicationContext(), "PDF url : "+url, Toast.LENGTH_SHORT).show();
                    openFile(url);


                } else {
                    Toast.makeText(getApplicationContext(), "PDF Path is empty", Toast.LENGTH_SHORT).show();
                }
            }
        });

        JsonReq JR=new JsonReq();
        JR.json_response=(JsonResponse) Pdf_upload_copy_1.this;
        String q = "view_pdf?login_id=" + sh.getString("login_id", "");
        JR.execute(q);
        Log.d("pearl",q);

        imgb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View arg0) {
                log_id = sh.getString("login_id", "");

                try {
                    String q = "http://" + IPSetting.ip + "/api/upload_pdf";
                    Map<String, byte[]> aa = new HashMap<>();
                    aa.put("pdf", by1); // Change "pdf" to the appropriate key
                    aa.put("log_id", log_id.getBytes());

//                    FileUploadAsync fua = new FileUploadAsync(q);
//                    fua.json_response = (JsonResponse) Pdf_upload_copy_1.this;
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

        AlertDialog.Builder builder = new AlertDialog.Builder(Pdf_upload_copy_1.this);
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
            } else if (method.equalsIgnoreCase("view_pdf")) {
                String status = jo.getString("status");
                if (status.equalsIgnoreCase("success")) {
                    view_pdf = jo.getString("data");
                    tv_pdf.setText(view_pdf);

                    Toast.makeText(getApplicationContext(), "PDF Loaded Successfully", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(getApplicationContext(), "Failed to Load PDF", Toast.LENGTH_LONG).show();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "Error in response: " + e, Toast.LENGTH_LONG).show();
        }
    }
//
//    // Add a new AsyncTask class to download and save the PDF file to internal storage
//    private class DownloadPdfTask extends AsyncTask<String, Void, File> {
//        @Override
//        protected File doInBackground(String... params) {
//            String pdfUrl = params[0];
//
//            try {
//                // Use HttpURLConnection or any other library to download the PDF
//                // For simplicity, you can use the following code with URL class
//                URL url = new URL("http://" + IPSetting.ip + "/" + pdfUrl);
//                Log.d("url", String.valueOf(url));
//
//                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
//
//                // Set up the connection parameters
//                urlConnection.setRequestMethod("GET");
//                urlConnection.connect();
//
//                // Specify the destination directory and file name
//                File downloadDir = new File(getFilesDir(), "Download/resume");
//                Log.d("downloadDir", String.valueOf(downloadDir));
//                if (!downloadDir.exists()) {
//                    downloadDir.mkdirs();
//                }
//
//                File pdfFile = new File(downloadDir, "downloaded_pdf.pdf");
//                Log.d("pdfFile", String.valueOf(pdfFile));
//
//                // Create a file output stream to save the PDF
//                FileOutputStream fileOutput = new FileOutputStream(pdfFile);
//
//                // Read the PDF data and save it to the file
//                InputStream inputStream = urlConnection.getInputStream();
//                byte[] buffer = new byte[1024];
//                int bufferLength;
//
//                while ((bufferLength = inputStream.read(buffer)) > 0) {
//                    fileOutput.write(buffer, 0, bufferLength);
//                }
//
//                // Close the streams
//                fileOutput.close();
//                inputStream.close();
//                Log.d("pdfFile", String.valueOf(pdfFile));
//                return pdfFile;
//
//            } catch (IOException e) {
//                e.printStackTrace();
//                return null;
//            }
//        }
//
//        @Override
//        protected void onPostExecute(File pdfFile) {
//            if (pdfFile != null) {
////                openPdf(pdfFile);
//                openFile(pdfFile);
//            } else {
//                Toast.makeText(getApplicationContext(), "Failed to download PDF", Toast.LENGTH_SHORT).show();
//            }
//        }
//    }


//    // Method to open the PDF using an Intent
//    private void openPdf(File pdfFile) {
//        Intent intent = new Intent(Intent.ACTION_VIEW);
//        Uri pdfUri = FileProvider.getUriForFile(
//                Pdf_upload.this,
//                Pdf_upload.this.getApplicationContext().getPackageName() + ".provider",
//                pdfFile
//        );
//        intent.setDataAndType(pdfUri, "application/pdf");
//        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
//
//        try {
//            startActivity(intent);
//        } catch (ActivityNotFoundException e) {
//            Toast.makeText(getApplicationContext(), "No PDF viewer installed", Toast.LENGTH_SHORT).show();
//        }
//    }


    public void openFile(File url) {

        Uri uri = Uri.fromFile(url);
        Toast.makeText(getApplicationContext(),"uurrll : "+url,Toast.LENGTH_LONG).show();
        Log.d("uurrll", String.valueOf(url));

        Intent intent = new Intent(Intent.ACTION_VIEW);
        if (url.toString().contains(".doc") || url.toString().contains(".docx")) {
            // Word document
            intent.setDataAndType(uri, "application/msword");
        } else if (url.toString().contains(".pdf")) {
            // PDF file
            intent.setDataAndType(uri, "application/pdf");
        } else if (url.toString().contains(".ppt") || url.toString().contains(".pptx")) {
            // Powerpoint file
            intent.setDataAndType(uri, "application/vnd.ms-powerpoint");
        } else if (url.toString().contains(".xls") || url.toString().contains(".xlsx")) {
            // Excel file
            intent.setDataAndType(uri, "application/vnd.ms-excel");
        } else if (url.toString().contains(".zip") || url.toString().contains(".rar")) {
            // WAV audio file
            intent.setDataAndType(uri, "application/x-wav");
        } else if (url.toString().contains(".rtf")) {
            // RTF file
            intent.setDataAndType(uri, "application/rtf");
        } else if (url.toString().contains(".wav") || url.toString().contains(".mp3")) {
            // WAV audio file
            intent.setDataAndType(uri, "audio/x-wav");
        } else if (url.toString().contains(".gif")) {
            // GIF file
            intent.setDataAndType(uri, "image/gif");
        } else if (url.toString().contains(".jpg") || url.toString().contains(".jpeg") || url.toString().contains(".png")) {
            // JPG file
            intent.setDataAndType(uri, "image/jpeg");
        } else if (url.toString().contains(".txt")) {
            // Text file
            intent.setDataAndType(uri, "text/plain");
        } else if (url.toString().contains(".3gp") || url.toString().contains(".mpg") || url.toString().contains(".mpeg") || url.toString().contains(".mpe") || url.toString().contains(".mp4") || url.toString().contains(".avi")) {
            // Video files
            intent.setDataAndType(uri, "video/*");
        } else {
            //if you want you can also define the intent type for any other file
            //additionally use else clause below, to manage other unknown extensions
            //in this case, Android will show all applications installed on the device
            //so you can choose which application to use
            intent.setDataAndType(uri, "*/*");
        }

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getApplicationContext().startActivity(intent);

    }
}
