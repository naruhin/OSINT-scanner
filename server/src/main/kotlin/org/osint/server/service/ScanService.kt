package org.osint.server.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import org.osint.server.domain.Scan
import org.osint.server.domain.enums.ScanStatus
import org.osint.server.repository.ScanRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ScanService(
    private val scanRepository: ScanRepository,
    @Autowired private val applicationContext: ApplicationContext
) {
    private val logger = LoggerFactory.getLogger(ScanService::class.java)

    fun getAllScans(): List<Scan> = scanRepository.findAll()

    suspend fun initiateScan(domain: String): Scan {
        val scan = Scan(
            domain = domain,
            startTime = LocalDateTime.now(),
            status = ScanStatus.IN_PROGRESS
        )
        val savedScan = withContext(Dispatchers.IO) {
            scanRepository.save(scan)
        }
        applicationContext.getBean(ScanService::class.java).runScanAsync(savedScan)
        return savedScan
    }

    @Async
    fun runScanAsync(scan: Scan) {
        try {
            val command = listOf(
                "docker", "run", "--rm",
                "caffix/amass",
                "enum", "-passive", "-d", scan.domain
            )

            logger.info("Executing command: {}", command.joinToString(" "))
            val processBuilder = ProcessBuilder(command)
            processBuilder.redirectErrorStream(true)
            val process = processBuilder.start()

            val output = process.inputStream.bufferedReader().use { it.readText() }
            val exitCode = process.waitFor()

            scan.endTime = LocalDateTime.now()

            if (exitCode == 0) {
                val results = output.lines().filter { it.isNotBlank() }
                scan.output = JSONObject().put("results", results).toString()
                scan.status = ScanStatus.COMPLETED
                logger.info("Scan for domain {} completed successfully.", scan.domain)
            } else {
                scan.output = JSONObject()
                    .put("error", "Process exited with code $exitCode")
                    .put("output", output)
                    .toString()
                scan.status = ScanStatus.FAILED
                logger.error("Scan for domain {} failed with exit code {}.", scan.domain, exitCode)
            }
        } catch (ex: Exception) {
            scan.endTime = LocalDateTime.now()
            scan.status = ScanStatus.FAILED
            scan.output = JSONObject().put("exception", ex.message).toString()
            logger.error("Exception during scan for domain {}: {}", scan.domain, ex.message, ex)
        } finally {
            try {
                scanRepository.save(scan)
                logger.info("Scan record for domain {} updated in repository.", scan.domain)
            } catch (e: Exception) {
                logger.error("Failed to update scan record for domain {}: {}", scan.domain, e.message, e)
            }
        }
    }
}
