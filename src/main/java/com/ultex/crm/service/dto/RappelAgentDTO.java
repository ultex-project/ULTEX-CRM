package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.StatutRappel;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.RappelAgent} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RappelAgentDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant rappelDate;

    private String rappelMessage;

    @NotNull
    private StatutRappel statutRappel;

    private Instant createdAt;

    private Instant updatedAt;

    private EtatInteractionDTO etat;

    private ClientDTO client;

    private InternalUserDTO agent;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getRappelDate() {
        return rappelDate;
    }

    public void setRappelDate(Instant rappelDate) {
        this.rappelDate = rappelDate;
    }

    public String getRappelMessage() {
        return rappelMessage;
    }

    public void setRappelMessage(String rappelMessage) {
        this.rappelMessage = rappelMessage;
    }

    public StatutRappel getStatutRappel() {
        return statutRappel;
    }

    public void setStatutRappel(StatutRappel statutRappel) {
        this.statutRappel = statutRappel;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public EtatInteractionDTO getEtat() {
        return etat;
    }

    public void setEtat(EtatInteractionDTO etat) {
        this.etat = etat;
    }

    public ClientDTO getClient() {
        return client;
    }

    public void setClient(ClientDTO client) {
        this.client = client;
    }

    public InternalUserDTO getAgent() {
        return agent;
    }

    public void setAgent(InternalUserDTO agent) {
        this.agent = agent;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RappelAgentDTO)) {
            return false;
        }

        RappelAgentDTO rappelAgentDTO = (RappelAgentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, rappelAgentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RappelAgentDTO{" +
            "id=" + getId() +
            ", rappelDate='" + getRappelDate() + "'" +
            ", rappelMessage='" + getRappelMessage() + "'" +
            ", statutRappel='" + getStatutRappel() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", etat=" + getEtat() +
            ", client=" + getClient() +
            ", agent=" + getAgent() +
            "}";
    }
}
