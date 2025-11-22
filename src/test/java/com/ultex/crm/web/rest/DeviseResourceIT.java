package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.DeviseAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.Devise;
import com.ultex.crm.repository.DeviseRepository;
import com.ultex.crm.service.dto.DeviseDTO;
import com.ultex.crm.service.mapper.DeviseMapper;
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
 * Integration tests for the {@link DeviseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DeviseResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM_COMPLET = "AAAAAAAAAA";
    private static final String UPDATED_NOM_COMPLET = "BBBBBBBBBB";

    private static final String DEFAULT_SYMBOLE = "AAAAAAAAAA";
    private static final String UPDATED_SYMBOLE = "BBBBBBBBBB";

    private static final String DEFAULT_PAYS = "AAAAAAAAAA";
    private static final String UPDATED_PAYS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/devises";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DeviseRepository deviseRepository;

    @Autowired
    private DeviseMapper deviseMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDeviseMockMvc;

    private Devise devise;

    private Devise insertedDevise;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Devise createEntity() {
        return new Devise().code(DEFAULT_CODE).nomComplet(DEFAULT_NOM_COMPLET).symbole(DEFAULT_SYMBOLE).pays(DEFAULT_PAYS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Devise createUpdatedEntity() {
        return new Devise().code(UPDATED_CODE).nomComplet(UPDATED_NOM_COMPLET).symbole(UPDATED_SYMBOLE).pays(UPDATED_PAYS);
    }

    @BeforeEach
    void initTest() {
        devise = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedDevise != null) {
            deviseRepository.delete(insertedDevise);
            insertedDevise = null;
        }
    }

    @Test
    @Transactional
    void createDevise() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Devise
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);
        var returnedDeviseDTO = om.readValue(
            restDeviseMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deviseDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            DeviseDTO.class
        );

        // Validate the Devise in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedDevise = deviseMapper.toEntity(returnedDeviseDTO);
        assertDeviseUpdatableFieldsEquals(returnedDevise, getPersistedDevise(returnedDevise));

        insertedDevise = returnedDevise;
    }

    @Test
    @Transactional
    void createDeviseWithExistingId() throws Exception {
        // Create the Devise with an existing ID
        devise.setId(1L);
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeviseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deviseDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Devise in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        devise.setCode(null);

        // Create the Devise, which fails.
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        restDeviseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deviseDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNomCompletIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        devise.setNomComplet(null);

        // Create the Devise, which fails.
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        restDeviseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deviseDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDevises() throws Exception {
        // Initialize the database
        insertedDevise = deviseRepository.saveAndFlush(devise);

        // Get all the deviseList
        restDeviseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(devise.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].nomComplet").value(hasItem(DEFAULT_NOM_COMPLET)))
            .andExpect(jsonPath("$.[*].symbole").value(hasItem(DEFAULT_SYMBOLE)))
            .andExpect(jsonPath("$.[*].pays").value(hasItem(DEFAULT_PAYS)));
    }

    @Test
    @Transactional
    void getDevise() throws Exception {
        // Initialize the database
        insertedDevise = deviseRepository.saveAndFlush(devise);

        // Get the devise
        restDeviseMockMvc
            .perform(get(ENTITY_API_URL_ID, devise.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(devise.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.nomComplet").value(DEFAULT_NOM_COMPLET))
            .andExpect(jsonPath("$.symbole").value(DEFAULT_SYMBOLE))
            .andExpect(jsonPath("$.pays").value(DEFAULT_PAYS));
    }

    @Test
    @Transactional
    void getNonExistingDevise() throws Exception {
        // Get the devise
        restDeviseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDevise() throws Exception {
        // Initialize the database
        insertedDevise = deviseRepository.saveAndFlush(devise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the devise
        Devise updatedDevise = deviseRepository.findById(devise.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDevise are not directly saved in db
        em.detach(updatedDevise);
        updatedDevise.code(UPDATED_CODE).nomComplet(UPDATED_NOM_COMPLET).symbole(UPDATED_SYMBOLE).pays(UPDATED_PAYS);
        DeviseDTO deviseDTO = deviseMapper.toDto(updatedDevise);

        restDeviseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, deviseDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deviseDTO))
            )
            .andExpect(status().isOk());

        // Validate the Devise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDeviseToMatchAllProperties(updatedDevise);
    }

    @Test
    @Transactional
    void putNonExistingDevise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        devise.setId(longCount.incrementAndGet());

        // Create the Devise
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeviseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, deviseDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deviseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Devise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDevise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        devise.setId(longCount.incrementAndGet());

        // Create the Devise
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeviseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(deviseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Devise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDevise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        devise.setId(longCount.incrementAndGet());

        // Create the Devise
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeviseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deviseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Devise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDeviseWithPatch() throws Exception {
        // Initialize the database
        insertedDevise = deviseRepository.saveAndFlush(devise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the devise using partial update
        Devise partialUpdatedDevise = new Devise();
        partialUpdatedDevise.setId(devise.getId());

        partialUpdatedDevise.code(UPDATED_CODE).symbole(UPDATED_SYMBOLE);

        restDeviseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDevise.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDevise))
            )
            .andExpect(status().isOk());

        // Validate the Devise in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDeviseUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedDevise, devise), getPersistedDevise(devise));
    }

    @Test
    @Transactional
    void fullUpdateDeviseWithPatch() throws Exception {
        // Initialize the database
        insertedDevise = deviseRepository.saveAndFlush(devise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the devise using partial update
        Devise partialUpdatedDevise = new Devise();
        partialUpdatedDevise.setId(devise.getId());

        partialUpdatedDevise.code(UPDATED_CODE).nomComplet(UPDATED_NOM_COMPLET).symbole(UPDATED_SYMBOLE).pays(UPDATED_PAYS);

        restDeviseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDevise.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDevise))
            )
            .andExpect(status().isOk());

        // Validate the Devise in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDeviseUpdatableFieldsEquals(partialUpdatedDevise, getPersistedDevise(partialUpdatedDevise));
    }

    @Test
    @Transactional
    void patchNonExistingDevise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        devise.setId(longCount.incrementAndGet());

        // Create the Devise
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeviseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, deviseDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(deviseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Devise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDevise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        devise.setId(longCount.incrementAndGet());

        // Create the Devise
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeviseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(deviseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Devise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDevise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        devise.setId(longCount.incrementAndGet());

        // Create the Devise
        DeviseDTO deviseDTO = deviseMapper.toDto(devise);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeviseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(deviseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Devise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDevise() throws Exception {
        // Initialize the database
        insertedDevise = deviseRepository.saveAndFlush(devise);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the devise
        restDeviseMockMvc
            .perform(delete(ENTITY_API_URL_ID, devise.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return deviseRepository.count();
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

    protected Devise getPersistedDevise(Devise devise) {
        return deviseRepository.findById(devise.getId()).orElseThrow();
    }

    protected void assertPersistedDeviseToMatchAllProperties(Devise expectedDevise) {
        assertDeviseAllPropertiesEquals(expectedDevise, getPersistedDevise(expectedDevise));
    }

    protected void assertPersistedDeviseToMatchUpdatableProperties(Devise expectedDevise) {
        assertDeviseAllUpdatablePropertiesEquals(expectedDevise, getPersistedDevise(expectedDevise));
    }
}
