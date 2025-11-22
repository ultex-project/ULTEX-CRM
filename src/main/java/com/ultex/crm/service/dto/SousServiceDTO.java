package com.ultex.crm.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.ultex.crm.domain.SousService} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SousServiceDTO implements Serializable {

    private Long id;

    @NotNull
    private String code;

    @NotNull
    private String libelle;

    private Set<DemandeClientDTO> demandes = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Set<DemandeClientDTO> getDemandes() {
        return demandes;
    }

    public void setDemandes(Set<DemandeClientDTO> demandes) {
        this.demandes = demandes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SousServiceDTO)) {
            return false;
        }

        SousServiceDTO sousServiceDTO = (SousServiceDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, sousServiceDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SousServiceDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", libelle='" + getLibelle() + "'" +
            ", demandes=" + getDemandes() +
            "}";
    }
}
