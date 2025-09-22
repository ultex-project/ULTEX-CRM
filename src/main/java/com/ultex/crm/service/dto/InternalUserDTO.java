package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.UserRole;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.InternalUser} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InternalUserDTO implements Serializable {

    private Long id;

    @NotNull
    private String fullName;

    @NotNull
    private UserRole role;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof InternalUserDTO)) {
            return false;
        }

        InternalUserDTO internalUserDTO = (InternalUserDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, internalUserDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InternalUserDTO{" +
            "id=" + getId() +
            ", fullName='" + getFullName() + "'" +
            ", role='" + getRole() + "'" +
            "}";
    }
}
