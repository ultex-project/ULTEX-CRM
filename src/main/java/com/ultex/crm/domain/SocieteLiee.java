package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SocieteLiee.
 */
@Entity
@Table(name = "societe_liee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SocieteLiee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "raison_sociale", nullable = false)
    private String raisonSociale;

    @Column(name = "forme_juridique")
    private String formeJuridique;

    @Column(name = "ice")
    private String ice;

    @Column(name = "rc")
    private String rc;

    @Column(name = "nif")
    private String nif;

    @Column(name = "secteur_activite")
    private String secteurActivite;

    @Column(name = "taille_entreprise")
    private String tailleEntreprise;

    @Column(name = "adresse_siege")
    private String adresseSiege;

    @Column(name = "representant_legal")
    private String representantLegal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = { "opportunities", "pays", "company", "convertedFromProspect", "contacts", "kycClient" },
        allowSetters = true
    )
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SocieteLiee id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRaisonSociale() {
        return this.raisonSociale;
    }

    public SocieteLiee raisonSociale(String raisonSociale) {
        this.setRaisonSociale(raisonSociale);
        return this;
    }

    public void setRaisonSociale(String raisonSociale) {
        this.raisonSociale = raisonSociale;
    }

    public String getFormeJuridique() {
        return this.formeJuridique;
    }

    public SocieteLiee formeJuridique(String formeJuridique) {
        this.setFormeJuridique(formeJuridique);
        return this;
    }

    public void setFormeJuridique(String formeJuridique) {
        this.formeJuridique = formeJuridique;
    }

    public String getIce() {
        return this.ice;
    }

    public SocieteLiee ice(String ice) {
        this.setIce(ice);
        return this;
    }

    public void setIce(String ice) {
        this.ice = ice;
    }

    public String getRc() {
        return this.rc;
    }

    public SocieteLiee rc(String rc) {
        this.setRc(rc);
        return this;
    }

    public void setRc(String rc) {
        this.rc = rc;
    }

    public String getNif() {
        return this.nif;
    }

    public SocieteLiee nif(String nif) {
        this.setNif(nif);
        return this;
    }

    public void setNif(String nif) {
        this.nif = nif;
    }

    public String getSecteurActivite() {
        return this.secteurActivite;
    }

    public SocieteLiee secteurActivite(String secteurActivite) {
        this.setSecteurActivite(secteurActivite);
        return this;
    }

    public void setSecteurActivite(String secteurActivite) {
        this.secteurActivite = secteurActivite;
    }

    public String getTailleEntreprise() {
        return this.tailleEntreprise;
    }

    public SocieteLiee tailleEntreprise(String tailleEntreprise) {
        this.setTailleEntreprise(tailleEntreprise);
        return this;
    }

    public void setTailleEntreprise(String tailleEntreprise) {
        this.tailleEntreprise = tailleEntreprise;
    }

    public String getAdresseSiege() {
        return this.adresseSiege;
    }

    public SocieteLiee adresseSiege(String adresseSiege) {
        this.setAdresseSiege(adresseSiege);
        return this;
    }

    public void setAdresseSiege(String adresseSiege) {
        this.adresseSiege = adresseSiege;
    }

    public String getRepresentantLegal() {
        return this.representantLegal;
    }

    public SocieteLiee representantLegal(String representantLegal) {
        this.setRepresentantLegal(representantLegal);
        return this;
    }

    public void setRepresentantLegal(String representantLegal) {
        this.representantLegal = representantLegal;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public SocieteLiee client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SocieteLiee)) {
            return false;
        }
        return getId() != null && getId().equals(((SocieteLiee) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SocieteLiee{" +
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
            "}";
    }
}
