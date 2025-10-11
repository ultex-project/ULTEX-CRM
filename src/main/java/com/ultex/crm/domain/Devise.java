package com.ultex.crm.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Devise.
 */
@Entity
@Table(name = "devise")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Devise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @NotNull
    @Column(name = "nom_complet", nullable = false)
    private String nomComplet;

    @Column(name = "symbole")
    private String symbole;

    @Column(name = "pays")
    private String pays;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Devise id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Devise code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNomComplet() {
        return this.nomComplet;
    }

    public Devise nomComplet(String nomComplet) {
        this.setNomComplet(nomComplet);
        return this;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public String getSymbole() {
        return this.symbole;
    }

    public Devise symbole(String symbole) {
        this.setSymbole(symbole);
        return this;
    }

    public void setSymbole(String symbole) {
        this.symbole = symbole;
    }

    public String getPays() {
        return this.pays;
    }

    public Devise pays(String pays) {
        this.setPays(pays);
        return this;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Devise)) {
            return false;
        }
        return getId() != null && getId().equals(((Devise) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Devise{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nomComplet='" + getNomComplet() + "'" +
            ", symbole='" + getSymbole() + "'" +
            ", pays='" + getPays() + "'" +
            "}";
    }
}
