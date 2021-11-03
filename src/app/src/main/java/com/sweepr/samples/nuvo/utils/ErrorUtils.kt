package com.sweepr.samples.nuvo.utils

import com.google.gson.Gson
import com.sweepr.backend.ApiException



object  ErrorUtils {
    data class ErrorResponseModel(
        val timestamp: String?,
        val code: String?,
        val message: String?
    )

    fun getErrorMessage(exception: ApiException) : String {
        val stringBody = exception.responseBody
        val gson = Gson()
        val responseMessage = gson.getAdapter(ErrorResponseModel::class.java).fromJson(stringBody)
        return responseMessage.message ?: ""
    }
}