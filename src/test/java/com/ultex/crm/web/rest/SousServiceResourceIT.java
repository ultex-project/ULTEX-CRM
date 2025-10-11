package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.SousServiceAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.SousService;
import com.ultex.crm.repository.SousServiceRepository;
import com.ultex.crm.service.dto.SousServiceDTO;
import com.ultex.crm.service.mapper.SousServiceMapper;
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
 * Integration tests for the {@link SousServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SousServiceResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sous-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SousServiceRepository sousServiceRepository;

    @Autowired
    private SousServiceMapper sousServiceMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSousServiceMockMvc;

    private SousService sousService;

    private SousService insertedSousService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SousService createEntity() {
        return new SousService().code(DEFAULT_CODE).libelle(DEFAULT_LIBELLE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SousService createUpdatedEntity() {
        return new SousService().code(UPDATED_CODE).libelle(UPDATED_LIBELLE);
    }

    @BeforeEach
    void initTest() {
        sousService = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedSousService != null) {
            sousServiceRepository.delete(insertedSousService);
            insertedSousService = null;
        }
    }

    @Test
    @Transactional
    void createSousService() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the SousService
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);
        var returnedSousServiceDTO = om.readValue(
            restSousServiceMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sousServiceDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            SousServiceDTO.class
        );

        // Validate the SousService in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedSousService = sousServiceMapper.toEntity(returnedSousServiceDTO);
        assertSousServiceUpdatableFieldsEquals(returnedSousService, getPersistedSousService(returnedSousService));

        insertedSousService = returnedSousService;
    }

    @Test
    @Transactional
    void createSousServiceWithExistingId() throws Exception {
        // Create the SousService with an existing ID
        sousService.setId(1L);
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSousServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sousServiceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        sousService.setCode(null);

        // Create the SousService, which fails.
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        restSousServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sousServiceDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLibelleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        sousService.setLibelle(null);

        // Create the SousService, which fails.
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        restSousServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sousServiceDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSousServices() throws Exception {
        // Initialize the database
        insertedSousService = sousServiceRepository.saveAndFlush(sousService);

        // Get all the sousServiceList
        restSousServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sousService.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }

    @Test
    @Transactional
    void getSousService() throws Exception {
        // Initialize the database
        insertedSousService = sousServiceRepository.saveAndFlush(sousService);

        // Get the sousService
        restSousServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, sousService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sousService.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE));
    }

    @Test
    @Transactional
    void getNonExistingSousService() throws Exception {
        // Get the sousService
        restSousServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSousService() throws Exception {
        // Initialize the database
        insertedSousService = sousServiceRepository.saveAndFlush(sousService);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sousService
        SousService updatedSousService = sousServiceRepository.findById(sousService.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSousService are not directly saved in db
        em.detach(updatedSousService);
        updatedSousService.code(UPDATED_CODE).libelle(UPDATED_LIBELLE);
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(updatedSousService);

        restSousServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sousServiceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sousServiceDTO))
            )
            .andExpect(status().isOk());

        // Validate the SousService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSousServiceToMatchAllProperties(updatedSousService);
    }

    @Test
    @Transactional
    void putNonExistingSousService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sousService.setId(longCount.incrementAndGet());

        // Create the SousService
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sousServiceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sousServiceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSousService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sousService.setId(longCount.incrementAndGet());

        // Create the SousService
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sousServiceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSousService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sousService.setId(longCount.incrementAndGet());

        // Create the SousService
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sousServiceDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SousService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSousServiceWithPatch() throws Exception {
        // Initialize the database
        insertedSousService = sousServiceRepository.saveAndFlush(sousService);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sousService using partial update
        SousService partialUpdatedSousService = new SousService();
        partialUpdatedSousService.setId(sousService.getId());

        partialUpdatedSousService.code(UPDATED_CODE);

        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSousService.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSousService))
            )
            .andExpect(status().isOk());

        // Validate the SousService in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSousServiceUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedSousService, sousService),
            getPersistedSousService(sousService)
        );
    }

    @Test
    @Transactional
    void fullUpdateSousServiceWithPatch() throws Exception {
        // Initialize the database
        insertedSousService = sousServiceRepository.saveAndFlush(sousService);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sousService using partial update
        SousService partialUpdatedSousService = new SousService();
        partialUpdatedSousService.setId(sousService.getId());

        partialUpdatedSousService.code(UPDATED_CODE).libelle(UPDATED_LIBELLE);

        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSousService.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSousService))
            )
            .andExpect(status().isOk());

        // Validate the SousService in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSousServiceUpdatableFieldsEquals(partialUpdatedSousService, getPersistedSousService(partialUpdatedSousService));
    }

    @Test
    @Transactional
    void patchNonExistingSousService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sousService.setId(longCount.incrementAndGet());

        // Create the SousService
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sousServiceDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sousServiceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSousService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sousService.setId(longCount.incrementAndGet());

        // Create the SousService
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sousServiceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSousService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sousService.setId(longCount.incrementAndGet());

        // Create the SousService
        SousServiceDTO sousServiceDTO = sousServiceMapper.toDto(sousService);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(sousServiceDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SousService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSousService() throws Exception {
        // Initialize the database
        insertedSousService = sousServiceRepository.saveAndFlush(sousService);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the sousService
        restSousServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, sousService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return sousServiceRepository.count();
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

    protected SousService getPersistedSousService(SousService sousService) {
        return sousServiceRepository.findById(sousService.getId()).orElseThrow();
    }

    protected void assertPersistedSousServiceToMatchAllProperties(SousService expectedSousService) {
        assertSousServiceAllPropertiesEquals(expectedSousService, getPersistedSousService(expectedSousService));
    }

    protected void assertPersistedSousServiceToMatchUpdatableProperties(SousService expectedSousService) {
        assertSousServiceAllUpdatablePropertiesEquals(expectedSousService, getPersistedSousService(expectedSousService));
    }
}
