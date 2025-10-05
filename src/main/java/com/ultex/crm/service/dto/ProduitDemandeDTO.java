package com.ultex.crm.service.dto;

import jakarta.persistence.Lob;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.ProduitDemande} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProduitDemandeDTO implements Serializable {

    private Long id;

    private String typeProduit;

    private String typeDemande;

    private String nomProduit;

    @Lob
    private String description;

    private Double quantite;

    private String unite;

    private Double prix;

    private Double fraisExpedition;

    private Double poidsKg;

    private Double volumeTotalCbm;

    private String dimensions;

    private Integer nombreCartons;

    private Integer piecesParCarton;

    private String hsCode;

    private Double prixCible;

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

    public String getTypeProduit() {
        return typeProduit;
    }

    public void setTypeProduit(String typeProduit) {
        this.typeProduit = typeProduit;
    }

    public String getTypeDemande() {
        return typeDemande;
    }

    public void setTypeDemande(String typeDemande) {
        this.typeDemande = typeDemande;
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

    public Double getFraisExpedition() {
        return fraisExpedition;
    }

    public void setFraisExpedition(Double fraisExpedition) {
        this.fraisExpedition = fraisExpedition;
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

    public Integer getNombreCartons() {
        return nombreCartons;
    }

    public void setNombreCartons(Integer nombreCartons) {
        this.nombreCartons = nombreCartons;
    }

    public Integer getPiecesParCarton() {
        return piecesParCarton;
    }

    public void setPiecesParCarton(Integer piecesParCarton) {
        this.piecesParCarton = piecesParCarton;
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
            ", typeDemande='" + getTypeDemande() + "'" +
            ", nomProduit='" + getNomProduit() + "'" +
            ", description='" + getDescription() + "'" +
            ", quantite=" + getQuantite() +
            ", unite='" + getUnite() + "'" +
            ", prix=" + getPrix() +
            ", fraisExpedition=" + getFraisExpedition() +
            ", poidsKg=" + getPoidsKg() +
            ", volumeTotalCbm=" + getVolumeTotalCbm() +
            ", dimensions='" + getDimensions() + "'" +
            ", nombreCartons=" + getNombreCartons() +
            ", piecesParCarton=" + getPiecesParCarton() +
            ", hsCode='" + getHsCode() + "'" +
            ", prixCible=" + getPrixCible() +
            ", ficheTechniqueUrl='" + getFicheTechniqueUrl() + "'" +
            ", photosUrl='" + getPhotosUrl() + "'" +
            ", piecesJointesUrl='" + getPiecesJointesUrl() + "'" +
            ", demande=" + getDemande() +
            "}";
    }
}
