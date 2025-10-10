package com.ultex.crm.repository;

import com.ultex.crm.domain.HistoriqueCRM;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HistoriqueCRM entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HistoriqueCRMRepository extends JpaRepository<HistoriqueCRM, Long> {}
