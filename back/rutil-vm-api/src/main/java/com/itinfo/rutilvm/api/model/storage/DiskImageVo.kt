package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DiskBuilder
import org.ovirt.engine.sdk4.builders.DiskProfileBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.types.*
import java.io.Serializable
import java.math.BigInteger

/**
 * [DiskImageVo]
 * 스토리지도메인 - 디스크 이미지 생성
 * 가상머신 - 생성 - 인스턴스 이미지 - 생성
 *
 * @property id [String] 디스크 id
 * @property size [Int] 크기(Gib)
 * @property appendSize [Int] 확장크기
 * @property alias [String] 별칭(이름과 같음)
 * @property description [String] 설명
 * @property dataCenterVo [IdentifiedVo] <스토리지-디스크-생성>
 * @property storageDomainVo [IdentifiedVo] 스토리지 도메인
 * @property sparse [Boolean] 할당 정책 (씬 true, 사전할당 false)
 * @property diskProfileVo [IdentifiedVo] 디스크 프로파일 (스토리지-디스크프로파일)
 * @property wipeAfterDelete [Boolean] 삭제 후 초기화
 * @property sharable [Boolean] 공유가능 (공유가능 o 이라면 증분백업 안됨 FRONT에서 막기?)
 * @property backup [Boolean] 증분 백업 사용 (기본이 true)
 * @property virtualSize [BigInteger] 가상크기 (provisionedSize)
 * @property actualSize [BigInteger] 실제크기
 * @property status [DiskStatus] 디스크상태
 * @property contentType [DiskContentType]
 * @property storageType [DiskStorageType] 유형
 * @property createDate [String] 생성일자
 * @property connectVm [IdentifiedVo] 연결대상(가상머신/템플릿)
 * @property diskProfileVos List<[IdentifiedVo]> 디스크 프로파일 목록
 */
class DiskImageVo(
	val id: String = "",
	val size: BigInteger = BigInteger.ZERO,
	val appendSize: BigInteger = BigInteger.ZERO,
	val alias: String = "",
	val description: String = "",
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val storageDomainVo: IdentifiedVo = IdentifiedVo(),
	val sparse: Boolean = false,
	val diskProfileVo: IdentifiedVo = IdentifiedVo(),
	val wipeAfterDelete: Boolean = false,
	val sharable: Boolean = false,
	val backup: Boolean = false,
	val format: DiskFormat = DiskFormat.RAW,
	val imageId: String = String(),
	val virtualSize: BigInteger = BigInteger.ZERO,
	val actualSize: BigInteger = BigInteger.ZERO,
	val status: DiskStatus = DiskStatus.LOCKED,
	val contentType: DiskContentType = DiskContentType.DATA, // unknown
	val storageType: DiskStorageType = DiskStorageType.IMAGE,
	val createDate: String = "",
	val connectVm: IdentifiedVo = IdentifiedVo(),
	val connectTemplate: IdentifiedVo = IdentifiedVo(),
	// val diskProfileVos: List<IdentifiedVo> = listOf()
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bSize: BigInteger = BigInteger.ZERO;fun size(block: () -> BigInteger?) { bSize = block() ?: BigInteger.ZERO }
		private var bAppendSize: BigInteger = BigInteger.ZERO;fun appendSize(block: () -> BigInteger?) { bAppendSize = block() ?: BigInteger.ZERO }
		private var bAlias: String = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo();fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bStorageDomainVo: IdentifiedVo = IdentifiedVo();fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
		private var bSparse: Boolean = false;fun sparse(block: () -> Boolean?) { bSparse = block() ?: false }
		private var bDiskProfileVo: IdentifiedVo = IdentifiedVo();fun diskProfileVo(block: () -> IdentifiedVo?) { bDiskProfileVo = block() ?: IdentifiedVo() }
		private var bWipeAfterDelete: Boolean = false;fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() ?: false }
		private var bSharable: Boolean = false;fun sharable(block: () -> Boolean?) { bSharable = block() ?: false }
		private var bBackup: Boolean = false;fun backup(block: () -> Boolean?) { bBackup = block() ?: false }
		private var bFormat: DiskFormat = DiskFormat.RAW;fun format(block: () -> DiskFormat?) { bFormat = block() ?: DiskFormat.RAW }
		private var bImageId: String = "";fun imageId(block: () -> String?) { bImageId = block() ?: "" }
		private var bVirtualSize: BigInteger = BigInteger.ZERO;fun virtualSize(block: () -> BigInteger?) { bVirtualSize = block() ?: BigInteger.ZERO }
		private var bActualSize: BigInteger = BigInteger.ZERO;fun actualSize(block: () -> BigInteger?) { bActualSize = block() ?: BigInteger.ZERO }
		private var bStatus: DiskStatus = DiskStatus.LOCKED;fun status(block: () -> DiskStatus?) { bStatus = block() ?: DiskStatus.LOCKED }
		private var bContentType: DiskContentType = DiskContentType.DATA;fun contentType(block: () -> DiskContentType?) { bContentType = block() ?: DiskContentType.DATA }
		private var bStorageType: DiskStorageType = DiskStorageType.IMAGE;fun storageType(block: () -> DiskStorageType?) { bStorageType = block() ?: DiskStorageType.IMAGE }
		private var bCreateDate: String = "";fun createDate(block: () -> String?) { bCreateDate = block() ?: "" }
		private var bConnectVm: IdentifiedVo = IdentifiedVo();fun connectVm(block: () -> IdentifiedVo?) { bConnectVm = block() ?: IdentifiedVo() }
		private var bConnectTemplate: IdentifiedVo = IdentifiedVo();fun connectTemplate(block: () -> IdentifiedVo?) { bConnectTemplate = block() ?: IdentifiedVo() }
		// private var bDiskProfileVos: List<IdentifiedVo> = listOf();fun diskProfileVos(block: () -> List<IdentifiedVo>?) { bDiskProfileVos = block() ?: listOf() }

        fun build(): DiskImageVo = DiskImageVo(bId, bSize, bAppendSize, bAlias, bDescription, bDataCenterVo, bStorageDomainVo, bSparse, bDiskProfileVo, bWipeAfterDelete, bSharable, bBackup, bFormat, bImageId, bVirtualSize, bActualSize, bStatus, bContentType, bStorageType, bCreateDate, bConnectVm, bConnectTemplate/*, bDiskProfileVos*/)
	}
	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): DiskImageVo = Builder().apply(block).build()
	}
}


