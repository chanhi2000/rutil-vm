package com.itinfo.rutilvm.util.cert

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.cert.util.CertParser

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

/**
 * [VMWareRestConfigTest]
 * 인증서 가져오기 테스트
 *
 * @author 이찬희 (chanhi2000)
 * @since 2025.02.20
 */
class VMWareRestConfigTest {
	private lateinit var certParser: CertParser

	@BeforeEach
	fun setup() {
		log.debug("setup ... ")
		certParser = CertParser.getInstance()
	}

	/**
	 * [VMWareRestConfigTest.should_fetchSSLCertificates]
	 */
	@Test
	@DisplayName("@SSHCertFetcherTest#should_fetchSSLCertificates()")
	fun should_fetchSSLCertificates() {
		log.debug("should_fetchSSLCertificates ... ")

		/*
		val certVDSMData: ByteArray? = sessionVDSM?.fetchFile(CertType.VDSM.path)
		assertThat(certVDSMData, `is`(notNullValue()))
		val certificateVDSM = certParser.parseCertificate(certVDSMData)
		assertThat(certificateVDSM, `is`(notNullValue()))
		log.info("Certificate Expiration Date: ${certificateVDSM?.notAfter}")

		val certVDSMCaData: ByteArray? = sessionVDSM?.fetchFile(CertType.VDSM_CA.path)
		assertThat(certVDSMCaData, `is`(notNullValue()))
		val certificateVDSMCa = certParser.parseCertificate(certVDSMCaData)
		assertThat(certificateVDSMCa, `is`(notNullValue()))
		log.info("Certificate Expiration Date: ${certificateVDSMCa?.notAfter}")

		val certData: ByteArray? = sessionVDSM?.fetchFile(CertType.VDSM.path)
		assertThat(certData, `is`(notNullValue()))
		val certificate = certParser.parseCertificate(certData)
		assertThat(certificate, `is`(notNullValue()))
		log.info("Certificate Expiration Date: ${certificate?.notAfter}")
		*/
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
