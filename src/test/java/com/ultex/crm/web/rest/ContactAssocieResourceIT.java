package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.ContactAssocieAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.ContactAssocie;
import com.ultex.crm.repository.ContactAssocieRepository;
import com.ultex.crm.service.dto.ContactAssocieDTO;
import com.ultex.crm.service.mapper.ContactAssocieMapper;
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
 * Integration tests for the {@link ContactAssocieResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ContactAssocieResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_RELATION = "AAAAAAAAAA";
    private static final String UPDATED_RELATION = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_WHATSAPP = "AAAAAAAAAA";
    private static final String UPDATED_WHATSAPP = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_AUTORISATION = "AAAAAAAAAA";
    private static final String UPDATED_AUTORISATION = "BBBBBBBBBB";

    private static final String DEFAULT_REMARQUES = "AAAAAAAAAA";
    private static final String UPDATED_REMARQUES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/contact-associes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ContactAssocieRepository contactAssocieRepository;

    @Autowired
    private ContactAssocieMapper contactAssocieMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContactAssocieMockMvc;

    private ContactAssocie contactAssocie;

    private ContactAssocie insertedContactAssocie;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContactAssocie createEntity() {
        return new ContactAssocie()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .relation(DEFAULT_RELATION)
            .telephone(DEFAULT_TELEPHONE)
            .whatsapp(DEFAULT_WHATSAPP)
            .email(DEFAULT_EMAIL)
            .autorisation(DEFAULT_AUTORISATION)
            .remarques(DEFAULT_REMARQUES);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContactAssocie createUpdatedEntity() {
        return new ContactAssocie()
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .relation(UPDATED_RELATION)
            .telephone(UPDATED_TELEPHONE)
            .whatsapp(UPDATED_WHATSAPP)
            .email(UPDATED_EMAIL)
            .autorisation(UPDATED_AUTORISATION)
            .remarques(UPDATED_REMARQUES);
    }

    @BeforeEach
    void initTest() {
        contactAssocie = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedContactAssocie != null) {
            contactAssocieRepository.delete(insertedContactAssocie);
            insertedContactAssocie = null;
        }
    }

    @Test
    @Transactional
    void createContactAssocie() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ContactAssocie
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);
        var returnedContactAssocieDTO = om.readValue(
            restContactAssocieMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contactAssocieDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ContactAssocieDTO.class
        );

        // Validate the ContactAssocie in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedContactAssocie = contactAssocieMapper.toEntity(returnedContactAssocieDTO);
        assertContactAssocieUpdatableFieldsEquals(returnedContactAssocie, getPersistedContactAssocie(returnedContactAssocie));

        insertedContactAssocie = returnedContactAssocie;
    }

    @Test
    @Transactional
    void createContactAssocieWithExistingId() throws Exception {
        // Create the ContactAssocie with an existing ID
        contactAssocie.setId(1L);
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restContactAssocieMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contactAssocieDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ContactAssocie in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        contactAssocie.setNom(null);

        // Create the ContactAssocie, which fails.
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        restContactAssocieMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contactAssocieDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrenomIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        contactAssocie.setPrenom(null);

        // Create the ContactAssocie, which fails.
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        restContactAssocieMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contactAssocieDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllContactAssocies() throws Exception {
        // Initialize the database
        insertedContactAssocie = contactAssocieRepository.saveAndFlush(contactAssocie);

        // Get all the contactAssocieList
        restContactAssocieMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contactAssocie.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].relation").value(hasItem(DEFAULT_RELATION)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].whatsapp").value(hasItem(DEFAULT_WHATSAPP)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].autorisation").value(hasItem(DEFAULT_AUTORISATION)))
            .andExpect(jsonPath("$.[*].remarques").value(hasItem(DEFAULT_REMARQUES)));
    }

    @Test
    @Transactional
    void getContactAssocie() throws Exception {
        // Initialize the database
        insertedContactAssocie = contactAssocieRepository.saveAndFlush(contactAssocie);

        // Get the contactAssocie
        restContactAssocieMockMvc
            .perform(get(ENTITY_API_URL_ID, contactAssocie.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(contactAssocie.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.relation").value(DEFAULT_RELATION))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.whatsapp").value(DEFAULT_WHATSAPP))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.autorisation").value(DEFAULT_AUTORISATION))
            .andExpect(jsonPath("$.remarques").value(DEFAULT_REMARQUES));
    }

    @Test
    @Transactional
    void getNonExistingContactAssocie() throws Exception {
        // Get the contactAssocie
        restContactAssocieMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingContactAssocie() throws Exception {
        // Initialize the database
        insertedContactAssocie = contactAssocieRepository.saveAndFlush(contactAssocie);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contactAssocie
        ContactAssocie updatedContactAssocie = contactAssocieRepository.findById(contactAssocie.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedContactAssocie are not directly saved in db
        em.detach(updatedContactAssocie);
        updatedContactAssocie
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .relation(UPDATED_RELATION)
            .telephone(UPDATED_TELEPHONE)
            .whatsapp(UPDATED_WHATSAPP)
            .email(UPDATED_EMAIL)
            .autorisation(UPDATED_AUTORISATION)
            .remarques(UPDATED_REMARQUES);
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(updatedContactAssocie);

        restContactAssocieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contactAssocieDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(contactAssocieDTO))
            )
            .andExpect(status().isOk());

        // Validate the ContactAssocie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedContactAssocieToMatchAllProperties(updatedContactAssocie);
    }

    @Test
    @Transactional
    void putNonExistingContactAssocie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contactAssocie.setId(longCount.incrementAndGet());

        // Create the ContactAssocie
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactAssocieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contactAssocieDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(contactAssocieDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactAssocie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchContactAssocie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contactAssocie.setId(longCount.incrementAndGet());

        // Create the ContactAssocie
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactAssocieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(contactAssocieDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactAssocie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamContactAssocie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contactAssocie.setId(longCount.incrementAndGet());

        // Create the ContactAssocie
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactAssocieMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contactAssocieDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContactAssocie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateContactAssocieWithPatch() throws Exception {
        // Initialize the database
        insertedContactAssocie = contactAssocieRepository.saveAndFlush(contactAssocie);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contactAssocie using partial update
        ContactAssocie partialUpdatedContactAssocie = new ContactAssocie();
        partialUpdatedContactAssocie.setId(contactAssocie.getId());

        partialUpdatedContactAssocie
            .prenom(UPDATED_PRENOM)
            .relation(UPDATED_RELATION)
            .telephone(UPDATED_TELEPHONE)
            .autorisation(UPDATED_AUTORISATION)
            .remarques(UPDATED_REMARQUES);

        restContactAssocieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContactAssocie.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedContactAssocie))
            )
            .andExpect(status().isOk());

        // Validate the ContactAssocie in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertContactAssocieUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedContactAssocie, contactAssocie),
            getPersistedContactAssocie(contactAssocie)
        );
    }

    @Test
    @Transactional
    void fullUpdateContactAssocieWithPatch() throws Exception {
        // Initialize the database
        insertedContactAssocie = contactAssocieRepository.saveAndFlush(contactAssocie);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contactAssocie using partial update
        ContactAssocie partialUpdatedContactAssocie = new ContactAssocie();
        partialUpdatedContactAssocie.setId(contactAssocie.getId());

        partialUpdatedContactAssocie
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .relation(UPDATED_RELATION)
            .telephone(UPDATED_TELEPHONE)
            .whatsapp(UPDATED_WHATSAPP)
            .email(UPDATED_EMAIL)
            .autorisation(UPDATED_AUTORISATION)
            .remarques(UPDATED_REMARQUES);

        restContactAssocieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContactAssocie.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedContactAssocie))
            )
            .andExpect(status().isOk());

        // Validate the ContactAssocie in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertContactAssocieUpdatableFieldsEquals(partialUpdatedContactAssocie, getPersistedContactAssocie(partialUpdatedContactAssocie));
    }

    @Test
    @Transactional
    void patchNonExistingContactAssocie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contactAssocie.setId(longCount.incrementAndGet());

        // Create the ContactAssocie
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactAssocieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, contactAssocieDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(contactAssocieDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactAssocie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchContactAssocie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contactAssocie.setId(longCount.incrementAndGet());

        // Create the ContactAssocie
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactAssocieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(contactAssocieDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactAssocie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamContactAssocie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contactAssocie.setId(longCount.incrementAndGet());

        // Create the ContactAssocie
        ContactAssocieDTO contactAssocieDTO = contactAssocieMapper.toDto(contactAssocie);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactAssocieMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(contactAssocieDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContactAssocie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteContactAssocie() throws Exception {
        // Initialize the database
        insertedContactAssocie = contactAssocieRepository.saveAndFlush(contactAssocie);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the contactAssocie
        restContactAssocieMockMvc
            .perform(delete(ENTITY_API_URL_ID, contactAssocie.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return contactAssocieRepository.count();
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

    protected ContactAssocie getPersistedContactAssocie(ContactAssocie contactAssocie) {
        return contactAssocieRepository.findById(contactAssocie.getId()).orElseThrow();
    }

    protected void assertPersistedContactAssocieToMatchAllProperties(ContactAssocie expectedContactAssocie) {
        assertContactAssocieAllPropertiesEquals(expectedContactAssocie, getPersistedContactAssocie(expectedContactAssocie));
    }

    protected void assertPersistedContactAssocieToMatchUpdatableProperties(ContactAssocie expectedContactAssocie) {
        assertContactAssocieAllUpdatablePropertiesEquals(expectedContactAssocie, getPersistedContactAssocie(expectedContactAssocie));
    }
}
