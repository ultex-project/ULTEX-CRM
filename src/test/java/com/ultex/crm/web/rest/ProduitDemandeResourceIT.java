package com.ultex.crm.web.rest;

import static com.ultex.crm.domain.ProduitDemandeAsserts.*;
import static com.ultex.crm.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ultex.crm.IntegrationTest;
import com.ultex.crm.domain.ProduitDemande;
import com.ultex.crm.domain.enumeration.TypeProduit;
import com.ultex.crm.repository.ProduitDemandeRepository;
import com.ultex.crm.service.dto.ProduitDemandeDTO;
import com.ultex.crm.service.mapper.ProduitDemandeMapper;
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
 * Integration tests for the {@link ProduitDemandeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProduitDemandeResourceIT {

    private static final TypeProduit DEFAULT_TYPE_PRODUIT = TypeProduit.VEHICULE;
    private static final TypeProduit UPDATED_TYPE_PRODUIT = TypeProduit.MACHINE;

    private static final String DEFAULT_NOM_PRODUIT = "AAAAAAAAAA";
    private static final String UPDATED_NOM_PRODUIT = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_QUANTITE = 1D;
    private static final Double UPDATED_QUANTITE = 2D;

    private static final String DEFAULT_UNITE = "AAAAAAAAAA";
    private static final String UPDATED_UNITE = "BBBBBBBBBB";

    private static final Double DEFAULT_PRIX = 1D;
    private static final Double UPDATED_PRIX = 2D;

    private static final Double DEFAULT_POIDS_KG = 1D;
    private static final Double UPDATED_POIDS_KG = 2D;

    private static final Double DEFAULT_VOLUME_TOTAL_CBM = 1D;
    private static final Double UPDATED_VOLUME_TOTAL_CBM = 2D;

    private static final String DEFAULT_DIMENSIONS = "AAAAAAAAAA";
    private static final String UPDATED_DIMENSIONS = "BBBBBBBBBB";

    private static final String DEFAULT_HS_CODE = "AAAAAAAAAA";
    private static final String UPDATED_HS_CODE = "BBBBBBBBBB";

    private static final Double DEFAULT_PRIX_CIBLE = 1D;
    private static final Double UPDATED_PRIX_CIBLE = 2D;

    private static final Double DEFAULT_FRAIS_EXPEDITION = 1D;
    private static final Double UPDATED_FRAIS_EXPEDITION = 2D;

    private static final String DEFAULT_ORIGINE = "AAAAAAAAAA";
    private static final String UPDATED_ORIGINE = "BBBBBBBBBB";

    private static final String DEFAULT_FOURNISSEUR = "AAAAAAAAAA";
    private static final String UPDATED_FOURNISSEUR = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE_CHARGEMENT = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE_CHARGEMENT = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE_DECHARGEMENT = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE_DECHARGEMENT = "BBBBBBBBBB";

    private static final String DEFAULT_FICHE_TECHNIQUE_URL = "AAAAAAAAAA";
    private static final String UPDATED_FICHE_TECHNIQUE_URL = "BBBBBBBBBB";

    private static final String DEFAULT_PHOTOS_URL = "AAAAAAAAAA";
    private static final String UPDATED_PHOTOS_URL = "BBBBBBBBBB";

    private static final String DEFAULT_PIECES_JOINTES_URL = "AAAAAAAAAA";
    private static final String UPDATED_PIECES_JOINTES_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/produit-demandes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProduitDemandeRepository produitDemandeRepository;

    @Autowired
    private ProduitDemandeMapper produitDemandeMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProduitDemandeMockMvc;

    private ProduitDemande produitDemande;

    private ProduitDemande insertedProduitDemande;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProduitDemande createEntity() {
        return new ProduitDemande()
            .typeProduit(DEFAULT_TYPE_PRODUIT)
            .nomProduit(DEFAULT_NOM_PRODUIT)
            .description(DEFAULT_DESCRIPTION)
            .quantite(DEFAULT_QUANTITE)
            .unite(DEFAULT_UNITE)
            .prix(DEFAULT_PRIX)
            .poidsKg(DEFAULT_POIDS_KG)
            .volumeTotalCbm(DEFAULT_VOLUME_TOTAL_CBM)
            .dimensions(DEFAULT_DIMENSIONS)
            .hsCode(DEFAULT_HS_CODE)
            .prixCible(DEFAULT_PRIX_CIBLE)
            .fraisExpedition(DEFAULT_FRAIS_EXPEDITION)
            .origine(DEFAULT_ORIGINE)
            .fournisseur(DEFAULT_FOURNISSEUR)
            .adresseChargement(DEFAULT_ADRESSE_CHARGEMENT)
            .adresseDechargement(DEFAULT_ADRESSE_DECHARGEMENT)
            .ficheTechniqueUrl(DEFAULT_FICHE_TECHNIQUE_URL)
            .photosUrl(DEFAULT_PHOTOS_URL)
            .piecesJointesUrl(DEFAULT_PIECES_JOINTES_URL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProduitDemande createUpdatedEntity() {
        return new ProduitDemande()
            .typeProduit(UPDATED_TYPE_PRODUIT)
            .nomProduit(UPDATED_NOM_PRODUIT)
            .description(UPDATED_DESCRIPTION)
            .quantite(UPDATED_QUANTITE)
            .unite(UPDATED_UNITE)
            .prix(UPDATED_PRIX)
            .poidsKg(UPDATED_POIDS_KG)
            .volumeTotalCbm(UPDATED_VOLUME_TOTAL_CBM)
            .dimensions(UPDATED_DIMENSIONS)
            .hsCode(UPDATED_HS_CODE)
            .prixCible(UPDATED_PRIX_CIBLE)
            .fraisExpedition(UPDATED_FRAIS_EXPEDITION)
            .origine(UPDATED_ORIGINE)
            .fournisseur(UPDATED_FOURNISSEUR)
            .adresseChargement(UPDATED_ADRESSE_CHARGEMENT)
            .adresseDechargement(UPDATED_ADRESSE_DECHARGEMENT)
            .ficheTechniqueUrl(UPDATED_FICHE_TECHNIQUE_URL)
            .photosUrl(UPDATED_PHOTOS_URL)
            .piecesJointesUrl(UPDATED_PIECES_JOINTES_URL);
    }

    @BeforeEach
    void initTest() {
        produitDemande = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedProduitDemande != null) {
            produitDemandeRepository.delete(insertedProduitDemande);
            insertedProduitDemande = null;
        }
    }

    @Test
    @Transactional
    void createProduitDemande() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProduitDemande
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);
        var returnedProduitDemandeDTO = om.readValue(
            restProduitDemandeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(produitDemandeDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProduitDemandeDTO.class
        );

        // Validate the ProduitDemande in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedProduitDemande = produitDemandeMapper.toEntity(returnedProduitDemandeDTO);
        assertProduitDemandeUpdatableFieldsEquals(returnedProduitDemande, getPersistedProduitDemande(returnedProduitDemande));

        insertedProduitDemande = returnedProduitDemande;
    }

    @Test
    @Transactional
    void createProduitDemandeWithExistingId() throws Exception {
        // Create the ProduitDemande with an existing ID
        produitDemande.setId(1L);
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProduitDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(produitDemandeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProduitDemande in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTypeProduitIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        produitDemande.setTypeProduit(null);

        // Create the ProduitDemande, which fails.
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        restProduitDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(produitDemandeDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNomProduitIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        produitDemande.setNomProduit(null);

        // Create the ProduitDemande, which fails.
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        restProduitDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(produitDemandeDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProduitDemandes() throws Exception {
        // Initialize the database
        insertedProduitDemande = produitDemandeRepository.saveAndFlush(produitDemande);

        // Get all the produitDemandeList
        restProduitDemandeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(produitDemande.getId().intValue())))
            .andExpect(jsonPath("$.[*].typeProduit").value(hasItem(DEFAULT_TYPE_PRODUIT.toString())))
            .andExpect(jsonPath("$.[*].nomProduit").value(hasItem(DEFAULT_NOM_PRODUIT)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].quantite").value(hasItem(DEFAULT_QUANTITE)))
            .andExpect(jsonPath("$.[*].unite").value(hasItem(DEFAULT_UNITE)))
            .andExpect(jsonPath("$.[*].prix").value(hasItem(DEFAULT_PRIX)))
            .andExpect(jsonPath("$.[*].poidsKg").value(hasItem(DEFAULT_POIDS_KG)))
            .andExpect(jsonPath("$.[*].volumeTotalCbm").value(hasItem(DEFAULT_VOLUME_TOTAL_CBM)))
            .andExpect(jsonPath("$.[*].dimensions").value(hasItem(DEFAULT_DIMENSIONS)))
            .andExpect(jsonPath("$.[*].hsCode").value(hasItem(DEFAULT_HS_CODE)))
            .andExpect(jsonPath("$.[*].prixCible").value(hasItem(DEFAULT_PRIX_CIBLE)))
            .andExpect(jsonPath("$.[*].fraisExpedition").value(hasItem(DEFAULT_FRAIS_EXPEDITION)))
            .andExpect(jsonPath("$.[*].origine").value(hasItem(DEFAULT_ORIGINE)))
            .andExpect(jsonPath("$.[*].fournisseur").value(hasItem(DEFAULT_FOURNISSEUR)))
            .andExpect(jsonPath("$.[*].adresseChargement").value(hasItem(DEFAULT_ADRESSE_CHARGEMENT)))
            .andExpect(jsonPath("$.[*].adresseDechargement").value(hasItem(DEFAULT_ADRESSE_DECHARGEMENT)))
            .andExpect(jsonPath("$.[*].ficheTechniqueUrl").value(hasItem(DEFAULT_FICHE_TECHNIQUE_URL)))
            .andExpect(jsonPath("$.[*].photosUrl").value(hasItem(DEFAULT_PHOTOS_URL)))
            .andExpect(jsonPath("$.[*].piecesJointesUrl").value(hasItem(DEFAULT_PIECES_JOINTES_URL)));
    }

    @Test
    @Transactional
    void getProduitDemande() throws Exception {
        // Initialize the database
        insertedProduitDemande = produitDemandeRepository.saveAndFlush(produitDemande);

        // Get the produitDemande
        restProduitDemandeMockMvc
            .perform(get(ENTITY_API_URL_ID, produitDemande.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(produitDemande.getId().intValue()))
            .andExpect(jsonPath("$.typeProduit").value(DEFAULT_TYPE_PRODUIT.toString()))
            .andExpect(jsonPath("$.nomProduit").value(DEFAULT_NOM_PRODUIT))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.quantite").value(DEFAULT_QUANTITE))
            .andExpect(jsonPath("$.unite").value(DEFAULT_UNITE))
            .andExpect(jsonPath("$.prix").value(DEFAULT_PRIX))
            .andExpect(jsonPath("$.poidsKg").value(DEFAULT_POIDS_KG))
            .andExpect(jsonPath("$.volumeTotalCbm").value(DEFAULT_VOLUME_TOTAL_CBM))
            .andExpect(jsonPath("$.dimensions").value(DEFAULT_DIMENSIONS))
            .andExpect(jsonPath("$.hsCode").value(DEFAULT_HS_CODE))
            .andExpect(jsonPath("$.prixCible").value(DEFAULT_PRIX_CIBLE))
            .andExpect(jsonPath("$.fraisExpedition").value(DEFAULT_FRAIS_EXPEDITION))
            .andExpect(jsonPath("$.origine").value(DEFAULT_ORIGINE))
            .andExpect(jsonPath("$.fournisseur").value(DEFAULT_FOURNISSEUR))
            .andExpect(jsonPath("$.adresseChargement").value(DEFAULT_ADRESSE_CHARGEMENT))
            .andExpect(jsonPath("$.adresseDechargement").value(DEFAULT_ADRESSE_DECHARGEMENT))
            .andExpect(jsonPath("$.ficheTechniqueUrl").value(DEFAULT_FICHE_TECHNIQUE_URL))
            .andExpect(jsonPath("$.photosUrl").value(DEFAULT_PHOTOS_URL))
            .andExpect(jsonPath("$.piecesJointesUrl").value(DEFAULT_PIECES_JOINTES_URL));
    }

    @Test
    @Transactional
    void getNonExistingProduitDemande() throws Exception {
        // Get the produitDemande
        restProduitDemandeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProduitDemande() throws Exception {
        // Initialize the database
        insertedProduitDemande = produitDemandeRepository.saveAndFlush(produitDemande);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the produitDemande
        ProduitDemande updatedProduitDemande = produitDemandeRepository.findById(produitDemande.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProduitDemande are not directly saved in db
        em.detach(updatedProduitDemande);
        updatedProduitDemande
            .typeProduit(UPDATED_TYPE_PRODUIT)
            .nomProduit(UPDATED_NOM_PRODUIT)
            .description(UPDATED_DESCRIPTION)
            .quantite(UPDATED_QUANTITE)
            .unite(UPDATED_UNITE)
            .prix(UPDATED_PRIX)
            .poidsKg(UPDATED_POIDS_KG)
            .volumeTotalCbm(UPDATED_VOLUME_TOTAL_CBM)
            .dimensions(UPDATED_DIMENSIONS)
            .hsCode(UPDATED_HS_CODE)
            .prixCible(UPDATED_PRIX_CIBLE)
            .fraisExpedition(UPDATED_FRAIS_EXPEDITION)
            .origine(UPDATED_ORIGINE)
            .fournisseur(UPDATED_FOURNISSEUR)
            .adresseChargement(UPDATED_ADRESSE_CHARGEMENT)
            .adresseDechargement(UPDATED_ADRESSE_DECHARGEMENT)
            .ficheTechniqueUrl(UPDATED_FICHE_TECHNIQUE_URL)
            .photosUrl(UPDATED_PHOTOS_URL)
            .piecesJointesUrl(UPDATED_PIECES_JOINTES_URL);
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(updatedProduitDemande);

        restProduitDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, produitDemandeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(produitDemandeDTO))
            )
            .andExpect(status().isOk());

        // Validate the ProduitDemande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProduitDemandeToMatchAllProperties(updatedProduitDemande);
    }

    @Test
    @Transactional
    void putNonExistingProduitDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        produitDemande.setId(longCount.incrementAndGet());

        // Create the ProduitDemande
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProduitDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, produitDemandeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(produitDemandeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProduitDemande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProduitDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        produitDemande.setId(longCount.incrementAndGet());

        // Create the ProduitDemande
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(produitDemandeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProduitDemande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProduitDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        produitDemande.setId(longCount.incrementAndGet());

        // Create the ProduitDemande
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitDemandeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(produitDemandeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProduitDemande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProduitDemandeWithPatch() throws Exception {
        // Initialize the database
        insertedProduitDemande = produitDemandeRepository.saveAndFlush(produitDemande);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the produitDemande using partial update
        ProduitDemande partialUpdatedProduitDemande = new ProduitDemande();
        partialUpdatedProduitDemande.setId(produitDemande.getId());

        partialUpdatedProduitDemande
            .typeProduit(UPDATED_TYPE_PRODUIT)
            .nomProduit(UPDATED_NOM_PRODUIT)
            .unite(UPDATED_UNITE)
            .poidsKg(UPDATED_POIDS_KG)
            .volumeTotalCbm(UPDATED_VOLUME_TOTAL_CBM)
            .hsCode(UPDATED_HS_CODE)
            .fraisExpedition(UPDATED_FRAIS_EXPEDITION)
            .fournisseur(UPDATED_FOURNISSEUR)
            .adresseChargement(UPDATED_ADRESSE_CHARGEMENT)
            .adresseDechargement(UPDATED_ADRESSE_DECHARGEMENT)
            .ficheTechniqueUrl(UPDATED_FICHE_TECHNIQUE_URL);

        restProduitDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduitDemande.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProduitDemande))
            )
            .andExpect(status().isOk());

        // Validate the ProduitDemande in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProduitDemandeUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProduitDemande, produitDemande),
            getPersistedProduitDemande(produitDemande)
        );
    }

    @Test
    @Transactional
    void fullUpdateProduitDemandeWithPatch() throws Exception {
        // Initialize the database
        insertedProduitDemande = produitDemandeRepository.saveAndFlush(produitDemande);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the produitDemande using partial update
        ProduitDemande partialUpdatedProduitDemande = new ProduitDemande();
        partialUpdatedProduitDemande.setId(produitDemande.getId());

        partialUpdatedProduitDemande
            .typeProduit(UPDATED_TYPE_PRODUIT)
            .nomProduit(UPDATED_NOM_PRODUIT)
            .description(UPDATED_DESCRIPTION)
            .quantite(UPDATED_QUANTITE)
            .unite(UPDATED_UNITE)
            .prix(UPDATED_PRIX)
            .poidsKg(UPDATED_POIDS_KG)
            .volumeTotalCbm(UPDATED_VOLUME_TOTAL_CBM)
            .dimensions(UPDATED_DIMENSIONS)
            .hsCode(UPDATED_HS_CODE)
            .prixCible(UPDATED_PRIX_CIBLE)
            .fraisExpedition(UPDATED_FRAIS_EXPEDITION)
            .origine(UPDATED_ORIGINE)
            .fournisseur(UPDATED_FOURNISSEUR)
            .adresseChargement(UPDATED_ADRESSE_CHARGEMENT)
            .adresseDechargement(UPDATED_ADRESSE_DECHARGEMENT)
            .ficheTechniqueUrl(UPDATED_FICHE_TECHNIQUE_URL)
            .photosUrl(UPDATED_PHOTOS_URL)
            .piecesJointesUrl(UPDATED_PIECES_JOINTES_URL);

        restProduitDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduitDemande.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProduitDemande))
            )
            .andExpect(status().isOk());

        // Validate the ProduitDemande in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProduitDemandeUpdatableFieldsEquals(partialUpdatedProduitDemande, getPersistedProduitDemande(partialUpdatedProduitDemande));
    }

    @Test
    @Transactional
    void patchNonExistingProduitDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        produitDemande.setId(longCount.incrementAndGet());

        // Create the ProduitDemande
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProduitDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, produitDemandeDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(produitDemandeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProduitDemande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProduitDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        produitDemande.setId(longCount.incrementAndGet());

        // Create the ProduitDemande
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(produitDemandeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProduitDemande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProduitDemande() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        produitDemande.setId(longCount.incrementAndGet());

        // Create the ProduitDemande
        ProduitDemandeDTO produitDemandeDTO = produitDemandeMapper.toDto(produitDemande);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitDemandeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(produitDemandeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProduitDemande in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProduitDemande() throws Exception {
        // Initialize the database
        insertedProduitDemande = produitDemandeRepository.saveAndFlush(produitDemande);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the produitDemande
        restProduitDemandeMockMvc
            .perform(delete(ENTITY_API_URL_ID, produitDemande.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return produitDemandeRepository.count();
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

    protected ProduitDemande getPersistedProduitDemande(ProduitDemande produitDemande) {
        return produitDemandeRepository.findById(produitDemande.getId()).orElseThrow();
    }

    protected void assertPersistedProduitDemandeToMatchAllProperties(ProduitDemande expectedProduitDemande) {
        assertProduitDemandeAllPropertiesEquals(expectedProduitDemande, getPersistedProduitDemande(expectedProduitDemande));
    }

    protected void assertPersistedProduitDemandeToMatchUpdatableProperties(ProduitDemande expectedProduitDemande) {
        assertProduitDemandeAllUpdatablePropertiesEquals(expectedProduitDemande, getPersistedProduitDemande(expectedProduitDemande));
    }
}
