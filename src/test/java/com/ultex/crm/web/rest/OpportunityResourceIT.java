package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.OpportunityAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static com.ultex.crm.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.Opportunity;
import com.ultex.crm.domain.enumeration.OpportunityStage;
import com.ultex.crm.repository.OpportunityRepository;
import com.ultex.crm.service.dto.OpportunityDTO;
import com.ultex.crm.service.mapper.OpportunityMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link OpportunityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OpportunityResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final OpportunityStage DEFAULT_STAGE = OpportunityStage.LEAD;
    private static final OpportunityStage UPDATED_STAGE = OpportunityStage.NEGOTIATION;

    private static final Instant DEFAULT_CLOSE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CLOSE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/opportunities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private OpportunityMapper opportunityMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOpportunityMockMvc;

    private Opportunity opportunity;

    private Opportunity insertedOpportunity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Opportunity createEntity() {
        return new Opportunity()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .amount(DEFAULT_AMOUNT)
            .stage(DEFAULT_STAGE)
            .closeDate(DEFAULT_CLOSE_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Opportunity createUpdatedEntity() {
        return new Opportunity()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT)
            .stage(UPDATED_STAGE)
            .closeDate(UPDATED_CLOSE_DATE);
    }

    @BeforeEach
    void initTest() {
        opportunity = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedOpportunity != null) {
            opportunityRepository.delete(insertedOpportunity);
            insertedOpportunity = null;
        }
    }

    @Test
    @Transactional
    void createOpportunity() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Opportunity
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);
        var returnedOpportunityDTO = om.readValue(
            restOpportunityMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(opportunityDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            OpportunityDTO.class
        );

        // Validate the Opportunity in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedOpportunity = opportunityMapper.toEntity(returnedOpportunityDTO);
        assertOpportunityUpdatableFieldsEquals(returnedOpportunity, getPersistedOpportunity(returnedOpportunity));

        insertedOpportunity = returnedOpportunity;
    }

    @Test
    @Transactional
    void createOpportunityWithExistingId() throws Exception {
        // Create the Opportunity with an existing ID
        opportunity.setId(1L);
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOpportunityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(opportunityDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Opportunity in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        opportunity.setTitle(null);

        // Create the Opportunity, which fails.
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        restOpportunityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(opportunityDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        opportunity.setAmount(null);

        // Create the Opportunity, which fails.
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        restOpportunityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(opportunityDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStageIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        opportunity.setStage(null);

        // Create the Opportunity, which fails.
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        restOpportunityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(opportunityDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOpportunities() throws Exception {
        // Initialize the database
        insertedOpportunity = opportunityRepository.saveAndFlush(opportunity);

        // Get all the opportunityList
        restOpportunityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(opportunity.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))))
            .andExpect(jsonPath("$.[*].stage").value(hasItem(DEFAULT_STAGE.toString())))
            .andExpect(jsonPath("$.[*].closeDate").value(hasItem(DEFAULT_CLOSE_DATE.toString())));
    }

    @Test
    @Transactional
    void getOpportunity() throws Exception {
        // Initialize the database
        insertedOpportunity = opportunityRepository.saveAndFlush(opportunity);

        // Get the opportunity
        restOpportunityMockMvc
            .perform(get(ENTITY_API_URL_ID, opportunity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(opportunity.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.stage").value(DEFAULT_STAGE.toString()))
            .andExpect(jsonPath("$.closeDate").value(DEFAULT_CLOSE_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingOpportunity() throws Exception {
        // Get the opportunity
        restOpportunityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOpportunity() throws Exception {
        // Initialize the database
        insertedOpportunity = opportunityRepository.saveAndFlush(opportunity);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the opportunity
        Opportunity updatedOpportunity = opportunityRepository.findById(opportunity.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOpportunity are not directly saved in db
        em.detach(updatedOpportunity);
        updatedOpportunity
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT)
            .stage(UPDATED_STAGE)
            .closeDate(UPDATED_CLOSE_DATE);
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(updatedOpportunity);

        restOpportunityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, opportunityDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(opportunityDTO))
            )
            .andExpect(status().isOk());

        // Validate the Opportunity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOpportunityToMatchAllProperties(updatedOpportunity);
    }

    @Test
    @Transactional
    void putNonExistingOpportunity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        opportunity.setId(longCount.incrementAndGet());

        // Create the Opportunity
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOpportunityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, opportunityDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(opportunityDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Opportunity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOpportunity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        opportunity.setId(longCount.incrementAndGet());

        // Create the Opportunity
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOpportunityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(opportunityDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Opportunity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOpportunity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        opportunity.setId(longCount.incrementAndGet());

        // Create the Opportunity
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOpportunityMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(opportunityDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Opportunity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOpportunityWithPatch() throws Exception {
        // Initialize the database
        insertedOpportunity = opportunityRepository.saveAndFlush(opportunity);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the opportunity using partial update
        Opportunity partialUpdatedOpportunity = new Opportunity();
        partialUpdatedOpportunity.setId(opportunity.getId());

        partialUpdatedOpportunity.title(UPDATED_TITLE).amount(UPDATED_AMOUNT).stage(UPDATED_STAGE);

        restOpportunityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOpportunity.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOpportunity))
            )
            .andExpect(status().isOk());

        // Validate the Opportunity in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOpportunityUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedOpportunity, opportunity),
            getPersistedOpportunity(opportunity)
        );
    }

    @Test
    @Transactional
    void fullUpdateOpportunityWithPatch() throws Exception {
        // Initialize the database
        insertedOpportunity = opportunityRepository.saveAndFlush(opportunity);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the opportunity using partial update
        Opportunity partialUpdatedOpportunity = new Opportunity();
        partialUpdatedOpportunity.setId(opportunity.getId());

        partialUpdatedOpportunity
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT)
            .stage(UPDATED_STAGE)
            .closeDate(UPDATED_CLOSE_DATE);

        restOpportunityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOpportunity.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOpportunity))
            )
            .andExpect(status().isOk());

        // Validate the Opportunity in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOpportunityUpdatableFieldsEquals(partialUpdatedOpportunity, getPersistedOpportunity(partialUpdatedOpportunity));
    }

    @Test
    @Transactional
    void patchNonExistingOpportunity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        opportunity.setId(longCount.incrementAndGet());

        // Create the Opportunity
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOpportunityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, opportunityDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(opportunityDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Opportunity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOpportunity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        opportunity.setId(longCount.incrementAndGet());

        // Create the Opportunity
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOpportunityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(opportunityDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Opportunity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOpportunity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        opportunity.setId(longCount.incrementAndGet());

        // Create the Opportunity
        OpportunityDTO opportunityDTO = opportunityMapper.toDto(opportunity);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOpportunityMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(opportunityDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Opportunity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOpportunity() throws Exception {
        // Initialize the database
        insertedOpportunity = opportunityRepository.saveAndFlush(opportunity);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the opportunity
        restOpportunityMockMvc
            .perform(delete(ENTITY_API_URL_ID, opportunity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return opportunityRepository.count();
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

    protected Opportunity getPersistedOpportunity(Opportunity opportunity) {
        return opportunityRepository.findById(opportunity.getId()).orElseThrow();
    }

    protected void assertPersistedOpportunityToMatchAllProperties(Opportunity expectedOpportunity) {
        assertOpportunityAllPropertiesEquals(expectedOpportunity, getPersistedOpportunity(expectedOpportunity));
    }

    protected void assertPersistedOpportunityToMatchUpdatableProperties(Opportunity expectedOpportunity) {
        assertOpportunityAllUpdatablePropertiesEquals(expectedOpportunity, getPersistedOpportunity(expectedOpportunity));
    }
}
