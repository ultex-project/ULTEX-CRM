package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.RappelAgentAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.RappelAgent;
import com.ultex.crm.domain.enumeration.StatutRappel;
import com.ultex.crm.repository.RappelAgentRepository;
import com.ultex.crm.service.dto.RappelAgentDTO;
import com.ultex.crm.service.mapper.RappelAgentMapper;
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
 * Integration tests for the {@link RappelAgentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RappelAgentResourceIT {

    private static final Instant DEFAULT_RAPPEL_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_RAPPEL_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_RAPPEL_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_RAPPEL_MESSAGE = "BBBBBBBBBB";

    private static final StatutRappel DEFAULT_STATUT_RAPPEL = StatutRappel.PENDING;
    private static final StatutRappel UPDATED_STATUT_RAPPEL = StatutRappel.DONE;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/rappel-agents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RappelAgentRepository rappelAgentRepository;

    @Autowired
    private RappelAgentMapper rappelAgentMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRappelAgentMockMvc;

    private RappelAgent rappelAgent;

    private RappelAgent insertedRappelAgent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RappelAgent createEntity() {
        return new RappelAgent()
            .rappelDate(DEFAULT_RAPPEL_DATE)
            .rappelMessage(DEFAULT_RAPPEL_MESSAGE)
            .statutRappel(DEFAULT_STATUT_RAPPEL)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RappelAgent createUpdatedEntity() {
        return new RappelAgent()
            .rappelDate(UPDATED_RAPPEL_DATE)
            .rappelMessage(UPDATED_RAPPEL_MESSAGE)
            .statutRappel(UPDATED_STATUT_RAPPEL)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
    }

    @BeforeEach
    void initTest() {
        rappelAgent = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedRappelAgent != null) {
            rappelAgentRepository.delete(insertedRappelAgent);
            insertedRappelAgent = null;
        }
    }

    @Test
    @Transactional
    void createRappelAgent() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the RappelAgent
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);
        var returnedRappelAgentDTO = om.readValue(
            restRappelAgentMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rappelAgentDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            RappelAgentDTO.class
        );

        // Validate the RappelAgent in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedRappelAgent = rappelAgentMapper.toEntity(returnedRappelAgentDTO);
        assertRappelAgentUpdatableFieldsEquals(returnedRappelAgent, getPersistedRappelAgent(returnedRappelAgent));

        insertedRappelAgent = returnedRappelAgent;
    }

    @Test
    @Transactional
    void createRappelAgentWithExistingId() throws Exception {
        // Create the RappelAgent with an existing ID
        rappelAgent.setId(1L);
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRappelAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rappelAgentDTO)))
            .andExpect(status().isBadRequest());

        // Validate the RappelAgent in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRappelDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        rappelAgent.setRappelDate(null);

        // Create the RappelAgent, which fails.
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        restRappelAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rappelAgentDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatutRappelIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        rappelAgent.setStatutRappel(null);

        // Create the RappelAgent, which fails.
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        restRappelAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rappelAgentDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRappelAgents() throws Exception {
        // Initialize the database
        insertedRappelAgent = rappelAgentRepository.saveAndFlush(rappelAgent);

        // Get all the rappelAgentList
        restRappelAgentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rappelAgent.getId().intValue())))
            .andExpect(jsonPath("$.[*].rappelDate").value(hasItem(DEFAULT_RAPPEL_DATE.toString())))
            .andExpect(jsonPath("$.[*].rappelMessage").value(hasItem(DEFAULT_RAPPEL_MESSAGE)))
            .andExpect(jsonPath("$.[*].statutRappel").value(hasItem(DEFAULT_STATUT_RAPPEL.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @Test
    @Transactional
    void getRappelAgent() throws Exception {
        // Initialize the database
        insertedRappelAgent = rappelAgentRepository.saveAndFlush(rappelAgent);

        // Get the rappelAgent
        restRappelAgentMockMvc
            .perform(get(ENTITY_API_URL_ID, rappelAgent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rappelAgent.getId().intValue()))
            .andExpect(jsonPath("$.rappelDate").value(DEFAULT_RAPPEL_DATE.toString()))
            .andExpect(jsonPath("$.rappelMessage").value(DEFAULT_RAPPEL_MESSAGE))
            .andExpect(jsonPath("$.statutRappel").value(DEFAULT_STATUT_RAPPEL.toString()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingRappelAgent() throws Exception {
        // Get the rappelAgent
        restRappelAgentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRappelAgent() throws Exception {
        // Initialize the database
        insertedRappelAgent = rappelAgentRepository.saveAndFlush(rappelAgent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rappelAgent
        RappelAgent updatedRappelAgent = rappelAgentRepository.findById(rappelAgent.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRappelAgent are not directly saved in db
        em.detach(updatedRappelAgent);
        updatedRappelAgent
            .rappelDate(UPDATED_RAPPEL_DATE)
            .rappelMessage(UPDATED_RAPPEL_MESSAGE)
            .statutRappel(UPDATED_STATUT_RAPPEL)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(updatedRappelAgent);

        restRappelAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rappelAgentDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(rappelAgentDTO))
            )
            .andExpect(status().isOk());

        // Validate the RappelAgent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRappelAgentToMatchAllProperties(updatedRappelAgent);
    }

    @Test
    @Transactional
    void putNonExistingRappelAgent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rappelAgent.setId(longCount.incrementAndGet());

        // Create the RappelAgent
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRappelAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rappelAgentDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(rappelAgentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RappelAgent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRappelAgent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rappelAgent.setId(longCount.incrementAndGet());

        // Create the RappelAgent
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRappelAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(rappelAgentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RappelAgent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRappelAgent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rappelAgent.setId(longCount.incrementAndGet());

        // Create the RappelAgent
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRappelAgentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rappelAgentDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RappelAgent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRappelAgentWithPatch() throws Exception {
        // Initialize the database
        insertedRappelAgent = rappelAgentRepository.saveAndFlush(rappelAgent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rappelAgent using partial update
        RappelAgent partialUpdatedRappelAgent = new RappelAgent();
        partialUpdatedRappelAgent.setId(rappelAgent.getId());

        partialUpdatedRappelAgent.rappelDate(UPDATED_RAPPEL_DATE).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restRappelAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRappelAgent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRappelAgent))
            )
            .andExpect(status().isOk());

        // Validate the RappelAgent in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRappelAgentUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedRappelAgent, rappelAgent),
            getPersistedRappelAgent(rappelAgent)
        );
    }

    @Test
    @Transactional
    void fullUpdateRappelAgentWithPatch() throws Exception {
        // Initialize the database
        insertedRappelAgent = rappelAgentRepository.saveAndFlush(rappelAgent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rappelAgent using partial update
        RappelAgent partialUpdatedRappelAgent = new RappelAgent();
        partialUpdatedRappelAgent.setId(rappelAgent.getId());

        partialUpdatedRappelAgent
            .rappelDate(UPDATED_RAPPEL_DATE)
            .rappelMessage(UPDATED_RAPPEL_MESSAGE)
            .statutRappel(UPDATED_STATUT_RAPPEL)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restRappelAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRappelAgent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRappelAgent))
            )
            .andExpect(status().isOk());

        // Validate the RappelAgent in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRappelAgentUpdatableFieldsEquals(partialUpdatedRappelAgent, getPersistedRappelAgent(partialUpdatedRappelAgent));
    }

    @Test
    @Transactional
    void patchNonExistingRappelAgent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rappelAgent.setId(longCount.incrementAndGet());

        // Create the RappelAgent
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRappelAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rappelAgentDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(rappelAgentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RappelAgent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRappelAgent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rappelAgent.setId(longCount.incrementAndGet());

        // Create the RappelAgent
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRappelAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(rappelAgentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RappelAgent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRappelAgent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rappelAgent.setId(longCount.incrementAndGet());

        // Create the RappelAgent
        RappelAgentDTO rappelAgentDTO = rappelAgentMapper.toDto(rappelAgent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRappelAgentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(rappelAgentDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RappelAgent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRappelAgent() throws Exception {
        // Initialize the database
        insertedRappelAgent = rappelAgentRepository.saveAndFlush(rappelAgent);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the rappelAgent
        restRappelAgentMockMvc
            .perform(delete(ENTITY_API_URL_ID, rappelAgent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return rappelAgentRepository.count();
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

    protected RappelAgent getPersistedRappelAgent(RappelAgent rappelAgent) {
        return rappelAgentRepository.findById(rappelAgent.getId()).orElseThrow();
    }

    protected void assertPersistedRappelAgentToMatchAllProperties(RappelAgent expectedRappelAgent) {
        assertRappelAgentAllPropertiesEquals(expectedRappelAgent, getPersistedRappelAgent(expectedRappelAgent));
    }

    protected void assertPersistedRappelAgentToMatchUpdatableProperties(RappelAgent expectedRappelAgent) {
        assertRappelAgentAllUpdatablePropertiesEquals(expectedRappelAgent, getPersistedRappelAgent(expectedRappelAgent));
    }
}
