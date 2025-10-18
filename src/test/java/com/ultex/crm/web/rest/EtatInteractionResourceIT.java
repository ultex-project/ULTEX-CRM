package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.EtatInteractionAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.CycleActivation;
import com.ultex.crm.domain.EtatInteraction;
import com.ultex.crm.domain.enumeration.EtatCRM;
import com.ultex.crm.repository.EtatInteractionRepository;
import com.ultex.crm.service.dto.EtatInteractionDTO;
import com.ultex.crm.service.mapper.EtatInteractionMapper;
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
 * Integration tests for the {@link EtatInteractionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtatInteractionResourceIT {

    private static final EtatCRM DEFAULT_ETAT = EtatCRM.TRAITE;
    private static final EtatCRM UPDATED_ETAT = EtatCRM.EN_COURS;

    private static final Instant DEFAULT_DATE_ETAT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ETAT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_AGENT = "AAAAAAAAAA";
    private static final String UPDATED_AGENT = "BBBBBBBBBB";

    private static final String DEFAULT_OBSERVATION = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/etat-interactions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EtatInteractionRepository etatInteractionRepository;

    @Autowired
    private EtatInteractionMapper etatInteractionMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtatInteractionMockMvc;

    private EtatInteraction etatInteraction;

    private EtatInteraction insertedEtatInteraction;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtatInteraction createEntity(EntityManager em) {
        EtatInteraction etatInteraction = new EtatInteraction()
            .etat(DEFAULT_ETAT)
            .dateEtat(DEFAULT_DATE_ETAT)
            .agent(DEFAULT_AGENT)
            .observation(DEFAULT_OBSERVATION);
        // Add required entity
        CycleActivation cycleActivation;
        if (TestUtil.findAll(em, CycleActivation.class).isEmpty()) {
            cycleActivation = CycleActivationResourceIT.createEntity(em);
            em.persist(cycleActivation);
            em.flush();
        } else {
            cycleActivation = TestUtil.findAll(em, CycleActivation.class).get(0);
        }
        etatInteraction.setCycle(cycleActivation);
        return etatInteraction;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtatInteraction createUpdatedEntity(EntityManager em) {
        EtatInteraction updatedEtatInteraction = new EtatInteraction()
            .etat(UPDATED_ETAT)
            .dateEtat(UPDATED_DATE_ETAT)
            .agent(UPDATED_AGENT)
            .observation(UPDATED_OBSERVATION);
        // Add required entity
        CycleActivation cycleActivation;
        if (TestUtil.findAll(em, CycleActivation.class).isEmpty()) {
            cycleActivation = CycleActivationResourceIT.createUpdatedEntity(em);
            em.persist(cycleActivation);
            em.flush();
        } else {
            cycleActivation = TestUtil.findAll(em, CycleActivation.class).get(0);
        }
        updatedEtatInteraction.setCycle(cycleActivation);
        return updatedEtatInteraction;
    }

    @BeforeEach
    void initTest() {
        etatInteraction = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedEtatInteraction != null) {
            etatInteractionRepository.delete(insertedEtatInteraction);
            insertedEtatInteraction = null;
        }
    }

    @Test
    @Transactional
    void createEtatInteraction() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the EtatInteraction
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);
        var returnedEtatInteractionDTO = om.readValue(
            restEtatInteractionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etatInteractionDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            EtatInteractionDTO.class
        );

        // Validate the EtatInteraction in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedEtatInteraction = etatInteractionMapper.toEntity(returnedEtatInteractionDTO);
        assertEtatInteractionUpdatableFieldsEquals(returnedEtatInteraction, getPersistedEtatInteraction(returnedEtatInteraction));

        insertedEtatInteraction = returnedEtatInteraction;
    }

    @Test
    @Transactional
    void createEtatInteractionWithExistingId() throws Exception {
        // Create the EtatInteraction with an existing ID
        etatInteraction.setId(1L);
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtatInteractionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etatInteractionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the EtatInteraction in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkEtatIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        etatInteraction.setEtat(null);

        // Create the EtatInteraction, which fails.
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        restEtatInteractionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etatInteractionDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateEtatIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        etatInteraction.setDateEtat(null);

        // Create the EtatInteraction, which fails.
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        restEtatInteractionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etatInteractionDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEtatInteractions() throws Exception {
        // Initialize the database
        insertedEtatInteraction = etatInteractionRepository.saveAndFlush(etatInteraction);

        // Get all the etatInteractionList
        restEtatInteractionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etatInteraction.getId().intValue())))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())))
            .andExpect(jsonPath("$.[*].dateEtat").value(hasItem(DEFAULT_DATE_ETAT.toString())))
            .andExpect(jsonPath("$.[*].agent").value(hasItem(DEFAULT_AGENT)))
            .andExpect(jsonPath("$.[*].observation").value(hasItem(DEFAULT_OBSERVATION)));
    }

    @Test
    @Transactional
    void getEtatInteraction() throws Exception {
        // Initialize the database
        insertedEtatInteraction = etatInteractionRepository.saveAndFlush(etatInteraction);

        // Get the etatInteraction
        restEtatInteractionMockMvc
            .perform(get(ENTITY_API_URL_ID, etatInteraction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etatInteraction.getId().intValue()))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()))
            .andExpect(jsonPath("$.dateEtat").value(DEFAULT_DATE_ETAT.toString()))
            .andExpect(jsonPath("$.agent").value(DEFAULT_AGENT))
            .andExpect(jsonPath("$.observation").value(DEFAULT_OBSERVATION));
    }

    @Test
    @Transactional
    void getNonExistingEtatInteraction() throws Exception {
        // Get the etatInteraction
        restEtatInteractionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEtatInteraction() throws Exception {
        // Initialize the database
        insertedEtatInteraction = etatInteractionRepository.saveAndFlush(etatInteraction);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etatInteraction
        EtatInteraction updatedEtatInteraction = etatInteractionRepository.findById(etatInteraction.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEtatInteraction are not directly saved in db
        em.detach(updatedEtatInteraction);
        updatedEtatInteraction.etat(UPDATED_ETAT).dateEtat(UPDATED_DATE_ETAT).agent(UPDATED_AGENT).observation(UPDATED_OBSERVATION);
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(updatedEtatInteraction);

        restEtatInteractionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etatInteractionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(etatInteractionDTO))
            )
            .andExpect(status().isOk());

        // Validate the EtatInteraction in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEtatInteractionToMatchAllProperties(updatedEtatInteraction);
    }

    @Test
    @Transactional
    void putNonExistingEtatInteraction() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etatInteraction.setId(longCount.incrementAndGet());

        // Create the EtatInteraction
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtatInteractionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etatInteractionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(etatInteractionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatInteraction in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtatInteraction() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etatInteraction.setId(longCount.incrementAndGet());

        // Create the EtatInteraction
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtatInteractionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(etatInteractionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatInteraction in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtatInteraction() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etatInteraction.setId(longCount.incrementAndGet());

        // Create the EtatInteraction
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtatInteractionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etatInteractionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtatInteraction in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtatInteractionWithPatch() throws Exception {
        // Initialize the database
        insertedEtatInteraction = etatInteractionRepository.saveAndFlush(etatInteraction);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etatInteraction using partial update
        EtatInteraction partialUpdatedEtatInteraction = new EtatInteraction();
        partialUpdatedEtatInteraction.setId(etatInteraction.getId());

        partialUpdatedEtatInteraction.dateEtat(UPDATED_DATE_ETAT).agent(UPDATED_AGENT).observation(UPDATED_OBSERVATION);

        restEtatInteractionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtatInteraction.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEtatInteraction))
            )
            .andExpect(status().isOk());

        // Validate the EtatInteraction in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEtatInteractionUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEtatInteraction, etatInteraction),
            getPersistedEtatInteraction(etatInteraction)
        );
    }

    @Test
    @Transactional
    void fullUpdateEtatInteractionWithPatch() throws Exception {
        // Initialize the database
        insertedEtatInteraction = etatInteractionRepository.saveAndFlush(etatInteraction);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etatInteraction using partial update
        EtatInteraction partialUpdatedEtatInteraction = new EtatInteraction();
        partialUpdatedEtatInteraction.setId(etatInteraction.getId());

        partialUpdatedEtatInteraction.etat(UPDATED_ETAT).dateEtat(UPDATED_DATE_ETAT).agent(UPDATED_AGENT).observation(UPDATED_OBSERVATION);

        restEtatInteractionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtatInteraction.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEtatInteraction))
            )
            .andExpect(status().isOk());

        // Validate the EtatInteraction in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEtatInteractionUpdatableFieldsEquals(
            partialUpdatedEtatInteraction,
            getPersistedEtatInteraction(partialUpdatedEtatInteraction)
        );
    }

    @Test
    @Transactional
    void patchNonExistingEtatInteraction() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etatInteraction.setId(longCount.incrementAndGet());

        // Create the EtatInteraction
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtatInteractionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etatInteractionDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(etatInteractionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatInteraction in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtatInteraction() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etatInteraction.setId(longCount.incrementAndGet());

        // Create the EtatInteraction
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtatInteractionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(etatInteractionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatInteraction in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtatInteraction() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etatInteraction.setId(longCount.incrementAndGet());

        // Create the EtatInteraction
        EtatInteractionDTO etatInteractionDTO = etatInteractionMapper.toDto(etatInteraction);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtatInteractionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(etatInteractionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtatInteraction in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtatInteraction() throws Exception {
        // Initialize the database
        insertedEtatInteraction = etatInteractionRepository.saveAndFlush(etatInteraction);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the etatInteraction
        restEtatInteractionMockMvc
            .perform(delete(ENTITY_API_URL_ID, etatInteraction.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return etatInteractionRepository.count();
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

    protected EtatInteraction getPersistedEtatInteraction(EtatInteraction etatInteraction) {
        return etatInteractionRepository.findById(etatInteraction.getId()).orElseThrow();
    }

    protected void assertPersistedEtatInteractionToMatchAllProperties(EtatInteraction expectedEtatInteraction) {
        assertEtatInteractionAllPropertiesEquals(expectedEtatInteraction, getPersistedEtatInteraction(expectedEtatInteraction));
    }

    protected void assertPersistedEtatInteractionToMatchUpdatableProperties(EtatInteraction expectedEtatInteraction) {
        assertEtatInteractionAllUpdatablePropertiesEquals(expectedEtatInteraction, getPersistedEtatInteraction(expectedEtatInteraction));
    }
}
