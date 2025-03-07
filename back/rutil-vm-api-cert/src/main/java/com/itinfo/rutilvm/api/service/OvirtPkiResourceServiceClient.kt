package com.itinfo.rutilvm.api.service

import com.itinfo.rutilvm.api.configuration.PkiResourceService
import com.itinfo.rutilvm.common.LoggerDelegate
import retrofit2.Response
import org.springframework.stereotype.Service

@Service
open class OvirtPkiResourceServiceClient(
	private val pkiResourceService: PkiResourceService
) {
	@Throws(Exception::class)
	open fun fetchEngineSshPublicKey(): String {
		log.info("fetchEngineSshPublicKey...")
		// Create the call for the engine-certificate in OPENSSH-PUBKEY format
		val call = pkiResourceService.getCertificate("engine-certificate", "OPENSSH-PUBKEY")
		// Execute the call synchronously
		val response: Response<String> = call.execute()
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
