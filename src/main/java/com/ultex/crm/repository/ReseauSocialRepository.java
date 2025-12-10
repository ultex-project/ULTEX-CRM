package com.ultex.crm.repository;

import com.ultex.crm.domain.ReseauSocial;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ReseauSocial entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReseauSocialRepository extends JpaRepository<ReseauSocial, Long> {}
