package com.ultex.crm.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.KycClient} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class KycClientDTO implements Serializable {

    private Long id;

    private Integer scoreStaff;

    private String comportements;

    private String remarques;

    private Integer completudeKyc;

    private String responsable;

    private ClientDTO client;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getScoreStaff() {
        return scoreStaff;
    }

    public void setScoreStaff(Integer scoreStaff) {
        this.scoreStaff = scoreStaff;
    }

    public String getComportements() {
        return comportements;
    }

    public void setComportements(String comportements) {
        this.comportements = comportements;
    }

    public String getRemarques() {
        return remarques;
    }

    public void setRemarques(String remarques) {
        this.remarques = remarques;
    }

    public Integer getCompletudeKyc() {
        return completudeKyc;
    }

    public void setCompletudeKyc(Integer completudeKyc) {
        this.completudeKyc = completudeKyc;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
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
        if (!(o instanceof KycClientDTO)) {
            return false;
        }

        KycClientDTO kycClientDTO = (KycClientDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, kycClientDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KycClientDTO{" +
            "id=" + getId() +
            ", scoreStaff=" + getScoreStaff() +
            ", comportements='" + getComportements() + "'" +
            ", remarques='" + getRemarques() + "'" +
            ", completudeKyc=" + getCompletudeKyc() +
            ", responsable='" + getResponsable() + "'" +
            ", client=" + getClient() +
            "}";
    }
}
