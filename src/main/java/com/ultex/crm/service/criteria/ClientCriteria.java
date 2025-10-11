package com.ultex.crm.service.criteria;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.InstantFilter;
import tech.jhipster.service.filter.LocalDateFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.ultex.crm.domain.Client} entity. This class is used in
 * {@link com.ultex.crm.web.rest.ClientResource} to receive filtering options through query parameters.
 *
 * For example: {@code /api/clients?nomComplet.contains=Ali&nationalite.equals=Marocaine}
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ClientCriteria implements Serializable, Criteria {

    private LongFilter id;

    private StringFilter code;

    private StringFilter nomComplet;

    private StringFilter photoUrl;

    private LocalDateFilter dateNaissance;

    private StringFilter lieuNaissance;

    private StringFilter nationalite;

    private StringFilter genre;

    private StringFilter fonction;

    private StringFilter languePreferee;

    private StringFilter telephonePrincipal;

    private StringFilter whatsapp;

    private StringFilter email;

    private StringFilter adressePersonnelle;

    private StringFilter adressesLivraison;

    private StringFilter reseauxSociaux;

    private InstantFilter createdAt;

    private InstantFilter updatedAt;

    private LongFilter opportunitiesId;

    private LongFilter companyId;

    private LongFilter convertedFromProspectId;

    private LongFilter contactsId;

    private LongFilter kycClientId;

    private Boolean distinct;

    public ClientCriteria() {}

    public ClientCriteria(ClientCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.code = other.code == null ? null : other.code.copy();
        this.nomComplet = other.nomComplet == null ? null : other.nomComplet.copy();
        this.photoUrl = other.photoUrl == null ? null : other.photoUrl.copy();
        this.dateNaissance = other.dateNaissance == null ? null : other.dateNaissance.copy();
        this.lieuNaissance = other.lieuNaissance == null ? null : other.lieuNaissance.copy();
        this.nationalite = other.nationalite == null ? null : other.nationalite.copy();
        this.genre = other.genre == null ? null : other.genre.copy();
        this.fonction = other.fonction == null ? null : other.fonction.copy();
        this.languePreferee = other.languePreferee == null ? null : other.languePreferee.copy();
        this.telephonePrincipal = other.telephonePrincipal == null ? null : other.telephonePrincipal.copy();
        this.whatsapp = other.whatsapp == null ? null : other.whatsapp.copy();
        this.email = other.email == null ? null : other.email.copy();
        this.adressePersonnelle = other.adressePersonnelle == null ? null : other.adressePersonnelle.copy();
        this.adressesLivraison = other.adressesLivraison == null ? null : other.adressesLivraison.copy();
        this.reseauxSociaux = other.reseauxSociaux == null ? null : other.reseauxSociaux.copy();
        this.createdAt = other.createdAt == null ? null : other.createdAt.copy();
        this.updatedAt = other.updatedAt == null ? null : other.updatedAt.copy();
        this.opportunitiesId = other.opportunitiesId == null ? null : other.opportunitiesId.copy();
        this.companyId = other.companyId == null ? null : other.companyId.copy();
        this.convertedFromProspectId = other.convertedFromProspectId == null ? null : other.convertedFromProspectId.copy();
        this.contactsId = other.contactsId == null ? null : other.contactsId.copy();
        this.kycClientId = other.kycClientId == null ? null : other.kycClientId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public ClientCriteria copy() {
        return new ClientCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getCode() {
        return code;
    }

    public void setCode(StringFilter code) {
        this.code = code;
    }

    public StringFilter getNomComplet() {
        return nomComplet;
    }

    public void setNomComplet(StringFilter nomComplet) {
        this.nomComplet = nomComplet;
    }

    public StringFilter getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(StringFilter photoUrl) {
        this.photoUrl = photoUrl;
    }

    public LocalDateFilter getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDateFilter dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public StringFilter getLieuNaissance() {
        return lieuNaissance;
    }

    public void setLieuNaissance(StringFilter lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public StringFilter getNationalite() {
        return nationalite;
    }

    public void setNationalite(StringFilter nationalite) {
        this.nationalite = nationalite;
    }

    public StringFilter getGenre() {
        return genre;
    }

    public void setGenre(StringFilter genre) {
        this.genre = genre;
    }

    public StringFilter getFonction() {
        return fonction;
    }

    public void setFonction(StringFilter fonction) {
        this.fonction = fonction;
    }

    public StringFilter getLanguePreferee() {
        return languePreferee;
    }

    public void setLanguePreferee(StringFilter languePreferee) {
        this.languePreferee = languePreferee;
    }

    public StringFilter getTelephonePrincipal() {
        return telephonePrincipal;
    }

    public void setTelephonePrincipal(StringFilter telephonePrincipal) {
        this.telephonePrincipal = telephonePrincipal;
    }

    public StringFilter getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(StringFilter whatsapp) {
        this.whatsapp = whatsapp;
    }

    public StringFilter getEmail() {
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
    }

    public StringFilter getAdressePersonnelle() {
        return adressePersonnelle;
    }

    public void setAdressePersonnelle(StringFilter adressePersonnelle) {
        this.adressePersonnelle = adressePersonnelle;
    }

    public StringFilter getAdressesLivraison() {
        return adressesLivraison;
    }

    public void setAdressesLivraison(StringFilter adressesLivraison) {
        this.adressesLivraison = adressesLivraison;
    }

    public StringFilter getReseauxSociaux() {
        return reseauxSociaux;
    }

    public void setReseauxSociaux(StringFilter reseauxSociaux) {
        this.reseauxSociaux = reseauxSociaux;
    }

    public InstantFilter getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(InstantFilter createdAt) {
        this.createdAt = createdAt;
    }

    public InstantFilter getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(InstantFilter updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LongFilter getOpportunitiesId() {
        return opportunitiesId;
    }

    public void setOpportunitiesId(LongFilter opportunitiesId) {
        this.opportunitiesId = opportunitiesId;
    }

    public LongFilter getCompanyId() {
        return companyId;
    }

    public void setCompanyId(LongFilter companyId) {
        this.companyId = companyId;
    }

    public LongFilter getConvertedFromProspectId() {
        return convertedFromProspectId;
    }

    public void setConvertedFromProspectId(LongFilter convertedFromProspectId) {
        this.convertedFromProspectId = convertedFromProspectId;
    }

    public LongFilter getContactsId() {
        return contactsId;
    }

    public void setContactsId(LongFilter contactsId) {
        this.contactsId = contactsId;
    }

    public LongFilter getKycClientId() {
        return kycClientId;
    }

    public void setKycClientId(LongFilter kycClientId) {
        this.kycClientId = kycClientId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ClientCriteria that = (ClientCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(code, that.code) &&
            Objects.equals(nomComplet, that.nomComplet) &&
            Objects.equals(photoUrl, that.photoUrl) &&
            Objects.equals(dateNaissance, that.dateNaissance) &&
            Objects.equals(lieuNaissance, that.lieuNaissance) &&
            Objects.equals(nationalite, that.nationalite) &&
            Objects.equals(genre, that.genre) &&
            Objects.equals(fonction, that.fonction) &&
            Objects.equals(languePreferee, that.languePreferee) &&
            Objects.equals(telephonePrincipal, that.telephonePrincipal) &&
            Objects.equals(whatsapp, that.whatsapp) &&
            Objects.equals(email, that.email) &&
            Objects.equals(adressePersonnelle, that.adressePersonnelle) &&
            Objects.equals(adressesLivraison, that.adressesLivraison) &&
            Objects.equals(reseauxSociaux, that.reseauxSociaux) &&
            Objects.equals(createdAt, that.createdAt) &&
            Objects.equals(updatedAt, that.updatedAt) &&
            Objects.equals(opportunitiesId, that.opportunitiesId) &&
            Objects.equals(companyId, that.companyId) &&
            Objects.equals(convertedFromProspectId, that.convertedFromProspectId) &&
            Objects.equals(contactsId, that.contactsId) &&
            Objects.equals(kycClientId, that.kycClientId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            code,
            nomComplet,
            photoUrl,
            dateNaissance,
            lieuNaissance,
            nationalite,
            genre,
            fonction,
            languePreferee,
            telephonePrincipal,
            whatsapp,
            email,
            adressePersonnelle,
            adressesLivraison,
            reseauxSociaux,
            createdAt,
            updatedAt,
            opportunitiesId,
            companyId,
            convertedFromProspectId,
            contactsId,
            kycClientId,
            distinct
        );
    }

    @Override
    public String toString() {
        return (
            "ClientCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (code != null ? "code=" + code + ", " : "") +
            (nomComplet != null ? "nomComplet=" + nomComplet + ", " : "") +
            (photoUrl != null ? "photoUrl=" + photoUrl + ", " : "") +
            (dateNaissance != null ? "dateNaissance=" + dateNaissance + ", " : "") +
            (lieuNaissance != null ? "lieuNaissance=" + lieuNaissance + ", " : "") +
            (nationalite != null ? "nationalite=" + nationalite + ", " : "") +
            (genre != null ? "genre=" + genre + ", " : "") +
            (fonction != null ? "fonction=" + fonction + ", " : "") +
            (languePreferee != null ? "languePreferee=" + languePreferee + ", " : "") +
            (telephonePrincipal != null ? "telephonePrincipal=" + telephonePrincipal + ", " : "") +
            (whatsapp != null ? "whatsapp=" + whatsapp + ", " : "") +
            (email != null ? "email=" + email + ", " : "") +
            (adressePersonnelle != null ? "adressePersonnelle=" + adressePersonnelle + ", " : "") +
            (adressesLivraison != null ? "adressesLivraison=" + adressesLivraison + ", " : "") +
            (reseauxSociaux != null ? "reseauxSociaux=" + reseauxSociaux + ", " : "") +
            (createdAt != null ? "createdAt=" + createdAt + ", " : "") +
            (updatedAt != null ? "updatedAt=" + updatedAt + ", " : "") +
            (opportunitiesId != null ? "opportunitiesId=" + opportunitiesId + ", " : "") +
            (companyId != null ? "companyId=" + companyId + ", " : "") +
            (convertedFromProspectId != null ? "convertedFromProspectId=" + convertedFromProspectId + ", " : "") +
            (contactsId != null ? "contactsId=" + contactsId + ", " : "") +
            (kycClientId != null ? "kycClientId=" + kycClientId + ", " : "") +
            (distinct != null ? "distinct=" + distinct : "") +
            '}'
        );
    }
}
