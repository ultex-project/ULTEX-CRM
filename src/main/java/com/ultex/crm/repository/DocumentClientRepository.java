package com.ultex.crm.repository;

import com.ultex.crm.domain.DocumentClient;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DocumentClient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentClientRepository extends JpaRepository<DocumentClient, Long> {}
