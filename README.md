
# OSINT Web Scanner

This project is a multi-module OSINT web scanner application, consisting of a Spring Boot backend (written in Kotlin using Gradle Kotlin DSL) and a React frontend. You can run the application either locally (without Docker) or in a containerized environment using Docker Compose.

## Project Structure

```
OSINT-scanner/
├── build.gradle.kts         // Root Gradle build file with common configuration and custom tasks
├── settings.gradle.kts      // Lists the included modules: "server" and "client"
├── docker-compose.yml       // Docker Compose file to run the full stack (DB, backend, frontend)
├── README.md                // This file
│
├── server/                  // Spring Boot backend module
│   ├── build.gradle.kts     // Module-specific build configuration (Kotlin DSL)
│   ├── Dockerfile           // Dockerfile for building the backend container
│   └── src/                 // Source code and resources
│       ├── main/
│       │   ├── kotlin/      // Kotlin source code (e.g., com/example/yourapp/...)
│       │   └── resources/   // Resources (e.g., application.yml)
│       └── test/            // Unit and integration tests
│
└── client/                  // React frontend module
    ├── package.json         // Node dependencies and scripts for the React app
    ├── Dockerfile           // Dockerfile for building the client container (using multi-stage build with Nginx)
    └── src/                 // React source code (components, App.js, theme.js, etc.)
```

## Running the Application Locally

### Prerequisites

- **Backend:** Java 17 and Gradle installed.
- **Client:** Node.js and npm installed.
- (Optional) Use a Unix-like environment for best compatibility with the provided Gradle task.

### Using the Gradle Task

A custom Gradle task `runLocal` is provided in the root `build.gradle.kts`. This task will:

1. Clean and build the backend.
2. Launch the backend using the `:server:bootRun` task.
3. Launch the client using `npm start` in the `client` directory.
4. Print the access URLs for both applications.

To run the task, execute in the root directory:

```bash
./gradlew runLocal
```

You should see messages like:

- **Backend is accessible at:** http://localhost:8080
- **Client is accessible at:** http://localhost:3000

Press Ctrl+C to gracefully terminate both processes. (A shutdown hook will attempt to stop both processes.)

### Manual Steps

Alternatively, you can run each module manually:

#### Backend

1. Navigate to the `server` folder.
2. Build the application:

   ```bash
   ./gradlew bootJar
   ```

3. Run the backend:

   ```bash
   ./gradlew bootRun
   ```

4. The backend will be available at: [http://localhost:8080](http://localhost:8080)

#### Client

1. Navigate to the `client` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

4. The client will be available at: [http://localhost:3000](http://localhost:3000)

---

## Running the Application with Docker

### Prerequisites

- Docker and Docker Compose must be installed.

### Steps

1. **Configure Ports:**  
   Ensure that no conflicting services are running on ports 5432, 8080, or 3000. If needed, adjust the port mappings in `docker-compose.yml`.

2. **Run Docker Compose:**  
   From the root directory, run:

   ```bash
   docker-compose up --build
   ```

   This command will build and run three services:


3. **Stopping the Containers:**  
   To stop all containers, press `Ctrl+C` in the terminal running Docker Compose or run:

   ```bash
   docker-compose down
   ```

---

## Additional Information

### Environment Variables & Configuration

- **Backend Configuration:**  
  The backend uses an `application.yml` file (located in `server/src/main/resources`) for its configuration (e.g., PostgreSQL connection settings, server port, etc.). For example:

  ```yaml
  spring:
    application:
      name: server
    datasource:
      url: jdbc:postgresql://localhost:5432/osint_scanner?stringtype=unspecified
      username: postgres
      password: password
      driver-class-name: org.postgresql.Driver
    jpa:
      hibernate:
        ddl-auto: update
      properties:
        hibernate:
          dialect: org.hibernate.dialect.PostgreSQLDialect

  server:
    port: 8080
  ```

- **Docker Socket Access:**  
  If your backend needs to execute Docker commands (e.g., for running Amass containers), ensure that the Docker socket is mounted into the container (see docker-compose.yml).

### Troubleshooting

- **Port Conflicts:**  
  If you encounter errors about ports not being available, adjust the mappings in `docker-compose.yml` or stop other services using those ports.
- **Build Issues:**  
  Ensure that your multi-module project builds correctly with Gradle. Use `./gradlew clean build` in the root directory.
- **Environment:**  
  Use appropriate environment configurations for local development versus production.

---
