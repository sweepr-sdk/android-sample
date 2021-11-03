package com.sweepr.samples.nuvo

import android.app.Application
import android.content.Intent
import com.sweepr.framework.logs.Log
import com.sweepr.framework.logs.ShipBookDestination

class NuvoApp : Application() {

    override fun onCreate() {
        super.onCreate()

        if (BuildConfig.SHIPBOOK_APP_ID.isNotEmpty()) {
            Log.add(
                ShipBookDestination(
                    this,
                    BuildConfig.SHIPBOOK_APP_ID,
                    BuildConfig.SHIPBOOK_APP_KEY
                )
            )
        }
    }
}

fun Intent.clearStack() {
    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
}