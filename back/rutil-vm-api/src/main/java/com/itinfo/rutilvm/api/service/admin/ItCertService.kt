package com.itinfo.rutilvm.api.service.admin

import com.itinfo.rutilvm.api.cert.CertManager
import com.itinfo.rutilvm.api.configuration.CertConfig
import com.itinfo.rutilvm.api.service.OvirtPkiResourceServiceClient
import com.itinfo.rutilvm.api.model.cert.toCertManagers
import com.itinfo.rutilvm.api.model.computing.HostVo
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.service.computing.ItHostService
import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import kotlin.jvm.Throws

interface ItCertService {
	/**
	 * [ItCertService.findAll]
	 * oVirt 관련 인증서 전체 조회
	 */
	fun findAll(): List<CertManager>
	/**
	 * [ItCertService.findOne]
	 * oVirt 관련 인증서 상세 조회
	 */
	fun findOne(alias: String, address: String): CertManager?

	@Throws(Exception::class)
	fun findEngineSshPublicKey(): String
}


@Service
class CertServiceImpl(

): BaseService(), ItCertService {
	@Autowired private lateinit var iHost: ItHostService
	@Autowired private lateinit var certConfig: CertConfig
	@Autowired private lateinit var pkiServiceClient: OvirtPkiResourceServiceClient

	override fun findAll(): List<CertManager> {
		log.info("findAll ...")
		val hosts: List<HostVo> = iHost.findAll()
		val certs: List<CertManager> = hosts.toCertManagers(certConfig.ovirtSSHPrvKey) + certConfig.engineCertManagers()
		return certs
	}

	override fun findOne(alias: String, address: String): CertManager? {
		log.info("findOne ... alias: {}, address: {}", alias, address)
		val cert: CertManager? = findAll().firstOrNull { it.alias == alias && it.address == address }
		/*
		val cert: CertManager? = when(val certType: CertType = CertType.findById(id)) {
			VDSM, VDSM_CA -> certType.toCertManager(certConfig.conn4VDSM())
			ENGINE_SERVER, ENGINE_CA -> certType.toCertManager(certConfig.conn4Engine())
			else -> null
		}
		*/
		return cert
	}

	override fun findEngineSshPublicKey(): String {
		log.info("findEngineSshPublicKey ... ")
		return pkiServiceClient.fetchEngineSshPublicKey()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
