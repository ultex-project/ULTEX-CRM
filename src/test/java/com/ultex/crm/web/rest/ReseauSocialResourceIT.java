package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.ReseauSocialAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.ReseauSocial;
import com.ultex.crm.domain.enumeration.PlateformeSociale;
import com.ultex.crm.repository.ReseauSocialRepository;
import com.ultex.crm.service.dto.ReseauSocialDTO;
import com.ultex.crm.service.mapper.ReseauSocialMapper;
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
 * Integration tests for the {@link ReseauSocialResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReseauSocialResourceIT {

    private static final PlateformeSociale DEFAULT_PLATEFORME = PlateformeSociale.FACEBOOK;
    private static final PlateformeSociale UPDATED_PLATEFORME = PlateformeSociale.INSTAGRAM;

    private static final String DEFAULT_URL_PROFIL = "AAAAAAAAAA";
    private static final String UPDATED_URL_PROFIL = "BBBBBBBBBB";

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/reseau-socials";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReseauSocialRepository reseauSocialRepository;

    @Autowired
    private ReseauSocialMapper reseauSocialMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReseauSocialMockMvc;

    private ReseauSocial reseauSocial;

    private ReseauSocial insertedReseauSocial;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReseauSocial createEntity(EntityManager em) {
        ReseauSocial reseauSocial = new ReseauSocial()
            .plateforme(DEFAULT_PLATEFORME)
            .urlProfil(DEFAULT_URL_PROFIL)
            .username(DEFAULT_USERNAME)
            .type(DEFAULT_TYPE);
        // Add required entity
        Client client;
        if (TestUtil.findAll(em, Client.class).isEmpty()) {
            client = ClientResourceIT.createEntity();
            em.persist(client);
            em.flush();
        } else {
            client = TestUtil.findAll(em, Client.class).get(0);
        }
        reseauSocial.setClient(client);
        return reseauSocial;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReseauSocial createUpdatedEntity(EntityManager em) {
        ReseauSocial updatedReseauSocial = new ReseauSocial()
            .plateforme(UPDATED_PLATEFORME)
            .urlProfil(UPDATED_URL_PROFIL)
            .username(UPDATED_USERNAME)
            .type(UPDATED_TYPE);
        // Add required entity
        Client client;
        if (TestUtil.findAll(em, Client.class).isEmpty()) {
            client = ClientResourceIT.createUpdatedEntity();
            em.persist(client);
            em.flush();
        } else {
            client = TestUtil.findAll(em, Client.class).get(0);
        }
        updatedReseauSocial.setClient(client);
        return updatedReseauSocial;
    }

    @BeforeEach
    void initTest() {
        reseauSocial = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedReseauSocial != null) {
            reseauSocialRepository.delete(insertedReseauSocial);
            insertedReseauSocial = null;
        }
    }

    @Test
    @Transactional
    void createReseauSocial() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ReseauSocial
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);
        var returnedReseauSocialDTO = om.readValue(
            restReseauSocialMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reseauSocialDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ReseauSocialDTO.class
        );

        // Validate the ReseauSocial in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedReseauSocial = reseauSocialMapper.toEntity(returnedReseauSocialDTO);
        assertReseauSocialUpdatableFieldsEquals(returnedReseauSocial, getPersistedReseauSocial(returnedReseauSocial));

        insertedReseauSocial = returnedReseauSocial;
    }

    @Test
    @Transactional
    void createReseauSocialWithExistingId() throws Exception {
        // Create the ReseauSocial with an existing ID
        reseauSocial.setId(1L);
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReseauSocialMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reseauSocialDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ReseauSocial in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPlateformeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        reseauSocial.setPlateforme(null);

        // Create the ReseauSocial, which fails.
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);

        restReseauSocialMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reseauSocialDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllReseauSocials() throws Exception {
        // Initialize the database
        insertedReseauSocial = reseauSocialRepository.saveAndFlush(reseauSocial);

        // Get all the reseauSocialList
        restReseauSocialMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reseauSocial.getId().intValue())))
            .andExpect(jsonPath("$.[*].plateforme").value(hasItem(DEFAULT_PLATEFORME.toString())))
            .andExpect(jsonPath("$.[*].urlProfil").value(hasItem(DEFAULT_URL_PROFIL)))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)));
    }

    @Test
    @Transactional
    void getReseauSocial() throws Exception {
        // Initialize the database
        insertedReseauSocial = reseauSocialRepository.saveAndFlush(reseauSocial);

        // Get the reseauSocial
        restReseauSocialMockMvc
            .perform(get(ENTITY_API_URL_ID, reseauSocial.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reseauSocial.getId().intValue()))
            .andExpect(jsonPath("$.plateforme").value(DEFAULT_PLATEFORME.toString()))
            .andExpect(jsonPath("$.urlProfil").value(DEFAULT_URL_PROFIL))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingReseauSocial() throws Exception {
        // Get the reseauSocial
        restReseauSocialMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReseauSocial() throws Exception {
        // Initialize the database
        insertedReseauSocial = reseauSocialRepository.saveAndFlush(reseauSocial);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reseauSocial
        ReseauSocial updatedReseauSocial = reseauSocialRepository.findById(reseauSocial.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReseauSocial are not directly saved in db
        em.detach(updatedReseauSocial);
        updatedReseauSocial.plateforme(UPDATED_PLATEFORME).urlProfil(UPDATED_URL_PROFIL).username(UPDATED_USERNAME).type(UPDATED_TYPE);
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(updatedReseauSocial);

        restReseauSocialMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reseauSocialDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reseauSocialDTO))
            )
            .andExpect(status().isOk());

        // Validate the ReseauSocial in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReseauSocialToMatchAllProperties(updatedReseauSocial);
    }

    @Test
    @Transactional
    void putNonExistingReseauSocial() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reseauSocial.setId(longCount.incrementAndGet());

        // Create the ReseauSocial
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReseauSocialMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reseauSocialDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reseauSocialDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReseauSocial in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReseauSocial() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reseauSocial.setId(longCount.incrementAndGet());

        // Create the ReseauSocial
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReseauSocialMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reseauSocialDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReseauSocial in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReseauSocial() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reseauSocial.setId(longCount.incrementAndGet());

        // Create the ReseauSocial
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReseauSocialMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reseauSocialDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReseauSocial in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReseauSocialWithPatch() throws Exception {
        // Initialize the database
        insertedReseauSocial = reseauSocialRepository.saveAndFlush(reseauSocial);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reseauSocial using partial update
        ReseauSocial partialUpdatedReseauSocial = new ReseauSocial();
        partialUpdatedReseauSocial.setId(reseauSocial.getId());

        partialUpdatedReseauSocial.plateforme(UPDATED_PLATEFORME).type(UPDATED_TYPE);

        restReseauSocialMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReseauSocial.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReseauSocial))
            )
            .andExpect(status().isOk());

        // Validate the ReseauSocial in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReseauSocialUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedReseauSocial, reseauSocial),
            getPersistedReseauSocial(reseauSocial)
        );
    }

    @Test
    @Transactional
    void fullUpdateReseauSocialWithPatch() throws Exception {
        // Initialize the database
        insertedReseauSocial = reseauSocialRepository.saveAndFlush(reseauSocial);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reseauSocial using partial update
        ReseauSocial partialUpdatedReseauSocial = new ReseauSocial();
        partialUpdatedReseauSocial.setId(reseauSocial.getId());

        partialUpdatedReseauSocial
            .plateforme(UPDATED_PLATEFORME)
            .urlProfil(UPDATED_URL_PROFIL)
            .username(UPDATED_USERNAME)
            .type(UPDATED_TYPE);

        restReseauSocialMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReseauSocial.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReseauSocial))
            )
            .andExpect(status().isOk());

        // Validate the ReseauSocial in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReseauSocialUpdatableFieldsEquals(partialUpdatedReseauSocial, getPersistedReseauSocial(partialUpdatedReseauSocial));
    }

    @Test
    @Transactional
    void patchNonExistingReseauSocial() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reseauSocial.setId(longCount.incrementAndGet());

        // Create the ReseauSocial
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReseauSocialMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reseauSocialDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reseauSocialDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReseauSocial in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReseauSocial() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reseauSocial.setId(longCount.incrementAndGet());

        // Create the ReseauSocial
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReseauSocialMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reseauSocialDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReseauSocial in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReseauSocial() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reseauSocial.setId(longCount.incrementAndGet());

        // Create the ReseauSocial
        ReseauSocialDTO reseauSocialDTO = reseauSocialMapper.toDto(reseauSocial);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReseauSocialMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(reseauSocialDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReseauSocial in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReseauSocial() throws Exception {
        // Initialize the database
        insertedReseauSocial = reseauSocialRepository.saveAndFlush(reseauSocial);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the reseauSocial
        restReseauSocialMockMvc
            .perform(delete(ENTITY_API_URL_ID, reseauSocial.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reseauSocialRepository.count();
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

    protected ReseauSocial getPersistedReseauSocial(ReseauSocial reseauSocial) {
        return reseauSocialRepository.findById(reseauSocial.getId()).orElseThrow();
    }

    protected void assertPersistedReseauSocialToMatchAllProperties(ReseauSocial expectedReseauSocial) {
        assertReseauSocialAllPropertiesEquals(expectedReseauSocial, getPersistedReseauSocial(expectedReseauSocial));
    }

    protected void assertPersistedReseauSocialToMatchUpdatableProperties(ReseauSocial expectedReseauSocial) {
        assertReseauSocialAllUpdatablePropertiesEquals(expectedReseauSocial, getPersistedReseauSocial(expectedReseauSocial));
    }
}
