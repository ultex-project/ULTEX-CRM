package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.ClientStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
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
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotNull
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "company")
    private String company;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClientStatus status;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "assignedTo", "client" }, allowSetters = true)
    private Set<Opportunity> opportunities = new HashSet<>();

    @JsonIgnoreProperties(value = { "convertedTo", "convertedBy" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "convertedTo")
    private Prospect prospect;

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

    public String getFirstName() {
        return this.firstName;
    }

    public Client firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Client lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public String getPhone() {
        return this.phone;
    }

    public Client phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompany() {
        return this.company;
    }

    public Client company(String company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public ClientStatus getStatus() {
        return this.status;
    }

    public Client status(ClientStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(ClientStatus status) {
        this.status = status;
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

    public Prospect getProspect() {
        return this.prospect;
    }

    public void setProspect(Prospect prospect) {
        if (this.prospect != null) {
            this.prospect.setConvertedTo(null);
        }
        if (prospect != null) {
            prospect.setConvertedTo(this);
        }
        this.prospect = prospect;
    }

    public Client prospect(Prospect prospect) {
        this.setProspect(prospect);
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
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", company='" + getCompany() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
