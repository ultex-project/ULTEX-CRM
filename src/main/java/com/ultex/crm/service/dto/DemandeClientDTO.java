package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.ServicePrincipal;
import com.ultex.crm.domain.enumeration.TypeDemande;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.ultex.crm.domain.DemandeClient} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DemandeClientDTO implements Serializable {

    private Long id;

    @NotNull
    private String reference;

    @NotNull
    private Instant dateDemande;

    @NotNull
    private ServicePrincipal servicePrincipal;

    @NotNull
    private TypeDemande typeDemande;

    private String provenance;

    private String remarqueGenerale;

    private ClientDTO client;

    private DeviseDTO devise;

    private IncotermDTO incoterm;

    private Set<SousServiceDTO> sousServices = new HashSet<>();

    private Set<ProduitDemandeDTO> produits = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Instant getDateDemande() {
        return dateDemande;
    }

    public void setDateDemande(Instant dateDemande) {
        this.dateDemande = dateDemande;
    }

    public ServicePrincipal getServicePrincipal() {
        return servicePrincipal;
    }

    public void setServicePrincipal(ServicePrincipal servicePrincipal) {
        this.servicePrincipal = servicePrincipal;
    }

    public TypeDemande getTypeDemande() {
        return typeDemande;
    }

    public void setTypeDemande(TypeDemande typeDemande) {
        this.typeDemande = typeDemande;
    }

    public String getProvenance() {
        return provenance;
    }

    public void setProvenance(String provenance) {
        this.provenance = provenance;
    }

    public String getRemarqueGenerale() {
        return remarqueGenerale;
    }

    public void setRemarqueGenerale(String remarqueGenerale) {
        this.remarqueGenerale = remarqueGenerale;
    }

    public ClientDTO getClient() {
        return client;
    }

    public void setClient(ClientDTO client) {
        this.client = client;
    }

    public DeviseDTO getDevise() {
        return devise;
    }

    public void setDevise(DeviseDTO devise) {
        this.devise = devise;
    }

    public IncotermDTO getIncoterm() {
        return incoterm;
    }

    public void setIncoterm(IncotermDTO incoterm) {
        this.incoterm = incoterm;
    }

    public Set<SousServiceDTO> getSousServices() {
        return sousServices;
    }

    public void setSousServices(Set<SousServiceDTO> sousServices) {
        this.sousServices = sousServices;
    }

    public Set<ProduitDemandeDTO> getProduits() {
        return produits;
    }

    public void setProduits(Set<ProduitDemandeDTO> produits) {
        this.produits = produits;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DemandeClientDTO)) {
            return false;
        }

        DemandeClientDTO demandeClientDTO = (DemandeClientDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, demandeClientDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DemandeClientDTO{" +
            "id=" + getId() +
            ", reference='" + getReference() + "'" +
            ", dateDemande='" + getDateDemande() + "'" +
            ", servicePrincipal='" + getServicePrincipal() + "'" +
            ", typeDemande='" + getTypeDemande() + "'" +
            ", provenance='" + getProvenance() + "'" +
            ", remarqueGenerale='" + getRemarqueGenerale() + "'" +
            ", client=" + getClient() +
            ", devise=" + getDevise() +
            ", incoterm=" + getIncoterm() +
            ", sousServices=" + getSousServices() +
            ", produits=" + getProduits() +
            "}";
    }
}
