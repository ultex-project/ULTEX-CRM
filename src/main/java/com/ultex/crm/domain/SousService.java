package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SousService.
 */
@Entity
@Table(name = "sous_service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SousService implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @NotNull
    @Column(name = "libelle", nullable = false)
    private String libelle;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "sousServices")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "devise", "incoterm", "sousServices" }, allowSetters = true)
    private Set<DemandeClient> demandes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SousService id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public SousService code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public SousService libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Set<DemandeClient> getDemandes() {
        return this.demandes;
    }

    public void setDemandes(Set<DemandeClient> demandeClients) {
        if (this.demandes != null) {
            this.demandes.forEach(i -> i.removeSousServices(this));
        }
        if (demandeClients != null) {
            demandeClients.forEach(i -> i.addSousServices(this));
        }
        this.demandes = demandeClients;
    }

    public SousService demandes(Set<DemandeClient> demandeClients) {
        this.setDemandes(demandeClients);
        return this;
    }

    public SousService addDemandes(DemandeClient demandeClient) {
        this.demandes.add(demandeClient);
        demandeClient.getSousServices().add(this);
        return this;
    }

    public SousService removeDemandes(DemandeClient demandeClient) {
        this.demandes.remove(demandeClient);
        demandeClient.getSousServices().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SousService)) {
            return false;
        }
        return getId() != null && getId().equals(((SousService) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SousService{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}
