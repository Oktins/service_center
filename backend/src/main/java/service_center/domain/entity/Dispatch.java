package service_center.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import service_center.domain.enums.DispatchStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispatches")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "service_request_id", nullable = false)
    private ServiceRequest serviceRequest;

    @ManyToOne
    @JoinColumn(name = "master_id", nullable = false)
    private Master master;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DispatchStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = DispatchStatus.SCHEDULED;
        }
    }
}
