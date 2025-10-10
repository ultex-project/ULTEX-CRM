package com.ultex.crm.service;

import com.ultex.crm.domain.ContactAssocie;
import com.ultex.crm.repository.ContactAssocieRepository;
import com.ultex.crm.service.dto.ContactAssocieDTO;
import com.ultex.crm.service.mapper.ContactAssocieMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.ContactAssocie}.
 */
@Service
@Transactional
public class ContactAssocieService {

    private static final Logger LOG = LoggerFactory.getLogger(ContactAssocieService.class);

    private final ContactAssocieRepository contactAssocieRepository;

    private final ContactAssocieMapper contactAssocieMapper;

    public ContactAssocieService(ContactAssocieRepository contactAssocieRepository, ContactAssocieMapper contactAssocieMapper) {
        this.contactAssocieRepository = contactAssocieRepository;
        this.contactAssocieMapper = contactAssocieMapper;
    }

    /**
     * Save a contactAssocie.
     *
     * @param contactAssocieDTO the entity to save.
     * @return the persisted entity.
     */
    public ContactAssocieDTO save(ContactAssocieDTO contactAssocieDTO) {
        LOG.debug("Request to save ContactAssocie : {}", contactAssocieDTO);
        ContactAssocie contactAssocie = contactAssocieMapper.toEntity(contactAssocieDTO);
        contactAssocie = contactAssocieRepository.save(contactAssocie);
        return contactAssocieMapper.toDto(contactAssocie);
    }

    /**
     * Update a contactAssocie.
     *
     * @param contactAssocieDTO the entity to save.
     * @return the persisted entity.
     */
    public ContactAssocieDTO update(ContactAssocieDTO contactAssocieDTO) {
        LOG.debug("Request to update ContactAssocie : {}", contactAssocieDTO);
        ContactAssocie contactAssocie = contactAssocieMapper.toEntity(contactAssocieDTO);
        contactAssocie = contactAssocieRepository.save(contactAssocie);
        return contactAssocieMapper.toDto(contactAssocie);
    }

    /**
     * Partially update a contactAssocie.
     *
     * @param contactAssocieDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ContactAssocieDTO> partialUpdate(ContactAssocieDTO contactAssocieDTO) {
        LOG.debug("Request to partially update ContactAssocie : {}", contactAssocieDTO);

        return contactAssocieRepository
            .findById(contactAssocieDTO.getId())
            .map(existingContactAssocie -> {
                contactAssocieMapper.partialUpdate(existingContactAssocie, contactAssocieDTO);

                return existingContactAssocie;
            })
            .map(contactAssocieRepository::save)
            .map(contactAssocieMapper::toDto);
    }

    /**
     * Get all the contactAssocies.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ContactAssocieDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ContactAssocies");
        return contactAssocieRepository.findAll(pageable).map(contactAssocieMapper::toDto);
    }

    /**
     * Get one contactAssocie by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ContactAssocieDTO> findOne(Long id) {
        LOG.debug("Request to get ContactAssocie : {}", id);
        return contactAssocieRepository.findById(id).map(contactAssocieMapper::toDto);
    }

    /**
     * Delete the contactAssocie by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ContactAssocie : {}", id);
        contactAssocieRepository.deleteById(id);
    }
}
