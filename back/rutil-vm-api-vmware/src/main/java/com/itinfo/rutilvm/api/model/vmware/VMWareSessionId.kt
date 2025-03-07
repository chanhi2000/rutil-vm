package com.itinfo.rutilvm.api.model.vmware

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.LoggerDelegate

import java.io.Serializable

class VMWareSessionId(
	val value: String = ""
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bValue:String = "";fun value(block: () -> String?) { bValue = block() ?: "" }
		fun build(): VMWareSessionId = VMWareSessionId(bValue)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VMWareSessionId =  Builder().apply(block).build()
		private val log by LoggerDelegate()
	}
}
