package com.ultex.crm.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.DocumentClient} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DocumentClientDTO implements Serializable {

    private Long id;

    @NotNull
    private String typeDocument;

    private String numeroDocument;

    private String fichierUrl;

    private ClientDTO client;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeDocument() {
        return typeDocument;
    }

    public void setTypeDocument(String typeDocument) {
        this.typeDocument = typeDocument;
    }

    public String getNumeroDocument() {
        return numeroDocument;
    }

    public void setNumeroDocument(String numeroDocument) {
        this.numeroDocument = numeroDocument;
    }

    public String getFichierUrl() {
        return fichierUrl;
    }

    public void setFichierUrl(String fichierUrl) {
        this.fichierUrl = fichierUrl;
    }

    public ClientDTO getClient() {
        return client;
    }

    public void setClient(ClientDTO client) {
        this.client = client;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocumentClientDTO)) {
            return false;
        }

        DocumentClientDTO documentClientDTO = (DocumentClientDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, documentClientDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocumentClientDTO{" +
            "id=" + getId() +
            ", typeDocument='" + getTypeDocument() + "'" +
            ", numeroDocument='" + getNumeroDocument() + "'" +
            ", fichierUrl='" + getFichierUrl() + "'" +
            ", client=" + getClient() +
            "}";
    }
}
