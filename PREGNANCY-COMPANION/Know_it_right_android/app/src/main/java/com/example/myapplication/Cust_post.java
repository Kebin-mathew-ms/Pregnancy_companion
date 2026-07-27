
package com.example.myapplication;

        import com.bumptech.glide.Glide;
        import com.squareup.picasso.Picasso;

        import android.annotation.SuppressLint;
        import android.app.Activity;
        import android.content.Context;
        import android.content.Intent;
        import android.content.SharedPreferences;
        import android.media.AudioManager;
        import android.media.MediaPlayer;
        import android.net.Uri;
        import android.os.Handler;
        import android.preference.PreferenceManager;
        import android.util.Log;
        import android.view.Gravity;
        import android.view.LayoutInflater;
        import android.view.MotionEvent;
        import android.view.View;
        import android.view.ViewGroup;
        import android.widget.ArrayAdapter;
        import android.widget.Button;
        import android.widget.FrameLayout;
        import android.widget.ImageView;
        import android.widget.LinearLayout;
        import android.widget.MediaController;
        import android.widget.SeekBar;
        import android.widget.TextView;
        import android.widget.Toast;
        import android.widget.VideoView;

        import org.json.JSONException;
        import org.json.JSONObject;

        import java.io.IOException;

public class Cust_post extends ArrayAdapter<String> {

    private Activity context;       //for to get current activity context
    SharedPreferences sh;
    private String[] user_name, title, post, post_type, date;
    private Button playButton,vplay;
    private SeekBar seekBar;
    private MediaPlayer mediaPlayer;

    private Handler handler = new Handler();



    public Cust_post(Activity context, String[] user_name,String[] title,String[] post,String[] post_type,String[] date) {
        //constructor of this class to get the values from main_activity_class

        super(context, R.layout.cust_post, user_name);
        this.context = context;
        this.user_name = user_name;
        this.title = title;
        this.post=post;
        this.post_type=post_type;
        this.date=date;

    }

    @SuppressLint("MissingInflatedId")
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View listViewItem = inflater.inflate(R.layout.cust_post, null, true);

        sh=PreferenceManager.getDefaultSharedPreferences(context);

        TextView t1 = (TextView) listViewItem.findViewById(R.id.tvuname);
        TextView t2 = (TextView) listViewItem.findViewById(R.id.tvtitle);
        TextView t3 = (TextView) listViewItem.findViewById(R.id.tvdate);

        TextView t4 = (TextView) listViewItem.findViewById(R.id.tvpost);



        ImageView img1 = (ImageView) listViewItem.findViewById(R.id.imageView);
        VideoView vd1 = (VideoView) listViewItem.findViewById(R.id.videoView);

        playButton = (Button) listViewItem.findViewById(R.id.playButton);
        vplay = (Button) listViewItem.findViewById(R.id.vplay);
        seekBar = (SeekBar) listViewItem.findViewById(R.id.seekBar);


        // Set the text for other TextViews
        t1.setText(user_name[position]);
        t2.setText(title[position]);
        t3.setText(date[position]);

        if(post_type[position].equalsIgnoreCase("jpg")){

            // Load image using your preferred method (e.g., Picasso, Glide)
            img1.setVisibility(View.VISIBLE);
            String pth = "http://" + sh.getString("ip", "") + "/" + post[position];
            pth = pth.replace("~", "");
            Log.d("img",pth);

            Picasso.with(context)
                    .load(pth)
                    .placeholder(R.drawable.kk)
                    .error(R.drawable.kk)
                    .into(img1);

        }

        if(post_type[position].equalsIgnoreCase("mp4")){


//            vd1.setVisibility(View.VISIBLE);
//
//            String videoPath = "http://" + sh.getString("ip", "") + "/" + post[position];
//            videoPath = videoPath.replace("~", "");
//            Log.d("vdo", videoPath);
//
//            Uri videoUri = Uri.parse(videoPath);
//
//            vd1.setVideoURI(videoUri);
//
//// Create a MediaController
//            MediaController mediaController = new MediaController(context);
//            mediaController.setAnchorView(vd1);
//
//// Set the MediaController to the VideoView
//            vd1.setMediaController(mediaController);
//
//            vd1.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
//                @Override
//                public void onPrepared(MediaPlayer mp) {
//                    // Start playing the video once it's prepared
//                    vd1.start();
//                }
//            });
//
//            vd1.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
//                @Override
//                public void onCompletion(MediaPlayer mp) {
//                    // Optionally, perform any actions when the video playback is completed
//                }
//            });
//
//            vd1.setOnErrorListener(new MediaPlayer.OnErrorListener() {
//                @Override
//                public boolean onError(MediaPlayer mp, int what, int extra) {
//                    // Handle any errors that may occur during video playback
//                    return false;
//                }
//            });

            vplay.setVisibility(View.VISIBLE);
            vd1.setVisibility(View.VISIBLE);
            vplay.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {


            String videoPath = "http://" + sh.getString("ip", "") + "/" + post[position];
            videoPath = videoPath.replace("~", "");
            Log.d("vdo", videoPath);

            Uri videoUri = Uri.parse(videoPath);

            vd1.setVideoURI(videoUri);

// Create a MediaController
            MediaController mediaController = new MediaController(context);
            mediaController.setAnchorView(vd1);

// Add a speaker on/off icon to the left of play/pause controls
            ImageView speakerIcon = new ImageView(context);
            speakerIcon.setImageResource(R.drawable.baseline_volume_up_24); // Replace with your speaker icon resource

// Set layout parameters for the speaker icon
            FrameLayout.LayoutParams speakerParams = new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
            );
            speakerParams.gravity = Gravity.CENTER_VERTICAL | Gravity.START; // Adjust gravity as needed
            speakerParams.setMargins(10, 0, 0, 0); // Adjust margins as needed

// Add the speaker icon to the left of play/pause controls
            mediaController.addView(speakerIcon, 0, speakerParams);

            speakerIcon.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // Handle speaker on/off toggle here
                    // You may toggle audio output, mute, or adjust volume as needed
                    // For example, you can use AudioManager to toggle mute
                    AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
                    boolean isMuted = audioManager.isStreamMute(AudioManager.STREAM_MUSIC);
                    audioManager.setStreamMute(AudioManager.STREAM_MUSIC, !isMuted);

                    // Update the speaker icon based on the mute status
                    speakerIcon.setImageResource(isMuted ? R.drawable.baseline_volume_off_24 : R.drawable.baseline_volume_up_24);
                }
            });

