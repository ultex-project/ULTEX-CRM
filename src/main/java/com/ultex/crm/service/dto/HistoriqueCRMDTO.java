package com.ultex.crm.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.HistoriqueCRM} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HistoriqueCRMDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant dateInteraction;

    private String canal;

    private String agent;

    @Lob
    private String resume;

    private String etat;

    private String observation;

    private ClientDTO client;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDateInteraction() {
        return dateInteraction;
    }

    public void setDateInteraction(Instant dateInteraction) {
        this.dateInteraction = dateInteraction;
    }

    public String getCanal() {
        return canal;
    }

    public void setCanal(String canal) {
        this.canal = canal;
    }

    public String getAgent() {
        return agent;
    }

    public void setAgent(String agent) {
        this.agent = agent;
    }

    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
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
        if (!(o instanceof HistoriqueCRMDTO)) {
            return false;
        }

        HistoriqueCRMDTO historiqueCRMDTO = (HistoriqueCRMDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, historiqueCRMDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HistoriqueCRMDTO{" +
            "id=" + getId() +
            ", dateInteraction='" + getDateInteraction() + "'" +
            ", canal='" + getCanal() + "'" +
            ", agent='" + getAgent() + "'" +
            ", resume='" + getResume() + "'" +
            ", etat='" + getEtat() + "'" +
            ", observation='" + getObservation() + "'" +
            ", client=" + getClient() +
            "}";
    }
}