fun Disk.toDiskIdName(): DiskImageVo = DiskImageVo.builder {
	id { this@toDiskIdName.id() }
	alias() { this@toDiskIdName.alias() }
}
fun List<Disk>.toDiskIdNames(): List<DiskImageVo> =
	this@toDiskIdNames.map { it.toDiskIdName() }

/**
 * 디스크 목록
 * 스토리지도메인 - 디스크 목록
 */
fun Disk.toDiskMenu(conn: Connection): DiskImageVo {
	val disk = this@toDiskMenu
	val storageDomain: StorageDomain? = conn.findStorageDomain(this.storageDomains().first().id()).getOrNull()

	val diskLink: Disk? = conn.findDisk(this@toDiskMenu.id()).getOrNull()
	val vmConn: Vm? = if(diskLink?.vmsPresent() == true){
		conn.findVm(diskLink.vms().first().id()).getOrNull()
	} else { null }

	val templateId: String? = conn.findAllTemplates(follow = "diskattachments")
		.getOrDefault(listOf())
		.firstOrNull { template ->
			template.diskAttachmentsPresent() &&
					template.diskAttachments().any { diskAttachment -> diskAttachment.id() == disk.id() }
		}?.id()
	val tmp: Template? = templateId?.let { conn.findTemplate(it).getOrNull() }

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		sharable { disk.shareable() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.actualSize() }
		status { disk.status() }
		sparse { disk.sparse() }
		storageType { disk.storageType() }
		description { disk.description() }
		connectVm { vmConn?.fromVmToIdentifiedVo() }
		connectTemplate { tmp?.fromTemplateToIdentifiedVo() }
	}
}
fun List<Disk>.toDiskMenus(conn: Connection): List<DiskImageVo> =
	this@toDiskMenus.map { it.toDiskMenu(conn) }

