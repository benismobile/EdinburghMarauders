
package com.example.android.location;

import android.content.Context;
import android.location.Location;
import com.example.android.location.R;
import android.widget.Toast ;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.location.LocationClient;

import com.google.android.gms.location.LocationRequest;
import android.view.View;
import android.os.Bundle;



public class WebAppInterface implements       
        GooglePlayServicesClient.ConnectionCallbacks,
        GooglePlayServicesClient.OnConnectionFailedListener  
{

Context mContext;
private LocationClient mLocationClient;
private LocationRequest mLocationRequest;

boolean mUpdatesRequested = false;



WebAppInterface(Context c) {
 
mContext = c;
mLocationClient = new LocationClient(mContext, this, this);
mLocationRequest = LocationRequest.create();

        
        mLocationRequest.setInterval(LocationUtils.UPDATE_INTERVAL_IN_MILLISECONDS);

        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

        mLocationRequest.setFastestInterval(LocationUtils.FAST_INTERVAL_CEILING_IN_MILLISECONDS);



    }

  //  @JavascriptInterface
 public void showToast(String toast) 
{


     Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
}


// GET LOCATION
 public String getLocation() {

Toast.makeText(mContext,"Android.getlocation called",Toast.LENGTH_SHORT).show();

boolean isConnected = servicesConnected() ;


if(mLocationClient == null)
{

Toast.makeText(mContext,"mLocationClient is null",Toast.LENGTH_SHORT).show();

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

         String latlon = LocationUtils.getLatLngJSON(mContext, currentLocation);

   return latlon ;

}

return "" ;


    }



 private boolean servicesConnected() {

        // Check that Google Play services is available
        int resultCode =             GooglePlayServicesUtil.isGooglePlayServicesAvailable(mContext);

        // If Google Play services is available
      if (ConnectionResult.SUCCESS == resultCode) {

            // Continue
            return true;
          }
		Toast.makeText(mContext, "Google Play Services Not Available",Toast.LENGTH_SHORT).show();

	return false;

    }

  
@Override
    public void onConnected(Bundle bundle) {

Toast.makeText(mContext, "On Connected",Toast.LENGTH_SHORT).show();


         
    }

@Override
    public void onDisconnected() {
Toast.makeText(mContext, "On DisConnected",Toast.LENGTH_SHORT).show();

    }



@Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

       Toast.makeText(mContext, "Connection Failed.",
                Toast.LENGTH_SHORT).show();


}


}
