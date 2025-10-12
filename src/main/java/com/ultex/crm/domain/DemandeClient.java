package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.ServicePrincipal;
import com.ultex.crm.domain.enumeration.TypeDemande;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
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

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "service_principal", nullable = false)
    private ServicePrincipal servicePrincipal;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type_demande", nullable = false)
    private TypeDemande typeDemande;

    @Column(name = "provenance")
    private String provenance;

    @Column(name = "remarque_generale")
    private String remarqueGenerale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = { "opportunities", "pays", "company", "convertedFromProspect", "contacts", "kycClient" },
        allowSetters = true
    )
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    private Devise devise;

    @ManyToOne(fetch = FetchType.LAZY)
    private Incoterm incoterm;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_demande_client__sous_services",
        joinColumns = @JoinColumn(name = "demande_client_id"),
        inverseJoinColumns = @JoinColumn(name = "sous_services_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "demandes" }, allowSetters = true)
    private Set<SousService> sousServices = new HashSet<>();

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

    public ServicePrincipal getServicePrincipal() {
        return this.servicePrincipal;
    }

    public DemandeClient servicePrincipal(ServicePrincipal servicePrincipal) {
        this.setServicePrincipal(servicePrincipal);
        return this;
    }

    public void setServicePrincipal(ServicePrincipal servicePrincipal) {
        this.servicePrincipal = servicePrincipal;
    }

    public TypeDemande getTypeDemande() {
        return this.typeDemande;
    }

    public DemandeClient typeDemande(TypeDemande typeDemande) {
        this.setTypeDemande(typeDemande);
        return this;
    }

    public void setTypeDemande(TypeDemande typeDemande) {
        this.typeDemande = typeDemande;
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

    public Devise getDevise() {
        return this.devise;
    }

    public void setDevise(Devise devise) {
        this.devise = devise;
    }

    public DemandeClient devise(Devise devise) {
        this.setDevise(devise);
        return this;
    }

    public Incoterm getIncoterm() {
        return this.incoterm;
    }

    public void setIncoterm(Incoterm incoterm) {
        this.incoterm = incoterm;
    }

    public DemandeClient incoterm(Incoterm incoterm) {
        this.setIncoterm(incoterm);
        return this;
    }

    public Set<SousService> getSousServices() {
        return this.sousServices;
    }

    public void setSousServices(Set<SousService> sousServices) {
        this.sousServices = sousServices;
    }

    public DemandeClient sousServices(Set<SousService> sousServices) {
        this.setSousServices(sousServices);
        return this;
    }

    public DemandeClient addSousServices(SousService sousService) {
        this.sousServices.add(sousService);
        return this;
    }

    public DemandeClient removeSousServices(SousService sousService) {
        this.sousServices.remove(sousService);
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
            ", typeDemande='" + getTypeDemande() + "'" +
            ", provenance='" + getProvenance() + "'" +
            ", remarqueGenerale='" + getRemarqueGenerale() + "'" +
            "}";
    }
}
