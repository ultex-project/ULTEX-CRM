package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DocumentClient.
 */
@Entity
@Table(name = "document_client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DocumentClient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "type_document", nullable = false)
    private String typeDocument;

    @Column(name = "numero_document")
    private String numeroDocument;

    @Column(name = "fichier_url")
    private String fichierUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = { "opportunities", "pays", "company", "convertedFromProspect", "contacts", "kycClient" },
        allowSetters = true
    )
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DocumentClient id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeDocument() {
        return this.typeDocument;
    }

    public DocumentClient typeDocument(String typeDocument) {
        this.setTypeDocument(typeDocument);
        return this;
    }

    public void setTypeDocument(String typeDocument) {
        this.typeDocument = typeDocument;
    }

    public String getNumeroDocument() {
        return this.numeroDocument;
    }

    public DocumentClient numeroDocument(String numeroDocument) {
        this.setNumeroDocument(numeroDocument);
        return this;
    }

    public void setNumeroDocument(String numeroDocument) {
        this.numeroDocument = numeroDocument;
    }

    public String getFichierUrl() {
        return this.fichierUrl;
    }

    public DocumentClient fichierUrl(String fichierUrl) {
        this.setFichierUrl(fichierUrl);
        return this;
    }

    public void setFichierUrl(String fichierUrl) {
        this.fichierUrl = fichierUrl;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public DocumentClient client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocumentClient)) {
            return false;
        }
        return getId() != null && getId().equals(((DocumentClient) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocumentClient{" +
            "id=" + getId() +
            ", typeDocument='" + getTypeDocument() + "'" +
            ", numeroDocument='" + getNumeroDocument() + "'" +
            ", fichierUrl='" + getFichierUrl() + "'" +
            "}";
    }
}
