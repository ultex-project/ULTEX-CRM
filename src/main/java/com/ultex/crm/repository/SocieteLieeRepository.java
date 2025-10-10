package com.ultex.crm.repository;

import com.ultex.crm.domain.SocieteLiee;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SocieteLiee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SocieteLieeRepository extends JpaRepository<SocieteLiee, Long> {}
