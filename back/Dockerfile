
# ------------------------------
# Stage 1: Build the application using Gradle
FROM gradle:7.4.2-jdk11-focal AS build
LABEL maintainer="Chan Hee Lee <chanhi2000@gmail.com>"
LABEL build-stage="gradle"

WORKDIR /home/gradle/project

# Copy the Gradle wrapper and build files
COPY gradle /home/gradle/project/gradle
COPY gradlew /home/gradle/project/
COPY build.gradle.kts /home/gradle/project/
COPY settings.gradle.kts /home/gradle/project/
COPY gradle.properties /home/gradle/project/

# Ensure the gradlew script has execute permissions
RUN chmod +x gradlew

# Copy the rest of the application source code
COPY buildSrc /home/gradle/project/buildSrc
COPY rutil-vm-api /home/gradle/project/rutil-vm-api
COPY rutil-vm-api-ovirt-business /home/gradle/project/rutil-vm-api-ovirt-business
COPY rutil-vm-api-cert /home/gradle/project/rutil-vm-api-cert
COPY rutil-vm-api-repository /home/gradle/project/rutil-vm-api-repository
COPY rutil-vm-api-socket /home/gradle/project/rutil-vm-api-socket
COPY rutil-vm-api-vmware /home/gradle/project/rutil-vm-api-vmware
COPY rutil-vm-common /home/gradle/project/rutil-vm-common
COPY rutil-vm-util /home/gradle/project/rutil-vm-util
COPY rutil-vm-util-cert /home/gradle/project/rutil-vm-util-cert
COPY rutil-vm-util-ovirt /home/gradle/project/rutil-vm-util-ovirt
COPY rutil-vm-util-ssh /home/gradle/project/rutil-vm-util-ssh



# Copy the node build results to path (ONLY when skipNpm=true)
# COPY --from=build-fe /usr/src/app/build /home/gradle/project/rutil-vm-api/src/main/resources/static
# RUN ls /home/gradle/project/rutil-vm-api/src/main/resources/static

# Build the application
RUN ./gradlew rutil-vm-api:bootJar -Pprofile=staging --parallel

# ------------------------------
# Stage 2: Run the application
# Base image for the runtime stage
FROM eclipse-temurin:11-jdk-focal
LABEL maintainer="Chan Hee Lee <chanhi2000@gmail.com>"
LABEL description="RutilVM (API)"
LABEL version="0.2.1"
LABEL vcs-url="https://github.com/ititcloud/rutil-vm"
LABEL build-date="2025-03-07"
LABEL commit-hash="05f9e12ee27c1532623112d1df92004226d0d347"
LABEL license="Apache-2.0"
LABEL environment="production"
LABEL app-name="rutil-vm-api"

# tzdata for timzone
RUN apt-get update -y
RUN apt-get install -y tzdata
# timezone env with default

ENV RUTIL_VM_VERSION=0.2.1
ENV RUTIL_VM_RELEASE_DATE=2025-03-07
ENV RUTIL_VM_PORT_HTTP=8080
ENV RUTIL_VM_PORT_HTTPS=8443
ENV RUTIL_VM_OVIRT_PORT_HTTPS=2443
ENV RUTIL_VM_SSL_KEY_STORE=/root/rutil-vm/rutil-vm-api/certs/keystore.p12
ENV RUTIL_VM_SSL_KEY_STORE_PASSWORD=rutil-vm-api
ENV RUTIL_VM_SSL_KEY_ALIAS=rutil-vm-api
ENV RUTIL_VM_OVIRT_IP=192.168.0.70
ENV RUTIL_VM_CORS_ALLOWED_ORIGINS=localhost;rutil-vm
ENV RUTIL_VM_CORS_ALLOWED_ORIGINS_PORT=3000;3443;443
ENV RUTIL_VM_OVIRT_SSH_JSCH_LOG_ENABLED=false
ENV RUTIL_VM_OVIRT_SSH_PRVKEY_LOCATION=/root/.ssh/id_rsa
ENV RUTIL_VM_OVIRT_SSH_ENGINE_ADDRESS=root@192.168.0.70:22
ENV RUTIL_VM_OVIRT_SSH_ENGINE_PRVKEY=

ENV POSTGRES_JDBC_PORT=5432
ENV POSTGRES_DATASOURCE_JDBC_ID=rutil
ENV POSTGRES_DATASOURCE_JDBC_PW=rutil1!
RUN echo "================== database.properties =================="
RUN echo ""
RUN echo ""

