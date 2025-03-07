package com.itinfo.rutilvm.api.model.vmware

import java.io.Serializable

class VMWareAPIFailure(
	val errorType: String = "",
	val message: List<VMWareAPIFailureDetail> = listOf(),
): Serializable {

}

class VMWareAPIFailureDetail(
	val args: List<String> = listOf(),
	val defaultMessage: String = "",
	val id: String = "",
): Serializable {

}
