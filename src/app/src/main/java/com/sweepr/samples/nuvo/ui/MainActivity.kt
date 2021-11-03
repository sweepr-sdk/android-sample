package com.sweepr.samples.nuvo.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.sweepr.framework.mobile.SweeprClient
import com.sweepr.framework.mobile.interfaces.LogoutInterface
import com.sweepr.samples.nuvo.R
import com.sweepr.samples.nuvo.clearStack
import com.sweepr.samples.nuvo.ui.onboarding.OnboardingActivity
import com.sweepr.samples.nuvo.databinding.ActivityMainBinding
import com.sweepr.samples.nuvo.utils.StateManager
import com.sweepr.samples.nuvo.ui.SplashActivity

class MainActivity : AppCompatActivity(), LogoutInterface {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        SweeprClient.getLoginManager().logoutInterface = this
    }

    override fun onLogout() {
        StateManager.logOut(this)
        val intent = Intent(this, OnboardingActivity::class.java)
        intent.clearStack()
        startActivity(intent)
    }
}