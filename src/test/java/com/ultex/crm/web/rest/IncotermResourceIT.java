package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.IncotermAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.Incoterm;
import com.ultex.crm.repository.IncotermRepository;
import com.ultex.crm.service.dto.IncotermDTO;
import com.ultex.crm.service.mapper.IncotermMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link IncotermResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IncotermResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/incoterms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private IncotermRepository incotermRepository;

    @Autowired
    private IncotermMapper incotermMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIncotermMockMvc;

    private Incoterm incoterm;

    private Incoterm insertedIncoterm;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Incoterm createEntity() {
        return new Incoterm().code(DEFAULT_CODE).description(DEFAULT_DESCRIPTION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Incoterm createUpdatedEntity() {
        return new Incoterm().code(UPDATED_CODE).description(UPDATED_DESCRIPTION);
    }

    @BeforeEach
    void initTest() {
        incoterm = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedIncoterm != null) {
            incotermRepository.delete(insertedIncoterm);
            insertedIncoterm = null;
        }
    }

    @Test
    @Transactional
    void createIncoterm() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Incoterm
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);
        var returnedIncotermDTO = om.readValue(
            restIncotermMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(incotermDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            IncotermDTO.class
        );

        // Validate the Incoterm in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedIncoterm = incotermMapper.toEntity(returnedIncotermDTO);
        assertIncotermUpdatableFieldsEquals(returnedIncoterm, getPersistedIncoterm(returnedIncoterm));

        insertedIncoterm = returnedIncoterm;
    }

    @Test
    @Transactional
    void createIncotermWithExistingId() throws Exception {
        // Create the Incoterm with an existing ID
        incoterm.setId(1L);
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIncotermMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(incotermDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Incoterm in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        incoterm.setCode(null);

        // Create the Incoterm, which fails.
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        restIncotermMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(incotermDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        incoterm.setDescription(null);

        // Create the Incoterm, which fails.
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        restIncotermMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(incotermDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIncoterms() throws Exception {
        // Initialize the database
        insertedIncoterm = incotermRepository.saveAndFlush(incoterm);

        // Get all the incotermList
        restIncotermMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(incoterm.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getIncoterm() throws Exception {
        // Initialize the database
        insertedIncoterm = incotermRepository.saveAndFlush(incoterm);

        // Get the incoterm
        restIncotermMockMvc
            .perform(get(ENTITY_API_URL_ID, incoterm.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(incoterm.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingIncoterm() throws Exception {
        // Get the incoterm
        restIncotermMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingIncoterm() throws Exception {
        // Initialize the database
        insertedIncoterm = incotermRepository.saveAndFlush(incoterm);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the incoterm
        Incoterm updatedIncoterm = incotermRepository.findById(incoterm.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedIncoterm are not directly saved in db
        em.detach(updatedIncoterm);
        updatedIncoterm.code(UPDATED_CODE).description(UPDATED_DESCRIPTION);
        IncotermDTO incotermDTO = incotermMapper.toDto(updatedIncoterm);

        restIncotermMockMvc
            .perform(
                put(ENTITY_API_URL_ID, incotermDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(incotermDTO))
            )
            .andExpect(status().isOk());

        // Validate the Incoterm in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedIncotermToMatchAllProperties(updatedIncoterm);
    }

    @Test
    @Transactional
    void putNonExistingIncoterm() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        incoterm.setId(longCount.incrementAndGet());

        // Create the Incoterm
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncotermMockMvc
            .perform(
                put(ENTITY_API_URL_ID, incotermDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(incotermDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incoterm in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIncoterm() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        incoterm.setId(longCount.incrementAndGet());

        // Create the Incoterm
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncotermMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(incotermDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incoterm in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIncoterm() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        incoterm.setId(longCount.incrementAndGet());

        // Create the Incoterm
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncotermMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(incotermDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Incoterm in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIncotermWithPatch() throws Exception {
        // Initialize the database
        insertedIncoterm = incotermRepository.saveAndFlush(incoterm);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the incoterm using partial update
        Incoterm partialUpdatedIncoterm = new Incoterm();
        partialUpdatedIncoterm.setId(incoterm.getId());

        partialUpdatedIncoterm.description(UPDATED_DESCRIPTION);

        restIncotermMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIncoterm.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedIncoterm))
            )
            .andExpect(status().isOk());

        // Validate the Incoterm in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertIncotermUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedIncoterm, incoterm), getPersistedIncoterm(incoterm));
    }

    @Test
    @Transactional
    void fullUpdateIncotermWithPatch() throws Exception {
        // Initialize the database
        insertedIncoterm = incotermRepository.saveAndFlush(incoterm);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the incoterm using partial update
        Incoterm partialUpdatedIncoterm = new Incoterm();
        partialUpdatedIncoterm.setId(incoterm.getId());

        partialUpdatedIncoterm.code(UPDATED_CODE).description(UPDATED_DESCRIPTION);

        restIncotermMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIncoterm.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedIncoterm))
            )
            .andExpect(status().isOk());

        // Validate the Incoterm in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertIncotermUpdatableFieldsEquals(partialUpdatedIncoterm, getPersistedIncoterm(partialUpdatedIncoterm));
    }

    @Test
    @Transactional
    void patchNonExistingIncoterm() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        incoterm.setId(longCount.incrementAndGet());

        // Create the Incoterm
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncotermMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, incotermDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(incotermDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incoterm in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIncoterm() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        incoterm.setId(longCount.incrementAndGet());

        // Create the Incoterm
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncotermMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(incotermDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incoterm in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIncoterm() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        incoterm.setId(longCount.incrementAndGet());

        // Create the Incoterm
        IncotermDTO incotermDTO = incotermMapper.toDto(incoterm);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncotermMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(incotermDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Incoterm in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIncoterm() throws Exception {
        // Initialize the database
        insertedIncoterm = incotermRepository.saveAndFlush(incoterm);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the incoterm
        restIncotermMockMvc
            .perform(delete(ENTITY_API_URL_ID, incoterm.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return incotermRepository.count();
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

    protected Incoterm getPersistedIncoterm(Incoterm incoterm) {
        return incotermRepository.findById(incoterm.getId()).orElseThrow();
    }

    protected void assertPersistedIncotermToMatchAllProperties(Incoterm expectedIncoterm) {
        assertIncotermAllPropertiesEquals(expectedIncoterm, getPersistedIncoterm(expectedIncoterm));
    }

    protected void assertPersistedIncotermToMatchUpdatableProperties(Incoterm expectedIncoterm) {
        assertIncotermAllUpdatablePropertiesEquals(expectedIncoterm, getPersistedIncoterm(expectedIncoterm));
    }
}
