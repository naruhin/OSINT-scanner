package org.osint.server.repository

import org.osint.server.domain.Scan
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ScanRepository : JpaRepository<Scan, UUID>