import org.gradle.api.artifacts.dsl.DependencyHandler

object Dependencies {
    val tomcatEmbedded = listOf(
        "org.apache.tomcat.embed:tomcat-embed-core:${Versions.tomcatEmbedded}",
        "org.apache.tomcat.embed:tomcat-embed-el:${Versions.tomcatEmbedded}",
        "org.apache.tomcat.embed:tomcat-embed-jasper:${Versions.tomcatEmbedded}",
        "org.apache.tomcat.embed:tomcat-embed-websocket:${Versions.tomcatEmbedded}"
    )
    val spring = listOf(
		"org.springframework:spring-aop:${Versions.spring}",
        "org.springframework:spring-beans:${Versions.spring}",
        "org.springframework:spring-context:${Versions.spring}",
        "org.springframework:spring-core:${Versions.spring}",
        "org.springframework:spring-expression:${Versions.spring}",
        "org.springframework:spring-jdbc:${Versions.spring}",
        "org.springframework:spring-messaging:${Versions.spring}",
        "org.springframework:spring-tx:${Versions.spring}",
        "org.springframework:spring-web:${Versions.spring}",
        "org.springframework:spring-webmvc:${Versions.spring}",
        "org.springframework:spring-websocket:${Versions.spring}",
    )
    val springTest = "org.springframework:spring-test:${Versions.spring}"
    val springSecurity = listOf(
        "org.springframework.boot:spring-boot-starter-security:${Versions.springBoot}",
//        "org.springframework.security:spring-security-acl:${Versions.springSecurity}",
//        "org.springframework.security:spring-security-config:${Versions.springSecurity}",
//        "org.springframework.security:spring-security-core:${Versions.springSecurity}",
//        "org.springframework.security:spring-security-taglibs:${Versions.springSecurity}",
//        "org.springframework.security:spring-security-web:${Versions.springSecurity}",
    )
    val jwt = listOf(
        "io.jsonwebtoken:jjwt-api:${Versions.jwt}",
    )
    val jwtRuntime = listOf(
        "io.jsonwebtoken:jjwt-impl:${Versions.jwt}",
        "io.jsonwebtoken:jjwt-jackson:${Versions.jwt}",
    )
    val springBootJpa = listOf(
        "org.springframework.boot:spring-boot-starter-jdbc:${Versions.springBoot}",
        "org.springframework.boot:spring-boot-starter-data-jpa:${Versions.springBoot}",
        "org.springframework.boot:spring-boot-starter-data-jdbc:${Versions.springBoot}",
    )
    val springBootWeb =
        "org.springframework.boot:spring-boot-starter-web:${Versions.springBoot}"
    val springBootAnnotation =
        "org.springframework.boot:spring-boot-configuration-processor:${Versions.springBoot}"
    val springBootWebsocket =
        "org.springframework.boot:spring-boot-starter-websocket:${Versions.springBoot}"
    val springBootTomcat =
        "org.springframework.boot:spring-boot-starter-tomcat:${Versions.springBoot}"
    val springBootDevtools =
        "org.springframework.boot:spring-boot-devtools:${Versions.springBoot}"
	val springBootActuator =
		"org.springframework.boot:spring-boot-starter-actuator:${Versions.springBoot}"
    val springBoot = listOf(
        "org.springframework.boot:spring-boot-starter:${Versions.springBoot}",
        "org.springframework.boot:spring-boot-starter-web-services:${Versions.springBoot}",
        "org.springframework.boot:spring-boot-starter-log4j2:${Versions.springBoot}",

    ) + springBootJpa + springBootWebsocket

    val jackson = listOf(
        "com.fasterxml.jackson.core:jackson-core:${Versions.jackson}",
        "com.fasterxml.jackson.core:jackson-databind:${Versions.jackson}",
        "com.fasterxml.jackson.datatype:jackson-datatype-jdk8:${Versions.jackson}",
        "com.fasterxml.jackson.datatype:jackson-datatype-jsr310:${Versions.jackson}",
        "com.fasterxml.jackson.module:jackson-module-kotlin:${Versions.jackson}",
        "com.fasterxml.jackson.module:jackson-module-parameter-names:${Versions.jackson}",
    )
    val jacksonAnnotation =
        "com.fasterxml.jackson.core:jackson-annotations:${Versions.jackson}"

