package com.ultex.crm.repository;

import com.ultex.crm.domain.DemandeClient;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class DemandeClientRepositoryWithBagRelationshipsImpl implements DemandeClientRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String DEMANDECLIENTS_PARAMETER = "demandeClients";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<DemandeClient> fetchBagRelationships(Optional<DemandeClient> demandeClient) {
        return demandeClient.map(this::fetchSousServices);
    }

    @Override
    public Page<DemandeClient> fetchBagRelationships(Page<DemandeClient> demandeClients) {
        return new PageImpl<>(
            fetchBagRelationships(demandeClients.getContent()),
            demandeClients.getPageable(),
            demandeClients.getTotalElements()
        );
    }

    @Override
    public List<DemandeClient> fetchBagRelationships(List<DemandeClient> demandeClients) {
        return Optional.of(demandeClients).map(this::fetchSousServices).orElse(Collections.emptyList());
    }

    DemandeClient fetchSousServices(DemandeClient result) {
        return entityManager
            .createQuery(
                "select demandeClient from DemandeClient demandeClient left join fetch demandeClient.sousServices where demandeClient.id = :id",
                DemandeClient.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<DemandeClient> fetchSousServices(List<DemandeClient> demandeClients) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, demandeClients.size()).forEach(index -> order.put(demandeClients.get(index).getId(), index));
        List<DemandeClient> result = entityManager
            .createQuery(
                "select demandeClient from DemandeClient demandeClient left join fetch demandeClient.sousServices where demandeClient in :demandeClients",
                DemandeClient.class
            )
            .setParameter(DEMANDECLIENTS_PARAMETER, demandeClients)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
