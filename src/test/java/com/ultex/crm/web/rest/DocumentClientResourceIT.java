package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.DocumentClientAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.DocumentClient;
import com.ultex.crm.repository.DocumentClientRepository;
import com.ultex.crm.service.dto.DocumentClientDTO;
import com.ultex.crm.service.mapper.DocumentClientMapper;
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
 * Integration tests for the {@link DocumentClientResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DocumentClientResourceIT {

    private static final String DEFAULT_TYPE_DOCUMENT = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_DOCUMENT = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO_DOCUMENT = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_DOCUMENT = "BBBBBBBBBB";

    private static final String DEFAULT_FICHIER_URL = "AAAAAAAAAA";
    private static final String UPDATED_FICHIER_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/document-clients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DocumentClientRepository documentClientRepository;

    @Autowired
    private DocumentClientMapper documentClientMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDocumentClientMockMvc;

    private DocumentClient documentClient;

    private DocumentClient insertedDocumentClient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentClient createEntity() {
        return new DocumentClient()
            .typeDocument(DEFAULT_TYPE_DOCUMENT)
            .numeroDocument(DEFAULT_NUMERO_DOCUMENT)
            .fichierUrl(DEFAULT_FICHIER_URL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentClient createUpdatedEntity() {
        return new DocumentClient()
            .typeDocument(UPDATED_TYPE_DOCUMENT)
            .numeroDocument(UPDATED_NUMERO_DOCUMENT)
            .fichierUrl(UPDATED_FICHIER_URL);
    }

    @BeforeEach
    void initTest() {
        documentClient = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedDocumentClient != null) {
            documentClientRepository.delete(insertedDocumentClient);
            insertedDocumentClient = null;
        }
    }

    @Test
    @Transactional
    void createDocumentClient() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the DocumentClient
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);
        var returnedDocumentClientDTO = om.readValue(
            restDocumentClientMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documentClientDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            DocumentClientDTO.class
        );

        // Validate the DocumentClient in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedDocumentClient = documentClientMapper.toEntity(returnedDocumentClientDTO);
        assertDocumentClientUpdatableFieldsEquals(returnedDocumentClient, getPersistedDocumentClient(returnedDocumentClient));

        insertedDocumentClient = returnedDocumentClient;
    }

    @Test
    @Transactional
    void createDocumentClientWithExistingId() throws Exception {
        // Create the DocumentClient with an existing ID
        documentClient.setId(1L);
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentClientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documentClientDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentClient in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTypeDocumentIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        documentClient.setTypeDocument(null);

        // Create the DocumentClient, which fails.
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);

        restDocumentClientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documentClientDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDocumentClients() throws Exception {
        // Initialize the database
        insertedDocumentClient = documentClientRepository.saveAndFlush(documentClient);

        // Get all the documentClientList
        restDocumentClientMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentClient.getId().intValue())))
            .andExpect(jsonPath("$.[*].typeDocument").value(hasItem(DEFAULT_TYPE_DOCUMENT)))
            .andExpect(jsonPath("$.[*].numeroDocument").value(hasItem(DEFAULT_NUMERO_DOCUMENT)))
            .andExpect(jsonPath("$.[*].fichierUrl").value(hasItem(DEFAULT_FICHIER_URL)));
    }

    @Test
    @Transactional
    void getDocumentClient() throws Exception {
        // Initialize the database
        insertedDocumentClient = documentClientRepository.saveAndFlush(documentClient);

        // Get the documentClient
        restDocumentClientMockMvc
            .perform(get(ENTITY_API_URL_ID, documentClient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(documentClient.getId().intValue()))
            .andExpect(jsonPath("$.typeDocument").value(DEFAULT_TYPE_DOCUMENT))
            .andExpect(jsonPath("$.numeroDocument").value(DEFAULT_NUMERO_DOCUMENT))
            .andExpect(jsonPath("$.fichierUrl").value(DEFAULT_FICHIER_URL));
    }

    @Test
    @Transactional
    void getNonExistingDocumentClient() throws Exception {
        // Get the documentClient
        restDocumentClientMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDocumentClient() throws Exception {
        // Initialize the database
        insertedDocumentClient = documentClientRepository.saveAndFlush(documentClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the documentClient
        DocumentClient updatedDocumentClient = documentClientRepository.findById(documentClient.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDocumentClient are not directly saved in db
        em.detach(updatedDocumentClient);
        updatedDocumentClient.typeDocument(UPDATED_TYPE_DOCUMENT).numeroDocument(UPDATED_NUMERO_DOCUMENT).fichierUrl(UPDATED_FICHIER_URL);
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(updatedDocumentClient);

        restDocumentClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documentClientDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(documentClientDTO))
            )
            .andExpect(status().isOk());

        // Validate the DocumentClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDocumentClientToMatchAllProperties(updatedDocumentClient);
    }

    @Test
    @Transactional
    void putNonExistingDocumentClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documentClient.setId(longCount.incrementAndGet());

        // Create the DocumentClient
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documentClientDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(documentClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDocumentClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documentClient.setId(longCount.incrementAndGet());

        // Create the DocumentClient
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(documentClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDocumentClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documentClient.setId(longCount.incrementAndGet());

        // Create the DocumentClient
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentClientMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(documentClientDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DocumentClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDocumentClientWithPatch() throws Exception {
        // Initialize the database
        insertedDocumentClient = documentClientRepository.saveAndFlush(documentClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the documentClient using partial update
        DocumentClient partialUpdatedDocumentClient = new DocumentClient();
        partialUpdatedDocumentClient.setId(documentClient.getId());

        partialUpdatedDocumentClient
            .typeDocument(UPDATED_TYPE_DOCUMENT)
            .numeroDocument(UPDATED_NUMERO_DOCUMENT)
            .fichierUrl(UPDATED_FICHIER_URL);

        restDocumentClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocumentClient.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDocumentClient))
            )
            .andExpect(status().isOk());

        // Validate the DocumentClient in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDocumentClientUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDocumentClient, documentClient),
            getPersistedDocumentClient(documentClient)
        );
    }

    @Test
    @Transactional
    void fullUpdateDocumentClientWithPatch() throws Exception {
        // Initialize the database
        insertedDocumentClient = documentClientRepository.saveAndFlush(documentClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the documentClient using partial update
        DocumentClient partialUpdatedDocumentClient = new DocumentClient();
        partialUpdatedDocumentClient.setId(documentClient.getId());

        partialUpdatedDocumentClient
            .typeDocument(UPDATED_TYPE_DOCUMENT)
            .numeroDocument(UPDATED_NUMERO_DOCUMENT)
            .fichierUrl(UPDATED_FICHIER_URL);

        restDocumentClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocumentClient.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDocumentClient))
            )
            .andExpect(status().isOk());

        // Validate the DocumentClient in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDocumentClientUpdatableFieldsEquals(partialUpdatedDocumentClient, getPersistedDocumentClient(partialUpdatedDocumentClient));
    }

    @Test
    @Transactional
    void patchNonExistingDocumentClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documentClient.setId(longCount.incrementAndGet());

        // Create the DocumentClient
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, documentClientDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(documentClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDocumentClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documentClient.setId(longCount.incrementAndGet());

        // Create the DocumentClient
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(documentClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocumentClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDocumentClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        documentClient.setId(longCount.incrementAndGet());

        // Create the DocumentClient
        DocumentClientDTO documentClientDTO = documentClientMapper.toDto(documentClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentClientMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(documentClientDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DocumentClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDocumentClient() throws Exception {
        // Initialize the database
        insertedDocumentClient = documentClientRepository.saveAndFlush(documentClient);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the documentClient
        restDocumentClientMockMvc
            .perform(delete(ENTITY_API_URL_ID, documentClient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return documentClientRepository.count();
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

    protected DocumentClient getPersistedDocumentClient(DocumentClient documentClient) {
        return documentClientRepository.findById(documentClient.getId()).orElseThrow();
    }

    protected void assertPersistedDocumentClientToMatchAllProperties(DocumentClient expectedDocumentClient) {
        assertDocumentClientAllPropertiesEquals(expectedDocumentClient, getPersistedDocumentClient(expectedDocumentClient));
    }

    protected void assertPersistedDocumentClientToMatchUpdatableProperties(DocumentClient expectedDocumentClient) {
        assertDocumentClientAllUpdatablePropertiesEquals(expectedDocumentClient, getPersistedDocumentClient(expectedDocumentClient));
    }
}
