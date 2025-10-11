package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.PaysAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.Pays;
import com.ultex.crm.repository.PaysRepository;
import com.ultex.crm.service.dto.PaysDTO;
import com.ultex.crm.service.mapper.PaysMapper;
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
 * Integration tests for the {@link PaysResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PaysResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_INDICATIF = "AAAAAAAAAA";
    private static final String UPDATED_INDICATIF = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/pays";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PaysRepository paysRepository;

    @Autowired
    private PaysMapper paysMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaysMockMvc;

    private Pays pays;

    private Pays insertedPays;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pays createEntity() {
        return new Pays().code(DEFAULT_CODE).nom(DEFAULT_NOM).indicatif(DEFAULT_INDICATIF);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pays createUpdatedEntity() {
        return new Pays().code(UPDATED_CODE).nom(UPDATED_NOM).indicatif(UPDATED_INDICATIF);
    }

    @BeforeEach
    void initTest() {
        pays = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedPays != null) {
            paysRepository.delete(insertedPays);
            insertedPays = null;
        }
    }

    @Test
    @Transactional
    void createPays() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Pays
        PaysDTO paysDTO = paysMapper.toDto(pays);
        var returnedPaysDTO = om.readValue(
            restPaysMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paysDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PaysDTO.class
        );

        // Validate the Pays in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedPays = paysMapper.toEntity(returnedPaysDTO);
        assertPaysUpdatableFieldsEquals(returnedPays, getPersistedPays(returnedPays));

        insertedPays = returnedPays;
    }

    @Test
    @Transactional
    void createPaysWithExistingId() throws Exception {
        // Create the Pays with an existing ID
        pays.setId(1L);
        PaysDTO paysDTO = paysMapper.toDto(pays);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaysMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paysDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Pays in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        pays.setCode(null);

        // Create the Pays, which fails.
        PaysDTO paysDTO = paysMapper.toDto(pays);

        restPaysMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paysDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        pays.setNom(null);

        // Create the Pays, which fails.
        PaysDTO paysDTO = paysMapper.toDto(pays);

        restPaysMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paysDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPays() throws Exception {
        // Initialize the database
        insertedPays = paysRepository.saveAndFlush(pays);

        // Get all the paysList
        restPaysMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pays.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].indicatif").value(hasItem(DEFAULT_INDICATIF)));
    }

    @Test
    @Transactional
    void getPays() throws Exception {
        // Initialize the database
        insertedPays = paysRepository.saveAndFlush(pays);

        // Get the pays
        restPaysMockMvc
            .perform(get(ENTITY_API_URL_ID, pays.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pays.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.indicatif").value(DEFAULT_INDICATIF));
    }

    @Test
    @Transactional
    void getNonExistingPays() throws Exception {
        // Get the pays
        restPaysMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPays() throws Exception {
        // Initialize the database
        insertedPays = paysRepository.saveAndFlush(pays);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pays
        Pays updatedPays = paysRepository.findById(pays.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPays are not directly saved in db
        em.detach(updatedPays);
        updatedPays.code(UPDATED_CODE).nom(UPDATED_NOM).indicatif(UPDATED_INDICATIF);
        PaysDTO paysDTO = paysMapper.toDto(updatedPays);

        restPaysMockMvc
            .perform(put(ENTITY_API_URL_ID, paysDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paysDTO)))
            .andExpect(status().isOk());

        // Validate the Pays in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPaysToMatchAllProperties(updatedPays);
    }

    @Test
    @Transactional
    void putNonExistingPays() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pays.setId(longCount.incrementAndGet());

        // Create the Pays
        PaysDTO paysDTO = paysMapper.toDto(pays);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaysMockMvc
            .perform(put(ENTITY_API_URL_ID, paysDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paysDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Pays in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPays() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pays.setId(longCount.incrementAndGet());

        // Create the Pays
        PaysDTO paysDTO = paysMapper.toDto(pays);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaysMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(paysDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pays in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPays() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pays.setId(longCount.incrementAndGet());

        // Create the Pays
        PaysDTO paysDTO = paysMapper.toDto(pays);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaysMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paysDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pays in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePaysWithPatch() throws Exception {
        // Initialize the database
        insertedPays = paysRepository.saveAndFlush(pays);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pays using partial update
        Pays partialUpdatedPays = new Pays();
        partialUpdatedPays.setId(pays.getId());

        partialUpdatedPays.nom(UPDATED_NOM);

        restPaysMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPays.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPays))
            )
            .andExpect(status().isOk());

        // Validate the Pays in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPaysUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPays, pays), getPersistedPays(pays));
    }

    @Test
    @Transactional
    void fullUpdatePaysWithPatch() throws Exception {
        // Initialize the database
        insertedPays = paysRepository.saveAndFlush(pays);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pays using partial update
        Pays partialUpdatedPays = new Pays();
        partialUpdatedPays.setId(pays.getId());

        partialUpdatedPays.code(UPDATED_CODE).nom(UPDATED_NOM).indicatif(UPDATED_INDICATIF);

        restPaysMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPays.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPays))
            )
            .andExpect(status().isOk());

        // Validate the Pays in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPaysUpdatableFieldsEquals(partialUpdatedPays, getPersistedPays(partialUpdatedPays));
    }

    @Test
    @Transactional
    void patchNonExistingPays() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pays.setId(longCount.incrementAndGet());

        // Create the Pays
        PaysDTO paysDTO = paysMapper.toDto(pays);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaysMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, paysDTO.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(paysDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pays in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPays() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pays.setId(longCount.incrementAndGet());

        // Create the Pays
        PaysDTO paysDTO = paysMapper.toDto(pays);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaysMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(paysDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pays in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPays() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pays.setId(longCount.incrementAndGet());

        // Create the Pays
        PaysDTO paysDTO = paysMapper.toDto(pays);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaysMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(paysDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pays in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePays() throws Exception {
        // Initialize the database
        insertedPays = paysRepository.saveAndFlush(pays);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the pays
        restPaysMockMvc
            .perform(delete(ENTITY_API_URL_ID, pays.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return paysRepository.count();
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

    protected Pays getPersistedPays(Pays pays) {
        return paysRepository.findById(pays.getId()).orElseThrow();
    }

    protected void assertPersistedPaysToMatchAllProperties(Pays expectedPays) {
        assertPaysAllPropertiesEquals(expectedPays, getPersistedPays(expectedPays));
    }

    protected void assertPersistedPaysToMatchUpdatableProperties(Pays expectedPays) {
        assertPaysAllUpdatablePropertiesEquals(expectedPays, getPersistedPays(expectedPays));
    }
}
