package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.PlateformeSociale;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.ReseauSocial} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReseauSocialDTO implements Serializable {

    private Long id;

    @NotNull
    private PlateformeSociale plateforme;

    private String urlProfil;

    private String username;

    private String type;

    @NotNull
    private ClientDTO client;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlateformeSociale getPlateforme() {
        return plateforme;
    }

    public void setPlateforme(PlateformeSociale plateforme) {
        this.plateforme = plateforme;
    }

    public String getUrlProfil() {
        return urlProfil;
    }

    public void setUrlProfil(String urlProfil) {
        this.urlProfil = urlProfil;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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
        if (!(o instanceof ReseauSocialDTO)) {
            return false;
        }

        ReseauSocialDTO reseauSocialDTO = (ReseauSocialDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, reseauSocialDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReseauSocialDTO{" +
            "id=" + getId() +
            ", plateforme='" + getPlateforme() + "'" +
            ", urlProfil='" + getUrlProfil() + "'" +
            ", username='" + getUsername() + "'" +
            ", type='" + getType() + "'" +
            ", client=" + getClient() +
            "}";
    }
}
