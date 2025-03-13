group = "com.itinfo.rutilvm.api"
description = "RutilVM 백엔드 공통 모듈"
version = Versions.Project.RUTIL_VM

val jar: Jar by tasks
jar.enabled = true
dependencies {
	compileOnly(project(":rutil-vm-common"))
	compileOnly(Dependencies.springBootWeb)
	compileOnly(Dependencies.kotlinStdlib)
	compileOnly(Dependencies.log4j)
	compileOnly(Dependencies.gson)
}
