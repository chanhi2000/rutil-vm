package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.scalars.ScalarsConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

@Configuration
open class OvirtRestConfig {

	@Bean
	open fun pkiResourceService() = ovirtRestRetrofit().create(PkiResourceService::class.java)

	@Bean
	open fun ovirtRestRetrofit(): Retrofit {
		log.info("retrofit ...")
		val baseUrl = "${ovirtBaseURL}/ovirt-engine/services/"
		return Retrofit.Builder()
				.baseUrl(baseUrl)
				.client(ovirtRestOkHttpClient())
				.addConverterFactory(ScalarsConverterFactory.create())
				.build()
	}

	@Value("\${application.ovirt.ip}")			private lateinit var ovirtIp: String
	@Value("\${application.ovirt.port.ssl}")	private lateinit var _ovirtPortSsl: String
	private val ovirtPortSsl: Int
		get() = _ovirtPortSsl.toIntOrNull() ?: 2443
	private val ovirtBaseURL: String
		get() = "https://${ovirtIp}${if (ovirtPortSsl == 443) "" else ":${ovirtPortSsl}"}"

	@Bean
	open fun ovirtRestOkHttpClient(): OkHttpClient {
		log.info("ovirtRestOkHttpClient ...")
		// Install the all-trusting trust manager
		val sslContext: SSLContext = SSLContext.getInstance("SSL")
		sslContext.init(null, ovirtRestTrustAllCerts(), SecureRandom())

		// Create an ssl socket factory with our all-trusting manager
		val socketFactory = sslContext.socketFactory
		val interceptor = HttpLoggingInterceptor().apply {
			this.level = HttpLoggingInterceptor.Level.BODY
		}
		return OkHttpClient.Builder()
			.sslSocketFactory(socketFactory, ovirtRestTrustAllCerts()[0] as X509TrustManager)
			.hostnameVerifier { _, _ -> true }
			.addInterceptor(interceptor)
			.readTimeout(20, TimeUnit.SECONDS)
			.build()
	}

	@Bean
	open fun ovirtRestTrustAllCerts(): Array<TrustManager> {
		log.info("ovirtRestTrustAllCerts ...")
		return arrayOf(object : X509TrustManager {
			override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String? ) {}
			override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
			override fun getAcceptedIssuers(): Array<X509Certificate> {
				return arrayOf()
			}
		})
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

interface PkiResourceService {
	/**
	 * [getCertificate]
	 * Calls /ovirt-engine/services/pki-resource endpoint.
	 *
	 * @param resource [String] The resource to retrieve, e.g., "engine-certificate" or "ca-certificate".
	 * @param format [String] The format of the certificate, e.g., "OPENSSH-PUBKEY", "X509-PEM", or "X509-PEM-CA".
	 * @return A Call wrapping the response as a plain String.
	 */
	@GET("pki-resource")
	fun getCertificate(
		@Query("resource") resource: String,
		@Query("format") format: String
	): Call<String>
}
