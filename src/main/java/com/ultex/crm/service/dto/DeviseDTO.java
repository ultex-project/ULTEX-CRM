package com.ultex.crm.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.Devise} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DeviseDTO implements Serializable {

    private Long id;

    @NotNull
    private String code;

    @NotNull
    private String nomComplet;

    private String symbole;

    private String pays;

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

    public String getNomComplet() {
        return nomComplet;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public String getSymbole() {
        return symbole;
    }

    public void setSymbole(String symbole) {
        this.symbole = symbole;
    }

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DeviseDTO)) {
            return false;
        }

        DeviseDTO deviseDTO = (DeviseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, deviseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DeviseDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nomComplet='" + getNomComplet() + "'" +
            ", symbole='" + getSymbole() + "'" +
            ", pays='" + getPays() + "'" +
            "}";
    }
}