RUN echo "================== application.properties =================="
RUN echo ""
RUN echo "application.version: $RUTIL_VM_VERSION"
RUN echo ""
RUN echo "server.ssl.enabled: $RUTIL_VM_SSL_ENABLED"
RUN echo "server.ssl.key-store: $RUTIL_VM_SSL_KEY_STORE"
RUN echo "server.ssl.key-store-password: $RUTIL_VM_SSL_KEY_STORE_PASSWORD"
RUN echo "server.ssl.key-alias: $RUTIL_VM_SSL_KEY_ALIAS"
RUN echo ""
RUN echo "spring.datasource.engine.url: $POSTGRES_JDBC_URL_ENGINE"
RUN echo "spring.datasource.engine.username: $POSTGRES_DATASOURCE_JDBC_ID"
RUN echo "spring.datasource.engine.password: $POSTGRES_DATASOURCE_JDBC_PW"
RUN echo ""
RUN echo "spring.datasource.history.url: $POSTGRES_JDBC_URL_HISTORY"
RUN echo "spring.datasource.history.username: $POSTGRES_DATASOURCE_JDBC_ID"
RUN echo "spring.datasource.history.password: $POSTGRES_DATASOURCE_JDBC_PW"
RUN echo ""
RUN echo "spring.datasource.aaa.url: $POSTGRES_JDBC_URL_AAA"
RUN echo "spring.datasource.aaa.username: $POSTGRES_DATASOURCE_JDBC_ID"
RUN echo "spring.datasource.aaa.password: $POSTGRES_DATASOURCE_JDBC_PW"
RUN echo ""

# Set the working directory inside the container
WORKDIR /app

# Copy the Spring Boot jar file from the build stage
COPY --from=build /home/gradle/project/rutil-vm-api/build/libs/*.jar app.jar

EXPOSE 8080
EXPOSE 8443

ENTRYPOINT [ "java", "-jar", "app.jar", \
  # "-Dspring-boot.run.arguments=", \
  "--application.ovirt.ip=${RUTIL_VM_OVIRT_IP}", \
  "--application.ovirt.port.ssl=${RUTIL_VM_OVIRT_PORT_HTTPS}", \
  "--application.api.cors.allowed-origins=${RUTIL_VM_CORS_ALLOWED_ORIGINS}", \
  "--application.api.cors.allowed-origins.port=${RUTIL_VM_CORS_ALLOWED_ORIGINS_PORT}", \
  "--application.ovirt.ssh.jsch.log.enabled=${RUTIL_VM_OVIRT_SSH_JSCH_LOG_ENABLED}", \
  "--application.ovirt.ssh.prvkey.location=${RUTIL_VM_OVIRT_SSH_PRVKEY_LOCATION}", \
  "--application.ovirt.ssh.engine.address=${RUTIL_VM_OVIRT_SSH_ENGINE_ADDRESS}", \
  "--application.ovirt.ssh.engine.prvkey=${RUTIL_VM_OVIRT_SSH_ENGINE_PRVKEY}", \
  "--server.port=${RUTIL_VM_PORT_HTTPS}", \
  "--server.ssl.key-store=${RUTIL_VM_SSL_KEY_STORE}", \
  "--server.ssl.key-store-password=${RUTIL_VM_SSL_KEY_STORE_PASSWORD}", \
  "--server.ssl.key-alias=${RUTIL_VM_SSL_KEY_ALIAS}", \
  # "--spring.datasource.engine.url=${RUTIL_VM_OVIRT_IP}", \
  "--spring.datasource.engine.username=${POSTGRES_DATASOURCE_JDBC_ID}", \
  "--spring.datasource.engine.password=${POSTGRES_DATASOURCE_JDBC_PW}", \
  # "--spring.datasource.history.url=${POSTGRES_JDBC_URL_HISTORY}", \
  "--spring.datasource.history.username=${POSTGRES_DATASOURCE_JDBC_ID}", \
  "--spring.datasource.history.password=${POSTGRES_DATASOURCE_JDBC_PW}", \
  # "--spring.datasource.aaa.url=${POSTGRES_JDBC_URL_AAA}", \
  "--spring.datasource.aaa.username=${POSTGRES_DATASOURCE_JDBC_ID}", \
  "--spring.datasource.aaa.password=${POSTGRES_DATASOURCE_JDBC_PW}" \
]
