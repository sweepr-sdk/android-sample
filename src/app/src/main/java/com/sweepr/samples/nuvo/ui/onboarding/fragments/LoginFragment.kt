package com.sweepr.samples.nuvo.ui.onboarding.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import com.sweepr.framework.mobile.SweeprClient
import com.sweepr.framework.resolution.models.Auth
import com.sweepr.framework.shared.SweeprResultCallback
import com.sweepr.samples.nuvo.R
import com.sweepr.samples.nuvo.clearStack
import com.sweepr.samples.nuvo.databinding.FragmentLoginBinding
import com.sweepr.samples.nuvo.ui.MainActivity
import com.sweepr.samples.nuvo.ui.onboarding.OnboardingInterface
import com.sweepr.samples.nuvo.utils.StateManager

class LoginFragment : Fragment() {

    private lateinit var binding: FragmentLoginBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentLoginBinding.inflate(layoutInflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupUI()
    }

    private fun setupUI(){
        binding.loginBTN.setOnClickListener {
            toggleLoginBtnVisibility()
            login(username, password)
        }

        binding.registerBTN.setOnClickListener {
            val handler = activity as? OnboardingInterface
            handler?.onRegistrationRequested()
        }
    }

    private fun login(username: String?, password: String?) {
        if(username.isNullOrEmpty() || password.isNullOrEmpty()){
            Toast.makeText(this.activity, getString(R.string.invalid_credentials), Toast.LENGTH_LONG).show()
            toggleLoginBtnVisibility()
            return
        }

        SweeprClient.getLoginManager().login(username, password, logInHandler)
    }

    private val username: String
        get() {
            return binding.usernameET.text?.toString()?.trim() ?: ""
        }

    private val password: String
        get() {
            return binding.passwordET.text?.toString()?.trim() ?: ""
        }

    private fun toggleLoginBtnVisibility(){
        //Remove button and show activity indicator
        activity?.runOnUiThread {
            //if register loader is visible while we are trying to toggle login that means registration is ongoing, toggle it
            if(binding.registerPB.isVisible){
                toggleRegisterBtnVisibility()
            } else {
                binding.loginPB.isVisible = !binding.loginPB.isVisible
                binding.loginBTN.isVisible = !binding.loginBTN.isVisible
                binding.registerBTN.isVisible = !binding.registerBTN.isVisible
            }
        }
    }
    private fun toggleRegisterBtnVisibility(){
        //Remove button and show activity indicator
        activity?.runOnUiThread {
            binding.registerPB.isVisible = !binding.registerPB.isVisible
            binding.registerBTN.isVisible = !binding.registerBTN.isVisible
        }
    }

    private val logInHandler = object: SweeprResultCallback<Auth> {
        override fun onSuccess(auth: Auth?) {
            toggleLoginBtnVisibility()
            StateManager.saveLoginCredentials(this@LoginFragment.requireContext(), username, password)
            val intent = Intent(this@LoginFragment.requireContext(), MainActivity::class.java)
            intent.clearStack()
            startActivity(intent)
        }

        override fun onFailure(error: Exception?) {
            toggleLoginBtnVisibility()
            Toast.makeText(this@LoginFragment.requireContext(), getString(R.string.login_failure), Toast.LENGTH_LONG).show()
        }
    }
}
