package org.osint.server.controller


import org.osint.server.domain.Scan
import org.osint.server.domain.dto.ScanRequest
import org.osint.server.service.ScanService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/scans")
@Validated
class ScanController(private val scanService: ScanService) {

    private val logger = LoggerFactory.getLogger(ScanController::class.java)

    @GetMapping
    fun getScans(): ResponseEntity<List<Scan>> {
        logger.info("Fetching all scans")
        val scans = scanService.getAllScans()
        return ResponseEntity.ok(scans)
    }

    @PostMapping
    suspend fun createScan(@RequestBody request: ScanRequest): ResponseEntity<Scan> {
        logger.info("Initiating scan for domain: {}", request.domain)
        val scan = scanService.initiateScan(request.domain)
        return ResponseEntity.ok(scan)
    }
}
