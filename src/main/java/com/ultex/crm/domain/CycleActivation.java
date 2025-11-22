package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CycleActivation.
 */
@Entity
@Table(name = "cycle_activation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CycleActivation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "numero_cycle", nullable = false)
    private Integer numeroCycle;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private Instant dateDebut;

    @Column(name = "date_fin")
    private Instant dateFin;

    @Column(name = "statut_cycle")
    private String statutCycle;

    @Lob
    @Column(name = "commentaire")
    private String commentaire;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cycle")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "historique", "cycle" }, allowSetters = true)
    private Set<EtatInteraction> etats = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(
        value = { "opportunities", "cyclesActivations", "pays", "company", "convertedFromProspect", "contacts", "kycClient" },
        allowSetters = true
    )
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CycleActivation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroCycle() {
        return this.numeroCycle;
    }

    public CycleActivation numeroCycle(Integer numeroCycle) {
        this.setNumeroCycle(numeroCycle);
        return this;
    }

    public void setNumeroCycle(Integer numeroCycle) {
        this.numeroCycle = numeroCycle;
    }

    public Instant getDateDebut() {
        return this.dateDebut;
    }

    public CycleActivation dateDebut(Instant dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Instant getDateFin() {
        return this.dateFin;
    }

    public CycleActivation dateFin(Instant dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public String getStatutCycle() {
        return this.statutCycle;
    }

    public CycleActivation statutCycle(String statutCycle) {
        this.setStatutCycle(statutCycle);
        return this;
    }

    public void setStatutCycle(String statutCycle) {
        this.statutCycle = statutCycle;
    }

    public String getCommentaire() {
        return this.commentaire;
    }

    public CycleActivation commentaire(String commentaire) {
        this.setCommentaire(commentaire);
        return this;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Set<EtatInteraction> getEtats() {
        return this.etats;
    }

    public void setEtats(Set<EtatInteraction> etatInteractions) {
        if (this.etats != null) {
            this.etats.forEach(i -> i.setCycle(null));
        }
        if (etatInteractions != null) {
            etatInteractions.forEach(i -> i.setCycle(this));
        }
        this.etats = etatInteractions;
    }

    public CycleActivation etats(Set<EtatInteraction> etatInteractions) {
        this.setEtats(etatInteractions);
        return this;
    }

    public CycleActivation addEtats(EtatInteraction etatInteraction) {
        this.etats.add(etatInteraction);
        etatInteraction.setCycle(this);
        return this;
    }

    public CycleActivation removeEtats(EtatInteraction etatInteraction) {
        this.etats.remove(etatInteraction);
        etatInteraction.setCycle(null);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public CycleActivation client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CycleActivation)) {
            return false;
        }
        return getId() != null && getId().equals(((CycleActivation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CycleActivation{" +
            "id=" + getId() +
            ", numeroCycle=" + getNumeroCycle() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", statutCycle='" + getStatutCycle() + "'" +
            ", commentaire='" + getCommentaire() + "'" +
            "}";
    }
}
