package org.osint.server.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import org.osint.server.domain.Scan
import org.osint.server.domain.enums.ScanStatus
import org.osint.server.repository.ScanRepository
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

    fun getAllScans(): List<Scan> = scanRepository.findAll()

    suspend fun initiateScan(domain: String): Scan {
        val scan = Scan(
            domain = domain,
            startTime = LocalDateTime.now(),
            status = ScanStatus.IN_PROGRESS,
            output = null
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

            val processBuilder = ProcessBuilder(command)
            processBuilder.redirectErrorStream(true)
            val process = processBuilder.start()

            val output = process.inputStream.bufferedReader().use { it.readText() }
            val exitCode = process.waitFor()

            scan.endTime = LocalDateTime.now()
            val jsonResult = if (exitCode == 0) {
                val results = output.lines().filter { it.isNotBlank() }
                JSONObject().put("results", results).toString()
            } else {
                JSONObject()
                    .put("error", "Process exited with code $exitCode")
                    .put("output", output)
                    .toString()
            }
            scan.output = jsonResult
            scan.status = if (exitCode == 0) ScanStatus.COMPLETED else ScanStatus.FAILED
        } catch (ex: Exception) {
            scan.endTime = LocalDateTime.now()
            scan.status = ScanStatus.FAILED
            scan.output = JSONObject().put("exception", ex.message).toString()
        } finally {
            scanRepository.save(scan)
        }
    }
}
