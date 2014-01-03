package com.example.android.location ;

import android.app.Activity ;
import android.os.Bundle ;
import android.content.Intent ;
import android.widget.EditText ;
import android.view.View;
import android.webkit.WebView ;
import android.annotation.SuppressLint ;
import android.webkit.WebSettings ;
import android.os.* ;
import android.support.v7.app.ActionBarActivity ;
import android.support.v7.widget.SearchView;
import android.view.Menu ;
import android.view.MenuItem ;
import android.view.MenuInflater ;
import android.widget.Toast ;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.location.LocationClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import android.location.Location;
import android.content.SharedPreferences;
import android.content.Context;




public class WebViewActivity extends ActionBarActivity
implements LocationListener,
   GooglePlayServicesClient.ConnectionCallbacks,
   GooglePlayServicesClient.OnConnectionFailedListener


{

private LocationClient mLocationClient;
private LocationRequest mLocationRequest;
boolean mUpdatesRequested = false;
WebView webview ;
SharedPreferences mPrefs;
SharedPreferences.Editor mEditor;



@SuppressLint("NewApi")
@Override
protected void onCreate(Bundle savedInstanceState) {

super.onCreate(savedInstanceState);

 // Make sure we're running on Honeycomb or higher to use ActionBar APIs
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            // Show the Up button in the action bar.
            getActionBar().setDisplayHomeAsUpEnabled(true);
        }



 webview = new WebView(this);
 setContentView(webview);

 WebSettings webSettings = webview.getSettings();
 webSettings.setJavaScriptEnabled(true);



 webSettings.setAllowContentAccess(true) ;
 webSettings.setBlockNetworkImage (false) ;
 webSettings.setUseWideViewPort(true);

 webSettings.setLoadsImagesAutomatically (true) ;

// WHATEVER YOU DO: DONT USE setAllowFileAccess* ON GINGERBREAB - Causes nasty crach
// BUT needed to get the local gpx loading to work
// webSettings.setAllowFileAccess(true) ;
// webSettings.setAllowFileAccessFromFileURLs(true) ;

webview.addJavascriptInterface(new WebAppInterface(this),"Android");


webview.loadUrl("file:///android_asset/html/openstackSample2.html");

// webview.loadUrl("file:///android_asset/html/openstacktestlink3.html");


mLocationClient = new LocationClient(this, this, this);
mLocationRequest = LocationRequest.create();

        mLocationRequest.setInterval(LocationUtils.UPDATE_INTERVAL_IN_MILLISECONDS);

                mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

               mLocationRequest.setFastestInterval(LocationUtils.FAST_INTERVAL_CEILING_IN_MILLISECONDS);

 // Open Shared Preferences
        mPrefs = getSharedPreferences(LocationUtils.SHARED_PREFERENCES, Context.MODE_PRIVATE);

        // Get an editor
        mEditor = mPrefs.edit();
        mUpdatesRequested = true ;
        mEditor.putBoolean(LocationUtils.KEY_UPDATES_REQUESTED, mUpdatesRequested);
        mEditor.commit();

} // ends onCreate



@Override
public void onStop() {

// If the client is connected
  if (mLocationClient.isConnected())
  {
            stopPeriodicUpdates();
  }

        // After disconnect() is called, the client is considered "dead".
        mLocationClient.disconnect();

        super.onStop();
} // end onStop()



    @Override
    public void onPause() {

        // Save the current setting for updates
        mEditor.putBoolean(LocationUtils.KEY_UPDATES_REQUESTED, mUpdatesRequested);
        mEditor.commit();

        super.onPause();
    }


    @Override
    public void onStart() {

        super.onStart();

        /*
         * Connect the client. Don't re-start any requests here;
         * instead, wait for onConnected() callback
         */
        mLocationClient.connect();

}

@Override
public void onResume()
{

        super.onResume();

        // If the app already has a setting for getting location updates, get it
        if (mPrefs.contains(LocationUtils.KEY_UPDATES_REQUESTED)) {
        {
            mUpdatesRequested = mPrefs.getBoolean(LocationUtils.KEY_UPDATES_REQUESTED, false);
        }
        // Otherwise, turn off location updates until requested
        } else {
            mEditor.putBoolean(LocationUtils.KEY_UPDATES_REQUESTED, false);
            mEditor.commit();
        }

}







@Override
public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu items for use in the action bar
    MenuInflater inflater = getMenuInflater();
    inflater.inflate(R.menu.webview_activity_actions, menu);
    return super.onCreateOptionsMenu(menu);
}


@Override
public boolean onOptionsItemSelected(MenuItem item) {
    // Handle presses on the action bar items
    switch (item.getItemId()) {
        case R.id.get_location:
            getLocation();
            return true;
        default:
            return super.onOptionsItemSelected(item);
    }
}




public void getLocation()
{

Toast.makeText(this,"Android.getLocation called",Toast.LENGTH_SHORT).show();
webview.loadUrl("javascript:getLocation();");

}



  private void startUpdates() {
        mUpdatesRequested = true;

        if (servicesConnected()) {
            startPeriodicUpdates();
        }
    }

  private void stopUpdates() {
        mUpdatesRequested = false;

        if (servicesConnected()) {
            stopPeriodicUpdates();
        }
    }





    private void startPeriodicUpdates() {

        mLocationClient.requestLocationUpdates(mLocationRequest, this);
          }

      private void stopPeriodicUpdates() {
        mLocationClient.removeLocationUpdates(this);
      }


    @Override
    public void onLocationChanged(Location location) {

 Toast.makeText(this,"Android.onLocationChanged",Toast.LENGTH_SHORT).show();

// webview.loadUrl("javascript:onLocationUpdate();");


	 // Display the current location in the UI
       String latlon = LocationUtils.getLatLngJSON(this, location);



     // call javascript method to update location
  webview.loadUrl("javascript:onLocationUpdateP('" + latlon +"');");


    }


private boolean servicesConnected() {

// Check that Google Play services is available
        int resultCode =              GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);

        // If Google Play services is available
        if (ConnectionResult.SUCCESS == resultCode)
	   {

            // Continue
            return true;
	   }


Toast.makeText(this, "Google Play Services NotAvailable",  Toast.LENGTH_SHORT).show();

	return false;

}

    @Override
    public void onConnected(Bundle dataBundle)
    {
	    Toast.makeText(this, "On Connected: " + mUpdatesRequested,Toast.LENGTH_SHORT).show();
       if(mUpdatesRequested)
      {
        startPeriodicUpdates() ;
      }
    }

    @Override
    public void onDisconnected()
    {
	Toast.makeText(this, "On Disconnected",Toast.LENGTH_SHORT).show();


    }


    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

Toast.makeText(this, "Connection Failed.",Toast.LENGTH_SHORT).show();


}




}
