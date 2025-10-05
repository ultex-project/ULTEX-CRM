package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A InternalUser.
 */
@Entity
@Table(name = "internal_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InternalUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @NotNull
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "assignedTo")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "assignedTo", "client" }, allowSetters = true)
    private Set<Opportunity> opportunities = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "convertedBy")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "convertedTo", "convertedBy", "company", "contacts" }, allowSetters = true)
    private Set<Prospect> convertedProspects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public InternalUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return this.fullName;
    }

    public InternalUser fullName(String fullName) {
        this.setFullName(fullName);
        return this;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public UserRole getRole() {
        return this.role;
    }

    public InternalUser role(UserRole role) {
        this.setRole(role);
        return this;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getEmail() {
        return this.email;
    }

    public InternalUser email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public InternalUser phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public InternalUser createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public InternalUser updatedAt(Instant updatedAt) {
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
            this.opportunities.forEach(i -> i.setAssignedTo(null));
        }
        if (opportunities != null) {
            opportunities.forEach(i -> i.setAssignedTo(this));
        }
        this.opportunities = opportunities;
    }

    public InternalUser opportunities(Set<Opportunity> opportunities) {
        this.setOpportunities(opportunities);
        return this;
    }

    public InternalUser addOpportunities(Opportunity opportunity) {
        this.opportunities.add(opportunity);
        opportunity.setAssignedTo(this);
        return this;
    }

    public InternalUser removeOpportunities(Opportunity opportunity) {
        this.opportunities.remove(opportunity);
        opportunity.setAssignedTo(null);
        return this;
    }

    public Set<Prospect> getConvertedProspects() {
        return this.convertedProspects;
    }

    public void setConvertedProspects(Set<Prospect> prospects) {
        if (this.convertedProspects != null) {
            this.convertedProspects.forEach(i -> i.setConvertedBy(null));
        }
        if (prospects != null) {
            prospects.forEach(i -> i.setConvertedBy(this));
        }
        this.convertedProspects = prospects;
    }

    public InternalUser convertedProspects(Set<Prospect> prospects) {
        this.setConvertedProspects(prospects);
        return this;
    }

    public InternalUser addConvertedProspects(Prospect prospect) {
        this.convertedProspects.add(prospect);
        prospect.setConvertedBy(this);
        return this;
    }

    public InternalUser removeConvertedProspects(Prospect prospect) {
        this.convertedProspects.remove(prospect);
        prospect.setConvertedBy(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof InternalUser)) {
            return false;
        }
        return getId() != null && getId().equals(((InternalUser) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InternalUser{" +
            "id=" + getId() +
            ", fullName='" + getFullName() + "'" +
            ", role='" + getRole() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
}
