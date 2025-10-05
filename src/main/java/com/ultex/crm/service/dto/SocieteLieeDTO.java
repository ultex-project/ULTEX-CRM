package com.ultex.crm.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.SocieteLiee} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SocieteLieeDTO implements Serializable {

    private Long id;

    @NotNull
    private String raisonSociale;

    private String formeJuridique;

    private String ice;

    private String rc;

    private String nif;

    private String secteurActivite;

    private String tailleEntreprise;

    private String adresseSiege;

    private String representantLegal;

    private ClientDTO client;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRaisonSociale() {
        return raisonSociale;
    }

    public void setRaisonSociale(String raisonSociale) {
        this.raisonSociale = raisonSociale;
    }

    public String getFormeJuridique() {
        return formeJuridique;
    }

    public void setFormeJuridique(String formeJuridique) {
        this.formeJuridique = formeJuridique;
    }

    public String getIce() {
        return ice;
    }

    public void setIce(String ice) {
        this.ice = ice;
    }

    public String getRc() {
        return rc;
    }

    public void setRc(String rc) {
        this.rc = rc;
    }

    public String getNif() {
        return nif;
    }

    public void setNif(String nif) {
        this.nif = nif;
    }

    public String getSecteurActivite() {
        return secteurActivite;
    }

    public void setSecteurActivite(String secteurActivite) {
        this.secteurActivite = secteurActivite;
    }

    public String getTailleEntreprise() {
        return tailleEntreprise;
    }

    public void setTailleEntreprise(String tailleEntreprise) {
        this.tailleEntreprise = tailleEntreprise;
    }

    public String getAdresseSiege() {
        return adresseSiege;
    }

    public void setAdresseSiege(String adresseSiege) {
        this.adresseSiege = adresseSiege;
    }

    public String getRepresentantLegal() {
        return representantLegal;
    }

    public void setRepresentantLegal(String representantLegal) {
        this.representantLegal = representantLegal;
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
        if (!(o instanceof SocieteLieeDTO)) {
            return false;
        }

        SocieteLieeDTO societeLieeDTO = (SocieteLieeDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, societeLieeDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SocieteLieeDTO{" +
            "id=" + getId() +
            ", raisonSociale='" + getRaisonSociale() + "'" +
            ", formeJuridique='" + getFormeJuridique() + "'" +
            ", ice='" + getIce() + "'" +
            ", rc='" + getRc() + "'" +
            ", nif='" + getNif() + "'" +
            ", secteurActivite='" + getSecteurActivite() + "'" +
            ", tailleEntreprise='" + getTailleEntreprise() + "'" +
            ", adresseSiege='" + getAdresseSiege() + "'" +
            ", representantLegal='" + getRepresentantLegal() + "'" +
            ", client=" + getClient() +
            "}";
    }
}
