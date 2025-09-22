package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.OpportunityStage;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.Opportunity} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OpportunityDTO implements Serializable {

    private Long id;

    @NotNull
    private String title;

    private String description;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private OpportunityStage stage;

    private Instant closeDate;

    private InternalUserDTO assignedTo;

    private ClientDTO client;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public OpportunityStage getStage() {
        return stage;
    }

    public void setStage(OpportunityStage stage) {
        this.stage = stage;
    }

    public Instant getCloseDate() {
        return closeDate;
    }

    public void setCloseDate(Instant closeDate) {
        this.closeDate = closeDate;
    }

    public InternalUserDTO getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(InternalUserDTO assignedTo) {
        this.assignedTo = assignedTo;
    }

    public ClientDTO getClient() {
        return client;
    }

    public void setClient(ClientDTO client) {
        this.client = client;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OpportunityDTO)) {
            return false;
        }

        OpportunityDTO opportunityDTO = (OpportunityDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, opportunityDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OpportunityDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", amount=" + getAmount() +
            ", stage='" + getStage() + "'" +
            ", closeDate='" + getCloseDate() + "'" +
            ", assignedTo=" + getAssignedTo() +
            ", client=" + getClient() +
            "}";
    }
}
