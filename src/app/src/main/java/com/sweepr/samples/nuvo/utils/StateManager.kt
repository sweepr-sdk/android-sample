package com.sweepr.samples.nuvo.utils

import android.content.Context
import com.sweepr.framework.mobile.SweeprClient
import com.sweepr.framework.mobile.config.*
import com.sweepr.framework.resolution.models.Auth
import com.sweepr.framework.shared.SweeprResultCallback
import com.sweepr.samples.nuvo.BuildConfig


object StateManager {

    /**
     * If there are saved credentials, just use them
     */
    fun checkLoginState(context: Context, logInHandler: SweeprResultCallback<Auth>) {
        val sharedPreferences = context.getSharedPreferences("nuvo", Context.MODE_PRIVATE)
        val username = sharedPreferences.getString("username", "")
        val password = sharedPreferences.getString("password", "")
        if(!username.isNullOrBlank() && !password.isNullOrBlank()) {
            setupSweepr(context)
            SweeprClient.getLoginManager().login(username, password, logInHandler)
        } else {
            logInHandler.onFailure(Exception("No credentials"))
        }
    }

    fun saveLoginCredentials(context: Context, username: String?, password: String?) {
        val sharedPreferences = context.getSharedPreferences("nuvo", Context.MODE_PRIVATE)
        sharedPreferences.edit().apply {
            putString("username", username)
            putString("password", password)
            apply()
        }
    }

    fun logOut(context: Context) {
        val sharedPreferences = context.getSharedPreferences("nuvo", Context.MODE_PRIVATE)
        sharedPreferences.edit().apply {
            remove("username")
            remove("password")
            apply()
        }
    }

    fun setupSweepr(applicationContext: Context){
        val userAgent = BuildConfig.USER_AGENT + "/" + SweeprClient.getVersionName(
            applicationContext
        )
        val ssoConfig = if (!BuildConfig.SSO_URL.equals("")) SweeprSSOConfiguration(
            BuildConfig.SSO_URL,
            "",
            BuildConfig.SSO_REDIRECT_URL
        ) else null

        val config = SweeprConfiguration(
            BuildConfig.APP_NAME,
            SweeprServerConfiguration(BuildConfig.API_URL, userAgent, null, ServerUtterancesKind.Shared),
            SweeprMQTTConfiguration(
                BuildConfig.MQTT_URL,
                userAgent,
                BuildConfig.MQTT_LOGIN,
                BuildConfig.MQTT_PASSWORD
            ),
            SweeprUXConfiguration(BuildConfig.APP_NAME, BuildConfig.APP_CUSTOM_THEME_FILE, true, true, BuildConfig.ASSETS_LOCAL_PATH, BuildConfig.ASSETS_TIMESTAMP),
            null,
            ssoConfig
        )

        SweeprClient.start(config, applicationContext)
    }
}