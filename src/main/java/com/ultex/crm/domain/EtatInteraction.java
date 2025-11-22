package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ultex.crm.domain.enumeration.EtatCRM;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EtatInteraction.
 */
@Entity
@Table(name = "etat_interaction")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EtatInteraction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "etat", nullable = false)
    private EtatCRM etat;

    @NotNull
    @Column(name = "date_etat", nullable = false)
    private Instant dateEtat;

    @Column(name = "agent")
    private String agent;

    @Lob
    @Column(name = "observation")
    private String observation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "client" }, allowSetters = true)
    private HistoriqueCRM historique;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "etats", "client" }, allowSetters = true)
    private CycleActivation cycle;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EtatInteraction id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EtatCRM getEtat() {
        return this.etat;
    }

    public EtatInteraction etat(EtatCRM etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(EtatCRM etat) {
        this.etat = etat;
    }

    public Instant getDateEtat() {
        return this.dateEtat;
    }

    public EtatInteraction dateEtat(Instant dateEtat) {
        this.setDateEtat(dateEtat);
        return this;
    }

    public void setDateEtat(Instant dateEtat) {
        this.dateEtat = dateEtat;
    }

    public String getAgent() {
        return this.agent;
    }

    public EtatInteraction agent(String agent) {
        this.setAgent(agent);
        return this;
    }

    public void setAgent(String agent) {
        this.agent = agent;
    }

    public String getObservation() {
        return this.observation;
    }

    public EtatInteraction observation(String observation) {
        this.setObservation(observation);
        return this;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public HistoriqueCRM getHistorique() {
        return this.historique;
    }

    public void setHistorique(HistoriqueCRM historiqueCRM) {
        this.historique = historiqueCRM;
    }

    public EtatInteraction historique(HistoriqueCRM historiqueCRM) {
        this.setHistorique(historiqueCRM);
        return this;
    }

    public CycleActivation getCycle() {
        return this.cycle;
    }

    public void setCycle(CycleActivation cycleActivation) {
        this.cycle = cycleActivation;
    }

    public EtatInteraction cycle(CycleActivation cycleActivation) {
        this.setCycle(cycleActivation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EtatInteraction)) {
            return false;
        }
        return getId() != null && getId().equals(((EtatInteraction) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EtatInteraction{" +
            "id=" + getId() +
            ", etat='" + getEtat() + "'" +
            ", dateEtat='" + getDateEtat() + "'" +
            ", agent='" + getAgent() + "'" +
            ", observation='" + getObservation() + "'" +
            "}";
    }
}
