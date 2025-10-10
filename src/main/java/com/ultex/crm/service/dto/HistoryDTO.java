package com.ultex.crm.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.History} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HistoryDTO implements Serializable {

    private Long id;

    @NotNull
    private String entityName;

    @NotNull
    private Long entityId;

    @NotNull
    private String action;

    private String fieldChanged;

    private String oldValue;

    private String newValue;

    @NotNull
    private String performedBy;

    @NotNull
    private Instant performedDate;

    @Lob
    private String details;

    private String ipAddress;

    private String userAgent;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getFieldChanged() {
        return fieldChanged;
    }

    public void setFieldChanged(String fieldChanged) {
        this.fieldChanged = fieldChanged;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public Instant getPerformedDate() {
        return performedDate;
    }

    public void setPerformedDate(Instant performedDate) {
        this.performedDate = performedDate;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HistoryDTO)) {
            return false;
        }

        HistoryDTO historyDTO = (HistoryDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, historyDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HistoryDTO{" +
            "id=" + getId() +
            ", entityName='" + getEntityName() + "'" +
            ", entityId=" + getEntityId() +
            ", action='" + getAction() + "'" +
            ", fieldChanged='" + getFieldChanged() + "'" +
            ", oldValue='" + getOldValue() + "'" +
            ", newValue='" + getNewValue() + "'" +
            ", performedBy='" + getPerformedBy() + "'" +
            ", performedDate='" + getPerformedDate() + "'" +
            ", details='" + getDetails() + "'" +
            ", ipAddress='" + getIpAddress() + "'" +
            ", userAgent='" + getUserAgent() + "'" +
            "}";
    }
}
