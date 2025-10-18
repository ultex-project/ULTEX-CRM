package com.ultex.crm.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.CycleActivation} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CycleActivationDTO implements Serializable {

    private Long id;

    @NotNull
    private Integer numeroCycle;

    @NotNull
    private Instant dateDebut;

    private Instant dateFin;

    private String statutCycle;

    @Lob
    private String commentaire;

    @NotNull
    private ClientDTO client;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroCycle() {
        return numeroCycle;
    }

    public void setNumeroCycle(Integer numeroCycle) {
        this.numeroCycle = numeroCycle;
    }

    public Instant getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Instant getDateFin() {
        return dateFin;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public String getStatutCycle() {
        return statutCycle;
    }

    public void setStatutCycle(String statutCycle) {
        this.statutCycle = statutCycle;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
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
        if (!(o instanceof CycleActivationDTO)) {
            return false;
        }

        CycleActivationDTO cycleActivationDTO = (CycleActivationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, cycleActivationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CycleActivationDTO{" +
            "id=" + getId() +
            ", numeroCycle=" + getNumeroCycle() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", statutCycle='" + getStatutCycle() + "'" +
            ", commentaire='" + getCommentaire() + "'" +
            ", client=" + getClient() +
            "}";
    }
}