fun Disk.toDiskInfo(conn: Connection): DiskImageVo {
	val disk = this@toDiskInfo
	val diskProfile: DiskProfile? =
		if(disk.diskProfilePresent()) conn.findDiskProfile(disk.diskProfile().id()).getOrNull()
		else null
	val storageDomain: StorageDomain? = conn.findStorageDomain(this.storageDomains().first().id()).getOrNull()
	val dataCenter: DataCenter? = storageDomain?.dataCenters()?.first()?.let {
		conn.findDataCenter(it.id()).getOrNull()
	}
	val diskLink: Disk? = conn.findDisk(this@toDiskInfo.id()).getOrNull()
	val vmConn: Vm? = if(diskLink?.vmsPresent() == true){
		conn.findVm(diskLink.vms().first().id()).getOrNull()
	} else { null }
	val templateId: String? = conn.findAllTemplates(follow = "diskattachments")
		.getOrDefault(listOf())
		.firstOrNull { template ->
			template.diskAttachmentsPresent() &&
					template.diskAttachments().any { diskAttachment -> diskAttachment.id() == disk.id() }
		}?.id()
	val tmp: Template? = templateId?.let { conn.findTemplate(it).getOrNull() }

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		description { disk.description() }
		status { disk.status() }
		sparse { disk.sparse() } // 할당정책
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		// storageDomainVo { storageDomain?.toStorageDomainIdName() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		diskProfileVo { diskProfile?.fromDiskProfileToIdentifiedVo() }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.totalSize() }
		wipeAfterDelete { disk.wipeAfterDelete() }
		sharable { disk.shareable() }
		backup { disk.backup() == DiskBackup.INCREMENTAL }
		connectVm { vmConn?.fromVmToIdentifiedVo() } // 연결된 가상머신
		connectTemplate { tmp?.fromTemplateToIdentifiedVo() }
	}
}

fun Disk.toVmDisk(conn: Connection): DiskImageVo {
	val disk = this@toVmDisk
	val storageDomain: StorageDomain? = conn.findStorageDomain(this.storageDomains().first().id()).getOrNull()
	val diskProfile: DiskProfile? =
		if(disk.diskProfilePresent()) conn.findDiskProfile(disk.diskProfile().id()).getOrNull()
		else null

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		description { disk.description() }
		status { disk.status() }
		sparse { disk.sparse() } // 할당정책
		wipeAfterDelete { disk.wipeAfterDelete() }
		sharable { disk.shareable() }
		backup { disk.backup() == DiskBackup.INCREMENTAL }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.totalSize() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		diskProfileVo { diskProfile?.fromDiskProfileToIdentifiedVo() }
	}
}
fun List<Disk>.toVmDisks(conn: Connection): List<DiskImageVo> =
	this@toVmDisks.map { it.toVmDisk(conn) }


