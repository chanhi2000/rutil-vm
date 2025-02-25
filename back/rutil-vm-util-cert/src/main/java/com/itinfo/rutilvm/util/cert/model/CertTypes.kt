package com.itinfo.rutilvm.util.cert.model

import java.util.concurrent.ConcurrentHashMap

enum class HostCertType(override val alias: String, override val path: String) : CertType {
	VDSM("VDSM Certificate", "/etc/pki/vdsm/certs/vdsmcert.pem"),
	VDSM_CA("VDSM CA Certificate", "/etc/pki/vdsm/certs/cacert.pem"),
	UNKNOWN("", "");

	companion object {
		private val findMap: MutableMap<String, CertType> = ConcurrentHashMap<String, CertType>()
		init {
			HostCertType.values().forEach { findMap[it.alias] = it }
		}
		@JvmStatic fun findByAlias(alias: String): CertType = findMap.entries.firstOrNull { it.value.alias == alias }?.value ?: UNKNOWN
	}
}

enum class EngineCertType(override val alias: String, override val path: String) : CertType {
	ENGINE_SERVER("Engine Server Certificate",  "/etc/pki/ovirt-engine/certs/engine.cer"),
	ENGINE_CA("Engine CA Certificate", "/etc/pki/ovirt-engine/ca.pem"),
	UNKNOWN("", "");

	companion object {
		private val findMap: MutableMap<String, CertType> = ConcurrentHashMap<String, CertType>()
		init {
			EngineCertType.values().forEach { findMap[it.alias] = it }
		}
		@JvmStatic fun findByAlias(alias: String): CertType = findMap.entries.firstOrNull { it.value.alias == alias }?.value ?: UNKNOWN
	}
}

interface CertType {
	val alias: String
	val path: String
}
