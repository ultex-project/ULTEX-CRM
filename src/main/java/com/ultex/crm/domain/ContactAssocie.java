package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ContactAssocie.
 */
@Entity
@Table(name = "contact_associe")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ContactAssocie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "relation")
    private String relation;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "whatsapp")
    private String whatsapp;

    @Column(name = "email")
    private String email;

    @Column(name = "autorisation")
    private String autorisation;

    @Column(name = "remarques")
    private String remarques;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "opportunities", "company", "convertedFromProspect", "contacts", "kycClient" }, allowSetters = true)
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ContactAssocie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public ContactAssocie nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public ContactAssocie prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getRelation() {
        return this.relation;
    }

    public ContactAssocie relation(String relation) {
        this.setRelation(relation);
        return this;
    }

    public void setRelation(String relation) {
        this.relation = relation;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public ContactAssocie telephone(String telephone) {
        this.setTelephone(telephone);
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getWhatsapp() {
        return this.whatsapp;
    }

    public ContactAssocie whatsapp(String whatsapp) {
        this.setWhatsapp(whatsapp);
        return this;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getEmail() {
        return this.email;
    }

    public ContactAssocie email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAutorisation() {
        return this.autorisation;
    }

    public ContactAssocie autorisation(String autorisation) {
        this.setAutorisation(autorisation);
        return this;
    }

    public void setAutorisation(String autorisation) {
        this.autorisation = autorisation;
    }

    public String getRemarques() {
        return this.remarques;
    }

    public ContactAssocie remarques(String remarques) {
        this.setRemarques(remarques);
        return this;
    }

    public void setRemarques(String remarques) {
        this.remarques = remarques;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public ContactAssocie client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ContactAssocie)) {
            return false;
        }
        return getId() != null && getId().equals(((ContactAssocie) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ContactAssocie{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", relation='" + getRelation() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", whatsapp='" + getWhatsapp() + "'" +
            ", email='" + getEmail() + "'" +
            ", autorisation='" + getAutorisation() + "'" +
            ", remarques='" + getRemarques() + "'" +
            "}";
    }
}