fun Disk.toDiskImageVo(conn: Connection): DiskImageVo {
	val storageDomain: StorageDomain? =
		conn.findStorageDomain(this@toDiskImageVo.storageDomains().first().id())
			.getOrNull()

	val dataCenter: DataCenter? =
		if(storageDomain?.dataCentersPresent() == true) conn.findDataCenter(storageDomain.dataCenters().first().id()).getOrNull()
		else null

	val diskProfile: DiskProfile? =
		if(this@toDiskImageVo.diskProfilePresent()) conn.findDiskProfile(this@toDiskImageVo.diskProfile().id()).getOrNull()
		else null

	return DiskImageVo.builder {
		id { this@toDiskImageVo.id() }
		size { this@toDiskImageVo.provisionedSize() } // 1024^3
		alias { this@toDiskImageVo.alias() }
		description { this@toDiskImageVo.description() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		// storageDomainVo { storageDomain?.toStorageDomainIdName() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		sparse { this@toDiskImageVo.sparse() }
		diskProfileVo { diskProfile?.fromDiskProfileToIdentifiedVo() }
		wipeAfterDelete { this@toDiskImageVo.wipeAfterDelete() }
		sharable { this@toDiskImageVo.shareable() }
		backup { this@toDiskImageVo.backup() == DiskBackup.INCREMENTAL }
		virtualSize { this@toDiskImageVo.provisionedSize() }
		actualSize { this@toDiskImageVo.actualSize() }
		status { this@toDiskImageVo.status() }
		contentType { this@toDiskImageVo.contentType() }
		storageType { this@toDiskImageVo.storageType() }
//		createDate { this@toDiskImageVo. } // TODO
//		connectVm { toConnectVm(conn, diskVmElementEntity) } } }  // TODO
	}
}
fun List<Disk>.toDiskImageVos(conn: Connection): List<DiskImageVo> =
	this@toDiskImageVos.map { it.toDiskImageVo(conn) }



fun Disk.toDiskVo(conn: Connection, vmId: String): DiskImageVo {
	val storageDomain: StorageDomain? =
		conn.findStorageDomain(this@toDiskVo.storageDomains().first().id())
			.getOrNull()

	val dataCenter: DataCenter? =
		if(storageDomain?.dataCentersPresent() == true) conn.findDataCenter(storageDomain.dataCenters().first().id()).getOrNull()
		else null

	val diskProfile: DiskProfile? =
		if(this@toDiskVo.diskProfilePresent()) conn.findDiskProfile(this@toDiskVo.diskProfile().id()).getOrNull()
		else null

	return DiskImageVo.builder {
		id { this@toDiskVo.id() }
		size { this@toDiskVo.provisionedSize() } // 1024^3
		alias { this@toDiskVo.alias() }
		description { this@toDiskVo.description() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		// storageDomainVo { storageDomain?.toStorageDomainIdName() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		sparse { this@toDiskVo.sparse() }
		diskProfileVo { diskProfile?.fromDiskProfileToIdentifiedVo() }
		wipeAfterDelete { this@toDiskVo.wipeAfterDelete() }
		sharable { this@toDiskVo.shareable() }
		backup { this@toDiskVo.backup() == DiskBackup.INCREMENTAL }
		virtualSize { this@toDiskVo.provisionedSize() }
		actualSize { this@toDiskVo.actualSize() }
		status { this@toDiskVo.status() }
		contentType { this@toDiskVo.contentType() }
		storageType { this@toDiskVo.storageType() }
//		createDate { this@toDiskImageVo. } // TODO
	}
}

fun Disk.toTemplateDiskInfo(conn: Connection): DiskImageVo {
	val disk = this@toTemplateDiskInfo
	val diskProfile: DiskProfile? =
		if(disk.diskProfilePresent()) conn.findDiskProfile(disk.diskProfile().id()).getOrNull()
		else null
	val storageDomain: StorageDomain? = conn.findStorageDomain(this.storageDomains().first().id()).getOrNull()
	val dataCenter: DataCenter? = storageDomain?.dataCenters()?.first()?.let {
		conn.findDataCenter(it.id()).getOrNull()
	}
	val diskLink: Disk? = conn.findDisk(disk.id()).getOrNull()
	val vmConn: Vm? = if(diskLink?.vmsPresent() == true){
		conn.findVm(diskLink.vms().first().id()).getOrNull()
	} else { null }
	val templateId: String? = conn.findAllTemplates(follow = "diskattachments")
		.getOrDefault(listOf())
		.firstOrNull { template ->
			template.diskAttachmentsPresent() &&
					template.diskAttachments().any { diskAttachment -> diskAttachment.id() == disk.id() }
		}?.id()
	val tmp: Template? = templateId?.let { conn.findTemplate(it).getOrNull() }

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		description { disk.description() }
		status { disk.status() }
		sparse { disk.sparse() } // 할당정책
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		diskProfileVo { diskProfile?.fromDiskProfileToIdentifiedVo() }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.totalSize() }
		wipeAfterDelete { disk.wipeAfterDelete() }
		sharable { disk.shareable() }
		backup { disk.backup() == DiskBackup.INCREMENTAL }
		connectVm { vmConn?.fromVmToIdentifiedVo() } // 연결된 가상머신
		connectTemplate { tmp?.fromTemplateToIdentifiedVo() }
	}
}


