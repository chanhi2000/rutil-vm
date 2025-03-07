group = "com.itinfo.rutilvm.api"
description = "RutilVM 백엔드 (VMWare)"
version = Versions.Project.RUTIL_VM

val jar: Jar by tasks
jar.enabled = true

dependencies {
	compileOnly(project(":rutil-vm-common"))
	compileOnly(project(":rutil-vm-util"))
	compileOnly(Dependencies.springBootWeb)
	compileOnly(Dependencies.kotlinStdlib)
	compileOnly(Dependencies.retrofit2)
	compileOnly(Dependencies.log4j)
	compileOnly(Dependencies.gson)
	compileOnly(Dependencies.retrofit2)

	testImplementation(project(":rutil-vm-common"))
	testImplementation(project(":rutil-vm-util"))
	testImplementation(Dependencies.log4j)
	testImplementation(Dependencies.retrofit2)
	testImplementation(Dependencies.junit)
	testImplementation(Dependencies.hamcrest)
}
