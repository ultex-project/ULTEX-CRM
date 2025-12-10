package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.PlateformeSociale;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ReseauSocial.
 */
@Entity
@Table(name = "reseau_social")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReseauSocial implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "plateforme", nullable = false)
    private PlateformeSociale plateforme;

    @Column(name = "url_profil")
    private String urlProfil;

    @Column(name = "username")
    private String username;

    @Column(name = "type")
    private String type;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(
        value = {
            "reseauxSociauxes",
            "opportunities",
            "cyclesActivations",
            "languePreferee",
            "pays",
            "company",
            "convertedFromProspect",
            "contacts",
            "kycClient",
        },
        allowSetters = true
    )
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ReseauSocial id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlateformeSociale getPlateforme() {
        return this.plateforme;
    }

    public ReseauSocial plateforme(PlateformeSociale plateforme) {
        this.setPlateforme(plateforme);
        return this;
    }

    public void setPlateforme(PlateformeSociale plateforme) {
        this.plateforme = plateforme;
    }

    public String getUrlProfil() {
        return this.urlProfil;
    }

    public ReseauSocial urlProfil(String urlProfil) {
        this.setUrlProfil(urlProfil);
        return this;
    }

    public void setUrlProfil(String urlProfil) {
        this.urlProfil = urlProfil;
    }

    public String getUsername() {
        return this.username;
    }

    public ReseauSocial username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getType() {
        return this.type;
    }

    public ReseauSocial type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public ReseauSocial client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReseauSocial)) {
            return false;
        }
        return getId() != null && getId().equals(((ReseauSocial) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReseauSocial{" +
            "id=" + getId() +
            ", plateforme='" + getPlateforme() + "'" +
            ", urlProfil='" + getUrlProfil() + "'" +
            ", username='" + getUsername() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