fun Disk.toUnregisterdDisk(): DiskImageVo {
    val disk = this@toUnregisterdDisk
//    val diskLink: Disk? = conn.findDisk(this@toUnregisterdDisk.id()).getOrNull()
    return DiskImageVo.builder {
        id { disk.id() }
        alias { disk.alias() }
        sharable { disk.shareable() }
        virtualSize { disk.provisionedSize() }
        actualSize { disk.actualSize() }
        sparse { disk.sparse() }
        description { disk.description() }
    }
}
fun List<Disk>.toUnregisterdDisks(): List<DiskImageVo> =
    this@toUnregisterdDisks.map { it.toUnregisterdDisk() }

fun DiskImageVo.toRegisterDiskBuilder(): Disk =
	this@toRegisterDiskBuilder.toDiskBuilder()
		.id(this@toRegisterDiskBuilder.id)
		.build()

/**
 * 스토리지 - 디스크 생성
 * 가상머신 - 가상머신 생성 - 디스크 생성
 */
fun DiskImageVo.toDiskBuilder(): DiskBuilder {
	return DiskBuilder()
		.alias(this@toDiskBuilder.alias)
		.description(this@toDiskBuilder.description)
		.wipeAfterDelete(this@toDiskBuilder.wipeAfterDelete)
		.shareable(this@toDiskBuilder.sharable)
		.backup(if (this@toDiskBuilder.backup) DiskBackup.INCREMENTAL else DiskBackup.NONE)
		.format(if (this@toDiskBuilder.backup) DiskFormat.COW else DiskFormat.RAW)
		.sparse(this@toDiskBuilder.sparse)
		.diskProfile(DiskProfileBuilder().id(this@toDiskBuilder.diskProfileVo.id).build())
}

fun DiskImageVo.toAddDiskBuilder(): Disk =
	this@toAddDiskBuilder.toDiskBuilder()
		.storageDomains(*arrayOf(StorageDomainBuilder().id(this@toAddDiskBuilder.storageDomainVo.id).build()))
		.provisionedSize(this@toAddDiskBuilder.size)
		.build()

fun DiskImageVo.toEditDiskBuilder(): Disk =
	this@toEditDiskBuilder.toDiskBuilder()
		.id(this@toEditDiskBuilder.id)
		.provisionedSize(this@toEditDiskBuilder.size.add(this@toEditDiskBuilder.appendSize))
		.build()


// 가상머신 스냅샷에서 디스크 포함할때 사용
fun DiskImageVo.toAddSnapshotDisk(): Disk {
	return DiskBuilder()
		.id(this@toAddSnapshotDisk.id)
		.imageId(this@toAddSnapshotDisk.imageId)
		.build()
}


/**
 * 디스크 업로드
 * ISO 이미지 업로드용
 * (화면표시) 파일 선택시 파일에 있는 포맷, 컨텐츠(파일 확장자로 칭하는건지), 크기 출력
 * 	파일 크기가 자동으로 디스크 옵션에 추가, 파일 명칭이 파일의 이름으로 지정됨 (+설명)
 * 	디스크 이미지 업로드
 *  required: provisioned_size, alias, description, wipe_after_delete, shareable, backup, disk_profile.
 *
 */
fun DiskImageVo.toUploadDiskBuilder(conn: Connection, fileSize: Long): Disk {
	val storageDomain: StorageDomain = conn.findStorageDomain(this@toUploadDiskBuilder.storageDomainVo.id)
		.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toException()
	// storage가 nfs 면 씬, iscsi면 사전할당
	val allocation: Boolean = storageDomain.storage().type() == StorageType.NFS

	return DiskBuilder()
		.contentType(DiskContentType.ISO)
		.provisionedSize(fileSize)
		.sparse(allocation)
		.alias(this@toUploadDiskBuilder.alias)
		.description(this@toUploadDiskBuilder.description)
		.storageDomains(*arrayOf(StorageDomainBuilder().id(this@toUploadDiskBuilder.storageDomainVo.id)))
		.diskProfile(DiskProfileBuilder().id(this@toUploadDiskBuilder.diskProfileVo.id))
		.shareable(this@toUploadDiskBuilder.sharable)
		.wipeAfterDelete(this@toUploadDiskBuilder.wipeAfterDelete)
		.backup(DiskBackup.NONE) // 증분백업 되지 않음
		.format(DiskFormat.RAW) // 이미지 업로드는 raw 형식만 가능 +front 처리?
		.build()
}