// Set the MediaController to the VideoView
            vd1.setMediaController(mediaController);

            vd1.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    // Start playing the video once it's prepared
                    vd1.start();
                }
            });

            vd1.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mp) {
                    // Optionally, perform any actions when the video playback is completed
                }
            });

            vd1.setOnErrorListener(new MediaPlayer.OnErrorListener() {
                @Override
                public boolean onError(MediaPlayer mp, int what, int extra) {
                    // Handle any errors that may occur during video playback
                    return false;
                }
            });

                }
            });

        }

        if(post_type[position].equalsIgnoreCase("mp3")){


            playButton.setVisibility(View.VISIBLE);
//            seekBar.setVisibility(View.VISIBLE);

            String videoPath = "http://" + sh.getString("ip", "") + "/" + post[position];
            videoPath = videoPath.replace("~", "");
            Log.d("vdo", videoPath);

// Release the existing MediaPlayer instance if it's not null
            if (mediaPlayer != null) {
                mediaPlayer.release();
            }

// Initialize MediaPlayer with the dynamic URL
            mediaPlayer = new MediaPlayer();
            try {
                mediaPlayer.setDataSource(videoPath);
                mediaPlayer.prepare();
                mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    @Override
                    public void onCompletion(MediaPlayer mp) {
                        // Reset the play button text and seek bar when audio is completed
                        playButton.setText("Play And Pause Audio");
                        seekBar.setProgress(0);
                    }
                });
            } catch (IOException e) {
                e.printStackTrace();
            }

            playButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (mediaPlayer.isPlaying()) {
                        // If currently playing, pause the audio
                        mediaPlayer.pause();
                        playButton.setText("Play Audio");
                    } else {
                        // If not playing, start or resume the audio
                        mediaPlayer.start();
                        playButton.setText("Stop Audio");
                        // Update the seek bar while playing
                        updateSeekBar();
                    }
                }
            });

// Set the maximum value of the seek bar to the duration of the audio file
            seekBar.setMax(mediaPlayer.getDuration());

// Update the seek bar progress when the user drags it
            seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    if (fromUser) {
                        mediaPlayer.seekTo(progress);
                    }
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                }

                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                }
            });


        }


        if(post_type[position].equalsIgnoreCase("text")){

            // Handle text display
            t4.setVisibility(View.VISIBLE);
            t4.setText(post[position]);
        }


        sh= PreferenceManager.getDefaultSharedPreferences(context);



        // Set the building number with a circular background
//        TextView buildingNumberTextView = (TextView) listViewItem.findViewById(R.id.bbnum);
//        buildingNumberTextView.setText(building_number[position]);

//        t8.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                // Get the correct blid for the clicked item
////                String clickedBlid = blid[position];
////
////                // Save the blid in SharedPreferences
////                sh.edit().putString("blid", clickedBlid).apply();
//
//                // Redirect to Hks_chat_with_user.java with the correct blid
//                Intent chatIntent = new Intent(context, Hks_chat_with_user.class);
//                chatIntent.putExtra("ownerId", clickedBlid); // Pass the correct blid as an extra
//                context.startActivity(chatIntent);
//            }
//        });


//        buildingNumberTextView.setBackgroundResource(R.drawable.cir2); // Replace with your circular background drawable

        return listViewItem;
    }



    // Method to update the seek bar progress while playing
    private void updateSeekBar() {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            seekBar.setProgress(mediaPlayer.getCurrentPosition());
            // Delayed execution of this method to update seek bar every 100 milliseconds
            handler.postDelayed(this::updateSeekBar, 100);
        }
    }


    private TextView setText(String string) {
        // TODO Auto-generated method stub
        return null;
    }

}