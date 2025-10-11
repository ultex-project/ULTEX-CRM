package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Pattern(regexp = "[A-Z0-9]{4,}")
    @Column(name = "code", nullable = false)
    private String code;

    @NotNull
    @Column(name = "nom_complet", nullable = false)
    private String nomComplet;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(name = "lieu_naissance")
    private String lieuNaissance;

    @NotNull
    @Column(name = "nationalite", nullable = false)
    private String nationalite;

    @Column(name = "genre")
    private String genre;

    @Column(name = "fonction")
    private String fonction;

    @Column(name = "langue_preferee")
    private String languePreferee;

    @NotNull
    @Pattern(regexp = "^\\+[0-9]{8,15}$")
    @Column(name = "telephone_principal", nullable = false)
    private String telephonePrincipal;

    @Column(name = "whatsapp")
    private String whatsapp;

    @Column(name = "email")
    private String email;

    @Column(name = "adresse_personnelle")
    private String adressePersonnelle;

    @Column(name = "adresses_livraison")
    private String adressesLivraison;

    @Column(name = "reseaux_sociaux")
    private String reseauxSociaux;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "assignedTo", "client" }, allowSetters = true)
    private Set<Opportunity> opportunities = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private Pays pays;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "clients", "prospects", "contacts" }, allowSetters = true)
    private Company company;

    @JsonIgnoreProperties(value = { "convertedTo", "convertedBy", "company", "contacts" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "convertedTo")
    private Prospect convertedFromProspect;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "company", "client", "prospect" }, allowSetters = true)
    private Set<Contact> contacts = new HashSet<>();

    @JsonIgnoreProperties(value = { "client" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "client")
    private KycClient kycClient;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Client code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNomComplet() {
        return this.nomComplet;
    }

    public Client nomComplet(String nomComplet) {
        this.setNomComplet(nomComplet);
        return this;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public String getPhotoUrl() {
        return this.photoUrl;
    }

    public Client photoUrl(String photoUrl) {
        this.setPhotoUrl(photoUrl);
        return this;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public LocalDate getDateNaissance() {
        return this.dateNaissance;
    }

    public Client dateNaissance(LocalDate dateNaissance) {
        this.setDateNaissance(dateNaissance);
        return this;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return this.lieuNaissance;
    }

    public Client lieuNaissance(String lieuNaissance) {
        this.setLieuNaissance(lieuNaissance);
        return this;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return this.nationalite;
    }

    public Client nationalite(String nationalite) {
        this.setNationalite(nationalite);
        return this;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getGenre() {
        return this.genre;
    }

    public Client genre(String genre) {
        this.setGenre(genre);
        return this;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getFonction() {
        return this.fonction;
    }

    public Client fonction(String fonction) {
        this.setFonction(fonction);
        return this;
    }

    public void setFonction(String fonction) {
        this.fonction = fonction;
    }

    public String getLanguePreferee() {
        return this.languePreferee;
    }

    public Client languePreferee(String languePreferee) {
        this.setLanguePreferee(languePreferee);
        return this;
    }

    public void setLanguePreferee(String languePreferee) {
        this.languePreferee = languePreferee;
    }

    public String getTelephonePrincipal() {
        return this.telephonePrincipal;
    }

    public Client telephonePrincipal(String telephonePrincipal) {
        this.setTelephonePrincipal(telephonePrincipal);
        return this;
    }

    public void setTelephonePrincipal(String telephonePrincipal) {
        this.telephonePrincipal = telephonePrincipal;
    }

    public String getWhatsapp() {
        return this.whatsapp;
    }

    public Client whatsapp(String whatsapp) {
        this.setWhatsapp(whatsapp);
        return this;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getEmail() {
        return this.email;
    }

    public Client email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdressePersonnelle() {
        return this.adressePersonnelle;
    }

    public Client adressePersonnelle(String adressePersonnelle) {
        this.setAdressePersonnelle(adressePersonnelle);
        return this;
    }

    public void setAdressePersonnelle(String adressePersonnelle) {
        this.adressePersonnelle = adressePersonnelle;
    }

    public String getAdressesLivraison() {
        return this.adressesLivraison;
    }

    public Client adressesLivraison(String adressesLivraison) {
        this.setAdressesLivraison(adressesLivraison);
        return this;
    }

    public void setAdressesLivraison(String adressesLivraison) {
        this.adressesLivraison = adressesLivraison;
    }

    public String getReseauxSociaux() {
        return this.reseauxSociaux;
    }

    public Client reseauxSociaux(String reseauxSociaux) {
        this.setReseauxSociaux(reseauxSociaux);
        return this;
    }

    public void setReseauxSociaux(String reseauxSociaux) {
        this.reseauxSociaux = reseauxSociaux;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Client createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public Client updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<Opportunity> getOpportunities() {
        return this.opportunities;
    }

    public void setOpportunities(Set<Opportunity> opportunities) {
        if (this.opportunities != null) {
            this.opportunities.forEach(i -> i.setClient(null));
        }
        if (opportunities != null) {
            opportunities.forEach(i -> i.setClient(this));
        }
        this.opportunities = opportunities;
    }

    public Client opportunities(Set<Opportunity> opportunities) {
        this.setOpportunities(opportunities);
        return this;
    }

    public Client addOpportunities(Opportunity opportunity) {
        this.opportunities.add(opportunity);
        opportunity.setClient(this);
        return this;
    }

    public Client removeOpportunities(Opportunity opportunity) {
        this.opportunities.remove(opportunity);
        opportunity.setClient(null);
        return this;
    }

    public Pays getPays() {
        return this.pays;
    }

    public void setPays(Pays pays) {
        this.pays = pays;
    }

    public Client pays(Pays pays) {
        this.setPays(pays);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Client company(Company company) {
        this.setCompany(company);
        return this;
    }

    public Prospect getConvertedFromProspect() {
        return this.convertedFromProspect;
    }

    public void setConvertedFromProspect(Prospect prospect) {
        if (this.convertedFromProspect != null) {
            this.convertedFromProspect.setConvertedTo(null);
        }
        if (prospect != null) {
            prospect.setConvertedTo(this);
        }
        this.convertedFromProspect = prospect;
    }

    public Client convertedFromProspect(Prospect prospect) {
        this.setConvertedFromProspect(prospect);
        return this;
    }

    public Set<Contact> getContacts() {
        return this.contacts;
    }

    public void setContacts(Set<Contact> contacts) {
        if (this.contacts != null) {
            this.contacts.forEach(i -> i.setClient(null));
        }
        if (contacts != null) {
            contacts.forEach(i -> i.setClient(this));
        }
        this.contacts = contacts;
    }

    public Client contacts(Set<Contact> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public Client addContacts(Contact contact) {
        this.contacts.add(contact);
        contact.setClient(this);
        return this;
    }

    public Client removeContacts(Contact contact) {
        this.contacts.remove(contact);
        contact.setClient(null);
        return this;
    }

    public KycClient getKycClient() {
        return this.kycClient;
    }

    public void setKycClient(KycClient kycClient) {
        if (this.kycClient != null) {
            this.kycClient.setClient(null);
        }
        if (kycClient != null) {
            kycClient.setClient(this);
        }
        this.kycClient = kycClient;
    }

    public Client kycClient(KycClient kycClient) {
        this.setKycClient(kycClient);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return getId() != null && getId().equals(((Client) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nomComplet='" + getNomComplet() + "'" +
            ", photoUrl='" + getPhotoUrl() + "'" +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", lieuNaissance='" + getLieuNaissance() + "'" +
            ", nationalite='" + getNationalite() + "'" +
            ", genre='" + getGenre() + "'" +
            ", fonction='" + getFonction() + "'" +
            ", languePreferee='" + getLanguePreferee() + "'" +
            ", telephonePrincipal='" + getTelephonePrincipal() + "'" +
            ", whatsapp='" + getWhatsapp() + "'" +
            ", email='" + getEmail() + "'" +
            ", adressePersonnelle='" + getAdressePersonnelle() + "'" +
            ", adressesLivraison='" + getAdressesLivraison() + "'" +
            ", reseauxSociaux='" + getReseauxSociaux() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
}
