package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DemandeClient.
 */
@Entity
@Table(name = "demande_client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DemandeClient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "reference", nullable = false)
    private String reference;

    @NotNull
    @Column(name = "date_demande", nullable = false)
    private Instant dateDemande;

    @Column(name = "service_principal")
    private String servicePrincipal;

    @Column(name = "sous_services")
    private String sousServices;

    @Column(name = "provenance")
    private String provenance;

    @Column(name = "incoterm")
    private String incoterm;

    @Column(name = "devise")
    private String devise;

    @Column(name = "nombre_produits")
    private Integer nombreProduits;

    @Column(name = "remarque_generale")
    private String remarqueGenerale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "opportunities", "company", "convertedFromProspect", "contacts", "kycClient" }, allowSetters = true)
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DemandeClient id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return this.reference;
    }

    public DemandeClient reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Instant getDateDemande() {
        return this.dateDemande;
    }

    public DemandeClient dateDemande(Instant dateDemande) {
        this.setDateDemande(dateDemande);
        return this;
    }

    public void setDateDemande(Instant dateDemande) {
        this.dateDemande = dateDemande;
    }

    public String getServicePrincipal() {
        return this.servicePrincipal;
    }

    public DemandeClient servicePrincipal(String servicePrincipal) {
        this.setServicePrincipal(servicePrincipal);
        return this;
    }

    public void setServicePrincipal(String servicePrincipal) {
        this.servicePrincipal = servicePrincipal;
    }

    public String getSousServices() {
        return this.sousServices;
    }

    public DemandeClient sousServices(String sousServices) {
        this.setSousServices(sousServices);
        return this;
    }

    public void setSousServices(String sousServices) {
        this.sousServices = sousServices;
    }

    public String getProvenance() {
        return this.provenance;
    }

    public DemandeClient provenance(String provenance) {
        this.setProvenance(provenance);
        return this;
    }

    public void setProvenance(String provenance) {
        this.provenance = provenance;
    }

    public String getIncoterm() {
        return this.incoterm;
    }

    public DemandeClient incoterm(String incoterm) {
        this.setIncoterm(incoterm);
        return this;
    }

    public void setIncoterm(String incoterm) {
        this.incoterm = incoterm;
    }

    public String getDevise() {
        return this.devise;
    }

    public DemandeClient devise(String devise) {
        this.setDevise(devise);
        return this;
    }

    public void setDevise(String devise) {
        this.devise = devise;
    }

    public Integer getNombreProduits() {
        return this.nombreProduits;
    }

    public DemandeClient nombreProduits(Integer nombreProduits) {
        this.setNombreProduits(nombreProduits);
        return this;
    }

    public void setNombreProduits(Integer nombreProduits) {
        this.nombreProduits = nombreProduits;
    }

    public String getRemarqueGenerale() {
        return this.remarqueGenerale;
    }

    public DemandeClient remarqueGenerale(String remarqueGenerale) {
        this.setRemarqueGenerale(remarqueGenerale);
        return this;
    }

    public void setRemarqueGenerale(String remarqueGenerale) {
        this.remarqueGenerale = remarqueGenerale;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public DemandeClient client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DemandeClient)) {
            return false;
        }
        return getId() != null && getId().equals(((DemandeClient) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DemandeClient{" +
            "id=" + getId() +
            ", reference='" + getReference() + "'" +
            ", dateDemande='" + getDateDemande() + "'" +
            ", servicePrincipal='" + getServicePrincipal() + "'" +
            ", sousServices='" + getSousServices() + "'" +
            ", provenance='" + getProvenance() + "'" +
            ", incoterm='" + getIncoterm() + "'" +
            ", devise='" + getDevise() + "'" +
            ", nombreProduits=" + getNombreProduits() +
            ", remarqueGenerale='" + getRemarqueGenerale() + "'" +
            "}";
    }
}