    val springBootTest = listOf(
        "org.springframework.boot:spring-boot-starter-test:${Versions.springBoot}",
    )
    val swagger2 = listOf(
        "io.springfox:springfox-swagger2:${Versions.swagger2}",
        "io.springfox:springfox-swagger-ui:${Versions.swagger2}"
    )
    val swagger3 = listOf(
        "io.springfox:springfox-boot-starter:${Versions.swagger3}",
        "io.springfox:springfox-swagger-ui:${Versions.swagger3}"
    )
    val ovirt = listOf(
        "org.ovirt.engine.api:sdk:${Versions.ovirt}",
    )
	val jsch = listOf(
		"com.github.mwiede:jsch:${Versions.jsch}",
		"org.bouncycastle:bcprov-jdk15on:1.70"
	)
	val okhttp3 = listOf(
		"com.squareup.okhttp3:okhttp:${Versions.okhttp3}",
		"com.squareup.okhttp3:okhttp-urlconnection:${Versions.okhttp3}",
		"com.squareup.okhttp3:logging-interceptor:${Versions.okhttp3}",
	)
	val retrofit2 = listOf(
		"com.squareup.retrofit2:retrofit:${Versions.retrofit2}",
		"com.squareup.retrofit2:converter-scalars:${Versions.retrofit2}",
		"com.squareup.retrofit2:converter-gson:${Versions.retrofit2}",
	) + okhttp3
    val qemu = listOf(
        "org.anarres.qemu:qemu-examples:${Versions.qemu}",
        "org.anarres.qemu:qemu-exec:${Versions.qemu}",
        "org.anarres.qemu:qemu-image:${Versions.qemu}",
        "org.anarres.qemu:qemu-qapi:${Versions.qemu}",
    )
    val tiles = listOf(
        "org.apache.tiles:tiles-api:${Versions.tiles}",
        "org.apache.tiles:tiles-core:${Versions.tiles}",
        "org.apache.tiles:tiles-jsp:${Versions.tiles}",
        "org.apache.tiles:tiles-servlet:${Versions.tiles}",
        "org.apache.tiles:tiles-template:${Versions.tiles}",
    )
    val mybatis = listOf(
        "org.mybatis:mybatis:${Versions.mybatis}",
        "org.mybatis:mybatis-spring:${Versions.mybatisSpring}"
    )
    val log4j = listOf(
        "org.apache.logging.log4j:log4j-core:${Versions.log4jApache}",
        "org.apache.logging.log4j:log4j-api:${Versions.log4jApache}",
        "org.apache.logging.log4j:log4j-jul:${Versions.log4jApache}",
        "org.apache.logging.log4j:log4j-slf4j-impl:${Versions.log4jApache}",
    )
    val webjars = listOf(
        "org.webjars:jquery:${Versions.jquery}",
        "org.webjars:bootstrap:${Versions.bootstrap}",
    )
    val jdbc =
        "org.postgresql:postgresql:${Versions.postgresql}"

    val commons = listOf(
        "commons-dbcp:commons-dbcp:${Versions.commonsDbcp}",
        "commons-configuration:commons-configuration:${Versions.commonsConf}",
        "commons-fileupload:commons-fileupload:${Versions.commonsFileUpload}",
        "org.apache.commons:commons-lang3:3.4",
    )
    val jasypt = listOf(
        "org.jasypt:jasypt:${Versions.jasypt}",
        "org.jasypt:jasypt-spring3:${Versions.jasypt}",
    )
    val gson = "com.google.code.gson:gson:${Versions.gson}"
    val jsonSimple = "com.googlecode.json-simple:json-simple:${Versions.jsonSimple}"
    val javaxServlet = listOf(
        "javax.servlet.jsp:jsp-api:${Versions.javaxServletJsp}",
        "javax.servlet:servlet-api:${Versions.javaxServlet}",
    )
    val javaxServletJstl = "javax.servlet:jstl:${Versions.javaxServletJstl}"
    val javaxInject = "javax.inject:javax.inject:1"
    val javaxAnnotation = "javax.annotation:javax.annotation-api:1.3.2"
    val aspectj = listOf(
        "org.aspectj:aspectjweaver:${Versions.aspectj}",
        "org.aspectj:aspectjrt:${Versions.aspectjrt}",
    )
    val cglib = listOf(
        "cglib:cglib-nodep:${Versions.cglib}",
    )
    val lombok = "org.projectlombok:lombok:${Versions.lombok}"
    val kotlinStdlib = listOf(
        "org.jetbrains.kotlin:kotlin-reflect:${Versions.kotlin}",
        "org.jetbrains.kotlin:kotlin-stdlib-jdk8:${Versions.kotlin}",
    )
    val junit = listOf(
        "org.junit.jupiter:junit-jupiter:${Versions.junit}",
        "org.junit.jupiter:junit-jupiter-api:${Versions.junit}",
        "org.junit.jupiter:junit-jupiter-engine:${Versions.junit}",
        "org.junit.jupiter:junit-jupiter-params:${Versions.junit}",
    )
    val hamcrest = listOf(
        "org.hamcrest:hamcrest-core:${Versions.hamcrest}",
    )
}

//util functions for adding the different type dependencies from build.gradle file
fun DependencyHandler.api(list: List<String>) {
    list.forEach { dependency ->
        add("api", dependency)
    }
}
fun DependencyHandler.kapt(list: List<String>) {
    list.forEach { dependency ->
        add("kapt", dependency)
    }
}

fun DependencyHandler.implementation(list: List<String>) {
    list.forEach { dependency ->
        add("implementation", dependency)
    }
}

fun DependencyHandler.runtimeOnly(list: List<String>) {
    list.forEach { dependency ->
        add("runtimeOnly", dependency)
    }
}

fun DependencyHandler.providedCompile(list: List<String>) {
    list.forEach { dependency ->
        add("providedCompile", dependency)
    }
}

fun DependencyHandler.tomcat(list: List<String>) {
    list.forEach { dependency ->
        add("tomcat", dependency)
    }
}

fun DependencyHandler.androidTestImplementation(list: List<String>) {
    list.forEach { dependency ->
        add("androidTestImplementation", dependency)
    }
}

fun DependencyHandler.testImplementation(list: List<String>) {
    list.forEach { dependency ->
        add("testImplementation", dependency)
    }
}

fun DependencyHandler.compileOnly(list: List<String>) {
    list.forEach { dependency ->
        add("compileOnly", dependency)
    }
}

fun DependencyHandler.testCompileOnly(list: List<String>) {
    list.forEach { dependency ->
        add("testCompileOnly", dependency)
    }
}
