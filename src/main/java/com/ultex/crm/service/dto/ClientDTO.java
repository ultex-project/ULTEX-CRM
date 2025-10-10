package com.ultex.crm.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.Client} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ClientDTO implements Serializable {

    private Long id;

    @NotNull
    @Pattern(regexp = "[A-Z0-9]{4,}")
    private String code;

    @NotNull
    private String nomComplet;

    private String photoUrl;

    private LocalDate dateNaissance;

    private String lieuNaissance;

    @NotNull
    private String nationalite;

    private String genre;

    private String fonction;

    private String languePreferee;

    @NotNull
    @Pattern(regexp = "^\\+[0-9]{8,15}$")
    private String telephonePrincipal;

    private String whatsapp;

    private String email;

    private String adressePersonnelle;

    private String adressesLivraison;

    private String reseauxSociaux;

    private Instant createdAt;

    private Instant updatedAt;

    private CompanyDTO company;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNomComplet() {
        return nomComplet;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return lieuNaissance;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return nationalite;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getFonction() {
        return fonction;
    }

    public void setFonction(String fonction) {
        this.fonction = fonction;
    }

    public String getLanguePreferee() {
        return languePreferee;
    }

    public void setLanguePreferee(String languePreferee) {
        this.languePreferee = languePreferee;
    }

    public String getTelephonePrincipal() {
        return telephonePrincipal;
    }

    public void setTelephonePrincipal(String telephonePrincipal) {
        this.telephonePrincipal = telephonePrincipal;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdressePersonnelle() {
        return adressePersonnelle;
    }

    public void setAdressePersonnelle(String adressePersonnelle) {
        this.adressePersonnelle = adressePersonnelle;
    }

    public String getAdressesLivraison() {
        return adressesLivraison;
    }

    public void setAdressesLivraison(String adressesLivraison) {
        this.adressesLivraison = adressesLivraison;
    }

    public String getReseauxSociaux() {
        return reseauxSociaux;
    }

    public void setReseauxSociaux(String reseauxSociaux) {
        this.reseauxSociaux = reseauxSociaux;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public CompanyDTO getCompany() {
        return company;
    }

    public void setCompany(CompanyDTO company) {
        this.company = company;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClientDTO)) {
            return false;
        }

        ClientDTO clientDTO = (ClientDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, clientDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClientDTO{" +
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
            ", company=" + getCompany() +
            "}";
    }
}
