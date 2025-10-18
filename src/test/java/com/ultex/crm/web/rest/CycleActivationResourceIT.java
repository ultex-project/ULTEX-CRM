package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.CycleActivationAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.CycleActivation;
import com.ultex.crm.repository.CycleActivationRepository;
import com.ultex.crm.service.dto.CycleActivationDTO;
import com.ultex.crm.service.mapper.CycleActivationMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CycleActivationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CycleActivationResourceIT {

    private static final Integer DEFAULT_NUMERO_CYCLE = 1;
    private static final Integer UPDATED_NUMERO_CYCLE = 2;

    private static final Instant DEFAULT_DATE_DEBUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEBUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_FIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_STATUT_CYCLE = "AAAAAAAAAA";
    private static final String UPDATED_STATUT_CYCLE = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENTAIRE = "AAAAAAAAAA";
    private static final String UPDATED_COMMENTAIRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/cycle-activations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CycleActivationRepository cycleActivationRepository;

    @Autowired
    private CycleActivationMapper cycleActivationMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCycleActivationMockMvc;

    private CycleActivation cycleActivation;

    private CycleActivation insertedCycleActivation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CycleActivation createEntity(EntityManager em) {
        CycleActivation cycleActivation = new CycleActivation()
            .numeroCycle(DEFAULT_NUMERO_CYCLE)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN)
            .statutCycle(DEFAULT_STATUT_CYCLE)
            .commentaire(DEFAULT_COMMENTAIRE);
        // Add required entity
        Client client;
        if (TestUtil.findAll(em, Client.class).isEmpty()) {
            client = ClientResourceIT.createEntity();
            em.persist(client);
            em.flush();
        } else {
            client = TestUtil.findAll(em, Client.class).get(0);
        }
        cycleActivation.setClient(client);
        return cycleActivation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CycleActivation createUpdatedEntity(EntityManager em) {
        CycleActivation updatedCycleActivation = new CycleActivation()
            .numeroCycle(UPDATED_NUMERO_CYCLE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .statutCycle(UPDATED_STATUT_CYCLE)
            .commentaire(UPDATED_COMMENTAIRE);
        // Add required entity
        Client client;
        if (TestUtil.findAll(em, Client.class).isEmpty()) {
            client = ClientResourceIT.createUpdatedEntity();
            em.persist(client);
            em.flush();
        } else {
            client = TestUtil.findAll(em, Client.class).get(0);
        }
        updatedCycleActivation.setClient(client);
        return updatedCycleActivation;
    }

    @BeforeEach
    void initTest() {
        cycleActivation = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedCycleActivation != null) {
            cycleActivationRepository.delete(insertedCycleActivation);
            insertedCycleActivation = null;
        }
    }

    @Test
    @Transactional
    void createCycleActivation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CycleActivation
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);
        var returnedCycleActivationDTO = om.readValue(
            restCycleActivationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cycleActivationDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CycleActivationDTO.class
        );

        // Validate the CycleActivation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedCycleActivation = cycleActivationMapper.toEntity(returnedCycleActivationDTO);
        assertCycleActivationUpdatableFieldsEquals(returnedCycleActivation, getPersistedCycleActivation(returnedCycleActivation));

        insertedCycleActivation = returnedCycleActivation;
    }

    @Test
    @Transactional
    void createCycleActivationWithExistingId() throws Exception {
        // Create the CycleActivation with an existing ID
        cycleActivation.setId(1L);
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCycleActivationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cycleActivationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the CycleActivation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumeroCycleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cycleActivation.setNumeroCycle(null);

        // Create the CycleActivation, which fails.
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        restCycleActivationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cycleActivationDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cycleActivation.setDateDebut(null);

        // Create the CycleActivation, which fails.
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        restCycleActivationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cycleActivationDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCycleActivations() throws Exception {
        // Initialize the database
        insertedCycleActivation = cycleActivationRepository.saveAndFlush(cycleActivation);

        // Get all the cycleActivationList
        restCycleActivationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cycleActivation.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroCycle").value(hasItem(DEFAULT_NUMERO_CYCLE)))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].statutCycle").value(hasItem(DEFAULT_STATUT_CYCLE)))
            .andExpect(jsonPath("$.[*].commentaire").value(hasItem(DEFAULT_COMMENTAIRE)));
    }

    @Test
    @Transactional
    void getCycleActivation() throws Exception {
        // Initialize the database
        insertedCycleActivation = cycleActivationRepository.saveAndFlush(cycleActivation);

        // Get the cycleActivation
        restCycleActivationMockMvc
            .perform(get(ENTITY_API_URL_ID, cycleActivation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cycleActivation.getId().intValue()))
            .andExpect(jsonPath("$.numeroCycle").value(DEFAULT_NUMERO_CYCLE))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.statutCycle").value(DEFAULT_STATUT_CYCLE))
            .andExpect(jsonPath("$.commentaire").value(DEFAULT_COMMENTAIRE));
    }

    @Test
    @Transactional
    void getNonExistingCycleActivation() throws Exception {
        // Get the cycleActivation
        restCycleActivationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCycleActivation() throws Exception {
        // Initialize the database
        insertedCycleActivation = cycleActivationRepository.saveAndFlush(cycleActivation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cycleActivation
        CycleActivation updatedCycleActivation = cycleActivationRepository.findById(cycleActivation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCycleActivation are not directly saved in db
        em.detach(updatedCycleActivation);
        updatedCycleActivation
            .numeroCycle(UPDATED_NUMERO_CYCLE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .statutCycle(UPDATED_STATUT_CYCLE)
            .commentaire(UPDATED_COMMENTAIRE);
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(updatedCycleActivation);

        restCycleActivationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cycleActivationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(cycleActivationDTO))
            )
            .andExpect(status().isOk());

        // Validate the CycleActivation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCycleActivationToMatchAllProperties(updatedCycleActivation);
    }

    @Test
    @Transactional
    void putNonExistingCycleActivation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cycleActivation.setId(longCount.incrementAndGet());

        // Create the CycleActivation
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCycleActivationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cycleActivationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(cycleActivationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CycleActivation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCycleActivation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cycleActivation.setId(longCount.incrementAndGet());

        // Create the CycleActivation
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCycleActivationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(cycleActivationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CycleActivation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCycleActivation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cycleActivation.setId(longCount.incrementAndGet());

        // Create the CycleActivation
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCycleActivationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cycleActivationDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CycleActivation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCycleActivationWithPatch() throws Exception {
        // Initialize the database
        insertedCycleActivation = cycleActivationRepository.saveAndFlush(cycleActivation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cycleActivation using partial update
        CycleActivation partialUpdatedCycleActivation = new CycleActivation();
        partialUpdatedCycleActivation.setId(cycleActivation.getId());

        partialUpdatedCycleActivation.commentaire(UPDATED_COMMENTAIRE);

        restCycleActivationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCycleActivation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCycleActivation))
            )
            .andExpect(status().isOk());

        // Validate the CycleActivation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCycleActivationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCycleActivation, cycleActivation),
            getPersistedCycleActivation(cycleActivation)
        );
    }

    @Test
    @Transactional
    void fullUpdateCycleActivationWithPatch() throws Exception {
        // Initialize the database
        insertedCycleActivation = cycleActivationRepository.saveAndFlush(cycleActivation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cycleActivation using partial update
        CycleActivation partialUpdatedCycleActivation = new CycleActivation();
        partialUpdatedCycleActivation.setId(cycleActivation.getId());

        partialUpdatedCycleActivation
            .numeroCycle(UPDATED_NUMERO_CYCLE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .statutCycle(UPDATED_STATUT_CYCLE)
            .commentaire(UPDATED_COMMENTAIRE);

        restCycleActivationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCycleActivation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCycleActivation))
            )
            .andExpect(status().isOk());

        // Validate the CycleActivation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCycleActivationUpdatableFieldsEquals(
            partialUpdatedCycleActivation,
            getPersistedCycleActivation(partialUpdatedCycleActivation)
        );
    }

    @Test
    @Transactional
    void patchNonExistingCycleActivation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cycleActivation.setId(longCount.incrementAndGet());

        // Create the CycleActivation
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCycleActivationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cycleActivationDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(cycleActivationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CycleActivation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCycleActivation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cycleActivation.setId(longCount.incrementAndGet());

        // Create the CycleActivation
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCycleActivationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(cycleActivationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CycleActivation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCycleActivation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cycleActivation.setId(longCount.incrementAndGet());

        // Create the CycleActivation
        CycleActivationDTO cycleActivationDTO = cycleActivationMapper.toDto(cycleActivation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCycleActivationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cycleActivationDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CycleActivation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCycleActivation() throws Exception {
        // Initialize the database
        insertedCycleActivation = cycleActivationRepository.saveAndFlush(cycleActivation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the cycleActivation
        restCycleActivationMockMvc
            .perform(delete(ENTITY_API_URL_ID, cycleActivation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return cycleActivationRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected CycleActivation getPersistedCycleActivation(CycleActivation cycleActivation) {
        return cycleActivationRepository.findById(cycleActivation.getId()).orElseThrow();
    }

    protected void assertPersistedCycleActivationToMatchAllProperties(CycleActivation expectedCycleActivation) {
        assertCycleActivationAllPropertiesEquals(expectedCycleActivation, getPersistedCycleActivation(expectedCycleActivation));
    }

    protected void assertPersistedCycleActivationToMatchUpdatableProperties(CycleActivation expectedCycleActivation) {
        assertCycleActivationAllUpdatablePropertiesEquals(expectedCycleActivation, getPersistedCycleActivation(expectedCycleActivation));
    }
}
