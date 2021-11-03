package com.sweepr.samples.nuvo.ui.onboarding

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.commit
import com.sweepr.framework.mobile.ui.fragments.SweeprFragment
import com.sweepr.samples.nuvo.R
import com.sweepr.samples.nuvo.databinding.ActivityOnboardingBinding
import com.sweepr.samples.nuvo.ui.onboarding.fragments.LoginFragment
import com.sweepr.samples.nuvo.ui.onboarding.fragments.RegisterFragment
import com.sweepr.samples.nuvo.utils.StateManager

class OnboardingActivity : AppCompatActivity(), OnboardingInterface {
    private lateinit var binding: ActivityOnboardingBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityOnboardingBinding.inflate(layoutInflater)
        setContentView(binding.root)


        supportFragmentManager.commit {
            replace(R.id.rootFL, LoginFragment())
            disallowAddToBackStack()
        }
    }

    override fun onRegistrationRequested() {
        supportFragmentManager.commit {
            replace(R.id.rootFL, RegisterFragment())
            addToBackStack("backToLogin")
        }
    }

    override fun onRegistrationSuccessfull() {
        supportFragmentManager.commit {
            replace(R.id.rootFL, SweeprFragment())
            disallowAddToBackStack()
        }
    }
}
