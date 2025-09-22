package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.ProspectAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.Prospect;
import com.ultex.crm.domain.enumeration.ProspectStatus;
import com.ultex.crm.repository.ProspectRepository;
import com.ultex.crm.service.dto.ProspectDTO;
import com.ultex.crm.service.mapper.ProspectMapper;
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
 * Integration tests for the {@link ProspectResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProspectResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_SOURCE = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE = "BBBBBBBBBB";

    private static final ProspectStatus DEFAULT_STATUS = ProspectStatus.NEW;
    private static final ProspectStatus UPDATED_STATUS = ProspectStatus.CONTACTED;

    private static final String ENTITY_API_URL = "/api/prospects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProspectRepository prospectRepository;

    @Autowired
    private ProspectMapper prospectMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProspectMockMvc;

    private Prospect prospect;

    private Prospect insertedProspect;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prospect createEntity() {
        return new Prospect()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phone(DEFAULT_PHONE)
            .source(DEFAULT_SOURCE)
            .status(DEFAULT_STATUS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prospect createUpdatedEntity() {
        return new Prospect()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .source(UPDATED_SOURCE)
            .status(UPDATED_STATUS);
    }

    @BeforeEach
    void initTest() {
        prospect = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedProspect != null) {
            prospectRepository.delete(insertedProspect);
            insertedProspect = null;
        }
    }

    @Test
    @Transactional
    void createProspect() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Prospect
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);
        var returnedProspectDTO = om.readValue(
            restProspectMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prospectDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProspectDTO.class
        );

        // Validate the Prospect in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedProspect = prospectMapper.toEntity(returnedProspectDTO);
        assertProspectUpdatableFieldsEquals(returnedProspect, getPersistedProspect(returnedProspect));

        insertedProspect = returnedProspect;
    }

    @Test
    @Transactional
    void createProspectWithExistingId() throws Exception {
        // Create the Prospect with an existing ID
        prospect.setId(1L);
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProspectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prospectDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Prospect in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        prospect.setFirstName(null);

        // Create the Prospect, which fails.
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        restProspectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prospectDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        prospect.setLastName(null);

        // Create the Prospect, which fails.
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        restProspectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prospectDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        prospect.setEmail(null);

        // Create the Prospect, which fails.
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        restProspectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prospectDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        prospect.setStatus(null);

        // Create the Prospect, which fails.
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        restProspectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prospectDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProspects() throws Exception {
        // Initialize the database
        insertedProspect = prospectRepository.saveAndFlush(prospect);

        // Get all the prospectList
        restProspectMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(prospect.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].source").value(hasItem(DEFAULT_SOURCE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getProspect() throws Exception {
        // Initialize the database
        insertedProspect = prospectRepository.saveAndFlush(prospect);

        // Get the prospect
        restProspectMockMvc
            .perform(get(ENTITY_API_URL_ID, prospect.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(prospect.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.source").value(DEFAULT_SOURCE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProspect() throws Exception {
        // Get the prospect
        restProspectMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProspect() throws Exception {
        // Initialize the database
        insertedProspect = prospectRepository.saveAndFlush(prospect);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the prospect
        Prospect updatedProspect = prospectRepository.findById(prospect.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProspect are not directly saved in db
        em.detach(updatedProspect);
        updatedProspect
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .source(UPDATED_SOURCE)
            .status(UPDATED_STATUS);
        ProspectDTO prospectDTO = prospectMapper.toDto(updatedProspect);

        restProspectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, prospectDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(prospectDTO))
            )
            .andExpect(status().isOk());

        // Validate the Prospect in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProspectToMatchAllProperties(updatedProspect);
    }

    @Test
    @Transactional
    void putNonExistingProspect() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prospect.setId(longCount.incrementAndGet());

        // Create the Prospect
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProspectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, prospectDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(prospectDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prospect in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProspect() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prospect.setId(longCount.incrementAndGet());

        // Create the Prospect
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProspectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(prospectDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prospect in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProspect() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prospect.setId(longCount.incrementAndGet());

        // Create the Prospect
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProspectMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prospectDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prospect in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProspectWithPatch() throws Exception {
        // Initialize the database
        insertedProspect = prospectRepository.saveAndFlush(prospect);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the prospect using partial update
        Prospect partialUpdatedProspect = new Prospect();
        partialUpdatedProspect.setId(prospect.getId());

        partialUpdatedProspect.lastName(UPDATED_LAST_NAME).source(UPDATED_SOURCE).status(UPDATED_STATUS);

        restProspectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProspect.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProspect))
            )
            .andExpect(status().isOk());

        // Validate the Prospect in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProspectUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedProspect, prospect), getPersistedProspect(prospect));
    }

    @Test
    @Transactional
    void fullUpdateProspectWithPatch() throws Exception {
        // Initialize the database
        insertedProspect = prospectRepository.saveAndFlush(prospect);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the prospect using partial update
        Prospect partialUpdatedProspect = new Prospect();
        partialUpdatedProspect.setId(prospect.getId());

        partialUpdatedProspect
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .source(UPDATED_SOURCE)
            .status(UPDATED_STATUS);

        restProspectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProspect.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProspect))
            )
            .andExpect(status().isOk());

        // Validate the Prospect in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProspectUpdatableFieldsEquals(partialUpdatedProspect, getPersistedProspect(partialUpdatedProspect));
    }

    @Test
    @Transactional
    void patchNonExistingProspect() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prospect.setId(longCount.incrementAndGet());

        // Create the Prospect
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProspectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, prospectDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(prospectDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prospect in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProspect() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prospect.setId(longCount.incrementAndGet());

        // Create the Prospect
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProspectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(prospectDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prospect in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProspect() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prospect.setId(longCount.incrementAndGet());

        // Create the Prospect
        ProspectDTO prospectDTO = prospectMapper.toDto(prospect);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProspectMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(prospectDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prospect in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProspect() throws Exception {
        // Initialize the database
        insertedProspect = prospectRepository.saveAndFlush(prospect);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the prospect
        restProspectMockMvc
            .perform(delete(ENTITY_API_URL_ID, prospect.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return prospectRepository.count();
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

    protected Prospect getPersistedProspect(Prospect prospect) {
        return prospectRepository.findById(prospect.getId()).orElseThrow();
    }

    protected void assertPersistedProspectToMatchAllProperties(Prospect expectedProspect) {
        assertProspectAllPropertiesEquals(expectedProspect, getPersistedProspect(expectedProspect));
    }

    protected void assertPersistedProspectToMatchUpdatableProperties(Prospect expectedProspect) {
        assertProspectAllUpdatablePropertiesEquals(expectedProspect, getPersistedProspect(expectedProspect));
    }
}
