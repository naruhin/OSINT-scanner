package org.osint.server.domain

import jakarta.persistence.*
import org.hibernate.annotations.GenericGenerator
import org.osint.server.domain.enums.ScanStatus
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "scans")
data class Scan(
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    val id: UUID? = null,

    val domain: String,

    val startTime: LocalDateTime,

    var endTime: LocalDateTime? = null,

    @Enumerated(EnumType.STRING)
    var status: ScanStatus = ScanStatus.IN_PROGRESS,

    @Lob
    @Column(columnDefinition = "text")
    var output: String? = null

)

