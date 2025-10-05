package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.ProspectStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.Prospect} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProspectDTO implements Serializable {

    private Long id;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    private String email;

    private String phone1;

    private String phone2;

    private String source;

    private String cin;

    private String address;

    private String city;

    private String country;

    private String deliveryAddress;

    private String referredBy;

    @NotNull
    private ProspectStatus status;

    private Instant convertedDate;

    private Instant createdAt;

    private Instant updatedAt;

    private ClientDTO convertedTo;

    @NotNull
    private InternalUserDTO convertedBy;

    private CompanyDTO company;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone1() {
        return phone1;
    }

    public void setPhone1(String phone1) {
        this.phone1 = phone1;
    }

    public String getPhone2() {
        return phone2;
    }

    public void setPhone2(String phone2) {
        this.phone2 = phone2;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getReferredBy() {
        return referredBy;
    }

    public void setReferredBy(String referredBy) {
        this.referredBy = referredBy;
    }

    public ProspectStatus getStatus() {
        return status;
    }

    public void setStatus(ProspectStatus status) {
        this.status = status;
    }

    public Instant getConvertedDate() {
        return convertedDate;
    }

    public void setConvertedDate(Instant convertedDate) {
        this.convertedDate = convertedDate;
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

    public ClientDTO getConvertedTo() {
        return convertedTo;
    }

    public void setConvertedTo(ClientDTO convertedTo) {
        this.convertedTo = convertedTo;
    }

    public InternalUserDTO getConvertedBy() {
        return convertedBy;
    }

    public void setConvertedBy(InternalUserDTO convertedBy) {
        this.convertedBy = convertedBy;
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
        if (!(o instanceof ProspectDTO)) {
            return false;
        }

        ProspectDTO prospectDTO = (ProspectDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, prospectDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProspectDTO{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone1='" + getPhone1() + "'" +
            ", phone2='" + getPhone2() + "'" +
            ", source='" + getSource() + "'" +
            ", cin='" + getCin() + "'" +
            ", address='" + getAddress() + "'" +
            ", city='" + getCity() + "'" +
            ", country='" + getCountry() + "'" +
            ", deliveryAddress='" + getDeliveryAddress() + "'" +
            ", referredBy='" + getReferredBy() + "'" +
            ", status='" + getStatus() + "'" +
            ", convertedDate='" + getConvertedDate() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", convertedTo=" + getConvertedTo() +
            ", convertedBy=" + getConvertedBy() +
            ", company=" + getCompany() +
            "}";
    }
}
