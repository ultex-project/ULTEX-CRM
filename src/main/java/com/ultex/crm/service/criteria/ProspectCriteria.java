package com.ultex.crm.service.criteria;

import com.ultex.crm.domain.enumeration.ProspectStatus;
import java.io.Serializable;
import java.util.Objects;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.InstantFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.ultex.crm.domain.Prospect} entity. This class is used in
 * {@link com.ultex.crm.web.rest.ProspectResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 *
 * For example the following could be a valid request:
 * {@code /api/prospects?id.greaterThan=5&firstName.contains=John&status.equals=NEW}
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProspectCriteria implements Serializable, Criteria {

    /**
     * Class for filtering ProspectStatus
     */
    public static class ProspectStatusFilter extends tech.jhipster.service.filter.Filter<ProspectStatus> {

        public ProspectStatusFilter() {}

        public ProspectStatusFilter(ProspectStatusFilter filter) {
            super(filter);
        }

        @Override
        public ProspectStatusFilter copy() {
            return new ProspectStatusFilter(this);
        }
    }

    private LongFilter id;

    private StringFilter firstName;

    private StringFilter lastName;

    private StringFilter email;

    private StringFilter phone1;

    private StringFilter phone2;

    private StringFilter source;

    private StringFilter cin;

    private StringFilter address;

    private StringFilter city;

    private StringFilter country;

    private StringFilter deliveryAddress;

    private StringFilter referredBy;

    private ProspectStatusFilter status;

    private InstantFilter convertedDate;

    private InstantFilter createdAt;

    private InstantFilter updatedAt;

    private LongFilter convertedToId;

    private LongFilter convertedById;

    private LongFilter companyId;

    private LongFilter contactsId;

    private Boolean distinct;

    public ProspectCriteria() {}

    public ProspectCriteria(ProspectCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.firstName = other.firstName == null ? null : other.firstName.copy();
        this.lastName = other.lastName == null ? null : other.lastName.copy();
        this.email = other.email == null ? null : other.email.copy();
        this.phone1 = other.phone1 == null ? null : other.phone1.copy();
        this.phone2 = other.phone2 == null ? null : other.phone2.copy();
        this.source = other.source == null ? null : other.source.copy();
        this.cin = other.cin == null ? null : other.cin.copy();
        this.address = other.address == null ? null : other.address.copy();
        this.city = other.city == null ? null : other.city.copy();
        this.country = other.country == null ? null : other.country.copy();
        this.deliveryAddress = other.deliveryAddress == null ? null : other.deliveryAddress.copy();
        this.referredBy = other.referredBy == null ? null : other.referredBy.copy();
        this.status = other.status == null ? null : other.status.copy();
        this.convertedDate = other.convertedDate == null ? null : other.convertedDate.copy();
        this.createdAt = other.createdAt == null ? null : other.createdAt.copy();
        this.updatedAt = other.updatedAt == null ? null : other.updatedAt.copy();
        this.convertedToId = other.convertedToId == null ? null : other.convertedToId.copy();
        this.convertedById = other.convertedById == null ? null : other.convertedById.copy();
        this.companyId = other.companyId == null ? null : other.companyId.copy();
        this.contactsId = other.contactsId == null ? null : other.contactsId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public ProspectCriteria copy() {
        return new ProspectCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getFirstName() {
        return firstName;
    }

    public void setFirstName(StringFilter firstName) {
        this.firstName = firstName;
    }

    public StringFilter getLastName() {
        return lastName;
    }

    public void setLastName(StringFilter lastName) {
        this.lastName = lastName;
    }

    public StringFilter getEmail() {
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
    }

    public StringFilter getPhone1() {
        return phone1;
    }

    public void setPhone1(StringFilter phone1) {
        this.phone1 = phone1;
    }

    public StringFilter getPhone2() {
        return phone2;
    }

    public void setPhone2(StringFilter phone2) {
        this.phone2 = phone2;
    }

    public StringFilter getSource() {
        return source;
    }

    public void setSource(StringFilter source) {
        this.source = source;
    }

    public StringFilter getCin() {
        return cin;
    }

    public void setCin(StringFilter cin) {
        this.cin = cin;
    }

    public StringFilter getAddress() {
        return address;
    }

    public void setAddress(StringFilter address) {
        this.address = address;
    }

    public StringFilter getCity() {
        return city;
    }

    public void setCity(StringFilter city) {
        this.city = city;
    }

    public StringFilter getCountry() {
        return country;
    }

    public void setCountry(StringFilter country) {
        this.country = country;
    }

    public StringFilter getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(StringFilter deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public StringFilter getReferredBy() {
        return referredBy;
    }

    public void setReferredBy(StringFilter referredBy) {
        this.referredBy = referredBy;
    }

    public ProspectStatusFilter getStatus() {
        return status;
    }

    public void setStatus(ProspectStatusFilter status) {
        this.status = status;
    }

    public InstantFilter getConvertedDate() {
        return convertedDate;
    }

    public void setConvertedDate(InstantFilter convertedDate) {
        this.convertedDate = convertedDate;
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

    public LongFilter getConvertedToId() {
        return convertedToId;
    }

    public void setConvertedToId(LongFilter convertedToId) {
        this.convertedToId = convertedToId;
    }

    public LongFilter getConvertedById() {
        return convertedById;
    }

    public void setConvertedById(LongFilter convertedById) {
        this.convertedById = convertedById;
    }

    public LongFilter getCompanyId() {
        return companyId;
    }

    public void setCompanyId(LongFilter companyId) {
        this.companyId = companyId;
    }

    public LongFilter getContactsId() {
        return contactsId;
    }

    public void setContactsId(LongFilter contactsId) {
        this.contactsId = contactsId;
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
        final ProspectCriteria that = (ProspectCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(firstName, that.firstName) &&
            Objects.equals(lastName, that.lastName) &&
            Objects.equals(email, that.email) &&
            Objects.equals(phone1, that.phone1) &&
            Objects.equals(phone2, that.phone2) &&
            Objects.equals(source, that.source) &&
            Objects.equals(cin, that.cin) &&
            Objects.equals(address, that.address) &&
            Objects.equals(city, that.city) &&
            Objects.equals(country, that.country) &&
            Objects.equals(deliveryAddress, that.deliveryAddress) &&
            Objects.equals(referredBy, that.referredBy) &&
            Objects.equals(status, that.status) &&
            Objects.equals(convertedDate, that.convertedDate) &&
            Objects.equals(createdAt, that.createdAt) &&
            Objects.equals(updatedAt, that.updatedAt) &&
            Objects.equals(convertedToId, that.convertedToId) &&
            Objects.equals(convertedById, that.convertedById) &&
            Objects.equals(companyId, that.companyId) &&
            Objects.equals(contactsId, that.contactsId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            firstName,
            lastName,
            email,
            phone1,
            phone2,
            source,
            cin,
            address,
            city,
            country,
            deliveryAddress,
            referredBy,
            status,
            convertedDate,
            createdAt,
            updatedAt,
            convertedToId,
            convertedById,
            companyId,
            contactsId,
            distinct
        );
    }

    @Override
    public String toString() {
        return (
            "ProspectCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (firstName != null ? "firstName=" + firstName + ", " : "") +
            (lastName != null ? "lastName=" + lastName + ", " : "") +
            (email != null ? "email=" + email + ", " : "") +
            (phone1 != null ? "phone1=" + phone1 + ", " : "") +
            (phone2 != null ? "phone2=" + phone2 + ", " : "") +
            (source != null ? "source=" + source + ", " : "") +
            (cin != null ? "cin=" + cin + ", " : "") +
            (address != null ? "address=" + address + ", " : "") +
            (city != null ? "city=" + city + ", " : "") +
            (country != null ? "country=" + country + ", " : "") +
            (deliveryAddress != null ? "deliveryAddress=" + deliveryAddress + ", " : "") +
            (referredBy != null ? "referredBy=" + referredBy + ", " : "") +
            (status != null ? "status=" + status + ", " : "") +
            (convertedDate != null ? "convertedDate=" + convertedDate + ", " : "") +
            (createdAt != null ? "createdAt=" + createdAt + ", " : "") +
            (updatedAt != null ? "updatedAt=" + updatedAt + ", " : "") +
            (convertedToId != null ? "convertedToId=" + convertedToId + ", " : "") +
            (convertedById != null ? "convertedById=" + convertedById + ", " : "") +
            (companyId != null ? "companyId=" + companyId + ", " : "") +
            (contactsId != null ? "contactsId=" + contactsId + ", " : "") +
            (distinct != null ? "distinct=" + distinct : "") +
            '}'
        );
    }
}
