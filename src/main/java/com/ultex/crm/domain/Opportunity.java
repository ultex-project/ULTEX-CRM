package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.OpportunityStage;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Opportunity.
 */
@Entity
@Table(name = "opportunity")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Opportunity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "stage", nullable = false)
    private OpportunityStage stage;

    @Column(name = "close_date")
    private Instant closeDate;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "opportunities", "convertedProspects" }, allowSetters = true)
    private InternalUser assignedTo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(
        value = { "opportunities", "pays", "company", "convertedFromProspect", "contacts", "kycClient" },
        allowSetters = true
    )
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Opportunity id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Opportunity title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Opportunity description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public Opportunity amount(BigDecimal amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public OpportunityStage getStage() {
        return this.stage;
    }

    public Opportunity stage(OpportunityStage stage) {
        this.setStage(stage);
        return this;
    }

    public void setStage(OpportunityStage stage) {
        this.stage = stage;
    }

    public Instant getCloseDate() {
        return this.closeDate;
    }

    public Opportunity closeDate(Instant closeDate) {
        this.setCloseDate(closeDate);
        return this;
    }

    public void setCloseDate(Instant closeDate) {
        this.closeDate = closeDate;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Opportunity createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public Opportunity updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public InternalUser getAssignedTo() {
        return this.assignedTo;
    }

    public void setAssignedTo(InternalUser internalUser) {
        this.assignedTo = internalUser;
    }

    public Opportunity assignedTo(InternalUser internalUser) {
        this.setAssignedTo(internalUser);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Opportunity client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Opportunity)) {
            return false;
        }
        return getId() != null && getId().equals(((Opportunity) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Opportunity{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", amount=" + getAmount() +
            ", stage='" + getStage() + "'" +
            ", closeDate='" + getCloseDate() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
}
