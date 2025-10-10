package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.KycClientAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.KycClient;
import com.ultex.crm.repository.KycClientRepository;
import com.ultex.crm.service.dto.KycClientDTO;
import com.ultex.crm.service.mapper.KycClientMapper;
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
 * Integration tests for the {@link KycClientResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KycClientResourceIT {

    private static final Integer DEFAULT_SCORE_STAFF = 1;
    private static final Integer UPDATED_SCORE_STAFF = 2;

    private static final String DEFAULT_COMPORTEMENTS = "AAAAAAAAAA";
    private static final String UPDATED_COMPORTEMENTS = "BBBBBBBBBB";

    private static final String DEFAULT_REMARQUES = "AAAAAAAAAA";
    private static final String UPDATED_REMARQUES = "BBBBBBBBBB";

    private static final Integer DEFAULT_COMPLETUDE_KYC = 1;
    private static final Integer UPDATED_COMPLETUDE_KYC = 2;

    private static final String DEFAULT_RESPONSABLE = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSABLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/kyc-clients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private KycClientRepository kycClientRepository;

    @Autowired
    private KycClientMapper kycClientMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKycClientMockMvc;

    private KycClient kycClient;

    private KycClient insertedKycClient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KycClient createEntity() {
        return new KycClient()
            .scoreStaff(DEFAULT_SCORE_STAFF)
            .comportements(DEFAULT_COMPORTEMENTS)
            .remarques(DEFAULT_REMARQUES)
            .completudeKyc(DEFAULT_COMPLETUDE_KYC)
            .responsable(DEFAULT_RESPONSABLE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KycClient createUpdatedEntity() {
        return new KycClient()
            .scoreStaff(UPDATED_SCORE_STAFF)
            .comportements(UPDATED_COMPORTEMENTS)
            .remarques(UPDATED_REMARQUES)
            .completudeKyc(UPDATED_COMPLETUDE_KYC)
            .responsable(UPDATED_RESPONSABLE);
    }

    @BeforeEach
    void initTest() {
        kycClient = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedKycClient != null) {
            kycClientRepository.delete(insertedKycClient);
            insertedKycClient = null;
        }
    }

    @Test
    @Transactional
    void createKycClient() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the KycClient
        KycClientDTO kycClientDTO = kycClientMapper.toDto(kycClient);
        var returnedKycClientDTO = om.readValue(
            restKycClientMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(kycClientDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            KycClientDTO.class
        );

        // Validate the KycClient in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedKycClient = kycClientMapper.toEntity(returnedKycClientDTO);
        assertKycClientUpdatableFieldsEquals(returnedKycClient, getPersistedKycClient(returnedKycClient));

        insertedKycClient = returnedKycClient;
    }

    @Test
    @Transactional
    void createKycClientWithExistingId() throws Exception {
        // Create the KycClient with an existing ID
        kycClient.setId(1L);
        KycClientDTO kycClientDTO = kycClientMapper.toDto(kycClient);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKycClientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(kycClientDTO)))
            .andExpect(status().isBadRequest());

        // Validate the KycClient in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKycClients() throws Exception {
        // Initialize the database
        insertedKycClient = kycClientRepository.saveAndFlush(kycClient);

        // Get all the kycClientList
        restKycClientMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kycClient.getId().intValue())))
            .andExpect(jsonPath("$.[*].scoreStaff").value(hasItem(DEFAULT_SCORE_STAFF)))
            .andExpect(jsonPath("$.[*].comportements").value(hasItem(DEFAULT_COMPORTEMENTS)))
            .andExpect(jsonPath("$.[*].remarques").value(hasItem(DEFAULT_REMARQUES)))
            .andExpect(jsonPath("$.[*].completudeKyc").value(hasItem(DEFAULT_COMPLETUDE_KYC)))
            .andExpect(jsonPath("$.[*].responsable").value(hasItem(DEFAULT_RESPONSABLE)));
    }

    @Test
    @Transactional
    void getKycClient() throws Exception {
        // Initialize the database
        insertedKycClient = kycClientRepository.saveAndFlush(kycClient);

        // Get the kycClient
        restKycClientMockMvc
            .perform(get(ENTITY_API_URL_ID, kycClient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kycClient.getId().intValue()))
            .andExpect(jsonPath("$.scoreStaff").value(DEFAULT_SCORE_STAFF))
            .andExpect(jsonPath("$.comportements").value(DEFAULT_COMPORTEMENTS))
            .andExpect(jsonPath("$.remarques").value(DEFAULT_REMARQUES))
            .andExpect(jsonPath("$.completudeKyc").value(DEFAULT_COMPLETUDE_KYC))
            .andExpect(jsonPath("$.responsable").value(DEFAULT_RESPONSABLE));
    }

    @Test
    @Transactional
    void getNonExistingKycClient() throws Exception {
        // Get the kycClient
        restKycClientMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingKycClient() throws Exception {
        // Initialize the database
        insertedKycClient = kycClientRepository.saveAndFlush(kycClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the kycClient
        KycClient updatedKycClient = kycClientRepository.findById(kycClient.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedKycClient are not directly saved in db
        em.detach(updatedKycClient);
        updatedKycClient
            .scoreStaff(UPDATED_SCORE_STAFF)
            .comportements(UPDATED_COMPORTEMENTS)
            .remarques(UPDATED_REMARQUES)
            .completudeKyc(UPDATED_COMPLETUDE_KYC)
            .responsable(UPDATED_RESPONSABLE);
        KycClientDTO kycClientDTO = kycClientMapper.toDto(updatedKycClient);

        restKycClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, kycClientDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(kycClientDTO))
            )
            .andExpect(status().isOk());

        // Validate the KycClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedKycClientToMatchAllProperties(updatedKycClient);
    }

    @Test
    @Transactional
    void putNonExistingKycClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        kycClient.setId(longCount.incrementAndGet());

        // Create the KycClient
        KycClientDTO kycClientDTO = kycClientMapper.toDto(kycClient);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKycClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, kycClientDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(kycClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the KycClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKycClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        kycClient.setId(longCount.incrementAndGet());

        // Create the KycClient
        KycClientDTO kycClientDTO = kycClientMapper.toDto(kycClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKycClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(kycClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the KycClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKycClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        kycClient.setId(longCount.incrementAndGet());

        // Create the KycClient
        KycClientDTO kycClientDTO = kycClientMapper.toDto(kycClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKycClientMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(kycClientDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the KycClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKycClientWithPatch() throws Exception {
        // Initialize the database
        insertedKycClient = kycClientRepository.saveAndFlush(kycClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the kycClient using partial update
        KycClient partialUpdatedKycClient = new KycClient();
        partialUpdatedKycClient.setId(kycClient.getId());

        partialUpdatedKycClient.comportements(UPDATED_COMPORTEMENTS);

        restKycClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKycClient.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedKycClient))
            )
            .andExpect(status().isOk());

        // Validate the KycClient in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertKycClientUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedKycClient, kycClient),
            getPersistedKycClient(kycClient)
        );
    }

    @Test
    @Transactional
    void fullUpdateKycClientWithPatch() throws Exception {
        // Initialize the database
        insertedKycClient = kycClientRepository.saveAndFlush(kycClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the kycClient using partial update
        KycClient partialUpdatedKycClient = new KycClient();
        partialUpdatedKycClient.setId(kycClient.getId());

        partialUpdatedKycClient
            .scoreStaff(UPDATED_SCORE_STAFF)
            .comportements(UPDATED_COMPORTEMENTS)
            .remarques(UPDATED_REMARQUES)
            .completudeKyc(UPDATED_COMPLETUDE_KYC)
            .responsable(UPDATED_RESPONSABLE);

        restKycClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKycClient.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedKycClient))
            )
            .andExpect(status().isOk());

        // Validate the KycClient in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertKycClientUpdatableFieldsEquals(partialUpdatedKycClient, getPersistedKycClient(partialUpdatedKycClient));
    }

    @Test
    @Transactional
    void patchNonExistingKycClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        kycClient.setId(longCount.incrementAndGet());

        // Create the KycClient
        KycClientDTO kycClientDTO = kycClientMapper.toDto(kycClient);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKycClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, kycClientDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(kycClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the KycClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKycClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        kycClient.setId(longCount.incrementAndGet());

        // Create the KycClient
        KycClientDTO kycClientDTO = kycClientMapper.toDto(kycClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKycClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(kycClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the KycClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKycClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        kycClient.setId(longCount.incrementAndGet());

        // Create the KycClient
        KycClientDTO kycClientDTO = kycClientMapper.toDto(kycClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKycClientMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(kycClientDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the KycClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKycClient() throws Exception {
        // Initialize the database
        insertedKycClient = kycClientRepository.saveAndFlush(kycClient);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the kycClient
        restKycClientMockMvc
            .perform(delete(ENTITY_API_URL_ID, kycClient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return kycClientRepository.count();
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

    protected KycClient getPersistedKycClient(KycClient kycClient) {
        return kycClientRepository.findById(kycClient.getId()).orElseThrow();
    }

    protected void assertPersistedKycClientToMatchAllProperties(KycClient expectedKycClient) {
        assertKycClientAllPropertiesEquals(expectedKycClient, getPersistedKycClient(expectedKycClient));
    }

    protected void assertPersistedKycClientToMatchUpdatableProperties(KycClient expectedKycClient) {
        assertKycClientAllUpdatablePropertiesEquals(expectedKycClient, getPersistedKycClient(expectedKycClient));
    }
}
