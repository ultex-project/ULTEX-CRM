package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A HistoriqueCRM.
 */
@Entity
@Table(name = "historique_crm")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HistoriqueCRM implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date_interaction", nullable = false)
    private Instant dateInteraction;

    @Column(name = "canal")
    private String canal;

    @Column(name = "agent")
    private String agent;

    @Lob
    @Column(name = "resume")
    private String resume;

    @Column(name = "etat")
    private String etat;

    @Column(name = "observation")
    private String observation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = { "opportunities", "cyclesActivations", "pays", "company", "convertedFromProspect", "contacts", "kycClient" },
        allowSetters = true
    )
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HistoriqueCRM id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDateInteraction() {
        return this.dateInteraction;
    }

    public HistoriqueCRM dateInteraction(Instant dateInteraction) {
        this.setDateInteraction(dateInteraction);
        return this;
    }

    public void setDateInteraction(Instant dateInteraction) {
        this.dateInteraction = dateInteraction;
    }

    public String getCanal() {
        return this.canal;
    }

    public HistoriqueCRM canal(String canal) {
        this.setCanal(canal);
        return this;
    }

    public void setCanal(String canal) {
        this.canal = canal;
    }

    public String getAgent() {
        return this.agent;
    }

    public HistoriqueCRM agent(String agent) {
        this.setAgent(agent);
        return this;
    }

    public void setAgent(String agent) {
        this.agent = agent;
    }

    public String getResume() {
        return this.resume;
    }

    public HistoriqueCRM resume(String resume) {
        this.setResume(resume);
        return this;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    public String getEtat() {
        return this.etat;
    }

    public HistoriqueCRM etat(String etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public String getObservation() {
        return this.observation;
    }

    public HistoriqueCRM observation(String observation) {
        this.setObservation(observation);
        return this;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public HistoriqueCRM client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HistoriqueCRM)) {
            return false;
        }
        return getId() != null && getId().equals(((HistoriqueCRM) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HistoriqueCRM{" +
            "id=" + getId() +
            ", dateInteraction='" + getDateInteraction() + "'" +
            ", canal='" + getCanal() + "'" +
            ", agent='" + getAgent() + "'" +
            ", resume='" + getResume() + "'" +
            ", etat='" + getEtat() + "'" +
            ", observation='" + getObservation() + "'" +
            "}";
    }
}
