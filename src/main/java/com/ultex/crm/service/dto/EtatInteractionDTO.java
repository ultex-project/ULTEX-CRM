package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.EtatCRM;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.EtatInteraction} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EtatInteractionDTO implements Serializable {

    private Long id;

    @NotNull
    private EtatCRM etat;

    @NotNull
    private Instant dateEtat;

    private String agent;

    @Lob
    private String observation;

    private HistoriqueCRMDTO historique;

    @NotNull
    private CycleActivationDTO cycle;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EtatCRM getEtat() {
        return etat;
    }

    public void setEtat(EtatCRM etat) {
        this.etat = etat;
    }

    public Instant getDateEtat() {
        return dateEtat;
    }

    public void setDateEtat(Instant dateEtat) {
        this.dateEtat = dateEtat;
    }

    public String getAgent() {
        return agent;
    }

    public void setAgent(String agent) {
        this.agent = agent;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public HistoriqueCRMDTO getHistorique() {
        return historique;
    }

    public void setHistorique(HistoriqueCRMDTO historique) {
        this.historique = historique;
    }

    public CycleActivationDTO getCycle() {
        return cycle;
    }

    public void setCycle(CycleActivationDTO cycle) {
        this.cycle = cycle;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EtatInteractionDTO)) {
            return false;
        }

        EtatInteractionDTO etatInteractionDTO = (EtatInteractionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, etatInteractionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EtatInteractionDTO{" +
            "id=" + getId() +
            ", etat='" + getEtat() + "'" +
            ", dateEtat='" + getDateEtat() + "'" +
            ", agent='" + getAgent() + "'" +
            ", observation='" + getObservation() + "'" +
            ", historique=" + getHistorique() +
            ", cycle=" + getCycle() +
            "}";
    }
}
