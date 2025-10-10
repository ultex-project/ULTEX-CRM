package com.ultex.crm.repository;

import com.ultex.crm.domain.ContactAssocie;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ContactAssocie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContactAssocieRepository extends JpaRepository<ContactAssocie, Long> {}
