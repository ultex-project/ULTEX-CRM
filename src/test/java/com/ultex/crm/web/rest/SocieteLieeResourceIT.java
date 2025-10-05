package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.SocieteLieeAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.SocieteLiee;
import com.ultex.crm.repository.SocieteLieeRepository;
import com.ultex.crm.service.dto.SocieteLieeDTO;
import com.ultex.crm.service.mapper.SocieteLieeMapper;
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
 * Integration tests for the {@link SocieteLieeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SocieteLieeResourceIT {

    private static final String DEFAULT_RAISON_SOCIALE = "AAAAAAAAAA";
    private static final String UPDATED_RAISON_SOCIALE = "BBBBBBBBBB";

    private static final String DEFAULT_FORME_JURIDIQUE = "AAAAAAAAAA";
    private static final String UPDATED_FORME_JURIDIQUE = "BBBBBBBBBB";

    private static final String DEFAULT_ICE = "AAAAAAAAAA";
    private static final String UPDATED_ICE = "BBBBBBBBBB";

    private static final String DEFAULT_RC = "AAAAAAAAAA";
    private static final String UPDATED_RC = "BBBBBBBBBB";

    private static final String DEFAULT_NIF = "AAAAAAAAAA";
    private static final String UPDATED_NIF = "BBBBBBBBBB";

    private static final String DEFAULT_SECTEUR_ACTIVITE = "AAAAAAAAAA";
    private static final String UPDATED_SECTEUR_ACTIVITE = "BBBBBBBBBB";

    private static final String DEFAULT_TAILLE_ENTREPRISE = "AAAAAAAAAA";
    private static final String UPDATED_TAILLE_ENTREPRISE = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE_SIEGE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE_SIEGE = "BBBBBBBBBB";

    private static final String DEFAULT_REPRESENTANT_LEGAL = "AAAAAAAAAA";
    private static final String UPDATED_REPRESENTANT_LEGAL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/societe-liees";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SocieteLieeRepository societeLieeRepository;

    @Autowired
    private SocieteLieeMapper societeLieeMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSocieteLieeMockMvc;

    private SocieteLiee societeLiee;

    private SocieteLiee insertedSocieteLiee;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocieteLiee createEntity() {
        return new SocieteLiee()
            .raisonSociale(DEFAULT_RAISON_SOCIALE)
            .formeJuridique(DEFAULT_FORME_JURIDIQUE)
            .ice(DEFAULT_ICE)
            .rc(DEFAULT_RC)
            .nif(DEFAULT_NIF)
            .secteurActivite(DEFAULT_SECTEUR_ACTIVITE)
            .tailleEntreprise(DEFAULT_TAILLE_ENTREPRISE)
            .adresseSiege(DEFAULT_ADRESSE_SIEGE)
            .representantLegal(DEFAULT_REPRESENTANT_LEGAL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocieteLiee createUpdatedEntity() {
        return new SocieteLiee()
            .raisonSociale(UPDATED_RAISON_SOCIALE)
            .formeJuridique(UPDATED_FORME_JURIDIQUE)
            .ice(UPDATED_ICE)
            .rc(UPDATED_RC)
            .nif(UPDATED_NIF)
            .secteurActivite(UPDATED_SECTEUR_ACTIVITE)
            .tailleEntreprise(UPDATED_TAILLE_ENTREPRISE)
            .adresseSiege(UPDATED_ADRESSE_SIEGE)
            .representantLegal(UPDATED_REPRESENTANT_LEGAL);
    }

    @BeforeEach
    void initTest() {
        societeLiee = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedSocieteLiee != null) {
            societeLieeRepository.delete(insertedSocieteLiee);
            insertedSocieteLiee = null;
        }
    }

    @Test
    @Transactional
    void createSocieteLiee() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the SocieteLiee
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);
        var returnedSocieteLieeDTO = om.readValue(
            restSocieteLieeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(societeLieeDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            SocieteLieeDTO.class
        );

        // Validate the SocieteLiee in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedSocieteLiee = societeLieeMapper.toEntity(returnedSocieteLieeDTO);
        assertSocieteLieeUpdatableFieldsEquals(returnedSocieteLiee, getPersistedSocieteLiee(returnedSocieteLiee));

        insertedSocieteLiee = returnedSocieteLiee;
    }

    @Test
    @Transactional
    void createSocieteLieeWithExistingId() throws Exception {
        // Create the SocieteLiee with an existing ID
        societeLiee.setId(1L);
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSocieteLieeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(societeLieeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the SocieteLiee in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRaisonSocialeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        societeLiee.setRaisonSociale(null);

        // Create the SocieteLiee, which fails.
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);

        restSocieteLieeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(societeLieeDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSocieteLiees() throws Exception {
        // Initialize the database
        insertedSocieteLiee = societeLieeRepository.saveAndFlush(societeLiee);

        // Get all the societeLieeList
        restSocieteLieeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(societeLiee.getId().intValue())))
            .andExpect(jsonPath("$.[*].raisonSociale").value(hasItem(DEFAULT_RAISON_SOCIALE)))
            .andExpect(jsonPath("$.[*].formeJuridique").value(hasItem(DEFAULT_FORME_JURIDIQUE)))
            .andExpect(jsonPath("$.[*].ice").value(hasItem(DEFAULT_ICE)))
            .andExpect(jsonPath("$.[*].rc").value(hasItem(DEFAULT_RC)))
            .andExpect(jsonPath("$.[*].nif").value(hasItem(DEFAULT_NIF)))
            .andExpect(jsonPath("$.[*].secteurActivite").value(hasItem(DEFAULT_SECTEUR_ACTIVITE)))
            .andExpect(jsonPath("$.[*].tailleEntreprise").value(hasItem(DEFAULT_TAILLE_ENTREPRISE)))
            .andExpect(jsonPath("$.[*].adresseSiege").value(hasItem(DEFAULT_ADRESSE_SIEGE)))
            .andExpect(jsonPath("$.[*].representantLegal").value(hasItem(DEFAULT_REPRESENTANT_LEGAL)));
    }

    @Test
    @Transactional
    void getSocieteLiee() throws Exception {
        // Initialize the database
        insertedSocieteLiee = societeLieeRepository.saveAndFlush(societeLiee);

        // Get the societeLiee
        restSocieteLieeMockMvc
            .perform(get(ENTITY_API_URL_ID, societeLiee.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(societeLiee.getId().intValue()))
            .andExpect(jsonPath("$.raisonSociale").value(DEFAULT_RAISON_SOCIALE))
            .andExpect(jsonPath("$.formeJuridique").value(DEFAULT_FORME_JURIDIQUE))
            .andExpect(jsonPath("$.ice").value(DEFAULT_ICE))
            .andExpect(jsonPath("$.rc").value(DEFAULT_RC))
            .andExpect(jsonPath("$.nif").value(DEFAULT_NIF))
            .andExpect(jsonPath("$.secteurActivite").value(DEFAULT_SECTEUR_ACTIVITE))
            .andExpect(jsonPath("$.tailleEntreprise").value(DEFAULT_TAILLE_ENTREPRISE))
            .andExpect(jsonPath("$.adresseSiege").value(DEFAULT_ADRESSE_SIEGE))
            .andExpect(jsonPath("$.representantLegal").value(DEFAULT_REPRESENTANT_LEGAL));
    }

    @Test
    @Transactional
    void getNonExistingSocieteLiee() throws Exception {
        // Get the societeLiee
        restSocieteLieeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSocieteLiee() throws Exception {
        // Initialize the database
        insertedSocieteLiee = societeLieeRepository.saveAndFlush(societeLiee);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the societeLiee
        SocieteLiee updatedSocieteLiee = societeLieeRepository.findById(societeLiee.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSocieteLiee are not directly saved in db
        em.detach(updatedSocieteLiee);
        updatedSocieteLiee
            .raisonSociale(UPDATED_RAISON_SOCIALE)
            .formeJuridique(UPDATED_FORME_JURIDIQUE)
            .ice(UPDATED_ICE)
            .rc(UPDATED_RC)
            .nif(UPDATED_NIF)
            .secteurActivite(UPDATED_SECTEUR_ACTIVITE)
            .tailleEntreprise(UPDATED_TAILLE_ENTREPRISE)
            .adresseSiege(UPDATED_ADRESSE_SIEGE)
            .representantLegal(UPDATED_REPRESENTANT_LEGAL);
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(updatedSocieteLiee);

        restSocieteLieeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, societeLieeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(societeLieeDTO))
            )
            .andExpect(status().isOk());

        // Validate the SocieteLiee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSocieteLieeToMatchAllProperties(updatedSocieteLiee);
    }

    @Test
    @Transactional
    void putNonExistingSocieteLiee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        societeLiee.setId(longCount.incrementAndGet());

        // Create the SocieteLiee
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocieteLieeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, societeLieeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(societeLieeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteLiee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSocieteLiee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        societeLiee.setId(longCount.incrementAndGet());

        // Create the SocieteLiee
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocieteLieeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(societeLieeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteLiee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSocieteLiee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        societeLiee.setId(longCount.incrementAndGet());

        // Create the SocieteLiee
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocieteLieeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(societeLieeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocieteLiee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSocieteLieeWithPatch() throws Exception {
        // Initialize the database
        insertedSocieteLiee = societeLieeRepository.saveAndFlush(societeLiee);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the societeLiee using partial update
        SocieteLiee partialUpdatedSocieteLiee = new SocieteLiee();
        partialUpdatedSocieteLiee.setId(societeLiee.getId());

        partialUpdatedSocieteLiee.rc(UPDATED_RC).nif(UPDATED_NIF).tailleEntreprise(UPDATED_TAILLE_ENTREPRISE);

        restSocieteLieeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocieteLiee.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSocieteLiee))
            )
            .andExpect(status().isOk());

        // Validate the SocieteLiee in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSocieteLieeUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedSocieteLiee, societeLiee),
            getPersistedSocieteLiee(societeLiee)
        );
    }

    @Test
    @Transactional
    void fullUpdateSocieteLieeWithPatch() throws Exception {
        // Initialize the database
        insertedSocieteLiee = societeLieeRepository.saveAndFlush(societeLiee);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the societeLiee using partial update
        SocieteLiee partialUpdatedSocieteLiee = new SocieteLiee();
        partialUpdatedSocieteLiee.setId(societeLiee.getId());

        partialUpdatedSocieteLiee
            .raisonSociale(UPDATED_RAISON_SOCIALE)
            .formeJuridique(UPDATED_FORME_JURIDIQUE)
            .ice(UPDATED_ICE)
            .rc(UPDATED_RC)
            .nif(UPDATED_NIF)
            .secteurActivite(UPDATED_SECTEUR_ACTIVITE)
            .tailleEntreprise(UPDATED_TAILLE_ENTREPRISE)
            .adresseSiege(UPDATED_ADRESSE_SIEGE)
            .representantLegal(UPDATED_REPRESENTANT_LEGAL);

        restSocieteLieeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocieteLiee.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSocieteLiee))
            )
            .andExpect(status().isOk());

        // Validate the SocieteLiee in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSocieteLieeUpdatableFieldsEquals(partialUpdatedSocieteLiee, getPersistedSocieteLiee(partialUpdatedSocieteLiee));
    }

    @Test
    @Transactional
    void patchNonExistingSocieteLiee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        societeLiee.setId(longCount.incrementAndGet());

        // Create the SocieteLiee
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocieteLieeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, societeLieeDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(societeLieeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteLiee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSocieteLiee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        societeLiee.setId(longCount.incrementAndGet());

        // Create the SocieteLiee
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocieteLieeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(societeLieeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteLiee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSocieteLiee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        societeLiee.setId(longCount.incrementAndGet());

        // Create the SocieteLiee
        SocieteLieeDTO societeLieeDTO = societeLieeMapper.toDto(societeLiee);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocieteLieeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(societeLieeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocieteLiee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSocieteLiee() throws Exception {
        // Initialize the database
        insertedSocieteLiee = societeLieeRepository.saveAndFlush(societeLiee);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the societeLiee
        restSocieteLieeMockMvc
            .perform(delete(ENTITY_API_URL_ID, societeLiee.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return societeLieeRepository.count();
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

    protected SocieteLiee getPersistedSocieteLiee(SocieteLiee societeLiee) {
        return societeLieeRepository.findById(societeLiee.getId()).orElseThrow();
    }

    protected void assertPersistedSocieteLieeToMatchAllProperties(SocieteLiee expectedSocieteLiee) {
        assertSocieteLieeAllPropertiesEquals(expectedSocieteLiee, getPersistedSocieteLiee(expectedSocieteLiee));
    }

    protected void assertPersistedSocieteLieeToMatchUpdatableProperties(SocieteLiee expectedSocieteLiee) {
        assertSocieteLieeAllUpdatablePropertiesEquals(expectedSocieteLiee, getPersistedSocieteLiee(expectedSocieteLiee));
    }
}
