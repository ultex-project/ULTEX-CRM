package com.ultex.crm.repository;

import com.ultex.crm.domain.InternalUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the InternalUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InternalUserRepository extends JpaRepository<InternalUser, Long> {}
