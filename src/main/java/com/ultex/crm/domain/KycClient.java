package com.ultex.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A KycClient.
 */
@Entity
@Table(name = "kyc_client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class KycClient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "score_staff")
    private Integer scoreStaff;

    @Column(name = "comportements")
    private String comportements;

    @Column(name = "remarques")
    private String remarques;

    @Column(name = "completude_kyc")
    private Integer completudeKyc;

    @Column(name = "responsable")
    private String responsable;

    @JsonIgnoreProperties(
        value = { "opportunities", "pays", "company", "convertedFromProspect", "contacts", "kycClient" },
        allowSetters = true
    )
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public KycClient id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getScoreStaff() {
        return this.scoreStaff;
    }

    public KycClient scoreStaff(Integer scoreStaff) {
        this.setScoreStaff(scoreStaff);
        return this;
    }

    public void setScoreStaff(Integer scoreStaff) {
        this.scoreStaff = scoreStaff;
    }

    public String getComportements() {
        return this.comportements;
    }

    public KycClient comportements(String comportements) {
        this.setComportements(comportements);
        return this;
    }

    public void setComportements(String comportements) {
        this.comportements = comportements;
    }

    public String getRemarques() {
        return this.remarques;
    }

    public KycClient remarques(String remarques) {
        this.setRemarques(remarques);
        return this;
    }

    public void setRemarques(String remarques) {
        this.remarques = remarques;
    }

    public Integer getCompletudeKyc() {
        return this.completudeKyc;
    }

    public KycClient completudeKyc(Integer completudeKyc) {
        this.setCompletudeKyc(completudeKyc);
        return this;
    }

    public void setCompletudeKyc(Integer completudeKyc) {
        this.completudeKyc = completudeKyc;
    }

    public String getResponsable() {
        return this.responsable;
    }

    public KycClient responsable(String responsable) {
        this.setResponsable(responsable);
        return this;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public KycClient client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KycClient)) {
            return false;
        }
        return getId() != null && getId().equals(((KycClient) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KycClient{" +
            "id=" + getId() +
            ", scoreStaff=" + getScoreStaff() +
            ", comportements='" + getComportements() + "'" +
            ", remarques='" + getRemarques() + "'" +
            ", completudeKyc=" + getCompletudeKyc() +
            ", responsable='" + getResponsable() + "'" +
            "}";
    }
}
