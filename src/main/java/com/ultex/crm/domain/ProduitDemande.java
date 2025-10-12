package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.TypeProduit;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProduitDemande.
 */
@Entity
@Table(name = "produit_demande")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProduitDemande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type_produit", nullable = false)
    private TypeProduit typeProduit;

    @NotNull
    @Column(name = "nom_produit", nullable = false)
    private String nomProduit;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "quantite")
    private Double quantite;

    @Column(name = "unite")
    private String unite;

    @Column(name = "prix")
    private Double prix;

    @Column(name = "poids_kg")
    private Double poidsKg;

    @Column(name = "volume_total_cbm")
    private Double volumeTotalCbm;

    @Column(name = "dimensions")
    private String dimensions;

    @Column(name = "hs_code")
    private String hsCode;

    @Column(name = "prix_cible")
    private Double prixCible;

    @Column(name = "frais_expedition")
    private Double fraisExpedition;

    @Column(name = "origine")
    private String origine;

    @Column(name = "fournisseur")
    private String fournisseur;

    @Column(name = "adresse_chargement")
    private String adresseChargement;

    @Column(name = "adresse_dechargement")
    private String adresseDechargement;

    @Column(name = "fiche_technique_url")
    private String ficheTechniqueUrl;

    @Column(name = "photos_url")
    private String photosUrl;

    @Column(name = "pieces_jointes_url")
    private String piecesJointesUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "client", "devise", "incoterm", "sousServices" }, allowSetters = true)
    private DemandeClient demande;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProduitDemande id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TypeProduit getTypeProduit() {
        return this.typeProduit;
    }

    public ProduitDemande typeProduit(TypeProduit typeProduit) {
        this.setTypeProduit(typeProduit);
        return this;
    }

    public void setTypeProduit(TypeProduit typeProduit) {
        this.typeProduit = typeProduit;
    }

    public String getNomProduit() {
        return this.nomProduit;
    }

    public ProduitDemande nomProduit(String nomProduit) {
        this.setNomProduit(nomProduit);
        return this;
    }

    public void setNomProduit(String nomProduit) {
        this.nomProduit = nomProduit;
    }

    public String getDescription() {
        return this.description;
    }

    public ProduitDemande description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getQuantite() {
        return this.quantite;
    }

    public ProduitDemande quantite(Double quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Double quantite) {
        this.quantite = quantite;
    }

    public String getUnite() {
        return this.unite;
    }

    public ProduitDemande unite(String unite) {
        this.setUnite(unite);
        return this;
    }

    public void setUnite(String unite) {
        this.unite = unite;
    }

    public Double getPrix() {
        return this.prix;
    }

    public ProduitDemande prix(Double prix) {
        this.setPrix(prix);
        return this;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public Double getPoidsKg() {
        return this.poidsKg;
    }

    public ProduitDemande poidsKg(Double poidsKg) {
        this.setPoidsKg(poidsKg);
        return this;
    }

    public void setPoidsKg(Double poidsKg) {
        this.poidsKg = poidsKg;
    }

    public Double getVolumeTotalCbm() {
        return this.volumeTotalCbm;
    }

    public ProduitDemande volumeTotalCbm(Double volumeTotalCbm) {
        this.setVolumeTotalCbm(volumeTotalCbm);
        return this;
    }

    public void setVolumeTotalCbm(Double volumeTotalCbm) {
        this.volumeTotalCbm = volumeTotalCbm;
    }

    public String getDimensions() {
        return this.dimensions;
    }

    public ProduitDemande dimensions(String dimensions) {
        this.setDimensions(dimensions);
        return this;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public String getHsCode() {
        return this.hsCode;
    }

    public ProduitDemande hsCode(String hsCode) {
        this.setHsCode(hsCode);
        return this;
    }

    public void setHsCode(String hsCode) {
        this.hsCode = hsCode;
    }

    public Double getPrixCible() {
        return this.prixCible;
    }

    public ProduitDemande prixCible(Double prixCible) {
        this.setPrixCible(prixCible);
        return this;
    }

    public void setPrixCible(Double prixCible) {
        this.prixCible = prixCible;
    }

    public Double getFraisExpedition() {
        return this.fraisExpedition;
    }

    public ProduitDemande fraisExpedition(Double fraisExpedition) {
        this.setFraisExpedition(fraisExpedition);
        return this;
    }

    public void setFraisExpedition(Double fraisExpedition) {
        this.fraisExpedition = fraisExpedition;
    }

    public String getOrigine() {
        return this.origine;
    }

    public ProduitDemande origine(String origine) {
        this.setOrigine(origine);
        return this;
    }

    public void setOrigine(String origine) {
        this.origine = origine;
    }

    public String getFournisseur() {
        return this.fournisseur;
    }

    public ProduitDemande fournisseur(String fournisseur) {
        this.setFournisseur(fournisseur);
        return this;
    }

    public void setFournisseur(String fournisseur) {
        this.fournisseur = fournisseur;
    }

    public String getAdresseChargement() {
        return this.adresseChargement;
    }

    public ProduitDemande adresseChargement(String adresseChargement) {
        this.setAdresseChargement(adresseChargement);
        return this;
    }

    public void setAdresseChargement(String adresseChargement) {
        this.adresseChargement = adresseChargement;
    }

    public String getAdresseDechargement() {
        return this.adresseDechargement;
    }

    public ProduitDemande adresseDechargement(String adresseDechargement) {
        this.setAdresseDechargement(adresseDechargement);
        return this;
    }

    public void setAdresseDechargement(String adresseDechargement) {
        this.adresseDechargement = adresseDechargement;
    }

    public String getFicheTechniqueUrl() {
        return this.ficheTechniqueUrl;
    }

    public ProduitDemande ficheTechniqueUrl(String ficheTechniqueUrl) {
        this.setFicheTechniqueUrl(ficheTechniqueUrl);
        return this;
    }

    public void setFicheTechniqueUrl(String ficheTechniqueUrl) {
        this.ficheTechniqueUrl = ficheTechniqueUrl;
    }

    public String getPhotosUrl() {
        return this.photosUrl;
    }

    public ProduitDemande photosUrl(String photosUrl) {
        this.setPhotosUrl(photosUrl);
        return this;
    }

    public void setPhotosUrl(String photosUrl) {
        this.photosUrl = photosUrl;
    }

    public String getPiecesJointesUrl() {
        return this.piecesJointesUrl;
    }

    public ProduitDemande piecesJointesUrl(String piecesJointesUrl) {
        this.setPiecesJointesUrl(piecesJointesUrl);
        return this;
    }

    public void setPiecesJointesUrl(String piecesJointesUrl) {
        this.piecesJointesUrl = piecesJointesUrl;
    }

    public DemandeClient getDemande() {
        return this.demande;
    }

    public void setDemande(DemandeClient demandeClient) {
        this.demande = demandeClient;
    }

    public ProduitDemande demande(DemandeClient demandeClient) {
        this.setDemande(demandeClient);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProduitDemande)) {
            return false;
        }
        return getId() != null && getId().equals(((ProduitDemande) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProduitDemande{" +
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
            "}";
    }
}
