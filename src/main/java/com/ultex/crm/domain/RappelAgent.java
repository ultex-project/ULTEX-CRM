package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.StatutRappel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RappelAgent.
 */
@Entity
@Table(name = "rappel_agent")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RappelAgent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "rappel_date", nullable = false)
    private Instant rappelDate;

    @Column(name = "rappel_message")
    private String rappelMessage;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "statut_rappel", nullable = false)
    private StatutRappel statutRappel;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "historique", "cycle" }, allowSetters = true)
    private EtatInteraction etat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = { "opportunities", "cyclesActivations", "pays", "company", "convertedFromProspect", "contacts", "kycClient" },
        allowSetters = true
    )
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "opportunities", "convertedProspects" }, allowSetters = true)
    private InternalUser agent;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RappelAgent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getRappelDate() {
        return this.rappelDate;
    }

    public RappelAgent rappelDate(Instant rappelDate) {
        this.setRappelDate(rappelDate);
        return this;
    }

    public void setRappelDate(Instant rappelDate) {
        this.rappelDate = rappelDate;
    }

    public String getRappelMessage() {
        return this.rappelMessage;
    }

    public RappelAgent rappelMessage(String rappelMessage) {
        this.setRappelMessage(rappelMessage);
        return this;
    }

    public void setRappelMessage(String rappelMessage) {
        this.rappelMessage = rappelMessage;
    }

    public StatutRappel getStatutRappel() {
        return this.statutRappel;
    }

    public RappelAgent statutRappel(StatutRappel statutRappel) {
        this.setStatutRappel(statutRappel);
        return this;
    }

    public void setStatutRappel(StatutRappel statutRappel) {
        this.statutRappel = statutRappel;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public RappelAgent createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public RappelAgent updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public EtatInteraction getEtat() {
        return this.etat;
    }

    public void setEtat(EtatInteraction etatInteraction) {
        this.etat = etatInteraction;
    }

    public RappelAgent etat(EtatInteraction etatInteraction) {
        this.setEtat(etatInteraction);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public RappelAgent client(Client client) {
        this.setClient(client);
        return this;
    }

    public InternalUser getAgent() {
        return this.agent;
    }

    public void setAgent(InternalUser internalUser) {
        this.agent = internalUser;
    }

    public RappelAgent agent(InternalUser internalUser) {
        this.setAgent(internalUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RappelAgent)) {
            return false;
        }
        return getId() != null && getId().equals(((RappelAgent) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RappelAgent{" +
            "id=" + getId() +
            ", rappelDate='" + getRappelDate() + "'" +
            ", rappelMessage='" + getRappelMessage() + "'" +
            ", statutRappel='" + getStatutRappel() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
}
