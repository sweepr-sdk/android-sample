package com.sweepr.samples.nuvo.ui

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.sweepr.framework.mobile.SweeprClient
import com.sweepr.framework.resolution.models.Auth
import com.sweepr.framework.shared.SweeprResultCallback
import com.sweepr.samples.nuvo.NuvoApp
import com.sweepr.samples.nuvo.R
import com.sweepr.samples.nuvo.clearStack
import com.sweepr.samples.nuvo.databinding.ActivityMainBinding
import com.sweepr.samples.nuvo.databinding.ActivitySplashBinding
import com.sweepr.samples.nuvo.ui.onboarding.OnboardingActivity
import com.sweepr.samples.nuvo.utils.StateManager
import java.lang.Exception

class SplashActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySplashBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        StateManager.setupSweepr(applicationContext)

        if(SweeprClient.getLoginManager().isLoggedIn) {
            val intent = Intent(this@SplashActivity, MainActivity::class.java)
            intent.clearStack()
            startActivity(intent)
        } else {
            val intent = Intent(this@SplashActivity, OnboardingActivity::class.java)
            intent.clearStack()
            startActivity(intent)
        }
    }
}