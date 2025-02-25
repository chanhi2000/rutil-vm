package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.api.cert.CertManager
import com.itinfo.rutilvm.api.cert.toCertManager
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.cert.model.EngineCertType
import com.itinfo.rutilvm.util.cert.model.HostCertType
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.jcraft.jsch.JSch
import com.jcraft.jsch.Logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.File
import java.io.IOException
import javax.annotation.PostConstruct

/**
 * [CertConfig]
 * oVirt 관련 인증서 관리 설정
 *
 * @since 2025-02-21
 * @author 이찬희 (@chanhi2000)
 */
@Configuration
open class CertConfig(

) {
	@Autowired private lateinit var pkiServiceClient: PkiServiceClient

	@Value("\${application.ovirt.ssh.jsch.log.enabled}")	private lateinit var _jschLogEnabled: String
	@Value("\${application.ovirt.ssh.prvkey.location}")		private lateinit var _ovirtSSHPrivateKeyLocation: String
	@Value("\${application.ovirt.ssh.engine.address}")		private lateinit var _ovirtSSHEngineAddress: String
	@Value("\${application.ovirt.ssh.engine.prvkey}")		lateinit var ovirtSSHEnginePrvKey: String
	@Value("\${application.ovirt.ssh.hosts.address}")		private lateinit var _ovirtSSHHostsAddress: String

	val jschLogEnabled: Boolean
		get() = _jschLogEnabled.toBooleanStrictOrNull() ?: false
	val ovirtEngineSSH: RemoteConnMgmt
		get() = RemoteConnMgmt.asRemoteConnMgmt(_ovirtSSHEngineAddress, ovirtSSHEnginePrvKey)
	val ovirtHostSSHAddresses: List<String>
		get() = _ovirtSSHHostsAddress.split(DEFAULT_SPLIT)
	val ovirtSSHPrvKey: String?
		get() = (try {  File(_ovirtSSHPrivateKeyLocation) } catch (e: IOException) { null })?.readText(Charsets.UTF_8)
	val ovirtHostSSHs: List<RemoteConnMgmt>
		get() = ovirtHostSSHAddresses.map { fullAddress ->
			RemoteConnMgmt.asRemoteConnMgmt(fullAddress, ovirtSSHPrvKey)
		}

	@PostConstruct
	fun init() {
		log.info("init ... ")
		log.debug("  application.ovirt.ssh.jsch.log.enabled: {}", jschLogEnabled)
		log.debug("  application.ovirt.ssh.prvkeypath: {}", _ovirtSSHPrivateKeyLocation)
		log.debug("  application.ovirt.ssh.engine.address: {}", pkiServiceClient.fetchEngineSshPublicKey())
		log.debug("  application.ovirt.ssh.engine.prvkey: {}", ovirtSSHEnginePrvKey)
		log.debug("  application.ovirt.ssh.hosts.address: {}\n", ovirtHostSSHAddresses)

		log.debug("  ovirtSSHPrvKey ... {}", ovirtSSHPrvKey)
		log.debug("  ovirtEngineSSH ... {}", ovirtEngineSSH)
		log.debug("  ovirtHostSSHs ... {}\n\n", ovirtHostSSHs)

		if (!jschLogEnabled) return
		JSch.setLogger(object : Logger {
			override fun isEnabled(level: Int): Boolean = true
			override fun log(level: Int, message: String) {
				val canonicalName = CertConfig::class.java.canonicalName
				when(level) {
					Logger.INFO -> log.info("{}: {}", canonicalName, message)
					Logger.WARN -> log.warn("{}: {}", canonicalName, message)
					Logger.FATAL, Logger.ERROR -> log.error("{}: {}",canonicalName, message)
					else -> log.debug("{}: {}",canonicalName, message)
				}
			}
		})

	}

	@Bean
	open fun allCertManagers(): List<CertManager> {
		log.info("parseCerts ...")
		return vdsmCertManagers() + engineCertManagers()
	}

	@Bean
	open fun engineCertManagers(): List<CertManager> {
		log.info("engineCertManagers ... ")
		val certs = EngineCertType.values().filter {
			it != EngineCertType.UNKNOWN
		}.map {
			it.toCertManager(conn4Engine())
		}
		return certs
	}

	@Bean
	open fun vdsmCertManagers(): List<CertManager> {
		log.info("vdsmCertManagers ...")
		val certs: List<CertManager> = conn4VDSM().map { c ->
			 HostCertType.values().filter {
				 it != HostCertType.UNKNOWN
			 }.map {
				it.toCertManager(c)
			}
		}.flatten()
		return certs
	}

	@Bean
	open fun conn4VDSM(): List<RemoteConnMgmt> {
		log.info("conn4VDSM ...")
		return ovirtHostSSHs
	}

	@Bean
	open fun conn4Engine(): RemoteConnMgmt {
		log.info("conn4Engine ...")
		return ovirtEngineSSH
	}

	/*
	@Bean
	open fun sshFileFetcher(): SSHFileFetcher {
		log.info("sshFileFetcher ...")
		return SSHFileFetcher.getInstance()
	}

	@Bean
	open fun sshHelper(): SSHHelper {
		log.info("sshHelper ...")
		return SSHHelper.getInstance()
	}
	*/

	companion object {
		private val log by LoggerDelegate()
		private const val DEFAULT_SPLIT = "|"
	}
}
