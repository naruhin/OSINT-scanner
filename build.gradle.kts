allprojects {
    repositories {
        mavenCentral()
    }
}

subprojects {
    group = "org.osint-scanner"
    version = "0.0.1-SNAPSHOT"
}

tasks.register("runLocal") {
    group = "application"
    description = "Clean, build and run both the server and client locally"

    doLast {
        val osName = System.getProperty("os.name").toLowerCase()
        val isWindows = osName.contains("windows")
        val gradlewCommand = if (isWindows) "gradlew.bat" else "./gradlew"

        println("Cleaning and building backend...")
        exec { commandLine(gradlewCommand, ":server:clean") }
        exec { commandLine(gradlewCommand, ":server:build") }

        println("Starting backend...")
        val backendProcess = ProcessBuilder(gradlewCommand, ":server:bootRun")
            .inheritIO()
            .start()

        println("Backend is accessible at: http://localhost:8080")

        println("Starting client...")
        val clientProcess = if (isWindows) {
            ProcessBuilder("cmd", "/c", "npm", "start")
        } else {
            ProcessBuilder("npm", "start")
        }.directory(file("client"))
            .inheritIO()
            .start()

        println("Client is accessible at: http://localhost:3000")
        backendProcess.waitFor()
        clientProcess.waitFor()
    }
}
