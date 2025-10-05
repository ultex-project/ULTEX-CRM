package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.HistoriqueCRMAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.HistoriqueCRM;
import com.ultex.crm.repository.HistoriqueCRMRepository;
import com.ultex.crm.service.dto.HistoriqueCRMDTO;
import com.ultex.crm.service.mapper.HistoriqueCRMMapper;
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
 * Integration tests for the {@link HistoriqueCRMResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HistoriqueCRMResourceIT {

    private static final Instant DEFAULT_DATE_INTERACTION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_INTERACTION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CANAL = "AAAAAAAAAA";
    private static final String UPDATED_CANAL = "BBBBBBBBBB";

    private static final String DEFAULT_AGENT = "AAAAAAAAAA";
    private static final String UPDATED_AGENT = "BBBBBBBBBB";

    private static final String DEFAULT_RESUME = "AAAAAAAAAA";
    private static final String UPDATED_RESUME = "BBBBBBBBBB";

    private static final String DEFAULT_ETAT = "AAAAAAAAAA";
    private static final String UPDATED_ETAT = "BBBBBBBBBB";

    private static final String DEFAULT_OBSERVATION = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/historique-crms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private HistoriqueCRMRepository historiqueCRMRepository;

    @Autowired
    private HistoriqueCRMMapper historiqueCRMMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHistoriqueCRMMockMvc;

    private HistoriqueCRM historiqueCRM;

    private HistoriqueCRM insertedHistoriqueCRM;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistoriqueCRM createEntity() {
        return new HistoriqueCRM()
            .dateInteraction(DEFAULT_DATE_INTERACTION)
            .canal(DEFAULT_CANAL)
            .agent(DEFAULT_AGENT)
            .resume(DEFAULT_RESUME)
            .etat(DEFAULT_ETAT)
            .observation(DEFAULT_OBSERVATION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistoriqueCRM createUpdatedEntity() {
        return new HistoriqueCRM()
            .dateInteraction(UPDATED_DATE_INTERACTION)
            .canal(UPDATED_CANAL)
            .agent(UPDATED_AGENT)
            .resume(UPDATED_RESUME)
            .etat(UPDATED_ETAT)
            .observation(UPDATED_OBSERVATION);
    }

    @BeforeEach
    void initTest() {
        historiqueCRM = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedHistoriqueCRM != null) {
            historiqueCRMRepository.delete(insertedHistoriqueCRM);
            insertedHistoriqueCRM = null;
        }
    }

    @Test
    @Transactional
    void createHistoriqueCRM() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the HistoriqueCRM
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);
        var returnedHistoriqueCRMDTO = om.readValue(
            restHistoriqueCRMMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(historiqueCRMDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            HistoriqueCRMDTO.class
        );

        // Validate the HistoriqueCRM in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedHistoriqueCRM = historiqueCRMMapper.toEntity(returnedHistoriqueCRMDTO);
        assertHistoriqueCRMUpdatableFieldsEquals(returnedHistoriqueCRM, getPersistedHistoriqueCRM(returnedHistoriqueCRM));

        insertedHistoriqueCRM = returnedHistoriqueCRM;
    }

    @Test
    @Transactional
    void createHistoriqueCRMWithExistingId() throws Exception {
        // Create the HistoriqueCRM with an existing ID
        historiqueCRM.setId(1L);
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHistoriqueCRMMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(historiqueCRMDTO)))
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueCRM in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateInteractionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        historiqueCRM.setDateInteraction(null);

        // Create the HistoriqueCRM, which fails.
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);

        restHistoriqueCRMMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(historiqueCRMDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHistoriqueCRMS() throws Exception {
        // Initialize the database
        insertedHistoriqueCRM = historiqueCRMRepository.saveAndFlush(historiqueCRM);

        // Get all the historiqueCRMList
        restHistoriqueCRMMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(historiqueCRM.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateInteraction").value(hasItem(DEFAULT_DATE_INTERACTION.toString())))
            .andExpect(jsonPath("$.[*].canal").value(hasItem(DEFAULT_CANAL)))
            .andExpect(jsonPath("$.[*].agent").value(hasItem(DEFAULT_AGENT)))
            .andExpect(jsonPath("$.[*].resume").value(hasItem(DEFAULT_RESUME)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT)))
            .andExpect(jsonPath("$.[*].observation").value(hasItem(DEFAULT_OBSERVATION)));
    }

    @Test
    @Transactional
    void getHistoriqueCRM() throws Exception {
        // Initialize the database
        insertedHistoriqueCRM = historiqueCRMRepository.saveAndFlush(historiqueCRM);

        // Get the historiqueCRM
        restHistoriqueCRMMockMvc
            .perform(get(ENTITY_API_URL_ID, historiqueCRM.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(historiqueCRM.getId().intValue()))
            .andExpect(jsonPath("$.dateInteraction").value(DEFAULT_DATE_INTERACTION.toString()))
            .andExpect(jsonPath("$.canal").value(DEFAULT_CANAL))
            .andExpect(jsonPath("$.agent").value(DEFAULT_AGENT))
            .andExpect(jsonPath("$.resume").value(DEFAULT_RESUME))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT))
            .andExpect(jsonPath("$.observation").value(DEFAULT_OBSERVATION));
    }

    @Test
    @Transactional
    void getNonExistingHistoriqueCRM() throws Exception {
        // Get the historiqueCRM
        restHistoriqueCRMMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHistoriqueCRM() throws Exception {
        // Initialize the database
        insertedHistoriqueCRM = historiqueCRMRepository.saveAndFlush(historiqueCRM);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the historiqueCRM
        HistoriqueCRM updatedHistoriqueCRM = historiqueCRMRepository.findById(historiqueCRM.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedHistoriqueCRM are not directly saved in db
        em.detach(updatedHistoriqueCRM);
        updatedHistoriqueCRM
            .dateInteraction(UPDATED_DATE_INTERACTION)
            .canal(UPDATED_CANAL)
            .agent(UPDATED_AGENT)
            .resume(UPDATED_RESUME)
            .etat(UPDATED_ETAT)
            .observation(UPDATED_OBSERVATION);
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(updatedHistoriqueCRM);

        restHistoriqueCRMMockMvc
            .perform(
                put(ENTITY_API_URL_ID, historiqueCRMDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(historiqueCRMDTO))
            )
            .andExpect(status().isOk());

        // Validate the HistoriqueCRM in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedHistoriqueCRMToMatchAllProperties(updatedHistoriqueCRM);
    }

    @Test
    @Transactional
    void putNonExistingHistoriqueCRM() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        historiqueCRM.setId(longCount.incrementAndGet());

        // Create the HistoriqueCRM
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoriqueCRMMockMvc
            .perform(
                put(ENTITY_API_URL_ID, historiqueCRMDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(historiqueCRMDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueCRM in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHistoriqueCRM() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        historiqueCRM.setId(longCount.incrementAndGet());

        // Create the HistoriqueCRM
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoriqueCRMMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(historiqueCRMDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueCRM in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHistoriqueCRM() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        historiqueCRM.setId(longCount.incrementAndGet());

        // Create the HistoriqueCRM
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoriqueCRMMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(historiqueCRMDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HistoriqueCRM in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHistoriqueCRMWithPatch() throws Exception {
        // Initialize the database
        insertedHistoriqueCRM = historiqueCRMRepository.saveAndFlush(historiqueCRM);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the historiqueCRM using partial update
        HistoriqueCRM partialUpdatedHistoriqueCRM = new HistoriqueCRM();
        partialUpdatedHistoriqueCRM.setId(historiqueCRM.getId());

        partialUpdatedHistoriqueCRM.resume(UPDATED_RESUME);

        restHistoriqueCRMMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistoriqueCRM.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedHistoriqueCRM))
            )
            .andExpect(status().isOk());

        // Validate the HistoriqueCRM in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHistoriqueCRMUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedHistoriqueCRM, historiqueCRM),
            getPersistedHistoriqueCRM(historiqueCRM)
        );
    }

    @Test
    @Transactional
    void fullUpdateHistoriqueCRMWithPatch() throws Exception {
        // Initialize the database
        insertedHistoriqueCRM = historiqueCRMRepository.saveAndFlush(historiqueCRM);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the historiqueCRM using partial update
        HistoriqueCRM partialUpdatedHistoriqueCRM = new HistoriqueCRM();
        partialUpdatedHistoriqueCRM.setId(historiqueCRM.getId());

        partialUpdatedHistoriqueCRM
            .dateInteraction(UPDATED_DATE_INTERACTION)
            .canal(UPDATED_CANAL)
            .agent(UPDATED_AGENT)
            .resume(UPDATED_RESUME)
            .etat(UPDATED_ETAT)
            .observation(UPDATED_OBSERVATION);

        restHistoriqueCRMMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistoriqueCRM.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedHistoriqueCRM))
            )
            .andExpect(status().isOk());

        // Validate the HistoriqueCRM in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHistoriqueCRMUpdatableFieldsEquals(partialUpdatedHistoriqueCRM, getPersistedHistoriqueCRM(partialUpdatedHistoriqueCRM));
    }

    @Test
    @Transactional
    void patchNonExistingHistoriqueCRM() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        historiqueCRM.setId(longCount.incrementAndGet());

        // Create the HistoriqueCRM
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoriqueCRMMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, historiqueCRMDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(historiqueCRMDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueCRM in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHistoriqueCRM() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        historiqueCRM.setId(longCount.incrementAndGet());

        // Create the HistoriqueCRM
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoriqueCRMMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(historiqueCRMDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueCRM in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHistoriqueCRM() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        historiqueCRM.setId(longCount.incrementAndGet());

        // Create the HistoriqueCRM
        HistoriqueCRMDTO historiqueCRMDTO = historiqueCRMMapper.toDto(historiqueCRM);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoriqueCRMMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(historiqueCRMDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HistoriqueCRM in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHistoriqueCRM() throws Exception {
        // Initialize the database
        insertedHistoriqueCRM = historiqueCRMRepository.saveAndFlush(historiqueCRM);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the historiqueCRM
        restHistoriqueCRMMockMvc
            .perform(delete(ENTITY_API_URL_ID, historiqueCRM.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return historiqueCRMRepository.count();
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

    protected HistoriqueCRM getPersistedHistoriqueCRM(HistoriqueCRM historiqueCRM) {
        return historiqueCRMRepository.findById(historiqueCRM.getId()).orElseThrow();
    }

    protected void assertPersistedHistoriqueCRMToMatchAllProperties(HistoriqueCRM expectedHistoriqueCRM) {
        assertHistoriqueCRMAllPropertiesEquals(expectedHistoriqueCRM, getPersistedHistoriqueCRM(expectedHistoriqueCRM));
    }

    protected void assertPersistedHistoriqueCRMToMatchUpdatableProperties(HistoriqueCRM expectedHistoriqueCRM) {
        assertHistoriqueCRMAllUpdatablePropertiesEquals(expectedHistoriqueCRM, getPersistedHistoriqueCRM(expectedHistoriqueCRM));
    }
}
