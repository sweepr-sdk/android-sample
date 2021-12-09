package com.sweepr.demo.nuvo2

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.navigation.fragment.findNavController
import com.sweepr.framework.mobile.SweeprClient
import com.sweepr.framework.shared.SweeprResultCallback
import com.sweepr.demo.nuvo2.databinding.FragmentLoginBinding
import java.lang.Exception

/**
 * A simple login form.
 */
class LoginFragment : Fragment() {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.buttonLogin.setOnClickListener {
            val email = binding.editEmail.text.toString()
            val password = binding.editPassword.text.toString()

            if (email.isNotBlank() && password.isNotBlank()) {
                binding.buttonLogin.isEnabled = false
                authenticate(email, password)
            }
        }
    }

    private fun authenticate(email: String, password: String) {

        SweeprClient.authenticate("MyName", email, password, "", "androidapp", null, null,
            object: SweeprResultCallback<Boolean> {
                override fun onSuccess(p0: Boolean?) {
                    Log.d(TAG, "Authenticated")

                    findNavController().navigate(R.id.action_LoginFragment_to_SecondFragment)
                    binding.buttonLogin.isEnabled = true
                }

                override fun onFailure(p0: Exception?) {
                    Log.d(TAG, "Failed to authenticate")

                    Toast.makeText(this@LoginFragment.requireContext(), getString(R.string.login_failure), Toast.LENGTH_LONG).show()
                    binding.buttonLogin.isEnabled = true
                }
            })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    companion object {
        private const val TAG = "LoginFragment"
    }
}
