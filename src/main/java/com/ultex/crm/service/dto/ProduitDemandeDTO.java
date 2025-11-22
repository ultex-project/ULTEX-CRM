package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.TypeProduit;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.ProduitDemande} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProduitDemandeDTO implements Serializable {

    private Long id;

    @NotNull
    private TypeProduit typeProduit;

    @NotNull
    private String nomProduit;

    @Lob
    private String description;

    private Double quantite;

    private String unite;

    private Double prix;

    private Double poidsKg;

    private Double volumeTotalCbm;

    private String dimensions;

    private String hsCode;

    private Double prixCible;

    private Double fraisExpedition;

    private String origine;

    private String fournisseur;

    private String adresseChargement;

    private String adresseDechargement;

    private String ficheTechniqueUrl;

    private String photosUrl;

    private String piecesJointesUrl;

    private DemandeClientDTO demande;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TypeProduit getTypeProduit() {
        return typeProduit;
    }

    public void setTypeProduit(TypeProduit typeProduit) {
        this.typeProduit = typeProduit;
    }

    public String getNomProduit() {
        return nomProduit;
    }

    public void setNomProduit(String nomProduit) {
        this.nomProduit = nomProduit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getQuantite() {
        return quantite;
    }

    public void setQuantite(Double quantite) {
        this.quantite = quantite;
    }

    public String getUnite() {
        return unite;
    }

    public void setUnite(String unite) {
        this.unite = unite;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public Double getPoidsKg() {
        return poidsKg;
    }

    public void setPoidsKg(Double poidsKg) {
        this.poidsKg = poidsKg;
    }

    public Double getVolumeTotalCbm() {
        return volumeTotalCbm;
    }

    public void setVolumeTotalCbm(Double volumeTotalCbm) {
        this.volumeTotalCbm = volumeTotalCbm;
    }

    public String getDimensions() {
        return dimensions;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public String getHsCode() {
        return hsCode;
    }

    public void setHsCode(String hsCode) {
        this.hsCode = hsCode;
    }

    public Double getPrixCible() {
        return prixCible;
    }

    public void setPrixCible(Double prixCible) {
        this.prixCible = prixCible;
    }

    public Double getFraisExpedition() {
        return fraisExpedition;
    }

    public void setFraisExpedition(Double fraisExpedition) {
        this.fraisExpedition = fraisExpedition;
    }

    public String getOrigine() {
        return origine;
    }

    public void setOrigine(String origine) {
        this.origine = origine;
    }

    public String getFournisseur() {
        return fournisseur;
    }

    public void setFournisseur(String fournisseur) {
        this.fournisseur = fournisseur;
    }

    public String getAdresseChargement() {
        return adresseChargement;
    }

    public void setAdresseChargement(String adresseChargement) {
        this.adresseChargement = adresseChargement;
    }

    public String getAdresseDechargement() {
        return adresseDechargement;
    }

    public void setAdresseDechargement(String adresseDechargement) {
        this.adresseDechargement = adresseDechargement;
    }

    public String getFicheTechniqueUrl() {
        return ficheTechniqueUrl;
    }

    public void setFicheTechniqueUrl(String ficheTechniqueUrl) {
        this.ficheTechniqueUrl = ficheTechniqueUrl;
    }

    public String getPhotosUrl() {
        return photosUrl;
    }

    public void setPhotosUrl(String photosUrl) {
        this.photosUrl = photosUrl;
    }

    public String getPiecesJointesUrl() {
        return piecesJointesUrl;
    }

    public void setPiecesJointesUrl(String piecesJointesUrl) {
        this.piecesJointesUrl = piecesJointesUrl;
    }

    public DemandeClientDTO getDemande() {
        return demande;
    }

    public void setDemande(DemandeClientDTO demande) {
        this.demande = demande;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProduitDemandeDTO)) {
            return false;
        }

        ProduitDemandeDTO produitDemandeDTO = (ProduitDemandeDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, produitDemandeDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProduitDemandeDTO{" +
            "id=" + getId() +
            ", typeProduit='" + getTypeProduit() + "'" +
            ", nomProduit='" + getNomProduit() + "'" +
            ", description='" + getDescription() + "'" +
            ", quantite=" + getQuantite() +
            ", unite='" + getUnite() + "'" +
            ", prix=" + getPrix() +
            ", poidsKg=" + getPoidsKg() +
            ", volumeTotalCbm=" + getVolumeTotalCbm() +
            ", dimensions='" + getDimensions() + "'" +
            ", hsCode='" + getHsCode() + "'" +
            ", prixCible=" + getPrixCible() +
            ", fraisExpedition=" + getFraisExpedition() +
            ", origine='" + getOrigine() + "'" +
            ", fournisseur='" + getFournisseur() + "'" +
            ", adresseChargement='" + getAdresseChargement() + "'" +
            ", adresseDechargement='" + getAdresseDechargement() + "'" +
            ", ficheTechniqueUrl='" + getFicheTechniqueUrl() + "'" +
            ", photosUrl='" + getPhotosUrl() + "'" +
            ", piecesJointesUrl='" + getPiecesJointesUrl() + "'" +
            ", demande=" + getDemande() +
            "}";
    }
}
