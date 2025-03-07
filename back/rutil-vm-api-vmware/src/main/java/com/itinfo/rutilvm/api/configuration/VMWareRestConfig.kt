package com.itinfo.rutilvm.api.configuration

import com.google.gson.GsonBuilder
import com.itinfo.rutilvm.api.model.vmware.VMWareSessionId
import com.itinfo.rutilvm.common.LoggerDelegate
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.scalars.ScalarsConverterFactory
import retrofit2.converter.gson.GsonConverterFactory

import retrofit2.http.Header
import retrofit2.http.POST
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

/**
 * [VMWareRestConfig]
 * VMWare REST API 설정
 *
 * @since 2025-03-07
 * @author 이찬희 (@chanhi2000)
 */
@Configuration
open class VMWareRestConfig {

	@Bean
	open fun authService(baseURL: String) = vmWareRestRetrofit(baseURL).create(AuthService::class.java)

	@Bean
	open fun vmWareRestRetrofit(baseURL: String): Retrofit {
		log.info("retrofit ... baseURL: {}", baseURL)
		return Retrofit.Builder()
			.baseUrl(baseURL)
			.client(vmWareRestOkHttpClient())
			.addConverterFactory(ScalarsConverterFactory.create())
			.addConverterFactory(GsonConverterFactory.create(GsonBuilder()
				.serializeNulls()
				.setPrettyPrinting()
				.create()))
			.build()
	}

	@Bean
	open fun vmWareRestOkHttpClient(): OkHttpClient {
		log.info("vmWareRestOkHttpClient ...")
		// Install the all-trusting trust manager
		val sslContext: SSLContext = SSLContext.getInstance("SSL")
		sslContext.init(null, vmWareRestTrustAllCerts(), SecureRandom())

		// Create an ssl socket factory with our all-trusting manager
		val socketFactory = sslContext.socketFactory
		val interceptor = HttpLoggingInterceptor().apply {
			this.level = HttpLoggingInterceptor.Level.BODY
		}
		return OkHttpClient.Builder()
			.sslSocketFactory(socketFactory, vmWareRestTrustAllCerts()[0] as X509TrustManager)
			.hostnameVerifier { _, _ -> true }
			.addInterceptor(interceptor)
			.readTimeout(20, TimeUnit.SECONDS)
			.build()
	}

	@Bean
	open fun vmWareRestTrustAllCerts(): Array<TrustManager> =
		arrayOf(object : X509TrustManager {
			override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String? ) {}
			override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
			override fun getAcceptedIssuers(): Array<X509Certificate> {
				return arrayOf()
			}
		})

	companion object {
		private val log by LoggerDelegate()
	}
}



interface AuthService {
	/**
	 * [createSession]
	 * Calls /rest/com/vmware/cis/session
	 *
	 * @param authHeader [String] The resource to retrieve, e.g., "engine-certificate" or "ca-certificate".
	 *
	 * @return A Call wrapping the response as a plain String.
	 */
	@POST("/rest/com/vmware/cis/session")
	fun createSession(
		@Header("Authorization") authHeader: String,
	): Call<VMWareSessionId>
}
