
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

import android.webkit.JavascriptInterface;


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

    }

 @JavascriptInterface
 public void showToast(String toast)
{


     Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
}


@JavascriptInterface
 public String getLocation() {

// Toast.makeText(mContext,"AndroidWebAppInterface.getlocation called",Toast.LENGTH_SHORT).show();

	if(servicesConnected()==false) return "" ;


	if(mLocationClient != null && mLocationClient.isConnected() == false)
	{
		Toast.makeText(mContext,"AndroidWebAppInterface: mLocationClient is not connected!",Toast.LENGTH_SHORT).show();
  		mLocationClient.connect() ;
	
                if(mLocationClient.isConnected())
		{

           		// Get the current location
            		Location currentLocation = mLocationClient.getLastLocation();
         		String latlon = LocationUtils.getLatLngJSON(mContext, currentLocation);
   			return latlon ;

		}
	} //mLocationClient already connected
	else
	{
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
		Toast.makeText(mContext, "WebAppInterface Google Play Services Not Available",Toast.LENGTH_SHORT).show();

	return false;

    }


@Override
    public void onConnected(Bundle bundle) {

// Toast.makeText(mContext, "WebAppInterface On Connected",Toast.LENGTH_SHORT).show();



    }

@Override
    public void onDisconnected() {
// Toast.makeText(mContext, "WebAppInterface On DisConnected",Toast.LENGTH_SHORT).show();

    }



@Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

       Toast.makeText(mContext, "WebAppInterface Connection Failed.",
                Toast.LENGTH_SHORT).show();


}


}
