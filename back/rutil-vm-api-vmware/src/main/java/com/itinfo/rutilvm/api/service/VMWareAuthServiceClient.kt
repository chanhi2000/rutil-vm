package com.itinfo.rutilvm.api.service

import com.itinfo.rutilvm.api.configuration.AuthService
import com.itinfo.rutilvm.api.model.vmware.VMWareSessionId
import com.itinfo.rutilvm.common.LoggerDelegate
import okhttp3.Credentials
import org.springframework.stereotype.Service
import retrofit2.Response

interface VMWareAuthService {

}

@Service
open class VMWareAuthServiceClient(
	private val authService: AuthService
): VMWareAuthService {
	@Throws(Exception::class)
	open fun createSession(username: String, password: String): VMWareSessionId {
		log.info("createSession...")
		val basicAuth: String = Credentials.basic(username, password)
		val call = authService.createSession(basicAuth)
		// Execute the call synchronously
		val response: Response<VMWareSessionId> = call.execute()
		if (response.isSuccessful) {
			return response.body() ?: throw RuntimeException("Response body is null")
		} else {
			throw RuntimeException("Failed to fetch engine SSH public key: ${response.errorBody()?.string()}")
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
