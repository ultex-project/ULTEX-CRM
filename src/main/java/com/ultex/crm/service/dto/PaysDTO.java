package com.ultex.crm.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.Pays} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PaysDTO implements Serializable {

    private Long id;

    @NotNull
    private String code;

    @NotNull
    private String nom;

    private String indicatif;

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

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getIndicatif() {
        return indicatif;
    }

    public void setIndicatif(String indicatif) {
        this.indicatif = indicatif;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PaysDTO)) {
            return false;
        }

        PaysDTO paysDTO = (PaysDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, paysDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PaysDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nom='" + getNom() + "'" +
            ", indicatif='" + getIndicatif() + "'" +
            "}";
    }
}
