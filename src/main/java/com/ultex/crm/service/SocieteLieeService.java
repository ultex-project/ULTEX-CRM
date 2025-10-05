package com.ultex.crm.service;

import com.ultex.crm.domain.SocieteLiee;
import com.ultex.crm.repository.SocieteLieeRepository;
import com.ultex.crm.service.dto.SocieteLieeDTO;
import com.ultex.crm.service.mapper.SocieteLieeMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.SocieteLiee}.
 */
@Service
@Transactional
public class SocieteLieeService {

    private static final Logger LOG = LoggerFactory.getLogger(SocieteLieeService.class);

    private final SocieteLieeRepository societeLieeRepository;

    private final SocieteLieeMapper societeLieeMapper;

    public SocieteLieeService(SocieteLieeRepository societeLieeRepository, SocieteLieeMapper societeLieeMapper) {
        this.societeLieeRepository = societeLieeRepository;
        this.societeLieeMapper = societeLieeMapper;
    }

    /**
     * Save a societeLiee.
     *
     * @param societeLieeDTO the entity to save.
     * @return the persisted entity.
     */
    public SocieteLieeDTO save(SocieteLieeDTO societeLieeDTO) {
        LOG.debug("Request to save SocieteLiee : {}", societeLieeDTO);
        SocieteLiee societeLiee = societeLieeMapper.toEntity(societeLieeDTO);
        societeLiee = societeLieeRepository.save(societeLiee);
        return societeLieeMapper.toDto(societeLiee);
    }

    /**
     * Update a societeLiee.
     *
     * @param societeLieeDTO the entity to save.
     * @return the persisted entity.
     */
    public SocieteLieeDTO update(SocieteLieeDTO societeLieeDTO) {
        LOG.debug("Request to update SocieteLiee : {}", societeLieeDTO);
        SocieteLiee societeLiee = societeLieeMapper.toEntity(societeLieeDTO);
        societeLiee = societeLieeRepository.save(societeLiee);
        return societeLieeMapper.toDto(societeLiee);
    }

    /**
     * Partially update a societeLiee.
     *
     * @param societeLieeDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SocieteLieeDTO> partialUpdate(SocieteLieeDTO societeLieeDTO) {
        LOG.debug("Request to partially update SocieteLiee : {}", societeLieeDTO);

        return societeLieeRepository
            .findById(societeLieeDTO.getId())
            .map(existingSocieteLiee -> {
                societeLieeMapper.partialUpdate(existingSocieteLiee, societeLieeDTO);

                return existingSocieteLiee;
            })
            .map(societeLieeRepository::save)
            .map(societeLieeMapper::toDto);
    }

    /**
     * Get all the societeLiees.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<SocieteLieeDTO> findAll() {
        LOG.debug("Request to get all SocieteLiees");
        return societeLieeRepository.findAll().stream().map(societeLieeMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one societeLiee by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<SocieteLieeDTO> findOne(Long id) {
        LOG.debug("Request to get SocieteLiee : {}", id);
        return societeLieeRepository.findById(id).map(societeLieeMapper::toDto);
    }

    /**
     * Delete the societeLiee by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete SocieteLiee : {}", id);
        societeLieeRepository.deleteById(id);
    }
}
