
package com.example.android.location;

import android.content.Context;
import android.location.Location;
import com.example.android.location.R;
import android.widget.Toast ;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.location.LocationClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import android.os.Bundle;
import android.webkit.JavascriptInterface;

/**
 * Defines app-wide constants and utilities
 */
public class WebAppInterfaceOld implements
        GooglePlayServicesClient.ConnectionCallbacks,
        GooglePlayServicesClient.OnConnectionFailedListener  {

Context mContext;
private LocationClient mLocationClient;


    /** Instantiate the interface and set the context */
    WebAppInterfaceOld(Context c) {
        mContext = c;
 mLocationClient = new LocationClient(mContext, this, this);


    }

 @JavascriptInterface
 public void showToast(String toast) {


     Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    }



@JavascriptInterface
public String getLocation() {

Toast.makeText(mContext,"Android.getlocation() called",Toast.LENGTH_SHORT).show();

boolean isConnected = servicesConnected() ;

Toast.makeText(mContext,new Boolean(isConnected).toString(),Toast.LENGTH_SHORT).show();

if(mLocationClient == null)
{
Toast.makeText(mContext,"mLocationClient is null!",Toast.LENGTH_SHORT).show();
}

if(mLocationClient.isConnected() == false)
{
Toast.makeText(mContext,"mLocationClient is not connected!",Toast.LENGTH_SHORT).show();
  mLocationClient.connect() ;
}
else
{
           // Get the current location
            Location currentLocation = mLocationClient.getLastLocation();

 // Display the current location in the UI
         String latlon = LocationUtils.getLatLngJSON(mContext, currentLocation);
 Toast.makeText(mContext, latlon, Toast.LENGTH_SHORT).show();

   return latlon ;

}

return "" ;


    }



    private boolean servicesConnected() {

 // Toast.makeText(mContext, "Check location services connected", Toast.LENGTH_SHORT).show();


        // Check that Google Play services is available
        int resultCode =
                GooglePlayServicesUtil.isGooglePlayServicesAvailable(mContext);

        // If Google Play services is available
        if (ConnectionResult.SUCCESS == resultCode) {

            // Continue
            return true;
             }


	return false;

    }

// @Override
    public void onConnected(Bundle dataBundle) {
        Toast.makeText(mContext, "Connected", Toast.LENGTH_SHORT).show();

    }

   // @Override
    public void onDisconnected() {
        Toast.makeText(mContext, "Disconnected. Please re-connect.",
                Toast.LENGTH_SHORT).show();
    }


 // @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

       Toast.makeText(mContext, "Connection Failed.",
                Toast.LENGTH_SHORT).show();


}


}
