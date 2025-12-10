package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.LangueAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.Langue;
import com.ultex.crm.repository.LangueRepository;
import com.ultex.crm.service.dto.LangueDTO;
import com.ultex.crm.service.mapper.LangueMapper;
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
 * Integration tests for the {@link LangueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LangueResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/langues";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LangueRepository langueRepository;

    @Autowired
    private LangueMapper langueMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLangueMockMvc;

    private Langue langue;

    private Langue insertedLangue;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Langue createEntity() {
        return new Langue().code(DEFAULT_CODE).nom(DEFAULT_NOM);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Langue createUpdatedEntity() {
        return new Langue().code(UPDATED_CODE).nom(UPDATED_NOM);
    }

    @BeforeEach
    void initTest() {
        langue = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedLangue != null) {
            langueRepository.delete(insertedLangue);
            insertedLangue = null;
        }
    }

    @Test
    @Transactional
    void createLangue() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Langue
        LangueDTO langueDTO = langueMapper.toDto(langue);
        var returnedLangueDTO = om.readValue(
            restLangueMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(langueDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            LangueDTO.class
        );

        // Validate the Langue in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedLangue = langueMapper.toEntity(returnedLangueDTO);
        assertLangueUpdatableFieldsEquals(returnedLangue, getPersistedLangue(returnedLangue));

        insertedLangue = returnedLangue;
    }

    @Test
    @Transactional
    void createLangueWithExistingId() throws Exception {
        // Create the Langue with an existing ID
        langue.setId(1L);
        LangueDTO langueDTO = langueMapper.toDto(langue);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLangueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(langueDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Langue in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        langue.setCode(null);

        // Create the Langue, which fails.
        LangueDTO langueDTO = langueMapper.toDto(langue);

        restLangueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(langueDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        langue.setNom(null);

        // Create the Langue, which fails.
        LangueDTO langueDTO = langueMapper.toDto(langue);

        restLangueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(langueDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLangues() throws Exception {
        // Initialize the database
        insertedLangue = langueRepository.saveAndFlush(langue);

        // Get all the langueList
        restLangueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(langue.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)));
    }

    @Test
    @Transactional
    void getLangue() throws Exception {
        // Initialize the database
        insertedLangue = langueRepository.saveAndFlush(langue);

        // Get the langue
        restLangueMockMvc
            .perform(get(ENTITY_API_URL_ID, langue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(langue.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM));
    }

    @Test
    @Transactional
    void getNonExistingLangue() throws Exception {
        // Get the langue
        restLangueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLangue() throws Exception {
        // Initialize the database
        insertedLangue = langueRepository.saveAndFlush(langue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the langue
        Langue updatedLangue = langueRepository.findById(langue.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLangue are not directly saved in db
        em.detach(updatedLangue);
        updatedLangue.code(UPDATED_CODE).nom(UPDATED_NOM);
        LangueDTO langueDTO = langueMapper.toDto(updatedLangue);

        restLangueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, langueDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(langueDTO))
            )
            .andExpect(status().isOk());

        // Validate the Langue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLangueToMatchAllProperties(updatedLangue);
    }

    @Test
    @Transactional
    void putNonExistingLangue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        langue.setId(longCount.incrementAndGet());

        // Create the Langue
        LangueDTO langueDTO = langueMapper.toDto(langue);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLangueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, langueDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(langueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Langue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLangue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        langue.setId(longCount.incrementAndGet());

        // Create the Langue
        LangueDTO langueDTO = langueMapper.toDto(langue);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLangueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(langueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Langue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLangue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        langue.setId(longCount.incrementAndGet());

        // Create the Langue
        LangueDTO langueDTO = langueMapper.toDto(langue);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLangueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(langueDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Langue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLangueWithPatch() throws Exception {
        // Initialize the database
        insertedLangue = langueRepository.saveAndFlush(langue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the langue using partial update
        Langue partialUpdatedLangue = new Langue();
        partialUpdatedLangue.setId(langue.getId());

        restLangueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLangue.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLangue))
            )
            .andExpect(status().isOk());

        // Validate the Langue in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLangueUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedLangue, langue), getPersistedLangue(langue));
    }

    @Test
    @Transactional
    void fullUpdateLangueWithPatch() throws Exception {
        // Initialize the database
        insertedLangue = langueRepository.saveAndFlush(langue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the langue using partial update
        Langue partialUpdatedLangue = new Langue();
        partialUpdatedLangue.setId(langue.getId());

        partialUpdatedLangue.code(UPDATED_CODE).nom(UPDATED_NOM);

        restLangueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLangue.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLangue))
            )
            .andExpect(status().isOk());

        // Validate the Langue in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLangueUpdatableFieldsEquals(partialUpdatedLangue, getPersistedLangue(partialUpdatedLangue));
    }

    @Test
    @Transactional
    void patchNonExistingLangue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        langue.setId(longCount.incrementAndGet());

        // Create the Langue
        LangueDTO langueDTO = langueMapper.toDto(langue);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLangueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, langueDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(langueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Langue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLangue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        langue.setId(longCount.incrementAndGet());

        // Create the Langue
        LangueDTO langueDTO = langueMapper.toDto(langue);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLangueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(langueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Langue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLangue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        langue.setId(longCount.incrementAndGet());

        // Create the Langue
        LangueDTO langueDTO = langueMapper.toDto(langue);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLangueMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(langueDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Langue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLangue() throws Exception {
        // Initialize the database
        insertedLangue = langueRepository.saveAndFlush(langue);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the langue
        restLangueMockMvc
            .perform(delete(ENTITY_API_URL_ID, langue.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return langueRepository.count();
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

    protected Langue getPersistedLangue(Langue langue) {
        return langueRepository.findById(langue.getId()).orElseThrow();
    }

    protected void assertPersistedLangueToMatchAllProperties(Langue expectedLangue) {
        assertLangueAllPropertiesEquals(expectedLangue, getPersistedLangue(expectedLangue));
    }

    protected void assertPersistedLangueToMatchUpdatableProperties(Langue expectedLangue) {
        assertLangueAllUpdatablePropertiesEquals(expectedLangue, getPersistedLangue(expectedLangue));
    }
}
