package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.InternalUserAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.InternalUser;
import com.ultex.crm.domain.enumeration.UserRole;
import com.ultex.crm.repository.InternalUserRepository;
import com.ultex.crm.service.dto.InternalUserDTO;
import com.ultex.crm.service.mapper.InternalUserMapper;
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
 * Integration tests for the {@link InternalUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InternalUserResourceIT {

    private static final String DEFAULT_FULL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FULL_NAME = "BBBBBBBBBB";

    private static final UserRole DEFAULT_ROLE = UserRole.ADMIN;
    private static final UserRole UPDATED_ROLE = UserRole.MANAGER;

    private static final String ENTITY_API_URL = "/api/internal-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private InternalUserRepository internalUserRepository;

    @Autowired
    private InternalUserMapper internalUserMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInternalUserMockMvc;

    private InternalUser internalUser;

    private InternalUser insertedInternalUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InternalUser createEntity() {
        return new InternalUser().fullName(DEFAULT_FULL_NAME).role(DEFAULT_ROLE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InternalUser createUpdatedEntity() {
        return new InternalUser().fullName(UPDATED_FULL_NAME).role(UPDATED_ROLE);
    }

    @BeforeEach
    void initTest() {
        internalUser = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedInternalUser != null) {
            internalUserRepository.delete(insertedInternalUser);
            insertedInternalUser = null;
        }
    }

    @Test
    @Transactional
    void createInternalUser() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the InternalUser
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);
        var returnedInternalUserDTO = om.readValue(
            restInternalUserMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(internalUserDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            InternalUserDTO.class
        );

        // Validate the InternalUser in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedInternalUser = internalUserMapper.toEntity(returnedInternalUserDTO);
        assertInternalUserUpdatableFieldsEquals(returnedInternalUser, getPersistedInternalUser(returnedInternalUser));

        insertedInternalUser = returnedInternalUser;
    }

    @Test
    @Transactional
    void createInternalUserWithExistingId() throws Exception {
        // Create the InternalUser with an existing ID
        internalUser.setId(1L);
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInternalUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(internalUserDTO)))
            .andExpect(status().isBadRequest());

        // Validate the InternalUser in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFullNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        internalUser.setFullName(null);

        // Create the InternalUser, which fails.
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        restInternalUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(internalUserDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRoleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        internalUser.setRole(null);

        // Create the InternalUser, which fails.
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        restInternalUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(internalUserDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllInternalUsers() throws Exception {
        // Initialize the database
        insertedInternalUser = internalUserRepository.saveAndFlush(internalUser);

        // Get all the internalUserList
        restInternalUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(internalUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].fullName").value(hasItem(DEFAULT_FULL_NAME)))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE.toString())));
    }

    @Test
    @Transactional
    void getInternalUser() throws Exception {
        // Initialize the database
        insertedInternalUser = internalUserRepository.saveAndFlush(internalUser);

        // Get the internalUser
        restInternalUserMockMvc
            .perform(get(ENTITY_API_URL_ID, internalUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(internalUser.getId().intValue()))
            .andExpect(jsonPath("$.fullName").value(DEFAULT_FULL_NAME))
            .andExpect(jsonPath("$.role").value(DEFAULT_ROLE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingInternalUser() throws Exception {
        // Get the internalUser
        restInternalUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInternalUser() throws Exception {
        // Initialize the database
        insertedInternalUser = internalUserRepository.saveAndFlush(internalUser);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the internalUser
        InternalUser updatedInternalUser = internalUserRepository.findById(internalUser.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedInternalUser are not directly saved in db
        em.detach(updatedInternalUser);
        updatedInternalUser.fullName(UPDATED_FULL_NAME).role(UPDATED_ROLE);
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(updatedInternalUser);

        restInternalUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, internalUserDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(internalUserDTO))
            )
            .andExpect(status().isOk());

        // Validate the InternalUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedInternalUserToMatchAllProperties(updatedInternalUser);
    }

    @Test
    @Transactional
    void putNonExistingInternalUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        internalUser.setId(longCount.incrementAndGet());

        // Create the InternalUser
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInternalUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, internalUserDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(internalUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInternalUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        internalUser.setId(longCount.incrementAndGet());

        // Create the InternalUser
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternalUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(internalUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInternalUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        internalUser.setId(longCount.incrementAndGet());

        // Create the InternalUser
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternalUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(internalUserDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the InternalUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInternalUserWithPatch() throws Exception {
        // Initialize the database
        insertedInternalUser = internalUserRepository.saveAndFlush(internalUser);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the internalUser using partial update
        InternalUser partialUpdatedInternalUser = new InternalUser();
        partialUpdatedInternalUser.setId(internalUser.getId());

        restInternalUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInternalUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedInternalUser))
            )
            .andExpect(status().isOk());

        // Validate the InternalUser in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertInternalUserUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedInternalUser, internalUser),
            getPersistedInternalUser(internalUser)
        );
    }

    @Test
    @Transactional
    void fullUpdateInternalUserWithPatch() throws Exception {
        // Initialize the database
        insertedInternalUser = internalUserRepository.saveAndFlush(internalUser);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the internalUser using partial update
        InternalUser partialUpdatedInternalUser = new InternalUser();
        partialUpdatedInternalUser.setId(internalUser.getId());

        partialUpdatedInternalUser.fullName(UPDATED_FULL_NAME).role(UPDATED_ROLE);

        restInternalUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInternalUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedInternalUser))
            )
            .andExpect(status().isOk());

        // Validate the InternalUser in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertInternalUserUpdatableFieldsEquals(partialUpdatedInternalUser, getPersistedInternalUser(partialUpdatedInternalUser));
    }

    @Test
    @Transactional
    void patchNonExistingInternalUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        internalUser.setId(longCount.incrementAndGet());

        // Create the InternalUser
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInternalUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, internalUserDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(internalUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInternalUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        internalUser.setId(longCount.incrementAndGet());

        // Create the InternalUser
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternalUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(internalUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInternalUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        internalUser.setId(longCount.incrementAndGet());

        // Create the InternalUser
        InternalUserDTO internalUserDTO = internalUserMapper.toDto(internalUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternalUserMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(internalUserDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the InternalUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInternalUser() throws Exception {
        // Initialize the database
        insertedInternalUser = internalUserRepository.saveAndFlush(internalUser);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the internalUser
        restInternalUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, internalUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return internalUserRepository.count();
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

    protected InternalUser getPersistedInternalUser(InternalUser internalUser) {
        return internalUserRepository.findById(internalUser.getId()).orElseThrow();
    }

    protected void assertPersistedInternalUserToMatchAllProperties(InternalUser expectedInternalUser) {
        assertInternalUserAllPropertiesEquals(expectedInternalUser, getPersistedInternalUser(expectedInternalUser));
    }

    protected void assertPersistedInternalUserToMatchUpdatableProperties(InternalUser expectedInternalUser) {
        assertInternalUserAllUpdatablePropertiesEquals(expectedInternalUser, getPersistedInternalUser(expectedInternalUser));
    }
}
