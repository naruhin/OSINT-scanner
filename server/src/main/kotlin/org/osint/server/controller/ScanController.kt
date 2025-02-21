package org.osint.server.controller

import org.osint.server.domain.Scan
import org.osint.server.domain.dto.ScanRequest
import org.osint.server.service.ScanService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/")
class ScanController(private val scanService: ScanService) {

    @GetMapping("/scans")
    fun getScans(): List<Scan> = scanService.getAllScans()

    @PostMapping("/scan")
    suspend fun createScan(@RequestBody request: ScanRequest): Scan {
        return scanService.initiateScan(request.domain)
    }
}