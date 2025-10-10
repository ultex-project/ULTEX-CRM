package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.ProspectStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Prospect.
 */
@Entity
@Table(name = "prospect")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Prospect implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotNull
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone_1")
    private String phone1;

    @Column(name = "phone_2")
    private String phone2;

    @Column(name = "source")
    private String source;

    @Column(name = "cin")
    private String cin;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "referred_by")
    private String referredBy;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProspectStatus status;

    @Column(name = "converted_date")
    private Instant convertedDate;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @JsonIgnoreProperties(value = { "opportunities", "company", "convertedFromProspect", "contacts", "kycClient" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Client convertedTo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "opportunities", "convertedProspects" }, allowSetters = true)
    private InternalUser convertedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "clients", "prospects", "contacts" }, allowSetters = true)
    private Company company;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "prospect")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "company", "client", "prospect" }, allowSetters = true)
    private Set<Contact> contacts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Prospect id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Prospect firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Prospect lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Prospect email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone1() {
        return this.phone1;
    }

    public Prospect phone1(String phone1) {
        this.setPhone1(phone1);
        return this;
    }

    public void setPhone1(String phone1) {
        this.phone1 = phone1;
    }

    public String getPhone2() {
        return this.phone2;
    }

    public Prospect phone2(String phone2) {
        this.setPhone2(phone2);
        return this;
    }

    public void setPhone2(String phone2) {
        this.phone2 = phone2;
    }

    public String getSource() {
        return this.source;
    }

    public Prospect source(String source) {
        this.setSource(source);
        return this;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getCin() {
        return this.cin;
    }

    public Prospect cin(String cin) {
        this.setCin(cin);
        return this;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getAddress() {
        return this.address;
    }

    public Prospect address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return this.city;
    }

    public Prospect city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return this.country;
    }

    public Prospect country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public Prospect deliveryAddress(String deliveryAddress) {
        this.setDeliveryAddress(deliveryAddress);
        return this;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getReferredBy() {
        return this.referredBy;
    }

    public Prospect referredBy(String referredBy) {
        this.setReferredBy(referredBy);
        return this;
    }

    public void setReferredBy(String referredBy) {
        this.referredBy = referredBy;
    }

    public ProspectStatus getStatus() {
        return this.status;
    }

    public Prospect status(ProspectStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(ProspectStatus status) {
        this.status = status;
    }

    public Instant getConvertedDate() {
        return this.convertedDate;
    }

    public Prospect convertedDate(Instant convertedDate) {
        this.setConvertedDate(convertedDate);
        return this;
    }

    public void setConvertedDate(Instant convertedDate) {
        this.convertedDate = convertedDate;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Prospect createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public Prospect updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Client getConvertedTo() {
        return this.convertedTo;
    }

    public void setConvertedTo(Client client) {
        this.convertedTo = client;
    }

    public Prospect convertedTo(Client client) {
        this.setConvertedTo(client);
        return this;
    }

    public InternalUser getConvertedBy() {
        return this.convertedBy;
    }

    public void setConvertedBy(InternalUser internalUser) {
        this.convertedBy = internalUser;
    }

    public Prospect convertedBy(InternalUser internalUser) {
        this.setConvertedBy(internalUser);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Prospect company(Company company) {
        this.setCompany(company);
        return this;
    }

    public Set<Contact> getContacts() {
        return this.contacts;
    }

    public void setContacts(Set<Contact> contacts) {
        if (this.contacts != null) {
            this.contacts.forEach(i -> i.setProspect(null));
        }
        if (contacts != null) {
            contacts.forEach(i -> i.setProspect(this));
        }
        this.contacts = contacts;
    }

    public Prospect contacts(Set<Contact> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public Prospect addContacts(Contact contact) {
        this.contacts.add(contact);
        contact.setProspect(this);
        return this;
    }

    public Prospect removeContacts(Contact contact) {
        this.contacts.remove(contact);
        contact.setProspect(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Prospect)) {
            return false;
        }
        return getId() != null && getId().equals(((Prospect) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Prospect{" +
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
            "}";
    }
}
