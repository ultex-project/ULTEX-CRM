package com.ultex.crm.repository;

import com.ultex.crm.domain.DemandeClient;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface DemandeClientRepositoryWithBagRelationships {
    Optional<DemandeClient> fetchBagRelationships(Optional<DemandeClient> demandeClient);

    List<DemandeClient> fetchBagRelationships(List<DemandeClient> demandeClients);

    Page<DemandeClient> fetchBagRelationships(Page<DemandeClient> demandeClients);
}
