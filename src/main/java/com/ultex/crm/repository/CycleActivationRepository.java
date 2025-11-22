package com.ultex.crm.repository;

import com.ultex.crm.domain.CycleActivation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CycleActivation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CycleActivationRepository extends JpaRepository<CycleActivation, Long> {}
