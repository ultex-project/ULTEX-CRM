package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.DemandeClientAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.DemandeClient;
import com.ultex.crm.domain.enumeration.ServicePrincipal;
import com.ultex.crm.domain.enumeration.TypeDemande;
import com.ultex.crm.repository.DemandeClientRepository;
import com.ultex.crm.service.DemandeClientService;
import com.ultex.crm.service.dto.DemandeClientDTO;
import com.ultex.crm.service.mapper.DemandeClientMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DemandeClientResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DemandeClientResourceIT {

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_DEMANDE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEMANDE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final ServicePrincipal DEFAULT_SERVICE_PRINCIPAL = ServicePrincipal.IMPORT;
    private static final ServicePrincipal UPDATED_SERVICE_PRINCIPAL = ServicePrincipal.EXPORT;

    private static final TypeDemande DEFAULT_TYPE_DEMANDE = TypeDemande.PROFORMA;
    private static final TypeDemande UPDATED_TYPE_DEMANDE = TypeDemande.SOURCING;

    private static final String DEFAULT_PROVENANCE = "AAAAAAAAAA";
    private static final String UPDATED_PROVENANCE = "BBBBBBBBBB";

    private static final String DEFAULT_REMARQUE_GENERALE = "AAAAAAAAAA";
    private static final String UPDATED_REMARQUE_GENERALE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/demande-clients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DemandeClientRepository demandeClientRepository;

    @Mock
    private DemandeClientRepository demandeClientRepositoryMock;

    @Autowired
    private DemandeClientMapper demandeClientMapper;

    @Mock
    private DemandeClientService demandeClientServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDemandeClientMockMvc;

    private DemandeClient demandeClient;

    private DemandeClient insertedDemandeClient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DemandeClient createEntity() {
        return new DemandeClient()
            .reference(DEFAULT_REFERENCE)
            .dateDemande(DEFAULT_DATE_DEMANDE)
            .servicePrincipal(DEFAULT_SERVICE_PRINCIPAL)
            .typeDemande(DEFAULT_TYPE_DEMANDE)
            .provenance(DEFAULT_PROVENANCE)
            .remarqueGenerale(DEFAULT_REMARQUE_GENERALE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DemandeClient createUpdatedEntity() {
        return new DemandeClient()
            .reference(UPDATED_REFERENCE)
            .dateDemande(UPDATED_DATE_DEMANDE)
            .servicePrincipal(UPDATED_SERVICE_PRINCIPAL)
            .typeDemande(UPDATED_TYPE_DEMANDE)
            .provenance(UPDATED_PROVENANCE)
            .remarqueGenerale(UPDATED_REMARQUE_GENERALE);
    }

    @BeforeEach
    void initTest() {
        demandeClient = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedDemandeClient != null) {
            demandeClientRepository.delete(insertedDemandeClient);
            insertedDemandeClient = null;
        }
    }

    @Test
    @Transactional
    void createDemandeClient() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the DemandeClient
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);
        var returnedDemandeClientDTO = om.readValue(
            restDemandeClientMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demandeClientDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            DemandeClientDTO.class
        );

        // Validate the DemandeClient in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedDemandeClient = demandeClientMapper.toEntity(returnedDemandeClientDTO);
        assertDemandeClientUpdatableFieldsEquals(returnedDemandeClient, getPersistedDemandeClient(returnedDemandeClient));

        insertedDemandeClient = returnedDemandeClient;
    }

    @Test
    @Transactional
    void createDemandeClientWithExistingId() throws Exception {
        // Create the DemandeClient with an existing ID
        demandeClient.setId(1L);
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDemandeClientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demandeClientDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DemandeClient in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkReferenceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        demandeClient.setReference(null);

        // Create the DemandeClient, which fails.
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        restDemandeClientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demandeClientDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateDemandeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        demandeClient.setDateDemande(null);

        // Create the DemandeClient, which fails.
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        restDemandeClientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demandeClientDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkServicePrincipalIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        demandeClient.setServicePrincipal(null);

        // Create the DemandeClient, which fails.
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        restDemandeClientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demandeClientDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeDemandeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        demandeClient.setTypeDemande(null);

        // Create the DemandeClient, which fails.
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        restDemandeClientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demandeClientDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDemandeClients() throws Exception {
        // Initialize the database
        insertedDemandeClient = demandeClientRepository.saveAndFlush(demandeClient);

        // Get all the demandeClientList
        restDemandeClientMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(demandeClient.getId().intValue())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].dateDemande").value(hasItem(DEFAULT_DATE_DEMANDE.toString())))
            .andExpect(jsonPath("$.[*].servicePrincipal").value(hasItem(DEFAULT_SERVICE_PRINCIPAL.toString())))
            .andExpect(jsonPath("$.[*].typeDemande").value(hasItem(DEFAULT_TYPE_DEMANDE.toString())))
            .andExpect(jsonPath("$.[*].provenance").value(hasItem(DEFAULT_PROVENANCE)))
            .andExpect(jsonPath("$.[*].remarqueGenerale").value(hasItem(DEFAULT_REMARQUE_GENERALE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDemandeClientsWithEagerRelationshipsIsEnabled() throws Exception {
        when(demandeClientServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDemandeClientMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(demandeClientServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDemandeClientsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(demandeClientServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDemandeClientMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(demandeClientRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDemandeClient() throws Exception {
        // Initialize the database
        insertedDemandeClient = demandeClientRepository.saveAndFlush(demandeClient);

        // Get the demandeClient
        restDemandeClientMockMvc
            .perform(get(ENTITY_API_URL_ID, demandeClient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(demandeClient.getId().intValue()))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE))
            .andExpect(jsonPath("$.dateDemande").value(DEFAULT_DATE_DEMANDE.toString()))
            .andExpect(jsonPath("$.servicePrincipal").value(DEFAULT_SERVICE_PRINCIPAL.toString()))
            .andExpect(jsonPath("$.typeDemande").value(DEFAULT_TYPE_DEMANDE.toString()))
            .andExpect(jsonPath("$.provenance").value(DEFAULT_PROVENANCE))
            .andExpect(jsonPath("$.remarqueGenerale").value(DEFAULT_REMARQUE_GENERALE));
    }

    @Test
    @Transactional
    void getNonExistingDemandeClient() throws Exception {
        // Get the demandeClient
        restDemandeClientMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDemandeClient() throws Exception {
        // Initialize the database
        insertedDemandeClient = demandeClientRepository.saveAndFlush(demandeClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the demandeClient
        DemandeClient updatedDemandeClient = demandeClientRepository.findById(demandeClient.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDemandeClient are not directly saved in db
        em.detach(updatedDemandeClient);
        updatedDemandeClient
            .reference(UPDATED_REFERENCE)
            .dateDemande(UPDATED_DATE_DEMANDE)
            .servicePrincipal(UPDATED_SERVICE_PRINCIPAL)
            .typeDemande(UPDATED_TYPE_DEMANDE)
            .provenance(UPDATED_PROVENANCE)
            .remarqueGenerale(UPDATED_REMARQUE_GENERALE);
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(updatedDemandeClient);

        restDemandeClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, demandeClientDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(demandeClientDTO))
            )
            .andExpect(status().isOk());

        // Validate the DemandeClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDemandeClientToMatchAllProperties(updatedDemandeClient);
    }

    @Test
    @Transactional
    void putNonExistingDemandeClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demandeClient.setId(longCount.incrementAndGet());

        // Create the DemandeClient
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, demandeClientDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(demandeClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDemandeClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demandeClient.setId(longCount.incrementAndGet());

        // Create the DemandeClient
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeClientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(demandeClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDemandeClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demandeClient.setId(longCount.incrementAndGet());

        // Create the DemandeClient
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeClientMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(demandeClientDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DemandeClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDemandeClientWithPatch() throws Exception {
        // Initialize the database
        insertedDemandeClient = demandeClientRepository.saveAndFlush(demandeClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the demandeClient using partial update
        DemandeClient partialUpdatedDemandeClient = new DemandeClient();
        partialUpdatedDemandeClient.setId(demandeClient.getId());

        partialUpdatedDemandeClient
            .reference(UPDATED_REFERENCE)
            .dateDemande(UPDATED_DATE_DEMANDE)
            .servicePrincipal(UPDATED_SERVICE_PRINCIPAL)
            .provenance(UPDATED_PROVENANCE)
            .remarqueGenerale(UPDATED_REMARQUE_GENERALE);

        restDemandeClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemandeClient.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDemandeClient))
            )
            .andExpect(status().isOk());

        // Validate the DemandeClient in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDemandeClientUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDemandeClient, demandeClient),
            getPersistedDemandeClient(demandeClient)
        );
    }

    @Test
    @Transactional
    void fullUpdateDemandeClientWithPatch() throws Exception {
        // Initialize the database
        insertedDemandeClient = demandeClientRepository.saveAndFlush(demandeClient);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the demandeClient using partial update
        DemandeClient partialUpdatedDemandeClient = new DemandeClient();
        partialUpdatedDemandeClient.setId(demandeClient.getId());

        partialUpdatedDemandeClient
            .reference(UPDATED_REFERENCE)
            .dateDemande(UPDATED_DATE_DEMANDE)
            .servicePrincipal(UPDATED_SERVICE_PRINCIPAL)
            .typeDemande(UPDATED_TYPE_DEMANDE)
            .provenance(UPDATED_PROVENANCE)
            .remarqueGenerale(UPDATED_REMARQUE_GENERALE);

        restDemandeClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemandeClient.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDemandeClient))
            )
            .andExpect(status().isOk());

        // Validate the DemandeClient in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDemandeClientUpdatableFieldsEquals(partialUpdatedDemandeClient, getPersistedDemandeClient(partialUpdatedDemandeClient));
    }

    @Test
    @Transactional
    void patchNonExistingDemandeClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demandeClient.setId(longCount.incrementAndGet());

        // Create the DemandeClient
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, demandeClientDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(demandeClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDemandeClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demandeClient.setId(longCount.incrementAndGet());

        // Create the DemandeClient
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeClientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(demandeClientDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDemandeClient() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        demandeClient.setId(longCount.incrementAndGet());

        // Create the DemandeClient
        DemandeClientDTO demandeClientDTO = demandeClientMapper.toDto(demandeClient);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeClientMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(demandeClientDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DemandeClient in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDemandeClient() throws Exception {
        // Initialize the database
        insertedDemandeClient = demandeClientRepository.saveAndFlush(demandeClient);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the demandeClient
        restDemandeClientMockMvc
            .perform(delete(ENTITY_API_URL_ID, demandeClient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return demandeClientRepository.count();
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

    protected DemandeClient getPersistedDemandeClient(DemandeClient demandeClient) {
        return demandeClientRepository.findById(demandeClient.getId()).orElseThrow();
    }

    protected void assertPersistedDemandeClientToMatchAllProperties(DemandeClient expectedDemandeClient) {
        assertDemandeClientAllPropertiesEquals(expectedDemandeClient, getPersistedDemandeClient(expectedDemandeClient));
    }

    protected void assertPersistedDemandeClientToMatchUpdatableProperties(DemandeClient expectedDemandeClient) {
        assertDemandeClientAllUpdatablePropertiesEquals(expectedDemandeClient, getPersistedDemandeClient(expectedDemandeClient));
    }
}
