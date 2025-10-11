package com.ultex.crm.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

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

    private String servicePrincipal;

    private String sousServices;

    private String provenance;

    private Integer nombreProduits;

    private String remarqueGenerale;

    private ClientDTO client;

    private DeviseDTO devise;

    private IncotermDTO incoterm;

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

    public String getServicePrincipal() {
        return servicePrincipal;
    }

    public void setServicePrincipal(String servicePrincipal) {
        this.servicePrincipal = servicePrincipal;
    }

    public String getSousServices() {
        return sousServices;
    }

    public void setSousServices(String sousServices) {
        this.sousServices = sousServices;
    }

    public String getProvenance() {
        return provenance;
    }

    public void setProvenance(String provenance) {
        this.provenance = provenance;
    }

    public Integer getNombreProduits() {
        return nombreProduits;
    }

    public void setNombreProduits(Integer nombreProduits) {
        this.nombreProduits = nombreProduits;
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
            ", sousServices='" + getSousServices() + "'" +
            ", provenance='" + getProvenance() + "'" +
            ", nombreProduits=" + getNombreProduits() +
            ", remarqueGenerale='" + getRemarqueGenerale() + "'" +
            ", client=" + getClient() +
            ", devise=" + getDevise() +
            ", incoterm=" + getIncoterm() +
            "}";
    }
}
