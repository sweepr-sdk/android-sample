package com.sweepr.samples.nuvo.ui.onboarding.fragments

import android.content.Context
import android.content.DialogInterface
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import com.sweepr.backend.ApiException
import com.sweepr.backend.model.Consumer
import com.sweepr.framework.logs.Log
import com.sweepr.framework.mobile.R.string
import com.sweepr.framework.mobile.SweeprClient
import com.sweepr.framework.resolution.models.Auth
import com.sweepr.framework.shared.SweeprResultCallback
import com.sweepr.samples.nuvo.databinding.FragmentRegisterBinding
import com.sweepr.samples.nuvo.ui.onboarding.OnboardingInterface
import org.json.JSONException
import org.json.JSONObject

class RegisterFragment : Fragment() {
    private lateinit var binding: FragmentRegisterBinding

    var alertDialogBuilder: AlertDialog.Builder? = null
    var progressDialog: AlertDialog? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentRegisterBinding.inflate(layoutInflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        alertDialogBuilder = AlertDialog.Builder(requireActivity())
        binding.registerButton.setOnClickListener {
            val firstName =
                binding.firstNameEditText.text.toString().trim { it <= ' ' }
            val lastName =
                binding.lastNameEditText.text.toString().trim { it <= ' ' }
            val email = binding.emailEditText.text.toString().trim { it <= ' ' }
            val password =
                binding.passwordEditText.text.toString().trim { it <= ' ' }
            val confirmPassword =
                binding.confirmPasswordEditText.text.toString().trim { it <= ' ' }
            if (firstName.equals("", ignoreCase = true)) {
                binding.firstNameEditText.error =
                    this@RegisterFragment.getString(string.sweepr_registerfragment_missing_name)
            } else if (lastName.equals("", ignoreCase = true)) {
                binding.lastNameEditText.error =
                    this@RegisterFragment.getString(string.sweepr_registerfragment_missing_surname)
            } else if (email.equals("", ignoreCase = true)) {
                binding.emailEditText.error =
                    this@RegisterFragment.getString(string.sweepr_registerfragment_missing_email)
            } else if (password.equals("", ignoreCase = true)) {
                binding.passwordEditText.error =
                    this@RegisterFragment.getString(string.sweepr_registerfragment_missing_password)
            } else if (password.length < 8) {
                binding.passwordEditText.error =
                    this@RegisterFragment.getString(string.sweepr_registerfragment_password_broken_rule)
            } else if (confirmPassword.equals("", ignoreCase = true)) {
                binding.confirmPasswordEditText.error =
                    this@RegisterFragment.getString(string.sweepr_registerfragment_missing_password_confirmation)
            } else {
                hideKeyboard()
                SweeprClient.getLoginManager().register(
                    firstName,
                    lastName,
                    email,
                    password,
                    object : SweeprResultCallback<Consumer?> {
                        override fun onSuccess(consumer: Consumer?) {
                            SweeprClient.getLoginManager()
                                .login(email, password, object : SweeprResultCallback<Auth?> {
                                    override fun onSuccess(data: Auth?) {
                                        progressDialog?.dismiss()
                                        afterSuccessfulRegistration()
                                    }

                                    override fun onFailure(e: Exception) {
                                        progressDialog?.dismiss()
                                        showError(e)
                                    }
                                })
                        }

                        override fun onFailure(e: Exception) {
                            progressDialog?.dismiss()
                            showError(e)
                        }
                    })
                alertDialogBuilder?.setMessage(string.sweepr_registerfragment_registration_in_progress)
                progressDialog =
                    alertDialogBuilder?.create()
                progressDialog?.setCanceledOnTouchOutside(false)
                progressDialog?.setTitle(string.app_name)
                progressDialog?.show()
            }
        }
        binding.passwordEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(charSequence: CharSequence, i: Int, i1: Int, i2: Int) {}
            override fun onTextChanged(charSequence: CharSequence, i: Int, i1: Int, i2: Int) {
                if (binding.confirmPasswordEditText.text.isNotEmpty()) {
                    binding.confirmPasswordEditText.setText("")
                }
                binding.confirmPasswordEditText.isEnabled = charSequence.length > 8
            }

            override fun afterTextChanged(editable: Editable) {}
        })
        binding.confirmPasswordEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(charSequence: CharSequence, i: Int, i1: Int, i2: Int) {}
            override fun onTextChanged(charSequence: CharSequence, i: Int, i1: Int, i2: Int) {
                if (charSequence.isNotEmpty()) {
                    val password = binding.passwordEditText.text.toString()
                    if (password.equals(charSequence.toString(), ignoreCase = true)) {
                        binding.confirmPasswordEditText.error = null
                    } else {
                        binding.confirmPasswordEditText.error =
                            this@RegisterFragment.getString(string.sweepr_registerfragment_password_mismatch)
                    }
                }
            }

            override fun afterTextChanged(editable: Editable) {}
        })
        binding.haveAccountAlready.setOnClickListener {
            activity?.onBackPressed()
        }
    }

    private fun showError(e: Exception) {
        val sweeprException = e as ApiException
        try {
            val responseMessage = getResponseMessage(sweeprException)
            alertDialogBuilder?.setMessage(responseMessage)
            alertDialogBuilder?.setPositiveButton(
                string.sweepr_button_ok,
                null as DialogInterface.OnClickListener?
            )
            val alertDialog = alertDialogBuilder?.create()
            alertDialog?.setTitle(string.app_name)
            alertDialog?.show()
        } catch (var5: JSONException) {
            Log.e("RegisterFragment", "Failed to register: " + var5.localizedMessage, e)
        }
    }

    private fun afterSuccessfulRegistration() {
        if(activity is OnboardingInterface){
            (activity as OnboardingInterface).onRegistrationSuccessfull()
        }
    }

    private fun hideKeyboard() {
        val imm = requireActivity().getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(binding.passwordEditText.windowToken, 0)
    }

    companion object {
        private const val TAG = "RegisterFragment"

        @Throws(JSONException::class)
        private fun getResponseMessage(e: ApiException?): String {
            return if (e == null) {
                "Unknown"
            } else {
                val body = e.responseBody
                if (body != null && !body.isEmpty()) {
                    val errorContent = JSONObject(body)
                    var responseMessage = errorContent.getString("message")
                    val subErrors = errorContent.getJSONArray("subErrors")
                    if (subErrors.length() > 0) {
                        responseMessage = """
                            $responseMessage

                            """.trimIndent()
                        for (i in 0 until subErrors.length()) {
                            responseMessage = """
                                $responseMessage
                                ${subErrors.getString(i)}
                                """.trimIndent()
                        }
                    }
                    responseMessage
                } else {
                    "Unable to contact server"
                }
            }
        }
    }
}