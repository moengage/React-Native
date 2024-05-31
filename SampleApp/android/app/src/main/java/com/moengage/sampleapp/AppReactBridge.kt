package com.moengage.sampleapp

import android.annotation.SuppressLint
import android.content.Context.MODE_PRIVATE
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class AppReactBridge(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {


    override fun getName() = "AppReactBridge"

    @SuppressLint("ApplySharedPref")
    @ReactMethod
    fun updateAppId(appId: String) {
        // Save App Id to Shared Preference
        reactContext.getSharedPreferences("MoESampleAppPref", MODE_PRIVATE)
            .edit()
            .putString("AppId", appId)
            .commit()
    }
}