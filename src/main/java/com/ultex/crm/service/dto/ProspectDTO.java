package com.ultex.crm.service.dto;

import com.ultex.crm.domain.enumeration.ProspectStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.ultex.crm.domain.Prospect} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProspectDTO implements Serializable {

    private Long id;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    private String email;

    private String phone;

    private String source;

    @NotNull
    private ProspectStatus status;

    private ClientDTO convertedTo;

    private InternalUserDTO convertedBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public ProspectStatus getStatus() {
        return status;
    }

    public void setStatus(ProspectStatus status) {
        this.status = status;
    }

    public ClientDTO getConvertedTo() {
        return convertedTo;
    }

    public void setConvertedTo(ClientDTO convertedTo) {
        this.convertedTo = convertedTo;
    }

    public InternalUserDTO getConvertedBy() {
        return convertedBy;
    }

    public void setConvertedBy(InternalUserDTO convertedBy) {
        this.convertedBy = convertedBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProspectDTO)) {
            return false;
        }

        ProspectDTO prospectDTO = (ProspectDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, prospectDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProspectDTO{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", source='" + getSource() + "'" +
            ", status='" + getStatus() + "'" +
            ", convertedTo=" + getConvertedTo() +
            ", convertedBy=" + getConvertedBy() +
            "}";
    }
}
