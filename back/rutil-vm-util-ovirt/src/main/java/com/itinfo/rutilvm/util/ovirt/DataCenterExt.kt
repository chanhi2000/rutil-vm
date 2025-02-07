package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*


fun Connection.srvDataCenters(): DataCentersService =
	this.systemService.dataCentersService()

fun Connection.findAllDataCenters(search: String = "", follow: String = ""): Result<List<DataCenter>> = runCatching {
	if (search.isNotEmpty() && follow.isNotEmpty())
		this.srvDataCenters().list().search(search).follow(follow).send().dataCenters()
	else if (search.isNotEmpty())
		this.srvDataCenters().list().search(search).send().dataCenters()
	else if (follow.isNotEmpty())
		this.srvDataCenters().list().follow(follow).send().dataCenters()
	else
		this.srvDataCenters().list().send().dataCenters()
}.onSuccess {
	Term.DATACENTER.logSuccess("목록조회")
}.onFailure {
	Term.DATACENTER.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvDataCenter(dataCenterId: String): DataCenterService =
	this.srvDataCenters().dataCenterService(dataCenterId)

fun Connection.findDataCenter(dcId: String, follow: String = ""): Result<DataCenter?> = runCatching {
	if (follow.isNotEmpty())
		this.srvDataCenter(dcId).get().follow(follow).send().dataCenter()
	else
		this.srvDataCenter(dcId).get().send().dataCenter()
}.onSuccess {
	Term.DATACENTER.logSuccess("상세조회")
}.onFailure {
	Term.DATACENTER.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun List<DataCenter>.nameDuplicateDataCenter(dataCenterName: String, dataCenterId: String? = null): Boolean =
	this.filter { it.id() != dataCenterId }.any { it.name() == dataCenterName }

//fun Connection.findAllClustersFromDataCenter(dataCenterId: String): List<Cluster> {
//	if(this.findDataCenter(dataCenterId).isFailure) {
//		throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toError()
//	}
//	return this.findAllClusters()
//		.getOrDefault(listOf())
//		.filter { it.dataCenterPresent() && it.dataCenter().id() == dataCenterId }
//}
//
//fun Connection.findHostFromDataCenter(dataCenterId: String): List<Host> {
//	if(this.findDataCenter(dataCenterId).isFailure) {
//		throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toError()
//	}
//	val clusters: List<Cluster> =
//		this.findAllClustersFromDataCenter(dataCenterId)
//	if (clusters.isEmpty())
//		return listOf()
//
//	return this.findAllHosts()
//		.getOrDefault(listOf())
//		.filter { host ->
//			clusters.any { it.id() == host.cluster().id() }
//		}
//}


fun Connection.addDataCenter(dataCenter: DataCenter): Result<DataCenter?> = runCatching {
	if (this.findAllDataCenters()
			.getOrDefault(listOf())
			.nameDuplicateDataCenter(dataCenter.name())) {
		return FailureType.DUPLICATE.toResult(Term.DATACENTER.desc)
	}
	val dataCenterAdded: DataCenter? =
		this.srvDataCenters().add().dataCenter(dataCenter).send().dataCenter()

	dataCenterAdded ?: throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
}.onSuccess {
	Term.DATACENTER.logSuccess("생성")
}.onFailure {
	Term.DATACENTER.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateDataCenter(dataCenter: DataCenter): Result<DataCenter?> = runCatching {
	if (this.findAllDataCenters()
			.getOrDefault(listOf())
			.nameDuplicateDataCenter(dataCenter.name(), dataCenter.id())) {
		return FailureType.DUPLICATE.toResult(Term.DATACENTER.desc)
	}
    val dataCenterUpdated: DataCenter? =
		this.srvDataCenter(dataCenter.id()).update().dataCenter(dataCenter).send().dataCenter()

	dataCenterUpdated ?: throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
}.onSuccess {
	Term.DATACENTER.logSuccess("편집")
}.onFailure {
	Term.DATACENTER.logFail("편집", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeDataCenter(dataCenterId: String): Result<Boolean> = runCatching {
	val dataCenter: DataCenter =
		this.findDataCenter(dataCenterId)
			.getOrNull() ?: throw ErrorPattern.DATACENTER_NOT_FOUND.toError()

	this.srvDataCenter(dataCenter.id()).remove().force(true).send()
	this.expectDataCenterDeleted(dataCenterId)
}.onSuccess {
	Term.DATACENTER.logSuccess("삭제")
}.onFailure {
	Term.DATACENTER.logFail("삭제", it)
	throw if (it is Error) it.toItCloudException() else it
}

@Throws(InterruptedException::class)
fun Connection.expectDataCenterDeleted(dataCenterId: String, timeout: Long = 60000L, interval: Long = 1000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val dataCenters: List<DataCenter> =
			this.findAllDataCenters().getOrDefault(listOf())
		val dataCenterToRemove = dataCenters.firstOrNull() { it.id() == dataCenterId }
		if (dataCenterToRemove == null) { // dataCenterToRemove 에 아무것도 없으면(삭제된상태)
			Term.DATACENTER.logSuccess("삭제")
			return true
		}
		else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("{} {} 삭제 실패 ... 시간 초과", Term.DATACENTER.desc, dataCenterToRemove.name())
			return false
		}
		log.debug("{} 삭제 진행중 ... ", Term.DATACENTER.desc)
		Thread.sleep(interval)
	}
}

fun Connection.srvClustersFromDataCenter(dataCenterId: String): ClustersService =
	this.srvDataCenter(dataCenterId).clustersService()

fun Connection.findAllClustersFromDataCenter(dataCenterId: String, search: String = "", follow: String = ""): Result<List<Cluster>> = runCatching {
	if (search.isNotEmpty() && follow.isNotEmpty())
		this.srvClustersFromDataCenter(dataCenterId).list().search(search).follow(follow).send().clusters()
	else if (search.isNotEmpty())
		this.srvClustersFromDataCenter(dataCenterId).list().search(search).send().clusters()
	else if (follow.isNotEmpty())
		this.srvClustersFromDataCenter(dataCenterId).list().follow(follow).send().clusters()
	else
		this.srvClustersFromDataCenter(dataCenterId).list().send().clusters()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.CLUSTER,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.CLUSTER,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAllHostsFromDataCenter(dataCenterId: String): Result<List<Host>> = runCatching {
	this.findAllHosts()
		.getOrDefault(listOf())
		.filter {
			this.findCluster(it.cluster().id())
				.getOrNull()?.dataCenter()?.id() == dataCenterId
		}
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.HOST,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.HOST,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.findAllVmsFromDataCenter(dataCenterId: String): Result<List<Vm>> = runCatching {
	val clusters: List<Cluster> =
		this.findAllClustersFromDataCenter(dataCenterId)
		.getOrDefault(listOf())

	this.findAllVms()
		.getOrDefault(listOf())
		.filter { vm -> vm.cluster().id() in clusters.map { it.id() } }
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.VM,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.VM,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.srvNetworksFromFromDataCenter(dataCenterId: String): DataCenterNetworksService =
	this.srvDataCenter(dataCenterId).networksService()

fun Connection.findAllNetworksFromDataCenter(dataCenterId: String): Result<List<Network>> = runCatching {
	this.srvNetworksFromFromDataCenter(dataCenterId).list().send().networks() ?: listOf()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.NETWORK,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.NETWORK,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

// AttachedStorageDomainsService
fun Connection.srvAllAttachedStorageDomainsFromDataCenter(dataCenterId: String): AttachedStorageDomainsService =
	this.srvDataCenter(dataCenterId).storageDomainsService()

fun Connection.findAllAttachedStorageDomainsFromDataCenter(dataCenterId: String): Result<List<StorageDomain>> = runCatching {
	if(this.findDataCenter(dataCenterId).isFailure) {
		throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
	}
	this.srvAllAttachedStorageDomainsFromDataCenter(dataCenterId).list().follow("disks").send().storageDomains() ?: listOf()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): AttachedStorageDomainService =
	this.srvAllAttachedStorageDomainsFromDataCenter(dataCenterId).storageDomainService(storageDomainId)

fun Connection.findAllAttachedStorageDomainDisksFromDataCenter(dataCenterId: String, storageDomainId: String): Result<List<Disk>> = runCatching {
	this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).disksService().list().send().disks()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.DISK,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.DISK,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): Result<StorageDomain?> = runCatching {
	srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).get().send().storageDomain()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.activateAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): Result<Boolean> = runCatching {
	if(this.findDataCenter(dataCenterId).isFailure) {
		throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
	}
	val storageDomain: StorageDomain =
		this.findAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId)
			.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

	if(storageDomain.status() == StorageDomainStatus.ACTIVE){
		throw Error("activate 실패 ... $storageDomainId 가 이미 활성 상태") // return 대신 throw
	}

	this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).activate().send()
	true
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"활성화", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"활성화", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.deactivateAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): Result<Boolean> = runCatching {
	if(this.findDataCenter(dataCenterId).isFailure) {
		throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
	}
	val storageDomain: StorageDomain = this.findAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId)
		.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

	if(storageDomain.status() == StorageDomainStatus.MAINTENANCE){
		throw Error("maintenance 실패 ... $storageDomainId 가 이미 유지관리 상태") // return 대신 throw
	}

	// force == ovf 업데이트 여부
	this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).deactivate().force(true).send()
	true
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"비활성화", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"비활성화", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): Result<Boolean> = runCatching {
	this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).remove().async(true).send()
	/*
	// TODO: UNATTACHED 상태확인 체크 기능필요
	while (storageDomain.status() != StorageDomainStatus.UNATTACHED)
		storageDomainService.remove().destroy(true).send()
	*/
	true
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"삭제", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"삭제", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvQossFromDataCenter(dataCenterId: String): QossService =
	this.srvDataCenter(dataCenterId).qossService()

fun Connection.findAllQossFromDataCenter(dataCenterId: String): Result<List<Qos>> = runCatching {
	this.srvQossFromDataCenter(dataCenterId).list().send().qoss()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.QOS,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.QOS,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvQuotasFromDataCenter(dataCenterId: String): QuotasService =
	this.srvDataCenter(dataCenterId).quotasService()

fun Connection.findAllQuotasFromDataCenter(dataCenterId: String): Result<List<Quota>> = runCatching {
	this.srvQuotasFromDataCenter(dataCenterId).list().send().quotas()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.QUOTA, "목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.QUOTA, "목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addQuotaFromDataCenter(dataCenterId: String, quota: Quota): Result<Quota?> = runCatching {
	this.srvQuotasFromDataCenter(dataCenterId).add().quota(quota).send().quota()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.QUOTA,"생성", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.QUOTA,"생성", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvQuotaFromDataCenter(dataCenterId: String, quotaId: String): QuotaService =
	this.srvQuotasFromDataCenter(dataCenterId).quotaService(quotaId)

fun Connection.findQuotaFromDataCenter(dataCenterId: String, quotaId: String): Result<Quota?> = runCatching {
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).get().send().quota()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.QUOTA, "상세조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.QUOTA, "상세조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvQuotaClusterLimitsFromDataCenter(dataCenterId: String, quotaId: String): QuotaClusterLimitsService =
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).quotaClusterLimitsService()

fun Connection.findAllQuotaClusterLimitsFromDataCenter(dataCenterId: String, quotaId: String): Result<List<QuotaClusterLimit>> = runCatching {
	this.srvQuotaClusterLimitsFromDataCenter(dataCenterId, quotaId).list().send().limits()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.CLUSTER_QUOTA_LIMIT, "목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.CLUSTER_QUOTA_LIMIT, "목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvQuotaStorageLimitsFromDataCenter(dataCenterId: String, quotaId: String): QuotaStorageLimitsService =
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).quotaStorageLimitsService()

fun Connection.findAllQuotaStorageLimitsFromDataCenter(dataCenterId: String, quotaId: String): List<QuotaStorageLimit> =
	this.srvQuotaStorageLimitsFromDataCenter(dataCenterId, quotaId).list().send().limits()

private fun Connection.srvPermissionsFromDataCenter(dataCenterId: String): AssignedPermissionsService =
	this.srvDataCenter(dataCenterId).permissionsService()

fun Connection.findAllPermissionsFromDataCenter(dataCenterId: String): Result<List<Permission>> = runCatching {
	if(this.findDataCenter(dataCenterId).isFailure){
		throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
	}
	this.srvPermissionsFromDataCenter(dataCenterId).list().send().permissions() ?: listOf()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.PERMISSION, "목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.PERMISSION, "목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}
